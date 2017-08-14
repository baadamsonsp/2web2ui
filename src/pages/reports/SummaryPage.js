import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetch as fetchMetrics } from '../../actions/metrics';
import LineChart from './components/LineChart';
import Layout from '../../components/Layout/Layout';
import { getQueryFromOptions, getDayLines, getLineChartFormatters } from '../../helpers/metrics';
import { Page, Grid, Button, Panel, Icon, Datepicker, TextField, Tabs, Table } from '@sparkpost/matchbox';
import _ from 'lodash';
import moment from 'moment';
import { subMonths, format } from 'date-fns';
import styles from './Reports.module.scss';
// import qs from 'query-string';

import DateFilter from './components/DateFilter';

class SummaryReportPage extends Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayHover = this.handleDayHover.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);

    const to = new Date();
    const from = moment(to).subtract(1, 'day').toDate();

    this.state = {
      options: {
        metrics: ['count_targeted', 'count_delivered', 'count_accepted', 'count_bounce'],
        from,
        to
      },
      datepicker: {
        selecting: false,
        selected: { from, to }
      }
    };
  }

  componentWillMount () {
    this.refresh();
  }

  renderLoading () {
    const { metricsData } = this.props;
    if (metricsData.pending) {
      return <p><Icon name='Refresh' /> Loading metrics...</p>;
    }
  }

  handleSubmit () {
    this.setState({ showDatePicker: false });
    this.refresh();
  }

  handleDayClick (clicked) {
    const { selecting, selected } = this.state.datepicker;
    const range = selecting ? selected : { from: clicked, to: getEndOfDay(clicked) };

    this.setState({
      options: { ...this.state.options, ...range },
      datepicker: { ...this.state.datepicker, selected: range, selecting: !selecting }
    });
  }

  handleDayHover (hovered) {
    const { selecting } = this.state.datepicker;

    if (selecting) {
      this.setState({
        datepicker: {
          ...this.state.datepicker,
          selected: {
            ...this.state.datepicker.selected,
            ...this.getOrderedRange(hovered)
          }
        }
      });
    }
  }

  getOrderedRange (newDate) {
    const { from, to } = this.state.options;
    return (from.getTime() <= newDate.getTime()) ? { from, to: newDate } : { from: newDate, to };
  }

  toggleDatePicker () {
    const { showDatePicker, options, chartOptions: { from, to } } = this.state;
    const previousRange = { from, to };
    if (showDatePicker) {
      this.setState({
        options: { ...options, ...previousRange },
        datepicker: { ...this.state.datepicker, selected: previousRange },
        showDatePicker: false
      });
    } else {
      this.setState({ showDatePicker: true });
    }
  }

  refresh () {
    if (this.props.metricsData.pending || (this.state.chartOptions === this.state.options)) {
      return;
    }
    const query = getQueryFromOptions(this.state.options);

    this.props.fetchMetrics('deliverability/time-series', query)
      .then(() => this.setState({ chartOptions: {
        ...this.state.options,
        precision: query.precision
      } }));
  }

  createDayReferenceLines () {
    const { results = {} } = this.props.metricsData;
    const { chartOptions } = this.state;

    return getDayLines(results, chartOptions).map(({ ts }) => ({
      key: ts,
      x: ts,
      stroke: '#bbb',
      strokeWidth: 2
    }));
  }

  renderChart () {
    const { results = [], pending } = this.props.metricsData;
    const { chartOptions = false } = this.state;
    const { metrics = [] } = chartOptions;

    if (!results.length || !chartOptions) {
      return null;
    }

    return (
      <LineChart
        data={results}
        lines={metrics.map((metric) => ({
          key: metric,
          dataKey: metric,
          name: formatMetricLabel(metric),
          stroke: pending ? '#ccc' : false
        }))}
        {...getLineChartFormatters(chartOptions)}
        referenceLines={this.createDayReferenceLines()}
      />
    );
  }

  render () {
    const { showDatePicker = false } = this.state;
    const { from, to } = this.state.options;
    const displayFormat = 'MMM Do, YYYY [at] h:mma';
    const formatted = {
      from: format(from, displayFormat),
      to: format(to, displayFormat)
    };

    return (
      <Layout.App>
        <Page
          title='Summary Report'
          secondaryActions={[{
            content: 'Share this Report'
          }]}
        />

        {this.renderLoading()}

        <Panel>

          <Panel.Section>
            <Grid>
              <Grid.Column>
                <DateFilter />
              </Grid.Column>
              <Grid.Column>
                <TextField placeholder='Filter by domain'/>
              </Grid.Column>
            </Grid>
          </Panel.Section>

              {/* {from &&
                <Panel.Section>
                  <form>
                    <Grid>
                      <Grid.Column xs={12} md={6}>
                        <TextField value={`${formatted.from} to ${formatted.to}`} onClick={this.toggleDatePicker} />
                      </Grid.Column>
                      <Grid.Column xs={12} md={6}>
                        <TextField placeholder='Filter Report'/>
                      </Grid.Column>
                    </Grid>
                  </form>
                </Panel.Section>
              } */}

              {/* {showDatePicker &&
                <Panel.Section>
                  <Datepicker
                    numberOfMonths={2}
                    fixedWeeks
                    initialMonth={subMonths(new Date(), 1)}
                    onDayClick={this.handleDayClick}
                    onDayMouseEnter={this.handleDayHover}
                    onDayFocus={this.handleDayHover}
                    selectedDays={this.state.datepicker.selected}
                    disabledDays={{ after: new Date() }}
                  />

                  <Button primary onClick={this.handleSubmit}>Apply</Button>
                  <Button onClick={this.toggleDatePicker}>Cancel</Button>
                </Panel.Section>
              } */}

            <Panel.Section className={styles.ChartSection}>
              {this.renderChart()}
              <Button size='small' className={styles.AddMetric}>Select Metrics</Button>
            </Panel.Section>

        </Panel>

        <Tabs
          selected={0}
          tabs={[
            { content: 'Domains' },
            { content: 'Campaigns' },
            { content: 'Templates' }
          ]}/>
        <Panel>
          <Table>
            <Table.Row rowData={[1, 2, 3]}>

            </Table.Row>
          </Table>
        </Panel>
      </Layout.App>
    );
  }
}

// this will be replaced with proper metrics config
function formatMetricLabel (name) {
  return _.startCase(name.replace(/^count_/, ''));
}

function getEndOfDay (date) {
  const end = new Date(date);
  end.setHours(11);
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(0);

  return end;
}

export default withRouter(connect(({ metrics }) => ({ metricsData: metrics }), { fetchMetrics })(SummaryReportPage));
