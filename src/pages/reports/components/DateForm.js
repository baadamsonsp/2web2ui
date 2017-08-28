import React, { Component } from 'react';
import moment from 'moment';
import { format } from 'date-fns';
import _ from 'lodash';

import { Grid, TextField, Icon } from '@sparkpost/matchbox';
import styles from './DateForm.module.scss';

class DateForm extends Component {
  dayFormat = 'YYYY-M-D';
  timeFormat = 'h:mma';
  debounce = 500;

  state = {
    toDate: '',
    toTime: '',
    fromDate: '',
    fromTime: ''
  }

  componentWillReceiveProps(nextProps) {
    this.syncPropsToState(nextProps);
  }

  syncPropsToState({ to, from }) {
    this.setState({
      toDate: format(to, this.dayFormat),
      toTime: format(to, this.timeFormat),
      fromDate: format(from, this.dayFormat),
      fromTime: format(from, this.timeFormat)
    });
  }

  handleFieldChange = (e, key) => {
    this.setState({ [key]: e.target.value });
    this.debounceChanges();
  }

  debounceChanges = _.debounce(() => {
    this.validate();
  }, this.DEBOUNCE);

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      this.validate(e, true);
    }
  };

  handleBlur = (e) => {
    this.validate(e, true);
  }

  validate = (e, shouldReset) => {
    const format = `${this.dayFormat} ${this.timeFormat}`;
    const to = moment(`${this.state.toDate} ${this.state.toTime}`, format, true);
    const from = moment(`${this.state.fromDate} ${this.state.fromTime}`, format, true);
    const now = moment();

    if (to.isValid() && from.isValid() && from.isBefore(to) && to.isBefore(now)) {
      return this.props.selectDates({ to: to.toDate(), from: from.toDate() }, () => {
        if (e && e.key === 'Enter') {
          this.props.onEnter(e);
        }
      });
    } else if (shouldReset) {
      this.syncPropsToState(this.props); // Resets fields if dates are not valid
    }
  }

  render() {
    const { toDate, toTime, fromDate, fromTime } = this.state;

    return (
      <form onKeyDown={this.handleEnter} className={styles.DateFields}>
        <Grid middle='xs'>
          <Grid.Column >
            <TextField
              label='From Date' labelHidden placeholder='YYYY-MM-DD'
              onChange={(e) => this.handleFieldChange(e, 'fromDate')}
              onBlur={(e) => this.handleBlur(e)}
              value={fromDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              label='From Time' labelHidden placeholder='12:00am'
              onChange={(e) => this.handleFieldChange(e, 'fromTime')}
              onBlur={(e) => this.handleBlur(e)}
              value={fromTime} />
          </Grid.Column>
          <Grid.Column xs={1}>
            <div className={styles.ArrowWrapper}>
              <Icon name='ArrowRight'/>
            </div>
          </Grid.Column>
          <Grid.Column >
            <TextField
              label='To Date' labelHidden placeholder='YYYY-MM-DD'
              onChange={(e) => this.handleFieldChange(e, 'toDate')}
              onBlur={(e) => this.handleBlur(e)}
              value={toDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              label='To Time' labelHidden placeholder='12:00am'
              onChange={(e) => this.handleFieldChange(e, 'toTime')}
              onBlur={(e) => this.handleBlur(e)}
              value={toTime} />
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}

export default DateForm;