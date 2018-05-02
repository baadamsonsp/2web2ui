import React from 'react';
import ScrollToTop from './ScrollToTop';
import Navigation from 'src/components/navigation/Navigation';
import TopNavigation from 'src/components/topNavigation/TopNavigation';
import styles from './Layout.module.scss';

const App = ({ children }) => (
  <div className={`${styles.wrapper} ${styles.app} ${styles.accent}`}>
    <div className={styles.top}>
      <TopNavigation />
    </div>
    <div className={styles.aside}>
      <Navigation />
    </div>
    <main role="main" className={styles.content}>
      <div className={styles.container}>
        {children}
      </div>
    </main>
    <ScrollToTop/>
  </div>
);

export default App;
