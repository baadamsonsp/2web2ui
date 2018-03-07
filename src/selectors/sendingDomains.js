import { createSelector } from 'reselect';
import { resolveReadyFor } from 'src/helpers/domains';
import _ from 'lodash';

export const isVerified = (domain) => domain.status.ownership_verified && domain.status.compliance_status === 'valid';
export const isUnverified = (domain) => !domain.status.ownership_verified || domain.status.compliance_status === 'pending';

export const getDomains = (state) => state.sendingDomains.list;
export const getDomain = (state) => state.sendingDomains.domain;
const selectSubaccountFromProps = (state, props) => _.get(props, 'id', null);

export const selectDomain = createSelector(
  [getDomain],
  (domain) => ({
    ...domain,
    dkimHostname: `${domain.dkim.selector}._domainkey.${domain.id}`,
    dkimValue: `v=DKIM1; k=rsa; h=sha256; p=${domain.dkim.public}`
  })
);

export const selectVerifiedDomains = createSelector(
  [getDomains],
  (domains) => _.filter(domains, (domain) => isVerified(domain))
);

export const selectReadyForBounce = createSelector(
  [getDomains],
  (domains) => _.filter(domains, (domain) => resolveReadyFor(domain.status).bounce)
);

export const selectReadyForDkim = createSelector(
  [getDomains],
  (domains) => _.filter(domains, (domain) => resolveReadyFor(domain.status).dkim)
);

export const hasUnverifiedDomains = createSelector(
  [getDomains],
  (domains) => _.reduce(domains, (acc, domain) => acc || isUnverified(domain), false)
);

export const selectSendingDomainsForSubaccount = createSelector(
  [getDomains, selectSubaccountFromProps],
  (domains, subaccount) => domains.filter((domain) => domain.subaccount_id === Number(subaccount))
);
