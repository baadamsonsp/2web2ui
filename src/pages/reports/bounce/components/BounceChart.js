import React, { Component } from 'react';
import _ from 'lodash';
import { Grid, Panel, Tabs } from '@sparkpost/matchbox';
import { Loading, PieChart } from 'src/components';
import { generateColors } from 'src/helpers/color';
import styles from './BounceChart.module.scss';
import { formatPercent } from 'src/helpers/units';
import { safeRate } from 'src/helpers/math';

// Chart color palette generated from:
const primaryColor = '#DB2F3D';
const secondaryColor = '#37aadc';

const fakeData = [
  { name: 'Admin Bounce', count: 249 },
  { name: 'Smart Send Suppression', count: 84 }
];

export default class BounceChart extends Component {
  state = {
    hoveredItem: null,
    active: null,
    tab: 0
  };

  /**
   * Handles mouse over event for LegendItems and BounceChart
   * @param  {Object} e - Recharts synthetic event - behavior mimiced from Legend
   * @param  {string} hoverSet - 'primary' | 'secondary'
   */
  handleMouseOver = (e, hoverSet) => {
    const { categories, types } = this.props;
    const { active, tab } = this.state;
    const { name, count } = e;

    let dataSet = hoverSet === 'primary' ? categories : types;

    if (active) {
      dataSet = active.children;
    }

    if (tab === 1) {
      dataSet = fakeData;
    }

    const hoveredItem = {
      name,
      count,
      index: _.findIndex(dataSet, { name }),
      dataSet: hoverSet
    };

    this.setState({ hoveredItem });
  }

  handleMouseOut = () => {
    this.setState({ hoveredItem: null });
  }

  handleClick = ({ name, children, count }) => {
    if (children) {
      this.setState({
        active: { name, children, count },
        hoveredItem: null
      });
    }
  }

  handleBreadcrumb = () => {
    this.setState({ active: null });
  }

  getLabelProps = () => {
    const { aggregates } = this.props;
    const { hoveredItem, tab } = this.state;

    let defaultLabel = { name: 'Bounce Rate', value: formatPercent(safeRate(aggregates.countBounce, aggregates.countSent)) };

    if (tab === 1) {
      defaultLabel = { name: 'Bounce Rate', value: formatPercent(safeRate(aggregates.countAdminBounce, aggregates.countTargeted)) };
    }

    return hoveredItem
      ? { name: hoveredItem.name, value: formatPercent(safeRate(hoveredItem.count, tab === 1 ? aggregates.countBounce : aggregates.countAdminBounce)) }
      : defaultLabel;
  }

  getLegendHeaderData = () => {
    const { aggregates } = this.props;
    const { active, tab } = this.state;

    // Header with breadcrumb & active data
    if (active) {
      return [
        { name: 'Bounces', breadcrumb: true, onClick: this.handleBreadcrumb, count: aggregates.countBounce },
        { name: 'Sent', count: aggregates.countSent },
        { name: active.name, count: active.count }
      ];
    }

    if (tab === 1) {
      return [
        { name: 'Admin Bounces', count: aggregates.countAdminBounce },
        { name: 'Targeted', count: aggregates.countTargeted }
      ];
    }

    // Default header
    return [
      { name: 'Bounces', count: aggregates.countBounce },
      { name: 'Sent', count: aggregates.countSent }
    ];
  }

  // Gets primary and secondary data for BounceChart & Legend
  getData = () => {
    const { categories, types } = this.props;
    const { active, tab } = this.state;

    let primaryData = categories;
    let secondaryData = types;

    if (active) {
      primaryData = active.children;
      secondaryData = null;
    }

    if (tab === 1) {
      primaryData = fakeData;
      secondaryData = null;
    }

    return {
      primaryData: generateColors(primaryData, { baseColor: primaryColor, rotate: 80, saturate: 0.06 }),
      secondaryData: secondaryData && generateColors(secondaryData, { baseColor: secondaryColor })
    };
  }

  handleTab = (index) => {
    this.setState({ tab: index });
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <Panel title='Bounce Rates' sectioned className={styles.LoadingPanel}><Loading /></Panel>;
    }

    return (
      <React.Fragment>
        <Tabs tabs={[{ content: 'Bounces', onClick: () => this.handleTab(0) }, { content: 'Admin Bounces', onClick: () => this.handleTab(1) }]} selected={this.state.tab} />
        <Panel sectioned>
          <Grid>
            <Grid.Column xs={12} lg={5}>
              <div className={styles.ChartWrapper}>
                <PieChart.Chart
                  {...this.getData()}
                  hoveredItem={this.state.hoveredItem}
                  onMouseOver={this.handleMouseOver}
                  onMouseOut={this.handleMouseOut}
                  onClick={this.handleClick} />
                <PieChart.ActiveLabel {...this.getLabelProps()}/>
              </div>
            </Grid.Column>
            <Grid.Column xs={12} lg={7}>
              <PieChart.Legend
                headerData={this.getLegendHeaderData()}
                {...this.getData()}
                hoveredItem={this.state.hoveredItem}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                onClick={this.handleClick} />
            </Grid.Column>
          </Grid>
        </Panel>
      </React.Fragment>
    );
  }
}
