import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from '@sparkpost/matchbox-icons';
import classnames from 'classnames';
import styles from './Navigation.module.scss';

export class Item extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false
    };
  }

  isActive () {
    const { to, location } = this.props;
    return location.pathname.includes(to);
  }

  handleParentClick () {
    this.setState({ open: !this.state.open });
  }

  componentWillMount () {
    if (this.isActive()) {
      this.setState({ open: true });
    }
  }

  renderChildren () {
    const { children, location } = this.props;

    return (
      <ul className={styles.nestedList}>
        {children.map((child, key) => <Item {...child} location={location} key={key} />)}
      </ul>
    );
  }

  render () {
    const {
      to,
      icon: Icon,
      label,
      children
    } = this.props;

    const active = this.isActive();
    const linkClasses = classnames(
      styles.link,
      active && styles.isActive,
      children && styles.hasChildren,
      this.state.open && styles.isOpen
    );

    return (
      <span>
        {children
          ? <li>
            <a onClick={() => this.handleParentClick()} className={linkClasses}>
              <span className={styles.iconWrapper}><Icon size={19} className={styles.icon} /></span>
              { label }
              <ChevronLeft className={styles.chevron} />
            </a>
            {this.renderChildren()}
          </li>

          : <li>
            <Link to={ to } className={linkClasses}>
              { Icon && <span className={styles.iconWrapper}><Icon size={19} className={styles.icon} /></span> }
              { label }
            </Link>
          </li>
        }
      </span>
    );
  }
}

export default Item;
