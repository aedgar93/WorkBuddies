import React from 'react'

//options can be found at https://www.cloudsponge.com/developer/address-book-widget/javascript-callbacks/
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
      this.addJavascript(`https://api.cloudsponge.com/widget/${process.env.REACT_APP_CLOUD_SPONGE_KEY}.js`, "__cloudsponge_widget_script", () => {
        // calling init attaches the cloudsponge.launch action to any cloudsponge-launch links on the page
        if (window.cloudsponge) {
          window.cloudsponge.init(this.props.options)
        }
      })
    }

    componentWillUnmount() {
      if(window.cloudsponge) {
        window.cloudsponge.end()
      }
    }

    render() {
      return this.props.children
    }
}

export default CloudSponge
