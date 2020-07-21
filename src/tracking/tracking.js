import mixpanel from 'mixpanel-browser'

const token = process.env.REACT_APP_MIXPANEL_KEY || "02f159bb569e3b49766465edd60436af"

class Tracking {
  constructor() {
    mixpanel.init(token);
    this.mixpanel = mixpanel
  }

  initUser = (user) => {
    mixpanel.identify(user.id);
    mixpanel.people.set(user)
  }

  signIn = () => {
    mixpanel.track('login')
    mixpanel.register_once({
      'First Login Date': new Date().toISOString()
    });
  }

  updateProfile = (option) => {
    mixpanel.track('update profile', { option })
  }

  updateCompany = () => {
    mixpanel.track('update company')
  }

  addActivity = (value) => {
    mixpanel.track('activity add', { value })
  }

  editActivity = (value) => {
    mixpanel.track('activity edit', { value })
  }

  deleteActivity = (value) => {
    mixpanel.track('activity delete', { value })
  }

  invite = (total) => {
    mixpanel.track('invite', { total })
  }
}
export default Tracking;

