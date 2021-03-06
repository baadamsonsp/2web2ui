import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as abTesting from '../abTesting';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: A/B Testing', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore({});
  });

  it('should dispatch a list action', () => {
    mockStore.dispatch(abTesting.listAbTests());
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
