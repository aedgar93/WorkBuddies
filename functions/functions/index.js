// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const moment = require('moment-timezone');
const initQueries = require('./queries.js');
const uuidv1 = require('uuid/v1');
const { PubSub } = require('@google-cloud/pubsub');
const inviteEmailContent = require('./emails/invite.js')
const buddyEmailContent = require('./emails/matchup.js')
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
var serviceAccount = require("./admin-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://work-buddies-2e620.firebaseio.com"
});

const config = functions.config()

const pubsub = new PubSub({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: './admin-service-account.json'
});

console.log(config.mail)
sgMail.setApiKey(config && config.mail ? config.mail.key : "");
sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally

//Delete all invites for an email when a user joins
exports.inviteAccepted = functions.firestore.document('users/{userId}')
  .onCreate((userSnapshot, _ctx) => {
    const firestore = admin.firestore();
    const invitesRef = firestore.collection('invites');
    let email = userSnapshot.data().email

    return invitesRef.where('email', '==', email).get()
    .then(snapshot => {
      var batch = firestore.batch()

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref)
      })
      return batch.commit()
    })
  })

//INVITE EMAIL
const getFromEmail = () => {
  return config && config.mail ? config.mail.email : 'annadesiree11@gmail.com'
}

const signupLink = `${config && config.host && config.host.url ? config.host.url : 'http://localhost:3000'}/signup`



