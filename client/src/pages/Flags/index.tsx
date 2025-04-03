import { Card } from '@components/common/Card';
import { FlexDiv } from '@components/common/FlexDiv';
import { useSearchFlagCharacteristicsQuery } from '@query-hooks/flags/useSearchFlagCharacteristics';
import { MultiSelect } from '@components/common/Select';
import { useGetCharacteristicsQuery } from '@query-hooks/flags/useGetCharacteristics';
import { Fragment, useState } from 'react';
import { List } from '@components/common/List';
import { ListItem } from '@components/common/List/ListItem';
import { Text } from '@components/common/Text';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { Loader } from '@components/common/Loader';
import { Notification } from '@components/common/Notification';
import { mapCharacteristics } from '@utils/flags/mapCharacteristics';

import styles from './styles.module.scss';
import { CharacteristicChip } from '@components/Flags/CharacteristicChip';

export const Flags = () => {
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<
    string[]
  >([]);
  const {
    data: characteristics,
    isLoading: isCharacteristicsLoading,
    isError: isCharacteristicsError
  } = useGetCharacteristicsQuery();
  const { data, isInitialLoading, isError } = useSearchFlagCharacteristicsQuery(
    '',
    selectedCharacteristics
  );

  function handleSelect(item: string) {
    setSelectedCharacteristics((state) => [...state, item]);
  }
  const loading = (isInitialLoading || isCharacteristicsLoading) && !data;

  return (
    <FlexDiv
      alignItems="center"
      className={styles.container}
      justifyContent="center"
    >
      <Card className={styles.card}>
        {isError ||
          (isCharacteristicsError && (
            <Notification type="error">
              <Text>
                Whoops something went wrong while searching retrieving search
                results
              </Text>
            </Notification>
          ))}
        <>
          {!(isError || isCharacteristicsError) && (
            <MultiSelect
              items={characteristics ? characteristics : []}
              name="flag-filters"
              label="Search"
              onSelect={handleSelect}
              onRemove={(index) =>
                setSelectedCharacteristics((state) =>
                  state.filter((_, cIndex) => index !== cIndex)
                )
              }
              selectedItems={selectedCharacteristics}
            />
          )}
          {loading && (
            <FlexDiv
              className={styles.loadingContainer}
              alignItems="center"
              justifyContent="center"
            >
              <Loader />
            </FlexDiv>
          )}
          <FlexDiv className={styles.listContainer}>
            <List>
              {data?.map((flag) => {
                const charMap = mapCharacteristics(flag?.characteristics);
                return (
                  <ListItem
                    key={flag.iso_2}
                    content={
                      <FlexDiv
                        className={styles.listItemWrapper}
                        flexDirection="col"
                        justifyContent="spaceBetween"
                      >
                        <FlexDiv alignItems="center">
                          <FlagAvatar
                            className={styles.flagAvatar}
                            flagIso2={flag?.iso_2}
                          />
                          <Text>{flag?.name}</Text>
                        </FlexDiv>
                        <FlexDiv className={styles.characteristicWrapper}>
                          {charMap &&
                            Object.keys(charMap)?.map((key, index) => {
                              const chars = charMap[key];
                              if (key) {
                                return (
                                  <Fragment key={`render-chip-${key}-${index}`}>
                                    <CharacteristicChip
                                      chipType={key}
                                      chars={chars}
                                    />
                                  </Fragment>
                                );
                              }
                              return null;
                            })}
                        </FlexDiv>
                      </FlexDiv>
                    }
                  />
                );
              })}
            </List>
          </FlexDiv>
        </>
      </Card>
    </FlexDiv>
  );
};
