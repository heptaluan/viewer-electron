import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CallbackComponent } from 'redux-oidc'

class CallbackPage extends Component {
  static propTypes = {
    userManager: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  render() {
    return (
      <CallbackComponent
        userManager={this.props.userManager}
        successCallback={() => {
          const { pathname, search = '' } = JSON.parse(sessionStorage.getItem('ohif-redirect-to'))

          this.props.history.push({ pathname, search })
        }}
        errorCallback={(error) => {
          throw new Error(error)
        }}
      >
        <div>Redirecting...</div>
      </CallbackComponent>
    )
  }
}

export default withRouter(CallbackPage)
