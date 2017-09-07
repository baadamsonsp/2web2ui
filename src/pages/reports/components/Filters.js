/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFilter, removeFilter } from 'actions/reportFilters';

import { Grid, Button, Panel, Tag } from '@sparkpost/matchbox';
import Typeahead from './Typeahead';

import DateFilter from './DateFilter';
import typeaheadCacheSelector from 'selectors/reportFilterTypeaheadCache';
import styles from './Filters.module.scss';

class Filters extends Component {
  renderActiveFilters = () => {
    const { filter } = this.props;
    return filter.activeList.length
      ? <Panel.Section>
          <small>Filters:</small>
          { filter.activeList.map((item, index) => <Tag key={index} onRemove={() => this.handleFilterRemove(index)} className={styles.TagWrapper}>{ item.value }</Tag>)}
        </Panel.Section>
      : null;
  }

  handleFilterRemove = (index) => this.props.removeFilter(index);
  handleTypeaheadSelect = (item) => this.props.addFilter(item);

  render() {
    const { typeaheadCache, refresh } = this.props;

    return (
      <Panel>
        <Panel.Section >
          <Grid>
            <Grid.Column xs={12} md={6}>
              <div className={styles.FieldWrapper}>
                <DateFilter refresh={refresh} />
              </div>
            </Grid.Column>
            <Grid.Column xs={12} md={5}>
              <div className={styles.FieldWrapper}>
                <Typeahead
                  placeholder='Filter by domain, campaign, etc'
                  onSelect={this.handleTypeaheadSelect}
                  items={typeaheadCache} />
              </div>
            </Grid.Column>
            <Grid.Column xs={12} md={1}>
              <Button fullWidth>Share</Button>
            </Grid.Column>
          </Grid>
        </Panel.Section>
        { this.renderActiveFilters() }
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  filter: state.reportFilters,
  typeaheadCache: typeaheadCacheSelector(state)
});
export default connect(mapStateToProps, { addFilter, removeFilter })(Filters);
