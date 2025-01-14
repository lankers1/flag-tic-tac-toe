import React from 'react';
import styles from './searchInput.module.scss';

interface Props {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder: string;
  label?: string;
  name: string;
}

export const TextInput = ({
  handleChange,
  name,
  label,
  type = 'text',
  placeholder
}: Props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>{label}</p>
      <input
        name={name}
        className={styles.textInput}
        onChange={handleChange}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
};
