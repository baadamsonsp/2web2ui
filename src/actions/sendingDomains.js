import sparkpostApiRequest from 'actions/helpers/sparkpostApiRequest';

export function list() {
  return sparkpostApiRequest({
    type: 'LIST_SENDING_DOMAINS',
    meta: {
      method: 'GET',
      url: '/sending-domains'
    }
  });
}