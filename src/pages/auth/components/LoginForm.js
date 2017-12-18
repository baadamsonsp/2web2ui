import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { required } from 'src/helpers/validation';
import { TextFieldWrapper, CheckboxWrapper } from 'src/components';

import { Button } from '@sparkpost/matchbox';

export class LoginForm extends Component {

  render() {
    const { loginPending, pristine, ssoEnabled, handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          autoFocus
          name='username'
          id='username'
          label='Email or Username'
          placeholder="Leslie Knope"
          component={TextFieldWrapper}
          validate={required}
        />

        { !ssoEnabled &&
        <Field
          type='password'
          name='password'
          id='password'
          label='Password'
          placeholder='Your Password'
          component={TextFieldWrapper}
        />
        }

        { !ssoEnabled &&
        <Field
          name='rememberMe'
          id='rememberMe'
          label='Keep me logged in'
          component={CheckboxWrapper}
        />
        }

        <Button primary submit disabled={loginPending || pristine}>
          { loginPending ? 'Logging In' : 'Log In' }
        </Button>
      </form>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    loginPending: auth.loginPending,
    initialValues: {
      username: auth.username,
      password: auth.password,
      rememberMe: Boolean(auth.rememberMe)
    }
  };
}

const formOptions = {
  form: 'loginForm'
};

export default connect(mapStateToProps)(reduxForm(formOptions)(LoginForm));
