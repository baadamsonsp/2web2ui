/* eslint-disable */
import React from 'react';
import { Notifications, Help, Person, PersonOutline, InfoOutline, Warning } from '@sparkpost/matchbox-icons';
import { Button, UnstyledLink, Popover, ActionList } from '@sparkpost/matchbox';
import { SparkPost } from 'src/components';
import styles from './TopNavigation.module.scss';

const NotificationItem = ({ children, icon: Icon }) => (
  <div className={styles.NotificationItem}>
    <div className={styles.NotificationIconWrapper}><Icon className={styles.NotificationIcon} size={21} /></div>
    <div className={styles.NotificationContent}>{children}</div>
  </div>
)

const TopNavigation = ({ children }) => (
  <div className={styles.TopNavigation}>
    <div className={styles.Logo}><SparkPost.Logo type='white' /></div>
    {/* <UnstyledLink className={styles.IconLink}><Notifications /></UnstyledLink>
    <UnstyledLink className={styles.IconLink}><Help /></UnstyledLink>
    <Person /> */}
    <div className={styles.RightOptions}>

      <Popover
        left
        trigger={<UnstyledLink className={styles.IconLink}><Notifications size={21} width={32}/></UnstyledLink>}>

        <NotificationItem icon={InfoOutline}>
          This is a notification Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium iusto sit magnam explicabo voluptates perferendis eveniet eius, <UnstyledLink to='#'>with a link</UnstyledLink>.
        </NotificationItem>

        <NotificationItem icon={Warning}>
          Lorem ipsum dolor perferendis eveniet eius, <UnstyledLink to='#'>ohno</UnstyledLink>.
        </NotificationItem>

      </Popover>

      <Popover
        left
        trigger={<UnstyledLink className={styles.IconLink}><Person size={24} width={32}/></UnstyledLink>}>
        <ActionList actions={[
          { content: 'Profile' },
          { content: 'Sign Out' },
        ]}/>
      </Popover>
    </div>
  </div>
);

export default TopNavigation;
