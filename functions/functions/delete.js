const firebaseTools = require('firebase-tools')
require ('custom-env').env('delete')

const project = process.env.PROJECT || 'work-buddies-staging'
const companyId = process.env.COMPANY_ID

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL: `https://${project}.firebaseio.com`
});

const run = async () => {
    if(!companyId) return console.error('Please set COMPANY_ID in .env.delete')
    const firestore = admin.firestore();


    //delete company
    await firebaseTools.firestore
      .delete(`companies/${companyId}`, {
        project: project,
        recursive: true,
        yes: true,
    });

    //find all users with companyID

    const usersRef = firestore.collection('users');

    await usersRef.where('company_uid', '==', companyId).get()
    .then(snapshot => {
      var batch = firestore.batch()

      snapshot.docs.forEach(async doc => {
        // eslint-disable-next-line promise/no-nesting
        await admin.auth().deleteUser(doc.data().auth_id)
        .catch((error) => {
          return console.error('Error deleting user:', error);
        });
        batch.delete(doc.ref)
      })
      return batch.commit()
    }).catch(error => console.error(error))

    //find all invites with companyID
    const invitesRef = firestore.collection('invites');

    await invitesRef.where('company_uid', '==', companyId).get()
    .then(snapshot => {
      var batch = firestore.batch()

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref)
      })
      return batch.commit()
    }).catch(error => console.error(error))


    return { done: true }
  };

  run()
