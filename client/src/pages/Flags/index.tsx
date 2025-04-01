import { Card } from '@components/common/Card';
import { FlexDiv } from '@components/common/FlexDiv';
import styles from './styles.module.scss';
import { useSearchFlagCharacteristicsQuery } from '@query-hooks/flags/useSearchFlagCharacteristics';
import { MultiSelect } from '@components/common/Select';
import { useGetCharacteristicsQuery } from '@query-hooks/flags/useGetCharacteristics';
import { Fragment, useState } from 'react';
import { List } from '@components/common/List';
import { ListItem } from '@components/common/List/ListItem';
import { Text } from '@components/common/Text';
import { FlagAvatar } from '@components/common/FlagAvatar';
import { capitaliseFirst } from '@utils/capitaliseFirst';
import { removeSnakeCase } from '@utils/removeSnakeCase';
import { Loader } from '@components/common/Loader';
import { Notification } from '@components/common/Notification';
import { Chip } from '@components/common/Chip';
import { mapCharacteristics } from '@utils/flags/mapCharacteristics';
import { CharacteristicIcon } from '@components/Flags/CharacteristicIcon';

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
                          <Text fontSize="small">{flag?.name}</Text>
                        </FlexDiv>
                        <FlexDiv className={styles.characteristicWrapper}>
                          {charMap &&
                            Object.keys(charMap)?.map((key, index) => {
                              const chars = charMap[key];
                              if (key) {
                                return (
                                  <Fragment key={`render-chip-${key}-${index}`}>
                                    <RenderChip chipType={key} chars={chars} />
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

interface RenderChipProps {
  chipType: string;
  chars: string[];
}

function RenderChip({ chipType, chars }: RenderChipProps) {
  switch (chipType) {
    case 'colors':
      return (
        <Chip>
          <FlexDiv alignItems="center" className={styles.chipContainer}>
            <Text fontSize="small">{capitaliseFirst(chipType)}</Text>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                width: `${12 + 8 * chars.length}px`
              }}
            >
              {chars?.map((c, i) => (
                <div
                  key={`${chipType}-${c}-${i}`}
                  style={{
                    border: '2px solid black',
                    borderRadius: '1rem',
                    height: '1rem',
                    width: '1rem',
                    backgroundColor: c,
                    position: 'absolute',
                    right: `${i * 8}px`,
                    bottom: '-0.6rem'
                  }}
                />
              ))}
            </div>
          </FlexDiv>
        </Chip>
      );
    case 'main_color':
      return chars.map((char, i) => (
        <Chip key={`main_color-${i}`}>
          <FlexDiv alignItems="center" className={styles.chipContainer}>
            <CharacteristicIcon type="main_color" characteristic={char} />
            <Text fontSize="small">
              {capitaliseFirst(removeSnakeCase(char))}
            </Text>
          </FlexDiv>
        </Chip>
      ));
    case 'symmetry':
      return chars.map((char, i) => (
        <Chip key={`symmetry-${i}`}>
          <FlexDiv alignItems="center" className={styles.chipContainer}>
            <CharacteristicIcon characteristic={char} />
            <Text fontSize="small">
              {capitaliseFirst(removeSnakeCase(char))}
            </Text>
          </FlexDiv>
        </Chip>
      ));
    case 'region':
      return (
        <Chip>
          <FlexDiv alignItems="center" className={styles.chipContainer}>
            <CharacteristicIcon characteristic={chars[0]} />
            <Text fontSize="small">
              {capitaliseFirst(removeSnakeCase(chars[0]))}
            </Text>
          </FlexDiv>
        </Chip>
      );
    case 'shapes':
      return chars.map((char, i) => (
        <Chip key={`shapes-${i}`}>
          <FlexDiv alignItems="center" className={styles.chipContainer}>
            <CharacteristicIcon characteristic={char} />
            <Text fontSize="small">
              {capitaliseFirst(removeSnakeCase(char))}
            </Text>
          </FlexDiv>
        </Chip>
      ));
    case 'object':
      return chars.map((char, i) => (
        <Chip key={`object-${i}`}>
          <FlexDiv alignItems="center" className={styles.chipContainer}>
            <CharacteristicIcon characteristic={char} />
            <Text fontSize="small">
              {capitaliseFirst(removeSnakeCase(char))}
            </Text>
          </FlexDiv>
        </Chip>
      ));
    case 'astronomical':
      return chars.map((char, i) => (
        <Chip key={`astronomical-${i}`}>
          <FlexDiv alignItems="center" className={styles.chipContainer}>
            <CharacteristicIcon characteristic={char} />
            <Text fontSize="small">
              {capitaliseFirst(removeSnakeCase(char))}
            </Text>
          </FlexDiv>
        </Chip>
      ));
  }
}
