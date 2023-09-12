import { memo } from 'react';
import styles from './styles.module.css';

const Loading = memo(function Loading() {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loading}></div>
    </div>
  );
});

export default Loading;
