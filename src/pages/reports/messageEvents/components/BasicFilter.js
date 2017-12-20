import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, change } from 'redux-form';
import _ from 'lodash';

import { Grid } from '@sparkpost/matchbox';
import DateFilter from 'src/pages/reports/components/DateFilter';
import { TextFieldWrapper } from 'src/components';
import { getRelativeDates } from 'src/helpers/date';
import { email as emailValidator } from 'src/helpers/validation';

export class BasicFilter extends Component {
  constructor(props) {
    super(props);

    const { reportFilters } = props;
    this.state = {
      reportFilters,
      recipients: ''
    };
  }

  refresh = () => {
    this.props.onSubmit(this.state);
  }

  parseAddresses = (value) => {
    value = _.trim(value, ' ,'); //strip whitespace and commas
    if (!value) {
      return [];
    }

    return value.split(',').map((address) => _.trim(address));
  }

  getInvalidAddresses = (addresses) => {
    const invalids = _.filter(addresses, (address) => {
      address = _.trim(address);

      return address && emailValidator(address) !== undefined;
    });

    return invalids;
  }

  handleRecipientsChange = (event) => {
    let value = event.target.value;
    const addresses = this.parseAddresses(value);
    const invalids = this.getInvalidAddresses(addresses);
    if (invalids.length) {
      return;
    }

    if (addresses.length) {
      value = addresses.join(',');
    }

    this.setState({ recipients: value }, this.refresh);
  }

  handleDateSelection = (options) => {
    const { relativeRange } = options;
    if (relativeRange) {
      Object.assign(options, getRelativeDates(relativeRange));
    }

    this.setState({
      reportFilters: {
        from: options.from,
        to: options.to,
        relativeRange: relativeRange
      }
    }, this.refresh);
  }

  emailValidator = (value) => {
    const invalids = this.getInvalidAddresses(this.parseAddresses(value));

    if (invalids.length) {
      return `${invalids.join(',')} ${invalids.length > 1 ? 'are' : 'is'} not valid email ${invalids.length > 1 ? 'addresess' : 'address'}`;
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Column xs={12} md={6}>
          <DateFilter refresh={this.handleDateSelection} />
        </Grid.Column>
        <Grid.Column xs={12} md={6}>
          <Field
            name="recipients"
            onBlur={(e) => this.handleRecipientsChange(e)}
            component={TextFieldWrapper}
            title="Recipient Email(s)"
            validate={this.emailValidator}
            placeholder='recipient1@domain.com, recipient2@domain.com'
          />
        </Grid.Column>
      </Grid>
    );
  }
}

const formName = 'basicFilter';
const formOptions = { form: formName };
const mapStateToProps = ({ reportFilters }) => ({
  reportFilters,
  formName
});

export default connect(mapStateToProps, { change })(reduxForm(formOptions)(BasicFilter));
