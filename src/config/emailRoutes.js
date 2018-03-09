import React from 'react';
import { ProfilePage } from 'src/pages';
import { Redirect } from 'react-router-dom';
import qs from 'query-string';

/**
 * Handles route redirects for cutover to GA from old email template links
 * TODO: Should remove at a later date
 */

/**
 * Handles redirect for existing profile route
 * /account/profile?verify={{token}}
 * to /account/email-verification/{{token}}
 */
export function emailVerificationRedirect(props) {
  const search = qs.parse(props.location.search);
  return search.verify ? <Redirect to={`/account/email-verification/${search.verify}`}/> : <ProfilePage {...props} />;
}

/**
 * Handles redirect for reset password
 * /reset-password?token={{token}}
 * to /reset-password/{{token}}
 */
function passwordReset(props) {
  const search = qs.parse(props.location.search);
  return <Redirect to={search.token ? `/reset-password/${search.token}` : '/404'}/>;
}

export const emailRedirects = [
  {
    path: '/account/webhooks',
    redirect: '/webhooks'
  },
  {
    path: '/reset-password',
    public: true,
    component: passwordReset
  }
];
