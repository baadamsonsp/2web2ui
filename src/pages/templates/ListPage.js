/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TableCollection, ApiErrorBanner, Loading, SubaccountTag } from 'src/components';
import { Templates } from 'src/components/images';
import { Page, Button, Popover, ActionList, Tag } from '@sparkpost/matchbox';
import { ExpandMore, ModeEdit } from '@sparkpost/matchbox-icons';
import Editor from './components/Editor'; // async, for preload

import { format } from 'date-fns';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

const primaryAction = {
  content: 'Create Template',
  to: '/templates/create',
  Component: Link
};

export default class ListPage extends Component {

  componentDidMount() {
    this.props.listTemplates();
    Editor.preload(); //loads editor chunk
  }

  renderError() {
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your templates.'}
        errorDetails={this.props.error.message}
        reload={this.props.listTemplates}
      />
    );
  }

  getRowData = ({ published, id, name, last_update_time, subaccount_id, shared_with_subaccounts }) => {
    const row = [
      // <Link to={`/templates/edit/${id}${setSubaccountQuery(subaccount_id)}`}>{name}</Link>,
      <React.Fragment>
        <div style={{ display: 'block', lineHeight: '1.2em' }}><strong>{name}</strong></div>
        <small><em>ID:{id}</em></small>
      </React.Fragment>,
      // id,
      <Tag color={published ? 'navy' : 'yellow'}>{published ? 'Published' : 'Draft'}</Tag>
    ];

    if (this.props.hasSubaccounts) {
      const tag = subaccount_id || shared_with_subaccounts
        ? <SubaccountTag all={shared_with_subaccounts} id={subaccount_id} />
        : null;
      row.push(tag);
    }

    row.push(<small>{format(last_update_time, 'MMM D, YYYY [at] h:mma')}</small>);

    row.push(
      <div style={{ textAlign: 'right' }}>
        <Button.Group>
          <Button size='small'>Edit</Button>
          <Popover
            left
            trigger={<Button size='small'><ExpandMore/></Button>}>
            <ActionList
              actions={[
                { content: 'Edit Draft', section: 1 },
                { content: 'View Published', section: 1 },
                { content: 'Preview & Send', section: 1 },
                { content: 'Delete', section: 2 }
              ]}
            />
          </Popover>
        </Button.Group>
      </div>
    )

    return row;
  }

  getColumns() {
    const { hasSubaccounts } = this.props;

    const columns = [
      { label: 'Name', width: '28%', sortKey: 'name' },
      // { label: 'ID', width: '22%', sortKey: 'id' },
      { label: 'Status', width: '20%', sortKey: 'published' }
    ];

    if (hasSubaccounts) {
      columns.push({ label: 'Subaccount', width: '22%', sortKey: (template) => [template.subaccount_id, template.shared_with_subaccounts]});
    }

    columns.push({ label: 'Last Updated', sortKey: 'last_update_time' })

    columns.push(null)

    return columns;
  }

  renderCollection() {
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={this.props.templates}
        getRowData={this.getRowData}
        pagination
        filterBox={{
          show: true,
          exampleModifiers: ['id', 'name'],
          itemToStringKeys: ['name', 'id', 'subaccount_id']
        }}
        defaultSortColumn='name'
      />
    );
  }

  render() {
    const { canModify, count, loading, error } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        primaryAction={canModify ? primaryAction : undefined}
        title='Templates'
        empty={{
          show: count === 0,
          image: Templates,
          title: 'Manage your email templates',
          content: <p>Build, test, preview and send your transmissions.</p>
        }} >
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );
  }
}
