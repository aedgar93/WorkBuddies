// eslint-disable-next-line no-unused-vars
import React, { useEffect, useContext, useState } from 'react';
import styles from './Cookies.module.css'
import { TrackingContext } from '../../tracking'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import Checkbox from '../checkbox'

const CookieBanner = () => {
  const { consent, setConsent } = useContext(TrackingContext)
  const [isBannerHidden, setIsBannerHidden] = useState(consent === true || consent === false)
  const [isPopupVisible, setIsPopupVisible] = useState(false)


  useEffect(() => {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const accept = () => {
    setConsent(true)
    setIsBannerHidden(true)
  }

  const reject = () => {
    setConsent(false)
    setIsBannerHidden(true)
  }

  return (
    <div className={styles.container}>
      { isBannerHidden ? null : (
      <div id="cookies-eu-banner" className={styles.banner}>
        <div className={styles.filler}></div>
        <div className={styles.inner}>
          <div className={styles.info}>We use cookies to improve your browsing experience. By continuing to use this website, you agree to our use of cookies in accordance with our <Link className={styles.inlineLink} to="">privacy policy</Link>.</div>
          <div className={styles.optionsContainerLarge}>
            <Button id="cookies-eu-accept" style={{paddingLeft: '30px', paddingRight: '30px'}} onClick={accept}>I accept.</Button>
            <div className={styles.rejectSmall}>
              <Button variant="outline-primary" onClick={reject}>I don't accept.</Button>
            </div>
            <Button id="cookies-eu-more" className={styles.settingsButton} bsPrefix="wb" onClick={() => setIsPopupVisible(!isPopupVisible)}>Settings
            <span className={styles.arrow}> {isPopupVisible ? "<" : ">" }</span>
            </Button>
          </div>
        </div>
        <div className={styles.reject}>
          <Button variant="outline-primary" onClick={reject}>I don't accept.</Button>
        </div>
      </div>
      )}
      {
        !isBannerHidden && isPopupVisible ? (
          <>
          <div className={styles.line}></div>
          <div className={styles.popupWrapper}>
            <CookieSettings buttonsShowing={true}/>
          </div>
          </>
        ) : null
      }
    </div>
  );
}

export const CookieSettings = ({ buttonsShowing }) => {
  const { consent, setConsent } = useContext(TrackingContext)

  return (
    <div className={styles.popup}>
      <div className={styles.section}>
        <div className={styles.info}>
          <div className={styles.label}>This site uses cookies to store information on your computer.</div>
          <div className={styles.content}>Some of these cookies are essential, while others help us to improve your experience by providing insights into how the site is being used.</div>
        </div>
        <div className={buttonsShowing ? styles.optionsContainerLarge : styles.optionsContainer }>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.info}>
          <div className={styles.label}>Necessary Cookies</div>
          <div className={styles.content}>Necessary cookies enable core functionality such as page navigation and access to secure areas. The website cannot function properly without these cookies, and can only be disabled by changing your browser preferences.</div>
        </div>
        <div className={buttonsShowing ? styles.optionsContainerLarge : styles.optionsContainer }>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.info}>
          <div className={styles.label}>Analytical Cookies</div>
          <div className={styles.content}>Analytical cookies help us to improve our website by collecting and reporting information on its usage</div>
        </div>
        <div className={buttonsShowing ? styles.optionsContainerLarge : styles.optionsContainer }>
          <Checkbox checked={consent} onChange={setConsent} id="analyticCookies" />
        </div>
      </div>
    </div>
  )
}


export default CookieBanner
