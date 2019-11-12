// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const moment = require('moment-timezone');
const initQueries = require('./queries.js');
const uuidv1 = require('uuid/v1');
const { PubSub } = require('@google-cloud/pubsub');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
var serviceAccount = require("./admin-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hr-app-391b3.firebaseio.com"
});

const config = functions.config()

const pubsub = new PubSub({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: './admin-service-account.json'
});

//INVITE EMAIL
const inviteEmailContent = () => {
  return `
    <p>Welcome to Work Buddies! Please follow this link to join {companyName}: {link}
  `
}
const foods = ["soup", "coffee", "pancake", "pizza", "sushi", "ramen", "burrito", "gyros", "pasta", "curry", "bratwurst"];
const generateCode = () => foods[Math.floor(Math.random() * foods.length)] + Math.floor(1000 + Math.random() * 9000);
const signupLink = `${config && config.host ? config.host : 'http://localhost'}/signup?code=`

sgMail.setApiKey(config && config.mail ? config.mail.key : "");

exports.inviteHandler = functions.firestore.document('invites/{inviteId}')
  .onCreate((inviteSnapshot, _ctx) => {
    const firestore = admin.firestore();
    const invitesRef = firestore.collection('invites');
    const companiesRef = firestore.collection('companies');

    return Promise.all([getCode(), companiesRef.doc(inviteSnapshot.data().company_uid).get()]).then(results => {
      let code = results[0];
      let companyRef = results[1];

      let emailContent = inviteEmailContent();
      let link = signupLink + code
      emailContent = emailContent.replace('{link}', link);
      emailContent = emailContent.replace('{companyName}', companyRef.data().name);

      const msg = {
        to: inviteSnapshot.data().email,
        from: functions.config().mail ? functions.config().mail.email : 'annadesiree11@gmail.com',
        subject: 'You\'re Invited to Work Buddies!',
        html: emailContent,
      };

      return Promise.all([inviteSnapshot.ref.update({ code }), sgMail.send(msg)]);
    });

    function getCode() {
      let code = generateCode();
      return invitesRef.where('code', '==', code).get()
        .then(snapshot => {
          return !snapshot.docs || snapshot.docs.length === 0 ? code : getCode();
        });
    }
  });

  //END INVITE EMAIL



//GENERATE MATCHUPS
const getLastBuddy = (userId, previousMatchups) => {
  if(!previousMatchups) return false
  let matchup = previousMatchups.find(matchup => {
    return matchup.buddies.indexOf(userId) !== -1
  })
  if(matchup && matchup.buddies.length === 2) {
    let userIndex = matchup.buddies.indexOf(userId)
    return userIndex === 0 ? matchup.buddies[1] : matchup.buddies[0]
  }
  return false

}

const getRandomActivity = () => {
  return 'Table Tennis'
}

