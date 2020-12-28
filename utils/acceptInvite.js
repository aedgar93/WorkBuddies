const acceptInvite = async (firebase, companyId, inviteId, { email, password1, firstName, lastName }) => {
  if (!companyId || !inviteId) {
    return Promise.reject('Sorry! Something went wrong. Please try again.')
  }

  let user
  try {
    let result = await firebase.createUserWithEmailAndPassword(email, password1)
    user = result.user
  } catch(error) {
    return Promise.reject(error.message)
  }
  localStorage.removeItem('inviteId')
  return firebase.db.collection('users').add({
    auth_id: user.uid,
    firstName,
    lastName,
    email,
    notifyEmail: true,
    company_uid: companyId,
    admin: false
  })
}

module.exports =  acceptInvite
