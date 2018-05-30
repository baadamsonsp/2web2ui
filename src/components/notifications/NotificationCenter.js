import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover } from '@sparkpost/matchbox';
import { Notifications, NotificationsUnread, InfoOutline, Warning } from '@sparkpost/matchbox-icons';
import * as notificationActions from 'src/actions/notifications';
import { selectTransformedNotifications, selectUnreadCount } from 'src/selectors/notifications';
import styles from './NotificationCenter.module.scss';

const iconTypeMap = {
  info: InfoOutline,
  notice: Warning,
  warning: Warning
};

const NotificationItem = ({ children, icon: Icon, unread }) => (
  <div className={unread ? styles.UnreadNotificationItem : styles.NotificationItem}>
    <div className={styles.NotificationIconWrapper}><Icon className={styles.NotificationIcon} size={21} /></div>
    <div className={styles.NotificationContent}>{children}</div>
  </div>
);

export class NotificationCenter extends Component {

  componentDidMount() {
    this.props.loadNotifications();
  }

  renderNotification = ({ component: Component, meta, id }) => (
    <NotificationItem key={id} icon={iconTypeMap[meta.type]} unread={meta.unread}>
      {meta.title ? <h2>{meta.title}</h2> : null}
      <Component />
    </NotificationItem>
  );

  renderNotificationsList = () => {
    if (!this.props.notifications || this.props.notifications.length === 0) {
      return <p>No notifications at this time.</p>;
    }
    return this.props.notifications.map(this.renderNotification);
  }

  render() {
    const icon = (this.props.unreadCount > 0)
      ? <NotificationsUnread className={styles.UnreadNotificationSignal} />
      : <Notifications className={styles.NotificationSignal} />;

    return (
      <Popover
        left
        onClose={this.props.markAllAsRead}
        trigger={icon}>
        {this.renderNotificationsList()}
      </Popover>
    );
  }
}

const mstp = (state) => ({
  notifications: selectTransformedNotifications(state),
  unreadCount: selectUnreadCount(state)
});
export default connect(mstp, notificationActions)(NotificationCenter);