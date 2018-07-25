import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function listAbTests() {
  return sparkpostApiRequest({
    type: 'LIST_AB_TESTS',
    meta: {
      method: 'GET',
      url: '/ab-test',
      showErrorAlert: false
    }
  });
}

export function getAbTest({ id, version }) {
  // Is this even needed? seems to work without /draft/
  // const url = draft ? `/ab-test/draft/${id}` : `/ab-test/${id}`;

  return sparkpostApiRequest({
    type: 'GET_AB_TEST',
    meta: {
      method: 'GET',
      url: `/ab-test/${id}`,
      showErrorAlert: false,
      params: {
        version
      }
    }
  });
}

export function updateDraftTest() {
  return sparkpostApiRequest({
    type: 'UPDATE_AB_TEST_DRAFT',
    meta: {
      method: 'PUT',
      url: `/ab-test/draft/${id}`
    }
  });
}

export function updateTest() {
  return sparkpostApiRequest({
    type: 'UPDATE_AB_TEST',
    meta: {
      method: 'PUT',
      url: `/ab-test/${id}`
    }
  });
}