const matchup = async (data) => {
  const companyId = data.id
  const firestore = admin.firestore();
  let companyRef = firestore.collection('companies').doc(companyId);
  if (!companyRef) return Promise.reject(new Error("company not found"))
  let companyData = await companyRef.get()
  companyData = companyData.data()
  let usersRef = firestore.collection('users').where('company_uid', '==', companyId)
  let lastBuddiesRef = companyData.activeBuddies ? await companyRef.collection('buddies').doc(companyData.activeBuddies) : null
  let lastBuddiesDoc = lastBuddiesRef  ? await lastBuddiesRef.get() : false
  let previousMatchups = lastBuddiesDoc && lastBuddiesDoc.exists  ? await lastBuddiesDoc.data().matchups : []

  let newMatchups = []

  let matchUpUsersPromise = usersRef.get()
    .then(snapshot => {
      const users = []
      snapshot.forEach(user => users.push(user))

      while (users.length > 1) {
        let buddy = null
        let user = users.pop()
        if(users.length === 1) {
          buddy = users.pop()
        } else {
          const usersCopy = [...users].map((user, i) => {
            let data = {}
            data.id = user.id
            data.originalIndex = i
            return data
          })
          let lastBuddyId = getLastBuddy(user.id, previousMatchups)
          if(lastBuddyId) {
            //remove last buddy from array of options
            let lastBuddyIndex = usersCopy.findIndex(user => user.id === lastBuddyId)
            usersCopy.splice(lastBuddyIndex, 1)
          }

          //get random buddy from remaining options
          let buddyInfo = usersCopy[Math.floor(Math.random()*usersCopy.length)]

          //remove buddy from original users list
          buddy = users[buddyInfo.originalIndex]
          users.splice(buddyInfo.originalIndex, 1)

        }
        newMatchups.push({
          buddies: [user.id, buddy.id],
          activity: getRandomActivity()
        })
      }
      if(users.length === 1) {
        //handle odd
        user = users.pop()
        newMatchups.push({
          buddies: [user.id],
          activity: getRandomActivity()
        })
      }

      // eslint-disable-next-line promise/no-nesting
      return companyRef.collection('buddies').add({
        matchups: newMatchups
      })
      .then(snapshot => {
        return companyRef.set({
          activeBuddies: snapshot.id
        }, {merge: true})
      })
    })

    let setNextMatchupPromise = setNextMatchupTime(companyId)

    return Promise.all([matchUpUsersPromise, setNextMatchupPromise])
}

exports.matchupSub = functions.pubsub.topic('matchup').onPublish((message, _ctx) => {
  const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
  console.info(JSON.stringify(data))
  return matchup(data)
})

exports.matchup = functions.https.onCall((data, _ctx) => {
  return matchup(data)
})
// END GENERATE MATCHUPS


// TRIGGER MATCHUPS

//set next matchup time
const setNextMatchupTime = (companyId) => {
  const firestore = admin.firestore();
  let companyRef = firestore.collection('companies').doc(companyId);
  if (!companyRef) return Promise.reject(new Error("company not found"))

  return companyRef.get()
  .then(company => {
    let data = company.data()
    let now = moment().tz(data.timeZone)
    let nextTime = moment().tz(data.timeZone).isoWeekday(data.day).hour(data.hour).minute(0).second(0).milliseconds(0)

    if(now.isAfter(nextTime)) {
      nextTime = nextTime.add(1, 'weeks')
    }

    return company.ref.set({
      matchUpTime: nextTime.valueOf()
    }, {merge: true})
  })
}
exports.setNextMatchupTime = functions.https.onCall(({ companyId }, _ctx) => {
  return setNextMatchupTime(companyId)
})

exports.setInitialMatchupTime = functions.database.ref('/companies/{companyId}')
.onCreate((snapshot, _context) => {
  setNextMatchupTime(snapshot.id)
});


//find matchups happening this hour
const queries = initQueries(admin.firestore());
let publishToTopic = topic =>
  batch =>
    batch.forEach(v => {
      let event_id = uuidv1();
      let iso = new Date().toISOString();
      console.info(`[${iso}] Publishing to topic: '${topic}'`);
      console.info(`[${iso}] Event ID: ${event_id}`);
      return pubsub.topic(topic).publish(
        Buffer.from(JSON.stringify({
          id: v.id,
          event_id
        }))
      )
        .then(r => {
          iso = new Date().toISOString();
          console.info(`[${iso}] Successful Publish.`);
          console.info(`[${iso}] Event ID: ${event_id}`);
          console.info(`[${iso}] Message ID: ${r}`);
          return
        })
        .catch(e => {
          iso = new Date().toISOString();
          console.info(`[${iso}] Publish Failed.`);
          console.info(`[${iso}] Event ID: ${event_id}`);
          console.info(`[${iso}] Error: ${e.message}`);
        });
    });


exports.matchUpScheduler = functions.pubsub.schedule('0 * * * *').onRun((_ctx) => {
  let timestamp = moment.utc().valueOf();
  return queries.getToMatchUp(timestamp).asyncMap(publishToTopic('matchup'))
});

// END TRIGGER MATCHUPS
