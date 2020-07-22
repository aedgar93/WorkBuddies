// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const moment = require('moment-timezone');
const initQueries = require('./queries.js');
const uuidv1 = require('uuid/v1');
const { TIMES, ROUTES }= require('wb-utils/constants')
const { PubSub } = require('@google-cloud/pubsub');
const fs = require('fs');
const { promisify } = require('util');
const read = promisify(fs.readFile);

const Sentry = require('@sentry/node')

Sentry.init({ dsn: 'https://abc4cbf3abff4a19975d97ee9e6bfcd6@o386021.ingest.sentry.io/5219768' });


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

sgMail.setApiKey(config && config.mail ? config.mail.key : "");
sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally

//Delete all invites for an email when a user joins
exports.inviteAccepted = functions.firestore.document('users/{userId}')
  .onCreate((userSnapshot, _ctx) => {
    try {
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
    } catch(e) {
      Sentry.captureException(e)
      return Promise.reject(e)
    }
  })

//INVITE EMAIL
const getFromEmail = () => {
  return config && config.mail ? config.mail.email : 'annadesiree11@gmail.com'
}

const signupLink = `${config && config.host && config.host.url ? config.host.url : 'http://localhost:3000'}${ROUTES.ACCEPT_INVITE}`



exports.inviteHandler = functions.firestore.document('invites/{inviteId}')
  .onCreate((inviteSnapshot, _ctx) => {
    try {
      const firestore = admin.firestore();
      const adminRef = firestore.collection('users');
      const data = inviteSnapshot.data()

      return Promise.all([
        adminRef.doc(data.invitedBy).get(),
        read('emails/invite.html', 'utf8')
      ])
      .then(([results, emailContent]) => {
        let admin = results.data();

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
    } catch(e) {
      Sentry.captureException(e)
      return Promise.reject(e)
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

const getRandom = (collection) => {
  if(!collection || collection.length === 0) return null
  return collection[Math.floor(Math.random()*collection.length)]
}

const noBuddyEmail = "Hello {{buddy1}},<br/><br/> Unfortunately there is an odd number of people in your group, so you did not get matched up with a buddy this week. Please check back next week for your new matchup. <br/><br/> Sincerely,<br/> the Work Buddies Team"


const addBuddySubstitutions = (buddy, suffix, substitutions) => {
  substitutions['buddy' + suffix] = `${buddy.firstName}`
  if(buddy.profilePic) {
    substitutions['profilePic_' + suffix] = `<img src=${buddy.profilePic} style="width:93px;height:93px;"></img>`
  } else {
    substitutions['profilePic_' + suffix] = `<div class="profileImgText">${buddy.firstName[0]}${buddy.lastName[0]}</div>`
  }
  if(buddy.department) {
    substitutions['department_' + suffix] = buddy.department
  } else {
    substitutions['department_' + suffix] = ""
  }
  if(buddy.about) {
    substitutions['about_' + suffix] = buddy.about
  } else {
    substitutions['about_' + suffix] = ""
  }
  const timePrefix = 'buddy' + suffix + '_time_'
  for(let i = 0;i <= 4; i++) {
    if(buddy.availability && buddy.availability[i] && buddy.availability[i].times) {
      let time0 = TIMES.find(t => t.value === buddy.availability[i].times[0])
      let time1 = TIMES.find(t => t.value === buddy.availability[i].times[1])
      console.info(time0 && time0.label)
      console.info(time1 && time1.label)
      substitutions[`${timePrefix}${i}_0`] = (time0 && time0.label) || '- -'
      substitutions[`${timePrefix}${i}_1`] = (time1 && time1.label) || '- -'
    } else {
      substitutions[`${timePrefix}${i}_0`] = '- -'
      substitutions[`${timePrefix}${i}_1`] = '- -'
    }
  }
}

const addEmailPersonalization = (buddy1, buddy2, buddy3, activity, emailInfo) => {
  if (!buddy1 || !buddy1.email || !buddy1.notifyEmail) return null
  let to = [{email: buddy1.email}]
  let activityString = activity ? activity.name : "Grab a Coffee"
  let substitutions = {"buddy1": `${buddy1.firstName} ${buddy1.lastName}`, "activityString": activityString , links: '', profilePic: '', department: '', about: '', email: ''}
  if (buddy2) {
    addBuddySubstitutions(buddy2, '2', substitutions)
    let subject = "I'm your weekly buddy"
    let body = `Hello ${buddy2.firstName},\n\nWe've been matched up as work buddies this week. Can we schedule a time this week to ${activityString}?\n\nSincerely, ${buddy1.firstName}`
    substitutions['contactHref'] = `mailto:${buddy2.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
  if(buddy3) {
    addBuddySubstitutions(buddy3, '3', substitutions)
    let subject = "I'm your weekly buddy"
    let body = `Hello ${buddy2.firstName} and ${buddy3.firstName},\n\nWe've been matched up as work buddies this week. Can we schedule a time this week to ${activityString}?\n\nSincerely, ${buddy1.firstName}`
    substitutions['contactHref'] = `mailto:${buddy2.email},${buddy3.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  }

  return emailInfo.push({ to, substitutions, subject: "Your Weekly Buddy" })
}

const notify = (buddy1, buddy2, buddy3,  activity, emailInfo) => {
  if (!buddy1) return null
  addEmailPersonalization(buddy1, buddy2, buddy3, activity, emailInfo)
  return null
}

const getOddManOutIndex = (previousMatchups, users) => {
  if(!previousMatchups) return -1
  let singleOrTriple = previousMatchups.find(matchup => {
    return matchup.buddies && (matchup.buddies.length === 1 || matchup.buddies.length === 3)
  })
  if (!singleOrTriple) return -1
  let id = singleOrTriple.buddies[0]

  let oddManOut = users.findIndex(user => {
    return user.id === id
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

  let usersRef = firestore.collection('users').where('company_uid', '==', companyId)
  let previousMatchupsInfo = await getMatchups(companyRef, companyData)
  let previousMatchups = previousMatchupsInfo.matchups

  let newMatchups = []
  let emailInfo = []
  let emailPromises = []
  let matchupEmailContent = await read('emails/matchup.html', 'utf8')
  let matchupEmailThreeContent = await  read('emails/matchup3.html', 'utf8')

  let matchUpUsersPromise = usersRef.get()
    .then(async snapshot => {
      const users = []
      snapshot.forEach(user => users.push(user))
      if(users.length === 1) return null //no matchup if there is only one person

      // If someone wasn't matched up last time, match them first this time
      let oddManOutIndex = getOddManOutIndex(previousMatchups, users)
      while (users.length > 1 && users.length !== 3) {
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

        let userData = user ? user.data() : null
        let buddyData = buddy ? buddy.data() : null

        notify(userData, buddyData, null, activity, emailInfo)

        //buddy2 notifications
        notify(buddyData, userData, null, activity, emailInfo)


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
          html: matchupEmailContent
        }
        allMessages.push(msg)
      }


      if(users.length === 1) {
        //handle odd
        let activity = getRandom(activities)
        let user = users.pop()
        newMatchups.push({
          buddies: [user.id],
          activity: activity
        })
        let userData = user.data()
        if(userData.notifyEmail) {
          let emailInfo = []
          notify(userData, null, null, activity, emailInfo)

          let msg = {
            personalizations: emailInfo,
            from: getFromEmail(),
            html: noBuddyEmail
          }
          allMessages.push(msg)
        }
      } else if(users.length === 3) {
        let activity = getRandom(activities)
        let user = users.pop()
        let buddy = users.pop()
        let buddy2 = users.pop()
        let emailInfo = []

        let userData = user.data()
        let buddyData = buddy.data()
        let buddy2Data = buddy2.data()

        notify(userData, buddyData, buddy2Data, activity, emailInfo)
        notify(buddyData, userData, buddy2Data, activity, emailInfo)
        notify(buddy2Data, userData, buddyData, activity, emailInfo)

        newMatchups.push({
          buddies: [user.id, buddy.id, buddy2.id],
          activity: activity
        })

        let msg = {
          personalizations: emailInfo,
          from: getFromEmail(),
          html: matchupEmailThreeContent
        }
        allMessages.push(msg)
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
  try {
    const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
    console.info(JSON.stringify(data))
    return matchup(data)
  } catch(e) {
    Sentry.captureException(e)
    return Promise.reject(e)
  }
})

exports.matchup = functions.https.onCall((data, _ctx) => {
  try {
    return matchup(data)
  } catch(e) {
    Sentry.captureException(e)
    return Promise.reject(e)
  }
})
// END GENERATE MATCHUPS


//Matchup on new user
exports.newUserHandler = functions.firestore.document('users/{userId}')
  .onCreate(async (userSnapshot, _ctx) => {
    try {
      //get company
      let user = userSnapshot.data()
      if(user.admin) return null
      let companyId = user.company_uid
      console.log(companyId)
      const firestore = admin.firestore();
      const companyRef = firestore.collection('companies').doc(companyId)
      if (!companyRef) return Promise.reject(new Error("company not found"))

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
            if(matchup.buddies.length > 2) buddiesInMatchup.push(matchup.buddies[2])
          })

          buddy = users.find(buddy => buddiesInMatchup.indexOf(buddy.id) === -1 && buddy.id !== userSnapshot.id)
          if(!buddy) return null
          activity = matchups[0].activity //just use the first activity so we don't have to fetch them all
          matchups.push({buddies: [userSnapshot.id, buddy.id], activity})
        }



        let emailInfo = []
        notify(user, buddy.data(), null, activity, emailInfo)
        notify(buddy.data(), user, null, activity, emailInfo)

        let emailContent = await read('emails/matchup.html', 'utf8')

        if(emailInfo.length >= 1) {
          let msg = {
            personalizations: emailInfo,
            from: getFromEmail(),
            html: emailContent
          }


          console.log(msg)
          return ref.set({matchups})
          .then(() => {
            //send email
            return sgMail.send(msg)
          })
        } else {
          return Promise.resolve()
        }
      }
    } catch(e) {
      Sentry.captureException(e)
      return Promise.reject(e)
    }
  })


// TRIGGER MATCHUPS

//set next matchup time
const setNextMatchupTime = (companyId) => {
  try {
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
  } catch(e) {
    Sentry.captureException(e)
    return Promise.reject(e)
  }
}
exports.setNextMatchupTime = functions.https.onCall(({ companyId }, _ctx) => {
  try {
    return setNextMatchupTime(companyId)
  } catch(e) {
    Sentry.captureException(e)
    return Promise.reject(e)
  }
})

exports.setInitialMatchupTime = functions.firestore.document('companies/{companyId}')
.onCreate((snapshot, _context) => {
  try {
    return setNextMatchupTime(snapshot.id)
  } catch(e) {
    Sentry.captureException(e)
    return Promise.reject(e)
  }
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
  try {
    let timestamp = moment.utc().valueOf();
    return queries.getToMatchUp(timestamp).asyncMap(publishToTopic('matchup'))
  } catch(e) {
    Sentry.captureException(e)
    return Promise.reject(e)
  }
});

// END TRIGGER MATCHUPS
