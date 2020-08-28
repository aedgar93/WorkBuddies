// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { ROUTES } from 'wb-utils/constants'

const MSRedirect = () => {

  useEffect(() => {
        //Needs to be initialized so the MS login popup can close on redirect
        new PublicClientApplication({
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

  }, [])

  return (
    <div>
      Redirecting
    </div>
  );
}

export default MSRedirect
