import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, SubmissionError, reduxForm } from 'redux-form';

import _ from 'lodash';

import { Panel, Banner, Button, Error } from '@sparkpost/matchbox';
import { DownloadLink, TextFieldWrapper } from 'src/components';
import { required, maxLength, maxFileSize } from 'src/helpers/validation';

import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';

import parseRecipientListCsv from '../helpers/csv';

import config from 'src/config';

import exampleRecipientListPath from './example-recipient-list.csv';

const formName = 'recipientListForm';

export class RecipientListForm extends Component {
  parseCsv = (csv) => parseRecipientListCsv(csv)
    .catch((csvErrors) => {
      throw new SubmissionError({ _error: csvErrors });
    });

  // `csv` is an internal field. The outer conponent can access the parsed records in `recipients`.
  formatValues = (values) => _.omit(values, ['csv']);

  submitWithRecipients = (values, recipients) => this.props.onSubmit({
    recipients,
    ...this.formatValues(values)
  });

  submitWithoutRecipients = (values) => this.props.onSubmit(this.formatValues(values));

  // Parse CSV, store JSON result, collect and show parsing errors
  preSubmit = (values) => {
    if (values.csv) {
      // CSV upload is optional in edit mode
      return this.parseCsv(values.csv)
        .then((recipients) => this.submitWithRecipients(values, recipients));
    } else {
      return this.submitWithoutRecipients(this.formatValues(values));
    }
  };

  renderCsvErrors() {
    const { error } = this.props;
    return <Banner status='danger' title='CSV Format Errors'>
      {error.map((err, idx) => <Error key={idx} error={err}/>)}
    </Banner>;
  }

  render() {
    const { editMode, pristine, valid, error, submitting, handleSubmit } = this.props;

    const submitDisabled = pristine || !valid || submitting;

    let actionText = 'Create';
    let uploadHint = 'Upload a CSV file of recipients';
    let uploadValidators = [required, maxFileSize(config.maxUploadSizeBytes)];

    if (editMode) {
      actionText = 'Update';
      uploadHint = 'Optional: Upload a CSV file of recipients to replace the existing recipients in this list';
      uploadValidators = uploadValidators.slice(1);
    }

    return <div>
      { error && this.renderCsvErrors() }
      <form onSubmit={handleSubmit(this.preSubmit)}>
        <Panel>
          <Panel.Section>
            <Field
              name='name'
              label='Label'
              placeholder='My favorite recipients'
              validate={[required, maxLength(64)]}
              disabled={submitting}
              component={TextFieldWrapper}
              required
            />
            { ! editMode && <Field
              name='id'
              label='Identifier'
              placeholder='my-favorite-recipients'
              validate={[required, maxLength(64)]}
              disabled={submitting}
              component={TextFieldWrapper}
              required
            /> }
            <Field
              name='description'
              label='Description'
              placeholder='All my favorite recipients'
              validate={[maxLength(1024)]}
              disabled={submitting}
              component={TextFieldWrapper}
            />
            <Field
              component={FileFieldWrapper}
              disabled={submitting}
              fileType="csv"
              helpText={
                <span>
                  You can download
                  a <DownloadLink href={exampleRecipientListPath}>CSV template here</DownloadLink> to
                  use when formatting your recipient list for upload.
                </span>
              }
              label={uploadHint}
              name="csv"
              validate={uploadValidators}
              required
            />
          </Panel.Section>
          <Panel.Section>
            <Button primary submit disabled={submitDisabled}>{actionText} Recipient List</Button>
          </Panel.Section>
        </Panel>
      </form>
    </div>;
  }
}

const WrappedForm = reduxForm({ form: formName })(RecipientListForm);

const mapStateToProps = (state, props) => ({
  initialValues: props.editMode ? state.recipientLists.current : {}
});

export default connect(mapStateToProps)(WrappedForm);
