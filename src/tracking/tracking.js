import mixpanel from 'mixpanel-browser'

const token = process.env.REACT_APP_MIXPANEL_KEY || "02f159bb569e3b49766465edd60436af"

class Cookies {
  constructor(acceptFunction, rejectFunction) {
    this.mixpanel = mixpanel
    this.acceptFunction = acceptFunction
    this.rejectFunction = rejectFunction
    this.bots = /bot|crawler|spider|crawling/i;
    this.cookieName = 'hasConsent';
    this.consent = null
    this.trackingCookiesNames = ['__utma', '__utmb', '__utmc', '__utmt', '__utmv', '__utmz', '_ga', '_gat', '_gid'];
  }

  init =  () => {
    // Detect if the visitor is a bot or not
    // Prevent for search engine take the cookie alert message as main content of the page
    var isBot = this.bots.test(navigator.userAgent);

    // Check if DoNotTrack is activated
    var dnt = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
    var isToTrack = (dnt !== null && dnt !== undefined) ? (dnt && dnt !== 'yes' && dnt !== 1 && dnt !== '1') : true;

    // Do nothing if it is a bot
    // If DoNotTrack is activated, do nothing too
    if (isBot || !isToTrack || this.hasConsent() === false) {
      this.setConsent(false)
      return false;
    }

    // User has already consent to use cookies to tracking
    if (this.hasConsent() === true) {
      this.setConsent(true)
      return true;
    }
  }

  /*
   * Set consent cookie or localStorage
   */
  setConsent = (consent) => {
    this.consent = consent
    this.setCookie(this.cookieName, consent);
    if(consent === true) {
      this.acceptFunction()
    }
    if(consent === false) {
      this.trackingCookiesNames.map(this.deleteCookie);
      this.rejectFunction()
    }
  }

  /*
   * Check if user already consent
   */
  hasConsent = () => {
    var cookieName = this.cookieName;
    var isCookieSetTo = function (value) {
      return document.cookie.indexOf(cookieName + '=' + value) > -1 || localStorage.getItem(cookieName) === value;
    };

    if (isCookieSetTo('true')) {
      return true;
    } else if (isCookieSetTo('false')) {
      return false;
    }

    return null;
  }

  /*
   * Create/update cookie
   */
  setCookie = (name, value) => {
    var date = new Date();
    date.setTime(date.getTime() + this.cookieTimeout);

    document.cookie = name + '=' + value + ';expires=' + date.toGMTString() + ';path=/';
  }

  /*
   * Delete cookie by changing expire
   */
  deleteCookie = (name) => {
    var hostname = document.location.hostname.replace(/^www\./, ''),
        commonSuffix = '; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';

    document.cookie = name + '=; domain=.' + hostname + commonSuffix;
    document.cookie = name + '=' + commonSuffix;
  }
};

class Tracking {
  constructor() {
    mixpanel.init(token, {opt_out_tracking_by_default: true});
    this.mixpanel = mixpanel
    this.cookies = new Cookies(() => {
      if(mixpanel.has_opted_in_tracking()) return
      mixpanel.opt_in_tracking()
    }, () => {
      if(mixpanel.has_opted_out_tracking()) return
      mixpanel.opt_out_tracking()
    })
    this.cookies.init()
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

