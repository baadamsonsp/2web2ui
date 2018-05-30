import React from 'react';
import { AccountDropdown } from '../AccountDropdown';
import { shallow } from 'enzyme';
import context from 'src/__testHelpers__/context';

describe('AccountDropdown', () => {
  let wrapper;
  const MockIcon = () => 'MockIcon';
  const props = {
    email: 'test@testing.com',
    accountNavItems: [
      {
        label: 'link',
        to: 'link'
      },
      {
        label: 'link2',
        to: 'link2',
        external: true,
        icon: MockIcon
      }
    ]
  };

  beforeEach(() => {
    wrapper = shallow(<AccountDropdown {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should hide dropdown on popover close', () => {
    wrapper.instance().toggleDropdown();
    expect(wrapper).toHaveState({ open: true });
    wrapper.find('Popover').simulate('close');
    expect(wrapper).toHaveState({ open: false });
  });

  it('should hide dropdown on actionlist click', () => {
    wrapper.instance().toggleDropdown();
    expect(wrapper).toHaveState({ open: true });
    wrapper.find('ActionList').simulate('click');
    expect(wrapper).toHaveState({ open: false });
  });

  describe('activator', () => {
    let consumer;

    beforeEach(() => {
      const Activator = wrapper.instance().renderActivator;
      consumer = context(<Activator />, { mobile: false });
    });

    it('should render email address on desktop', () => {
      expect(consumer.children()).toMatchSnapshot();
    });

    it('should render an icon on mobile', () => {
      expect(consumer.children({ mobile: true })).toMatchSnapshot();
    });

    it('should render an icon on desktop if email doesnt exist', () => {
      wrapper.setProps({ email: null });
      expect(consumer.children({ mobile: false })).toMatchSnapshot();
    });

    it('should toggle dropdown on click', () => {
      consumer.children().find('UnstyledLink').simulate('click');
      expect(wrapper).toHaveState({ open: true });
    });
  });
});