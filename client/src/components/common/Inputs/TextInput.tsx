import React from 'react';
import styles from './searchInput.module.scss';
import { Text } from '@components/common/Text';
import { FlexDiv } from '../FlexDiv';

interface Props {
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder: string;
  label?: string;
  name: string;
  value: string;
  error?: string;
  disabled?: boolean;
}

export const TextInput = ({
  handleChange,
  name,
  disabled,
  label,
  type = 'text',
  placeholder,
  value,
  error
}: Props) => {
  return (
    <FlexDiv flexDirection="col">
      <label htmlFor={name}>{label}</label>
      <input
        disabled={disabled}
        name={name}
        className={`${styles.textInput} ${error && styles.error}`}
        onChange={handleChange}
        type={type}
        placeholder={placeholder}
        value={value}
      />
      {error && (
        <Text fontSize="small" color="error">
          {error}
        </Text>
      )}
    </FlexDiv>
  );
};
