// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
var serviceAccount = require("./admin-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hr-app-391b3.firebaseio.com"
});

const inviteEmailContent = () => {
  return `
    <p>Welcome to Work Buddies! Enter the code {code} to join {companyName}
  `
}
const foods = ["soup", "coffee", "pancake", "pizza", "sushi", "ramen", "burrito", "gyros", "pasta", "curry", "bratwurst"];
const generateCode = () => foods[Math.floor(Math.random() * foods.length)] + Math.floor(1000 + Math.random() * 9000);


// sgMail.setApiKey(functions.config().mail.key);

exports.inviteHandler = functions.firestore.document('invites/{inviteId}')
  .onCreate((inviteSnapshot, _ctx) => {
    const firestore = admin.firestore();
    const invitesRef = firestore.collection('invites');
    const companiesRef = firestore.collection('companies');

    return Promise.all([getCode(), companiesRef.doc(inviteSnapshot.data().company_uid).get()]).then(results => {
      let code = results[0];
      let companyRef = results[1];

      let emailContent = inviteEmailContent();
      emailContent = emailContent.replace('{code}', code);
      emailContent = emailContent.replace('{companyName}', companyRef.data().name);

      const msg = {
        to: inviteSnapshot.data().email,
        from: functions.config().mail.email,
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

//Generate matchups
exports.matchup = functions.https.onCall(({ companyId }, _ctx) => {
  const firestore = admin.firestore();
  let companyRef = firestore.collection('companies').doc(companyId);
  if (!companyRef) return Promise.reject(new Error("company not found"))

  let usersRef = firestore.collection('users').where('company_uid', '==', companyId)


  return usersRef.get()
    .then(snapshot => {
      const users = []
      snapshot.forEach(user => users.push(user))

      console.log(users.length)
      let promises = []
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
          let lastBuddyId = user.data().buddy_uid
          if(lastBuddyId) {
            //remove last buddy from array of options
            let lastBuddyIndex = usersCopy.findIndex(user => user.id === lastBuddyId)
            usersCopy.splice(lastBuddyIndex, 1)
          }

          //get random buddy from remaining options
          let buddyInfo = usersCopy[Math.floor(Math.random()*users.length)]

          //remove buddy from original users list
          buddy = users[buddyInfo.originalIndex]
          users.splice(buddyInfo.originalIndex, 1)

        }
        console.log('user', user.id)
        console.log('buddy', buddy.id)
        promises.push(user.ref.set({
          buddy_uid: buddy.id
        }, {merge: true}))

        promises.push(buddy.ref.set({
          buddy_uid: user.id
        }, {merge: true}))
        console.log('remaining', users.length)
      }
      if(users.length === 1) {
        //handle odd
        user = users.pop()
        promises.push(user.ref.set({
          buddy_uid: null
        }))
        console.log('left over', user.id)
      }

      return Promise.all(promises)
    })
})
