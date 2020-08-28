const SUPPORT_EMAIL = "dev@tangcapital.com"

const ROUTES = {
  BASE: '/',
  MY_ACCOUNT: '/my_account',
  ACCEPT_INVITE: '/accept_invite',
  SIGN_IN: '/sign_in',
  GET_STARTED: '/get_started',
  EDIT_COMPANY: '/edit_company',
  SET_UP_ACTIVITIES: '/set_up_activities',
  SET_UP_EMPLOYEES: '/set_up_employees',
  WELCOME: '/welcome',
  PRIVACY: '/privacy_policy',
  TERMS: '/terms_of_use',
  REDIRECT: '/redirect'
}

const DAYS = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
]

const TIMES = [
  { label: '5 am', value: 5},
  { label: '6 am', value: 6},
  { label: '7 am', value: 7},
  { label: '8 am', value: 8},
  { label: '9 am', value: 9},
  { label: '10 am', value: 10},
  { label: '11 am', value: 11},
  { label: 'Noon', value: 12},
  { label: '1 pm', value: 13},
  { label: '2 pm', value: 14},
  { label: '3 pm', value: 15},
  { label: '4 pm', value: 16},
  { label: '5 pm', value: 17},
  { label: '6 pm', value: 18},
  { label: '7 pm', value: 19},
]


module.exports = {
  ROUTES,
  DAYS,
  TIMES,
  SUPPORT_EMAIL
}
