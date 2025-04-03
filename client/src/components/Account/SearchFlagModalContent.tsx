import React, { useContext, useState } from 'react';
import { IoClose } from 'react-icons/io5';

import styles from './styles.module.scss';
import { Notification } from '@components/common/Notification';
import { useSearchFlagsQuery } from '@query-hooks/flags/useSearchFlags';
import { debounce } from '@utils/debounce';
import { SearchInput } from '@components/common/Inputs/SearchInput';
import { IconButton } from '@components/common/Buttons/IconButton';
import { List } from '@components/common/List';
import { ListItem } from '@components/common/List/ListItem';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { Text } from '@components/common/Text';
import { FlexDiv } from '@components/common/FlexDiv';
import { useUpdateFavouriteFlagQuery } from '@query-hooks/user/useUpdateFavouriteFlag';
import { AuthContext } from '@context/AuthContext';
import { Flag } from '@type-defs/flag';

interface Props {
  closeModal: () => void;
}

export const SearchFlagModalContent = ({ closeModal }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const user = useContext(AuthContext);
  const { data: flags, error, isError } = useSearchFlagsQuery(searchTerm);
  const mutation = useUpdateFavouriteFlagQuery();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setSearchTerm(event.target.value),
    500
  );

  const handleSelect = (flag: Flag) => {
    mutation.mutate({
      favouriteFlag: flag.iso_2,
      username: user?.username,
      token: user?.token
    });
    closeModal();
  };

  return (
    <div className={styles.container}>
      <header className={styles.modalHeader}>
        <SearchInput handleSearch={handleSearch} autoFocus />
        <IconButton handleClick={closeModal} Icon={IoClose} />
      </header>
      {isError && (
        <Notification className={styles.errorNotification} type="error">
          {error?.message}
        </Notification>
      )}
      <div className={styles.listContainer}>
        <List>
          {flags?.map((flag) => (
            <ListItem
              clickable
              key={flag.iso_2}
              handleClick={() => handleSelect(flag)}
              content={
                <FlexDiv className={styles.listItemContent} alignItems="center">
                  <FlagAvatar flagIso2={flag.iso_2} />
                  <Text>{flag.name}</Text>
                </FlexDiv>
              }
            />
          ))}
        </List>
      </div>
    </div>
  );
};
