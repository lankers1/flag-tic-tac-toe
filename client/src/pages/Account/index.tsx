import { useContext, useState } from 'react';

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
import { Modal } from '@components/common/Modal';
import { SearchFlagModalContent } from '@components/Account/SearchFlagModalContent';
import { useGetUserQuery } from '@query-hooks/user/useGetUser';
import { Loader } from '@components/common/Loader';
import { Notification } from '@components/common/Notification';

export const Account = () => {
  const [displayFlagModal, setDisplayFlagModal] = useState(false);
  const userContext = useContext(AuthContext) as UserContext;
  const { data, isLoading, isError } = useGetUserQuery(userContext?.username);

  function closeFlagModal() {
    setDisplayFlagModal(false);
  }

  return (
    <>
      <Card className={styles.card}>
        <FlexDiv flexDirection="col" className={styles.cardContainer}>
          {isError && (
            <Notification type="error">
              Something went wrong while retireving your account
            </Notification>
          )}
          {isLoading && <Loader />}
          {data?.user && (
            <>
              <Heading variant="h3">Account details</Heading>
              <TextInput
                name="username"
                label="Username"
                disabled
                placeholder="Username"
                value={data?.user?.username}
              />
              <FlexDiv alignItems="flexStart" flexDirection="col">
                <Text>Favourite flag</Text>
                <Button
                  handleClick={() => setDisplayFlagModal(true)}
                  label={
                    <>
                      <FlagAvatar
                        className={styles.flagAvatar}
                        flagIso2={data?.user?.favouriteFlag}
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
              </FlexDiv>
            </>
          )}
        </FlexDiv>
      </Card>
      <Modal isOpen={displayFlagModal}>
        <SearchFlagModalContent closeModal={closeFlagModal} />
      </Modal>
    </>
  );
};
