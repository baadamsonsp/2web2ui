import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { listPools } from 'src/actions/ipPools';
import { getOrderedIpPools, shouldShowIpPurchaseCTA } from 'src/selectors/ipPools';
import { Loading, TableCollection, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';

const columns = [
  { label: 'Name', sortKey: 'name' },
  { label: 'ID', sortKey: 'id' },
  { label: 'Number of IPs Assigned', sortKey: (pool) => pool.ips.length }
];

export const getRowData = ({ id, name, ips }) => {
  const nameLink = <Link to={`/account/ip-pools/edit/${id}`}>{name}</Link>;
  return [nameLink, id, ips.length.toString()];
};

export class IpPoolsList extends Component {

  componentDidMount() {
    this.props.listPools();
  }


  renderError() {
    const { error, listPools } = this.props;
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your ip pools.'}
        errorDetails={error.message}
        reload={listPools}
      />
    );
  }

  renderCollection() {
    const { ipPools } = this.props;
    return (
      <TableCollection
        columns={columns}
        rows={ipPools}
        getRowData={getRowData}
        pagination={true}
        filterBox={{
          show: true,
          exampleModifiers: ['name', 'id'],
          itemToStringKeys: ['name', 'id']
        }}
      />
    );
  }

  render() {
    const { loading, error, showPurchaseCTA } = this.props;

    if (loading) {
      return <Loading />;
    }

    const createAction = { content: 'Create IP Pool', Component: Link, to: '/account/ip-pools/create' };
    const purchaseActions = showPurchaseCTA ? [{ content: 'Purchase IPs', Component: Link, to: '/account/billing' }] : null;

    return (
      <Page
        primaryAction={createAction}
        secondaryActions={purchaseActions}
        title='IP Pools' >
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const { ipPools } = state;
  return {
    ipPools: getOrderedIpPools(state),
    loading: ipPools.listLoading,
    error: ipPools.listError,
    showPurchaseCTA: shouldShowIpPurchaseCTA(state)
  };
}

export default connect(mapStateToProps, { listPools })(IpPoolsList);
