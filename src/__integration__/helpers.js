import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'src/store';
import { Provider } from 'react-redux';
import _ from 'lodash';
import getFiller from './fill';

// prevent problems with trying to load google analytics stuff
jest.mock('src/helpers/analytics');

export const asyncFlush = () => new Promise((resolve) => setImmediate(resolve));

export const login = (store) => store.dispatch({
  type: 'LOGIN_SUCCESS',
  payload: {
    access_token: 'very-real-access-token'
  }
});

export async function setupForm(tree) {
  const store = configureStore();
  login(store);

  const mounted = mount(
    <Provider store={store}>
      <MemoryRouter>
        {tree}
      </MemoryRouter>
    </Provider>
  );

  await asyncFlush();
  mounted.update();

  return {
    mounted,
    find: mounted.find.bind(mounted),
    store,
    fill: getFiller(mounted),
    asyncFlush,
    submit: async () => {
      mounted.find('form').simulate('submit');
      return asyncFlush();
    },
    /* eslint-disable-next-line no-console */
    debug: (path = 'form') => console.log(JSON.stringify(_.get(store.getState(), path), null, 2))
  };
}
