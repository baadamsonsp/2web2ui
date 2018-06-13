import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { updateBillingContact } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';
import { updateContactInitialValues } from 'src/selectors/accountBillingForms';
import { Panel, Button } from '@sparkpost/matchbox';
import BillingContactFields from './fields/BillingContactFields';
import styles from './Forms.module.scss';

const FORMNAME = 'updateContact';

export class UpdateContact extends Component {

  onSubmit = (values) => {
    const { updateBillingContact, onCancel, showAlert } = this.props;
    return updateBillingContact(values).then(() => {
      showAlert({ type: 'success', message: 'Billing Contact Updated' });
      onCancel();
    });
  }

  render() {
    const { onCancel, handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Panel title='Update Billing Contact'>
          <Panel.Section>
            <BillingContactFields
              formName={FORMNAME}
              disabled={submitting}
              change={this.props.change} />
          </Panel.Section>
          <Panel.Section>
            <Button type='submit' primary disabled={submitting}>Update Billing Contact</Button>
            <Button onClick={onCancel} className={styles.Cancel}>Cancel</Button>
          </Panel.Section>
        </Panel>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  billing: state.billing,
  initialValues: updateContactInitialValues(state)
});

const mapDispatchtoProps = { updateBillingContact, showAlert };
const formOptions = { form: FORMNAME, enableReinitialize: true };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(UpdateContact));
