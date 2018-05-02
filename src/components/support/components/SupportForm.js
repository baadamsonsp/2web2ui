/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Button, Panel } from '@sparkpost/matchbox';
import { TextFieldWrapper, SelectWrapper } from 'src/components';
import { required, minLength, maxFileSize } from 'src/helpers/validation';
import config from 'src/config';
import styles from './SupportForm.module.scss';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import _ from 'lodash';

const formName = 'supportForm';
const types = [
  { label: 'Technical errors', value: 'Errors', messageLabel: 'Tell us more about your issue' },
  { label: 'Billing problems', value: 'Billing', messageLabel: 'Tell us more about your billing issue' },
  { label: 'Canceling my account', value: 'Compliance-Cancel', messageLabel: 'Tell us why you are leaving' },
  { label: 'Unsuspending my account', value: 'Compliance-Suspension', messageLabel: 'Why do you think your account should be unsuspended?' },
  { label: 'Increasing my daily sending limits', value: 'Daily Limits', messageLabel: 'What limit do you need and why?' },
  { label: 'Another issue', value: 'Support', messageLabel: 'Tell us more about your issue' }
];

export class SupportForm extends Component {
  renderSuccess () {
    const { ticketId, onContinue } = this.props;

    return <div className={styles.SupportForm}>
      <div className={styles.SuccessMessage}>
        <h6>Your Ticket Has Been Submitted</h6>
        <p>Ticket # {ticketId}</p>
        <p>Please check your email for updates on your support ticket.</p>
        <Button primary onClick={() => this.reset(onContinue)}>Continue</Button>
      </div>
    </div>;
  }

  reset (parentReset) {
    this.props.reset(formName);
    return parentReset();
  }

  renderForm () {
    const {
      pristine,
      invalid,
      submitting,
      handleSubmit,
      onSubmit,
      onCancel,
      subject
    } = this.props;

    const selectedType = _.find(types, { value: subject });
    const messageLabel = _.get(selectedType, 'messageLabel', '');

    return <div className={styles.SupportForm}>
      <Panel.Section>
        <h6>Submit A Support Ticket</h6>
      </Panel.Section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel.Section>
          <Field
            name='subject'
            label='I need help with...'
            helpText='Additional support options are available on paid plans'
            inlineErrors={true}
            autoFocus={true}
            disabled={submitting}
            options={types}
            component={SelectWrapper} />
          <Field
            multiline
            rows={10}
            resize='none'
            name='message'
            label={messageLabel}
            inlineErrors={true}
            disabled={submitting}
            validate={required}
            component={TextFieldWrapper}
          />
          <Field
            type='file'
            name='attachment'
            label='Attach a file'
            disabled={submitting}
            component={FileFieldWrapper}
            validate={maxFileSize(config.support.maxAttachmentSizeBytes)}
          />
        </Panel.Section>
        <Panel.Section>
          <Button submit primary disabled={pristine || invalid || submitting}>
            {submitting ? 'Saving' : 'Submit Ticket'}
          </Button>
          <Button className={styles.CancelBtn} disabled={submitting} onClick={() => this.reset(onCancel)}>Cancel</Button>
        </Panel.Section>
      </form>
    </div>;
  }

  render () {
    if (this.props.submitSucceeded) {
      return this.renderSuccess();
    }
    return this.renderForm();
  }
}

const selector = formValueSelector(formName);
const mapStateToProps = (state) => ({
  ticketId: state.support.ticketId,
  subject: selector(state, 'subject'),
  initialValues: {
    subject: 'Errors'
  }
});

const ReduxSupportForm = reduxForm({ form: formName })(SupportForm);
export default connect(mapStateToProps)(ReduxSupportForm);
