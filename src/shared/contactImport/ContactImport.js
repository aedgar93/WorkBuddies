// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import styles from './ContactImport.module.css'
import { gapi } from 'gapi-script'
import { PublicClientApplication } from '@azure/msal-browser';
import * as graph from '@microsoft/microsoft-graph-client'
import { ROUTES } from 'wb-utils/constants'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import GmailIcon from '../../assets/images/gmail.svg'
import OutlookIcon from '../../assets/images/outlook.svg'
import Spinner from 'react-bootstrap/Spinner'
import Checkbox from '../checkbox'
import { ModalFooter } from 'react-bootstrap';

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/contacts.readonly";
const STANDARD_ERROR = "Uh oh! Something went wrong. Please try again."

const ContactImport = ({ onSubmit, isVisible, setIsVisible }) => {
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const [contacts, setContacts] = useState(null)
  const [fetchingContacts, setFetchingContacts] = useState(false)
  const [msApp, setMSApp] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [selectedContacts, setSelectedContacts] = useState({})

  useEffect(() => {
    gapi.load('client:auth2', initClient);
    const msApp = new PublicClientApplication({
      auth: {
          redirectUri: process.env.REACT_APP_MS_REDIRECT + ROUTES.REDIRECT,
          clientId: process.env.REACT_APP_MS_APP_ID,
          navigateToLoginRequestUrl: false
      },
      cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: false
      }
    })

    setMSApp(msApp)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setError = (error) => {
    setFetchingContacts(false)
    setErrorMessage(error)
  }

  const initClient = () => {
    gapi.client.init({
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      setIsGoogleReady(true)
    }, function(error) {
        console.error(error)
        setError(STANDARD_ERROR)
    });
  }

  const formatContacts = (contacts) => {
    if(!contacts) return []
    let splitContacts = []
    let keys = []

    contacts.forEach(contact => {
      if(!contact.emails) return
      contact.emails.forEach(email => {
        if(!email || email.trim() === "") return
        let key = email + (contact.name || "")

        if(keys.indexOf(key) !== -1) return //prevent dupes
        splitContacts.push({name: contact.name, email, sortLabel: contact.name && contact.name !== "" ? contact.name.toUpperCase() : email.toUpperCase(), key})
      })
    })

    return splitContacts.sort((a, b) => a.sortLabel.localeCompare(b.sortLabel))
  }

  const getGoogleContacts = async () => {
    setFetchingContacts(true)
    setSelectedContacts({})
    try {
      await gapi.auth2.getAuthInstance().signIn();
      // await gapi.auth2.getAuthInstance().signIn();
      gapi.client.people.people.connections.list({
        'resourceName': 'people/me',
        'personFields': 'names,emailAddresses',
      }).then(function(response) {
        var connections = response.result.connections;

        let contacts = connections
        .map(person => {
          return {
            name: person.names && person.names.length > 0 ? person.names[0].displayName : "",
            emails: person.emailAddresses && person.emailAddresses.map(email => email.value)
          }
        })
        .filter(person => person.emails && person.emails.length > 0)


        setContacts(formatContacts(contacts))
        setFetchingContacts(false)
      })
    } catch(err) {
      console.error(err)
      setError(STANDARD_ERROR)
      throw err
    }

  }


  const isInteractionRequired = (error) => {
    if (!error.message || error.message.length <= 0) {
      return false;
    }

    return (
      error.message.indexOf('consent_required') > -1 ||
      error.message.indexOf('interaction_required') > -1 ||
      error.message.indexOf('login_required') > -1
    );
  }

  const getMSAccessToken = async (scopes, account) =>{
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token
      var silentResult = await msApp.acquireTokenSilent({
        account,
        scopes
      });

      return silentResult.accessToken;
    } catch (err) {
      // If a silent request fails, it may be because the user needs
      // to login or grant consent to one or more of the requested scopes
      if (isInteractionRequired(err)) {
        var interactiveResult = await msApp.acquireTokenPopup({
          scopes: scopes
        });

        return interactiveResult.accessToken;
      } else {
        throw err;
      }
    }
  }


  const getOutlookContacts = async () => {
    setSelectedContacts({})
    setFetchingContacts(true)
    try {

      // Login via popup
      let loginResponse = await msApp.loginPopup(
          {
            scopes: ['user.read', 'contacts.read'],
            prompt: "select_account"
      })
      let account = loginResponse.account

      // After login, get the user's profile
      let accessToken = await getMSAccessToken(['contacts.read'], account);

      const client = graph.Client.init({
        // Use the provided access token to authenticate
        // requests
        authProvider: (done) => {
          done(null, accessToken);
        }
      });

      let results = await client.api("/me/contacts").select(['displayName', 'emailAddresses']).get()

      let contacts = results.value
      .map(person => {
        return {
          name: person.displayName,
          emails: person.emailAddresses.map(email => email.address)
        }
      })
      .filter(person => person.emails.length > 0)

      setContacts(formatContacts(contacts))
      setFetchingContacts(false)
    }
    catch(err) {
      console.error(err)
      setError(STANDARD_ERROR)
      throw err
    }
  }

  const back = () => {
    setContacts(null)
    setError(null)
    setFetchingContacts(false)
    setSelectedContacts({})
  }

  const submit = () => {
    back()
    onSubmit(Object.values(selectedContacts))
    setIsVisible(false)
  }

  const handleClose = () => {
    back()
    setIsVisible(false)
  }

  const renderBody = () => {
    if(!isGoogleReady || fetchingContacts) return <div className={styles.spinner}><Spinner variant="primary" animation="border"/></div>
    if(errorMessage) {
      return (
        <div>
          <div><Button onClick={back} variant="outline-secondary">Back</Button></div>
          <div className={styles.error}>{ errorMessage }</div>
        </div>
      )
    }
    if(contacts) {
      return (
        <div className={styles.contactBody}>{ renderContacts() }</div>
      )
    }
    return (
      <div>
        <button onClick={getGoogleContacts} variant="outline-danger" size="lg" className={styles.bookButton}>
          <img src={GmailIcon} alt="Gmail" className={styles.gmailIcon}/> Google Contacts
        </button>
        <button onClick={getOutlookContacts} variant="outline-info" size="lg" className={styles.bookButton}>
          <img src={OutlookIcon} alt="Outlook" className={styles.outlookIcon}/> Outlook
        </button>
      </div>
    );
  }

  const selectContact = (contact) => {
    let selectContactsCopy = { ...selectedContacts }

    if(selectContactsCopy[contact.key]) {
      delete selectContactsCopy[contact.key]
    } else {
      selectContactsCopy[contact.key] = contact
    }

    setSelectedContacts(selectContactsCopy)
  }

  const renderContacts = () => {
    if(!contacts) return 'Loading Contacts..'
    if(contacts.length === 0 ) return 'No Contacts Found'
    let currentLetter = ""

    return (
      <div>
        {
          contacts.map((contact, i) => {
            let firstLetter = contact.sortLabel[0]
            let updateLetter = false
            if(firstLetter !== currentLetter) {
              updateLetter = true
              currentLetter = firstLetter
            }

            return (
              <div key={contact.key}>
                { updateLetter ? (
                  <div className={styles.letterLabel}>{currentLetter}</div>
                ) : null}
                <div className={styles.contactInfoContainer}>
                  <Checkbox id={contact.key} checked={!!selectedContacts[contact.key]} onChange={() => selectContact(contact)} hideLabel={true} size={18}/>
                  <div className={styles.contactInfo} onClick={() => selectContact(contact)}>{contact.name ? `${contact.name}: ` : ""}{contact.email}</div>
                </div>
              </div>
            )}
            )
        }
      </div>
    )
  }

  return (
    <Modal show={isVisible} onHide={handleClose} scrollable={true}>
      <Modal.Header closeButton>
        <h4 className={styles.title}>
        {
          contacts ? 'Select Contacts' : 'Choose Your Address Book'
        }
        </h4>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.body}>
          { renderBody() }
        </div>
      </Modal.Body>
      {
        isGoogleReady && !fetchingContacts && !errorMessage && contacts ? (
          <ModalFooter>
            <Button onClick={back} variant="outline-secondary">Back</Button>
            <Button onClick={submit} className={styles.submit}>Submit</Button>
          </ModalFooter>
        ) : null
      }
    </Modal>
  )
}


export default ContactImport
