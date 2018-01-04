import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import authCookie from 'src/helpers/authCookie';

export function get() {
  return (dispatch, getState) => {
    const { username } = getState().auth;
    return dispatch(sparkpostApiRequest({
      type: 'GET_CURRENT_USER',
      meta: {
        method: 'GET',
        url: `/users/${username}`
      }
    }));
  };
}

export function getGrantsFromCookie(authCookieData = authCookie.get()) {
  const { grants = []} = authCookieData;
  const expanded = grants.map((key) => ({ key }));
  return {
    type: 'GET_GRANTS_SUCCESS',
    payload: expanded
  };
}

export function getGrants({ beta = false, role } = {}) {
  return (dispatch) => dispatch(sparkpostApiRequest({
    type: 'GET_GRANTS',
    meta: {
      url: '/authenticate/grants',
      params: { beta, role }
    }
  }))
    .then((grantData) => {
      const grants = grantData.map(({ key }) => key);
      authCookie.merge({ grants });
    });

}
