import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export function listPools() {
  return sparkpostApiRequest({
    type: 'LIST_IP_POOLS',
    meta: {
      method: 'GET',
      url: '/ip-pools',
      showErrorAlert: false
    }
  });
}

export function createPool({ name, signing_domain }) {
  return sparkpostApiRequest({
    type: 'CREATE_IP_POOL',
    meta: {
      method: 'POST',
      url: '/ip-pools',
      data: { name, signing_domain }
    }
  });
}

export function updatePool(id, update) {
  return sparkpostApiRequest({
    type: 'UPDATE_IP_POOL',
    meta: {
      method: 'PUT',
      url: `/ip-pools/${id}`,
      data: update
    }
  });
}

export function deletePool(id) {
  return sparkpostApiRequest({
    type: 'DELETE_IP_POOL',
    meta: {
      method: 'DELETE',
      url: `/ip-pools/${id}`
    }
  });
}

export function getPool(id) {
  return sparkpostApiRequest({
    type: 'GET_IP_POOL',
    meta: {
      method: 'GET',
      url: `/ip-pools/${id}`
    }
  });
}
