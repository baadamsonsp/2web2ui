/* eslint-disable */
import React from 'react';
import { Notifications, Help } from '@sparkpost/matchbox-icons';
import { Button, UnstyledLink } from '@sparkpost/matchbox';
import { SparkPost } from 'src/components';
import styles from './TopNavigation.module.scss';

const TopNavigation = ({ children }) => (
  <div className={styles.TopNavigation}>
    <div className={styles.Logo}><SparkPost.Logo type='white' /></div>
    {/* <UnstyledLink className={styles.IconLink}><Notifications /></UnstyledLink>
    <UnstyledLink className={styles.IconLink}>Support <Help /></UnstyledLink> */}
  </div>
);

export default TopNavigation;
