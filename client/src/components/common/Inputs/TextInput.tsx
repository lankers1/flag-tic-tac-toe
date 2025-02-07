import React from 'react';
import styles from './searchInput.module.scss';
import { Text } from '@components/common/Text';

interface Props {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder: string;
  label?: string;
  name: string;
  value: string;
  error?: string;
}

export const TextInput = ({
  handleChange,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error
}: Props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text>{label}</Text>
      <input
        name={name}
        className={`${styles.textInput} ${error && styles.error}`}
        onChange={handleChange}
        type={type}
        placeholder={placeholder}
        value={value}
      />
      {error && <Text color="error">{error}</Text>}
    </div>
  );
};
