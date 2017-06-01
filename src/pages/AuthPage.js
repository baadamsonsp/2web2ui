import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../actions/auth';
import { Redirect } from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import { Panel } from '@sparkpost/matchbox';

class AuthPage extends Component {
  state = {
    username: '',
    password: '',
    remember_me: false
  }

  updateInput (name, value) {
    this.setState({
      [name]: value
    });
  }

  renderLoginError () {
    const { errorDescription } = this.props.auth;

    if (!errorDescription) {
      return null;
    }

    return (
      <div className='error'>
        <p>{errorDescription}</p>
      </div>
    );
  }

  renderLoginButton () {
    return this.props.auth.loginPending ? <span><i className="fa fa-spinner fa-spin"></i> Logging In</span> : <span>Log In</span>;
  }

  render () {
    if (this.props.auth.loggedIn) {
      return <Redirect to='/dashboard' />;
    }
    return (
      <Layout.Form>
        <a href="https://www.sparkpost.com" title="SparkPost">
          <img alt="SparkPost" height="68" src="/assets/images/sparkpost-logo-color.svg" width="188" />
        </a>

        <Panel sectioned accent>

            <h3 className="margin-bottom-xl" id="sp-login-message"><span>Log In</span></h3>
            <form>
              {this.renderLoginError()}
              <div className="form-group">
                <div className="text-muted">Username or Email</div>
                <input autoFocus={true} className="form-control input-sm form-username"
                name="username" required={true} value={this.state.username}
                type="text" onChange={(e) => this.updateInput('username', e.target.value)} />
              </div>

              <div className="form-group">
                <div className="text-muted">Password</div>
                <input className="form-control input-sm form-password"
                name="password" required={true} value={this.state.password}
                type="password" onChange={(e) => this.updateInput('password', e.target.value)} />
              </div>

              <div className="checkbox small">
                <label><input name="remember_me" type="checkbox"
                checked={this.state.remember_me} onChange={(e) => this.updateInput('remember_me', e.target.checked)} /> Keep me logged in</label>
              </div>

              <button className="btn btn-primary btn-loading" id="login-button"
              type="submit" onClick={(e) => {
                const { username, password, remember_me } = this.state;
                e.preventDefault();
                this.props.authenticate(username, password, remember_me);
              }}>{this.renderLoginButton()}</button>

            </form>

        </Panel>
      </Layout.Form>
    );
  }
}

function mapStateToProps ({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, { authenticate })(AuthPage);
