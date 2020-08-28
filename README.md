# Welcome to Work Buddies!


## What is Work Buddies?
Work Buddies is a website that pairs up coworkers on a weekly basis and encourages them to do something together. Admins can add activities avaliable in their office, such as ping pong or foosball, to be suggested to the pairs.

## Why Work Buddies?
I noticed that my company can be very siloed. I am very close with my small team, but I don't interact with the rest of the company much. I pass by my coworkers every day, but I don't have many chances to get to know them. We do have an office manager that plans the occasional happy hour or party. But many people don't attend because it's too much of a time commitment. Plus they are difficult to plan in the first place!

I also noticed that while my company has a lot of cool toys (ping pong, foosball, boccee ball, corn hole, putt putt, baskball, etc, etc), hardly anyone uses them! I wanted to create a way to encourage people to take the occasional break from work, de-stress, and know that it's encouraged for them to get away from their desk every now and then.


That's where Work Buddies come in. It encourages people to get to know each other, on a more regular basis. Instead of facing a lengthy after work party, with a bunch of people you barely know, you can spend 15 minutes a week building up relationships. Hopefully it will help break the ice, introduce different departments to one another, and encourage healthy interactions.


## Setup

### Front End
1. `yarn install`
1. create a .env file in the root folder. You can find a copy of the .env file for staging in LastPass

### Firebase Functions
1. If you have not already, install the firebase cli: `npm install -g firebase-tools`
1. `firebase login`
1. `cd functions/functions`
1. `npm install`

### Install utils package so it updates when you make changes
1. `cd utils`
1. `yarn link`
1. `cd ..`
1. `yarn link wb-utils`


## Run
From the root folder, run `yarn`

## Deploy

### Front End
The app can be deployed from heroku. Log in to heroku and select the app you would like to deploy (work-buddies or work-buddies staging).

### Firebase Functions
1. `cd functions/functions`
1. Switch to the app you would like to use. Either `firebase use default` for production or `firebase use staging`
1. `npm run deploy`



## Other info

* Manually triggering a weekly matchup:
  * Find the company in the Firebase Cloud Firestore console (console.firebase.google.com)
  * set the matchUpTime to 0
  * The matchup job runs automatically every 5 minutes and will pick up your company the next time it runs
* We use React Bootstrap for many of our components. You can find examples of buttons, alerts, the navbar and more at https://react-bootstrap.github.io/components/


## Accounts
All logins can be found in LastPass, unless otherwise mentioned

* CloudSponge: contacts import tool
  * https://www.cloudsponge.com/
* Firebase/Google Cloud
  * ttglabs@gmail.com account has access. You can log in and add your own account in the Settings/Users and Permissions section
* Heroku
  * ttglabs@gmail.com account has access. You can log in and add your own account by selecting the work-buddies-pipeline and adding your account under the access tab
* Sentry: error alerting tool

