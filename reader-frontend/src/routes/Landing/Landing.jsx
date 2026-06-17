import { Link } from 'react-router';
import styles from './landing.module.css';
import { BiRightArrowAlt as RightArrow } from 'react-icons/bi';

const Landing = () => {
  return (
    <div>
      <div className={styles.hero}>
        <span className={styles.title}>
          <span className={styles.block}>Stories</span> worth telling
        </span>
        <span className={styles.subtitle}>
          <Link viewTransition className={styles.link} to='/blogs'>
            Start writing now <RightArrow />
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Landing;
