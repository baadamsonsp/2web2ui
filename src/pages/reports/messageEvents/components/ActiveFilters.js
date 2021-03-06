import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Tag } from '@sparkpost/matchbox';
import { getMessageEvents, removeFilter, updateMessageEventsSearchOptions } from 'src/actions/messageEvents';
import { snakeToFriendly } from 'src/helpers/string';
import _ from 'lodash';
import styles from './ActiveFilters.module.scss';

export class ActiveFilters extends Component {
  static defaultProps = {
    search: {}
  };

  renderTags = ({ key, label, itemToString }) => {
    const { search } = this.props;

    if (!search[key]) {
      return null;
    }

    return search[key].map((item, i) => (
      <Tag onRemove={() => this.handleRemove({ key, item })} key={i} className={styles.TagWrapper}>
        {label}: {itemToString ? itemToString(item) : item}
      </Tag>
    ));
  }

  handleRemove = (filter) => {
    this.props.removeFilter(filter);
  }

  handleRemoveAll = () => {
    const { dateOptions, ...filters } = this.props.search;
    const clearedFilters = _.mapValues(filters, () => []);
    this.props.updateMessageEventsSearchOptions({ dateOptions, ...clearedFilters });
  }

  isEmpty() {
    const { dateOptions, ...rest } = this.props.search;
    return _.every(rest, (arr) => arr.length === 0);
  }

  render() {
    if (this.isEmpty()) {
      return null;
    }

    return (
      <Panel.Section actions={[{ content: 'Clear All Filters', onClick: this.handleRemoveAll, color: 'blue' }]}>
        <small>Filters: </small>
        {this.renderTags({ key: 'events', label: 'Event', itemToString: snakeToFriendly })}
        {this.renderTags({ key: 'recipients', label: 'Recipient' })}
        {this.renderTags({ key: 'friendly_froms', label: 'From' })}
        {this.renderTags({ key: 'subaccounts', label: 'Subaccount' })}
        {this.renderTags({ key: 'message_ids', label: 'Message' })}
        {this.renderTags({ key: 'template_ids', label: 'Template' })}
        {this.renderTags({ key: 'campaign_ids', label: 'Campaign' })}
        {this.renderTags({ key: 'bounce_classes', label: 'Bounce Class' })}
      </Panel.Section>
    );
  }
}

const mapStateToProps = (state, props) => ({
  search: state.messageEvents.search
});

export default connect(mapStateToProps, { removeFilter, getMessageEvents, updateMessageEventsSearchOptions })(ActiveFilters);
