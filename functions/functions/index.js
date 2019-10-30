// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const inviteEmailContent = () => {
  return `
    <p>Welcome to Work Buddies! Enter the code {code} to join {companyName}
  `
}
const foods = ["soup", "coffee", "pancake", "pizza", "sushi", "ramen", "burrito", "gyros", "pasta", "curry", "bratwurst"];
const generateCode = () => foods[Math.floor(Math.random() * foods.length)] + Math.floor(1000 + Math.random() * 9000);


sgMail.setApiKey(functions.config().mail.key);

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
