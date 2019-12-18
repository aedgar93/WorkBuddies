import React from 'react'

// Simple React Component that manages adding the cloudsponge object to the page
//  and initializing it with the options that were passed through.
// props:
//  * options (optional): any javascript options you wish to pass to configure the cloudsponge object
//
// For example, you can use the component like so:
// import CloudSpongeWidget from './CloudSpongeWidget'
// // react boilerplate ...
// <CloudSpongeWidget
//     options={{
//         selectionLimit: this.availableNewUserSlots.bind(this),
//         afterSubmitContacts: this.addUsers.bind(this),
//     }}
// >
//     <a className="cloudsponge-launch" data-cloudsponge-source="gmail">
//         Add your Gmail Contacts
//     </a>
//     <a className="cloudsponge-launch">
//         Add From Address Book
//     </a>
// </CloudSpongeWidget>
class CloudSponge extends React.Component {
    // adds an async script tag to the page and invokes a callback when the script has loaded
    addJavascript(src, id, callback) {
        if (id && document.getElementById(id)) {
            // the script is already loaded so just invoke the callback and return
            if(callback) callback()
            return
        }

        // create and add the script tag
        const scriptTag = document.createElement('script')
        scriptTag.type = 'text/javascript'
        scriptTag.async = 1
        if (id) {
            scriptTag.id = id
        }

        // set the script to invoke a callback after it loads
        if (callback) {
            if (scriptTag.readyState) { // IE7+
                scriptTag.onreadystatechange = () => {
                    if (scriptTag.readyState === 'loaded' || scriptTag.readyState === 'complete') {
                        // clear the callback so it only ever executes once
                        scriptTag.onreadystatechange = null
                        callback()
                    }
                }
            }
            else {
                scriptTag.onload = () => { // Other browsers support the onload attribute \o/
                    callback()
                }
            }
        }

        // assign the src attribute
        scriptTag.src = src
        // add the script to the page
        document.body.appendChild(scriptTag)
    }

    componentDidMount() {
      console.log(process.env.REACT_APP_CLOUD_SPONGE_KEY)
        this.addJavascript(`https://api.cloudsponge.com/widget/${process.env.REACT_APP_CLOUD_SPONGE_KEY}.js`, "__cloudsponge_widget_script", () => {
            // calling init attaches the cloudsponge.launch action to any cloudsponge-launch links on the page
            if (window.cloudsponge) {
                window.cloudsponge.init(this.props.options)
            }
        })
    }

    // just render the children, if any.
    //  typically the children will include at least one link decorated with
    //  class="cloudsponge-launch" so that the cloudsponge library will attach
    //  to its onClick handler to launch the widget
    render() {
        return this.props.children
    }
}

export default CloudSponge
