import { useContext } from 'react';

import { Card } from '@components/common/Card';
import { FlexDiv } from '@components/common/FlexDiv';
import { Heading } from '@components/common/Heading';
import { AuthContext, UserContext } from '@context/AuthContext';

import styles from './styles.module.scss';
import { TextInput } from '@components/common/Inputs/TextInput';
import { Text } from '@components/common/Text';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { Button } from '@components/common/Buttons/Button';
import { LinkButton } from '@components/common/Buttons/LinkButton';
import { FaChevronLeft } from 'react-icons/fa';
import { FaSave } from 'react-icons/fa';

export const Account = () => {
  const user = useContext(AuthContext) as UserContext;
  return (
    <Card className={styles.card}>
      <FlexDiv flexDirection="col" className={styles.cardContainer}>
        <Heading variant="h3">Account details</Heading>
        <TextInput
          name="username"
          label="Username"
          disabled
          placeholder="Username"
          value={user?.username}
        />
        <FlexDiv alignItems="flexStart" flexDirection="col">
          <Text>Favourite flag</Text>
          <Button
            label={
              <>
                <FlagAvatar
                  className={styles.flagAvatar}
                  flagIso2={user?.favouriteFlag}
                />
                Change flag
              </>
            }
          />
        </FlexDiv>
        <FlexDiv justifyContent="spaceBetween">
          <LinkButton
            to="/"
            label={
              <>
                <FaChevronLeft />
                Back
              </>
            }
          />
          <Button
            color="green"
            label={
              <>
                Update details
                <FaSave />
              </>
            }
          />
        </FlexDiv>
      </FlexDiv>
    </Card>
  );
};