exports.inviteHandler = functions.firestore.document('invites/{inviteId}')
  .onCreate((inviteSnapshot, _ctx) => {
    const firestore = admin.firestore();
    const adminRef = firestore.collection('users');
    const data = inviteSnapshot.data()

    return adminRef.doc(data.invitedBy).get().then(results => {
      let admin = results.data();

      let emailContent = inviteEmailContent()
      let link = `${signupLink}?id=${encodeURIComponent(inviteSnapshot.id)}`
      emailContent = emailContent.replace('{{link}}', link);
      if(inviteSnapshot.data().name) {
        emailContent = emailContent.replace('{{greeting}}', `Hi ${inviteSnapshot.data().name},`)
      } else {
        emailContent = emailContent.replace('{{greeting}}', 'Hi,')
      }
      emailContent = emailContent.replace('{{admin_name}}', admin.firstName);

      const msg = {
        to: inviteSnapshot.data().email,
        from: getFromEmail(),
        subject: 'You\'re Invited to Work Buddies!',
        html: emailContent,
      };

      return sgMail.send(msg);
    });
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

const getRandom = (collection) => {
  if(!collection || collection.length === 0) return null
  return collection[Math.floor(Math.random()*collection.length)]
}

const noBuddyEmail = "Hello {{buddy1}},<br/><br/> Unfortunately there is an odd number of people in your group, so you did not get matched up with a buddy this week. Please check back next week for your new matchup. <br/><br/> Sincerely,<br/> the Work Buddies Team"

const getActivitiesHTML = (activities) => {
  return `
  <table align="left" border="0" cellpadding="0" cellspacing="0"
    style="max-width: 100%;min-width: 100%;border-collapse: separate;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;padding-top: 60px;"
    width="100%" class="mcnTextContentContainer">
    <tbody>
      <tr>

        <td valign="top" class="otherActivityContainer">
          <div style="test-align: left; font-size: 20px;color: #5B5B5B;padding-bottom:50px;">Other Suggested Activities:</div>
          <table align="left" border="0" cellpadding="0" cellspacing="10"
            style="max-width: 100%;min-width: 100%;border-collapse: separate;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"
            width="100%" class="mcnTextContentContainer">
            <tbody>
              <tr>
                <td class="activityTD">
                  ${activities.map(activity => {
                    return `
                      <span class="activity">${activity.name}</span>
                    `
                  }).join(" ")}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  `
}

const addEmailPersonalization = (buddy1, buddy2, activity, activitiesHTML, emailInfo) => {
  if (!buddy1 || !buddy1.email || !buddy1.notifyEmail) return null
  let to = [{email: buddy1.email}]
  let activityString = activity ? activity.name : "Grab a Coffee"
  let substitutions = {"buddy1": `${buddy1.firstName} ${buddy1.lastName}`, "activityString": activityString , links: '', profilePic: '', department: '', about: '', activitiesHTML}
  if (buddy2) {
    substitutions["buddy2"] = `${buddy2.firstName} ${buddy2.lastName}`
    if(buddy2.profilePic) {
      substitutions.profilePic = `<img src=${buddy2.profilePic} style="width:93px;height:93px;"></img>`
    } else {
      substitutions.profilePic = `<div class="profileImgText">${buddy2.firstName[0]}${buddy2.lastName[0]}</div>`
    }
    if(buddy2.department) substitutions.department = buddy2.department
    if(buddy2.description) substitutions.description = buddy2.description
    if(buddy2.email) substitutions.links = `<a href="mailto:${buddy2.email}"><img src="http://work-buddies-app.herokuapp.com/email_icon.png" style="width:22px;height:22px;"></img><a>`
    if(buddy2.department) substitutions.department = buddy2.department
    if(buddy2.about) substitutions.about = buddy2.about
  }

  return emailInfo.push({ to, substitutions, subject: "Your Weekly Buddy" })
}

const notify = (buddy1, buddy2, activity, activitiesHTML, emailInfo) => {
  if (!buddy1) return null
  addEmailPersonalization(buddy1, buddy2, activity, activitiesHTML, emailInfo)
  return null
}

const getOddManOutIndex = (previousMatchups, users) => {
  if(!previousMatchups) return -1
  let single = previousMatchups.find(matchup => {
    return matchup.buddies && matchup.buddies.length === 1
  })
  if (!single) return -1
  let singleId = single.buddies[0]

  let oddManOut = users.findIndex(user => {
    return user.id === singleId
  })
  return oddManOut
}

const getMatchups = async (companyRef, companyData) => {
  let lastBuddiesRef = companyData.activeBuddies ? await companyRef.collection('buddies').doc(companyData.activeBuddies) : null
  let lastBuddiesDoc = lastBuddiesRef  ? await lastBuddiesRef.get() : false
  let matchups = lastBuddiesDoc && lastBuddiesDoc.exists ? lastBuddiesDoc.data().matchups : []
  return {doc: lastBuddiesDoc, matchups, ref: lastBuddiesRef}
}
const matchup = async (data) => {
  const companyId = data.id
  let eventId = data.event_id || uuidv1()

  const firestore = admin.firestore();
  let companyRef = firestore.collection('companies').doc(companyId);
  if (!companyRef) return Promise.reject(new Error("company not found"))


  let existingMatchup = await companyRef.collection('buddies').doc(eventId)
  if(existingMatchup.exists) return Promise.reject(new Error('duplicate matchup event'))

  await companyRef.collection('buddies').doc(eventId).set({ loading: true })

  let companyData = await companyRef.get()
  companyData = companyData.data()
  let activitiesSnapshot = await companyRef.collection('activities').get()

  const activities = []
  activitiesSnapshot.forEach(doc => activities.push(doc.data()))
  let activitiesHTML = getActivitiesHTML(activities)

  let usersRef = firestore.collection('users').where('company_uid', '==', companyId)
  let previousMatchupsInfo = await getMatchups(companyRef, companyData)
  let previousMatchups = previousMatchupsInfo.matchups
  console.log(previousMatchupsInfo)

  let newMatchups = []
  let emailInfo = []
  let emailPromises = []

  let matchUpUsersPromise = usersRef.get()
    .then(async snapshot => {
      const users = []
      snapshot.forEach(user => users.push(user))
      if(users.length === 1) return null //no matchup if there is only one person

      // If someone wasn't matched up last time, match them first this time
      let oddManOutIndex = getOddManOutIndex(previousMatchups, users)
      while (users.length > 1) {
        let buddy = null
        let user = null
        if(oddManOutIndex >=0 && oddManOutIndex < users.length) {
          user = users[oddManOutIndex]
          users.splice(oddManOutIndex, 1)
          oddManOutIndex = -1
        } else {
          user = users.pop()
        }
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
          let buddyInfo = getRandom(usersCopy)

          //remove buddy from original users list
          buddy = users[buddyInfo.originalIndex]
          users.splice(buddyInfo.originalIndex, 1)

        }
        let activity = getRandom(activities)

        //buddy 1 notifications
        let userData = user ? user.data() : null
        let buddyData = buddy ? buddy.data() : null
        notify(userData, buddyData, activity, activitiesHTML, emailInfo)

        //buddy2 notifications
        notify(buddyData, userData, activity,  activitiesHTML, emailInfo)

        newMatchups.push({
          buddies: [user.id, buddy.id],
          activity: activity
        })
      }
      // end of matching up loop


      let allMessages = []
      //Handle emails with buddies
      if (emailInfo.length) {
        let msg = {
          personalizations: emailInfo,
          from: getFromEmail(),
          html: buddyEmailContent()
        }
        allMessages.push(msg)
      }


      if(users.length === 1) {
        //handle odd
        let activity = getRandom(activities)
        user = users.pop()
        newMatchups.push({
          buddies: [user.id],
          activity: activity
        })
        let userData = user.data()
        if(userData.notifyEmail) {
          let emailInfo = []
          addEmailPersonalization(userData, null, activity, emailInfo)
          let msg = {
            personalizations: emailInfo,
            from: getFromEmail(),
            html: noBuddyEmail
          }
          allMessages.push(msg)
        }
      }

      //double check existing matchup
      let existingMatchup = await companyRef.collection('buddies').doc(eventId).get()
      if (existingMatchup && !existingMatchup.data().loading) return null

      emailPromises = allMessages.forEach(msg => sgMail.send(msg))
      // eslint-disable-next-line promise/no-nesting
      return companyRef.collection('buddies').doc(eventId).set({
        matchups: newMatchups
      })
      .then(_snapshot => {
        return companyRef.set({
          activeBuddies: eventId
        }, {merge: true})
      })
    })

    let setNextMatchupPromise = setNextMatchupTime(companyId)

    return Promise.all([matchUpUsersPromise, setNextMatchupPromise].concat(emailPromises))
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


//Matchup on new user
exports.newUserHandler = functions.firestore.document('users/{userId}')
  .onCreate(async (userSnapshot, _ctx) => {
    //get company
    let user = userSnapshot.data()
    if(user.admin) return null
    let companyId = user.company_uid
    console.log(companyId)
    const firestore = admin.firestore();
    const companyRef = firestore.collection('companies').doc(companyId)
    if (!companyRef) return Promise.reject(new Error("company not found"))

    let activitiesSnapshot = await companyRef.collection('activities').get()

    const activities = []
    activitiesSnapshot.forEach(doc => activities.push(doc.data()))
    let activitiesHTML = getActivitiesHTML(activities)

    let companyData = await companyRef.get()
    companyData = companyData.data()

    if(!companyData.activeBuddies) {
    //if no matchup, create one and match people up
      return matchup({id: companyId})
    } else {
      //get current matchup
      let { ref, matchups } = await getMatchups(companyRef, companyData)
      let usersRef = await firestore.collection('users').where('company_uid', '==', companyId).get()
      let users = []
      usersRef.forEach(user => users.push(user))

      //check if there is an odd man out
      let single = matchups.find(matchup => {
        return matchup.buddies && matchup.buddies.length === 1
      })

      let buddy
      let activity
      if (single) {
        let buddyId = single.buddies[0]
        buddy = users.find(user => user.id === buddyId)
        activity = single.activity
        single.buddies.push(userSnapshot.id)
      } else {
        console.log('no single')
        //check if there are any users not in a matchup at all
        let buddiesInMatchup = []
        matchups.forEach(matchup => {
          buddiesInMatchup.push(matchup.buddies[0])
          if(matchup.buddies.length > 1) buddiesInMatchup.push(matchup.buddies[1])
        })

        buddy = users.find(buddy => buddiesInMatchup.indexOf(buddy.id) === -1 && buddy.id !== userSnapshot.id)
        console.log('buddy', buddy)
        if(!buddy) return null
        activity = matchups[0].activity //just use the first activity so we don't have to fetch them all
        matchups.push({buddies: [userSnapshot.id, buddy.id], activity})
      }


      let emailInfo = []
      addEmailPersonalization(user, buddy.data(), activity, activitiesHTML, emailInfo)
      addEmailPersonalization(buddy.data(), user, activity, activitiesHTML, emailInfo)

      let msg = {
        personalizations: emailInfo,
        from: getFromEmail(),
        html: buddyEmailContent()
      }

      console.log(matchups)
      return ref.set({matchups})
      .then(() => {
        //send email
        return sgMail.send(msg)
      })
    }
  })


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

exports.setInitialMatchupTime = functions.firestore.document('companies/{companyId}')
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


exports.matchUpScheduler = functions.pubsub.schedule('*/5 * * * *').onRun((_ctx) => {
  let timestamp = moment.utc().valueOf();
  return queries.getToMatchUp(timestamp).asyncMap(publishToTopic('matchup'))
});

// END TRIGGER MATCHUPS
