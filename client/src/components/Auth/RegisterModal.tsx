import { IoClose } from 'react-icons/io5';

import { Modal } from '@components/Modal';
import { IconButton } from '@components/Buttons/IconButton';
import styles from './styles.module.scss';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

export const RegisterModal = ({ isOpen }: Props) => {
  const navigate = useNavigate();

  function closeModal() {
    navigate('..');
  }

  return (
    <Modal isOpen={isOpen}>
      <header className={styles.modalHeader}>
        <IconButton handleClick={closeModal} Icon={IoClose} />
      </header>
      <Routes>
        <Route path="register" element={<RegisterForm />} />
        <Route path="login" element={<LoginForm />} />
      </Routes>
    </Modal>
  );
};
