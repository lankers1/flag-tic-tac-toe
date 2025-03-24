import React from 'react';
import styles from './inputs.module.scss';
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
    <FlexDiv flexDirection="col" className={styles.container}>
      <input
        disabled={disabled}
        name={name}
        className={`${styles.input} ${error && styles.error}`}
        onChange={handleChange}
        type={type}
        placeholder={placeholder}
        value={value}
      />
      <fieldset className={styles.fieldset}>
        <legend>
          <Text fontSize="small">{label}</Text>
        </legend>
      </fieldset>
      {error && (
        <Text fontSize="small" color="error">
          {error}
        </Text>
      )}
    </FlexDiv>
  );
};
