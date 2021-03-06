import billingCreate from '../billingCreate';
import * as accountActions from 'src/actions/account';
import * as billingActions from 'src/actions/billing';
import { isAws } from 'src/helpers/conditions/account';
import * as billingHelpers from 'src/helpers/billing';

jest.mock('src/actions/account');
jest.mock('src/actions/billing');
jest.mock('src/helpers/conditions/account');
jest.mock('src/helpers/billing');

describe('Action Creator: Billing Create', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn((a) => a);
    isAws.mockImplementation(() => false);
  });

  it('update without a planpicker code', () => {
    const values = {};
    const currentUser = {
      email: 'test@example.com'
    };
    const corsData = {
      email: 'test@example.com'
    };
    const billingData = {
      billToContact: {},
      creditCard: {
        cardNumber: '1111222233334444'
      }
    };
    const getState = () => ({ currentUser });
    const thunk = billingCreate(values);

    billingActions.cors = jest.fn(({ meta }) => meta.onSuccess({
      results: {
        signature: 'TEST_SIGNATURE',
        token: 'TEST_TOKEN'
      }
    }));
    billingActions.createZuoraAccount = jest.fn(({ meta }) => meta.onSuccess({}));
    billingActions.syncSubscription = jest.fn(({ meta }) => meta.onSuccess({}));
    accountActions.fetch = jest.fn();

    billingHelpers.formatCreateData = jest.fn((a) => a);
    billingHelpers.formatDataForCors = jest.fn((a) => ({ billingData, corsData }));

    thunk(dispatch, getState);

    expect(billingActions.cors).toHaveBeenCalledWith(expect.objectContaining({
      context: 'create-account',
      data: corsData
    }));

    expect(billingActions.createZuoraAccount).toHaveBeenCalledWith(expect.objectContaining({
      data: billingData,
      signature: 'TEST_SIGNATURE',
      token: 'TEST_TOKEN'
    }));

    expect(billingActions.syncSubscription).toHaveBeenCalled();
    expect(accountActions.fetch).toHaveBeenCalledWith(expect.objectContaining({ include: 'usage,billing' }));
  });

  it('update subscription for AWS users', () => {
    const state = jest.fn();
    const values = { planpicker: { code: 'plan-code' }};
    const thunk = billingCreate(values);

    isAws.mockImplementation(() => true);
    billingActions.updateSubscription = jest.fn();

    thunk(dispatch, () => state);
    expect(isAws).toHaveBeenCalledWith(state);
    expect(billingActions.updateSubscription).toHaveBeenCalledWith({ code: 'plan-code' });
  });
});
