import { useNavigate } from 'react-router-dom';
import { BiChevronLeft } from 'react-icons/bi';
import styles from './backButton.module.css';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className={styles.backButton}>
      <BiChevronLeft className={styles.icon} />
      Back
    </button>
  );
};

export default BackButton;
