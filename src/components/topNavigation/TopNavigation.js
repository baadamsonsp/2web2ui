/* eslint-disable */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Notifications, Help, ArrowDropDown, PersonOutline, InfoOutline, Warning, OpenInNew } from '@sparkpost/matchbox-icons';
import { Button, UnstyledLink, Popover, ActionList, Panel } from '@sparkpost/matchbox';
import { SparkPost } from 'src/components';
import styles from './TopNavigation.module.scss';

const NotificationItem = ({ children, icon: Icon }) => (
  <div className={styles.NotificationItem}>
    <div className={styles.NotificationIconWrapper}><Icon className={styles.NotificationIcon} size={21} /></div>
    <div className={styles.NotificationContent}>{children}</div>
  </div>
)

const TopNavigation = ({ email, children }) => (
  <div className={styles.TopNavigation}>
    <div className={styles.Logo}><SparkPost.Logo type='white' /></div>
    {/* <UnstyledLink className={styles.IconLink}><Notifications /></UnstyledLink>
    <UnstyledLink className={styles.IconLink}><Help /></UnstyledLink>
    <Person /> */}
    <div className={styles.RightOptions}>
        <Button size='small' primary className={styles.Upgrade}>Upgrade Now</Button>
      <Popover
        left
        trigger={<UnstyledLink className={styles.IconLink}><Notifications size={21} width={32}/></UnstyledLink>}>

        <Panel.Section><h6>Notifications</h6></Panel.Section>

        <NotificationItem icon={InfoOutline}>
          This is a notification Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium iusto sit magnam explicabo voluptates perferendis eveniet eius, <UnstyledLink to='#'>with a link</UnstyledLink>.
        </NotificationItem>

        <NotificationItem icon={Warning}>
          Lorem ipsum dolor perferendis eveniet eius, <UnstyledLink to='#'>ohno</UnstyledLink>.
        </NotificationItem>

      </Popover>

      <Popover
        left
        trigger={<UnstyledLink className={styles.IconLink}>{email} <ArrowDropDown/></UnstyledLink>}>

        <ActionList className={styles.ProfileList} style={{ maxHeight: 'none' }}
          sections={[
            { actions: [
              { content: 'Profile' },
              { content: 'Billing' },
              { content: 'Manage Users' }
              ]
            },
            { actions: [
              { content: 'Get Help' },
              { content: <Fragment>
                API Documentation <div style={{float:'right'}}><OpenInNew size={13}/></div>
              </Fragment> }
              ]
            },
            { actions: [{ content: 'Log Out' }]}
          ]}/>
      </Popover>
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  email: state.currentUser.email
});
export default connect(mapStateToProps, {})(TopNavigation);
