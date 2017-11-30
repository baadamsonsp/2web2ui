import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { getTableData } from 'src/actions/summaryChart';
import { addFilter } from 'src/actions/reportFilters';
import typeaheadCacheSelector from 'src/selectors/reportFilterTypeaheadCache';

import { TableCollection, Unit, Loading } from 'src/components';
import Empty from '../../components/Empty';
import { Panel, Select, Grid, UnstyledLink } from '@sparkpost/matchbox';
import { GROUP_COL_CONFIG2 } from './tableConfig';
import _ from 'lodash';

import styles from './Table.module.scss';

class Table extends Component {

  handleGroupChange = (e) => {
    this.props.getTableData({ groupBy: e.target.value });
  }

  handleRowClick = (item) => {
    this.props.addFilter(item);
    this.props.refresh();
  }

  getColumnHeaders() {
    const { metrics, groupBy } = this.props;

    const primaryCol = {
      label: _.find(GROUP_COL_CONFIG2, { value: groupBy }).label,
      className: styles.HeaderCell
    };

    const metricCols = metrics.map(({ label, key }) => ({
      key,
      label: <div className={styles.RightAlign}>{ label }</div>,
      className: cx(styles.HeaderCell, styles.NumericalHeader)
    }));

    return [primaryCol, ...metricCols];
  }

  getRowData() {
    const { metrics, groupBy, typeaheadCache } = this.props;
    const group = _.find(GROUP_COL_CONFIG2, { value: this.props.groupBy });

    return (row) => {
      let value = row[group.keyName];
      const filter = {
        type: group.label,
        value
      };

      // Matches typeahead filter object for subaccounts
      if (filter.type === 'Subaccount') {
        const subaccount = _.find(typeaheadCache, { type: 'Subaccount', id: filter.value });
        const id = filter.value;
        value = _.get(subaccount, 'value') || `Deleted (ID ${filter.value})`;

        if (filter.value === 0) {
          value = 'Master Account (ID 0)';
        }

        filter.value = value;
        filter.id = id;
      }

      const primaryCol = <UnstyledLink onClick={() => this.handleRowClick(filter)}>{ value }</UnstyledLink>;

      const metricCols = metrics.map((metric) => (
        <div className={styles.RightAlign}>
          <Unit value={row[metric.key]} unit={metric.unit}/>
        </div>
      ));

      return [primaryCol, ...metricCols];
    };
  }

  renderTable() {
    const { tableData, tableLoading, groupBy } = this.props;

    if (tableLoading) {
      return (
        <div className={styles.LoadingSection}>
          <div className={styles.Loading}><Loading /></div>
        </div>
      );
    }

    if (!tableData.length) {
      return <Empty message='There is no data for your current query' />;
    }

    return (
      <TableCollection
        rowKeyName={_.find(GROUP_COL_CONFIG2, { value: this.props.groupBy }).keyName}
        columns={this.getColumnHeaders()}
        getRowData={this.getRowData()}
        pagination
        defaultPerPage={10}
        rows={tableData}
        filterBox={{ show: false }}
      />
    );
  }

  render() {
    const { tableLoading, groupBy } = this.props;
    const options = GROUP_COL_CONFIG2.map(({ value, label }) => ({ value, label }));
    return (
      <Panel>
        <Panel.Section>
          <Grid>
            <Grid.Column xs={12} md={5} lg={4}>
              <Select
                label='Group By'
                options={options}
                value={groupBy}
                disabled={tableLoading}
                onChange={this.handleGroupChange}/>
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid>
        </Panel.Section>
        { this.renderTable() }
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  typeaheadCache: typeaheadCacheSelector(state),
  ...state.summaryChart
});
export default connect(mapStateToProps, { getTableData, addFilter })(Table);
