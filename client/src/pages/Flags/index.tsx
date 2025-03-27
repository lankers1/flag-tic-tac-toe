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
import {
  FaBan,
  FaBuilding,
  FaCircle,
  FaCross,
  FaCrown,
  FaGlobeAfrica,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeEurope,
  FaKiwiBird,
  FaMoon,
  FaPen,
  FaStar,
  FaStarAndCrescent,
  FaStarHalfAlt,
  FaSun,
  FaTools
} from 'react-icons/fa';
import { FaGun, FaPerson, FaRotateRight, FaShieldHeart } from 'react-icons/fa6';
import { IoTriangle } from 'react-icons/io5';
import { BsSymmetryVertical } from 'react-icons/bs';
import { Loader } from '@components/common/Loader';
import { Notification } from '@components/common/Notification';
import { GiStarsStack } from 'react-icons/gi';
import { RiPlantFill, RiRectangleLine } from 'react-icons/ri';
import { TbBoxAlignTopLeftFilled, TbFocusCentered } from 'react-icons/tb';
import { Chip } from '@components/common/Chip';
import { mapCharacteristics } from '@utils/flags/mapCharacteristics';

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
            <DetermineIcon type="main_color" characteristic={char} />
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
            <DetermineIcon characteristic={char} />
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
            <DetermineIcon characteristic={chars[0]} />
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
            <DetermineIcon characteristic={char} />
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
            <DetermineIcon characteristic={char} />
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
            <DetermineIcon characteristic={char} />
            <Text fontSize="small">
              {capitaliseFirst(removeSnakeCase(char))}
            </Text>
          </FlexDiv>
        </Chip>
      ));
  }
}

interface DetermineIconProps {
  characteristic: string;
  type?: string;
}

export function DetermineIcon({ characteristic, type }: DetermineIconProps) {
  if (type === 'color') {
    return (
      <div
        style={{
          border: '2px solid black',
          borderRadius: '1rem',
          height: '1rem',
          width: '1rem',
          backgroundColor: characteristic.slice(9)
        }}
      />
    );
  }

  if (type === 'main_color') {
    return (
      <div
        style={{
          border: '2px solid black',
          borderRadius: '1rem',
          height: '1rem',
          width: '1rem',
          backgroundColor: characteristic.slice(12)
        }}
      />
    );
  }

  if (type === 'combo_colors') {
    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: `${12 + 8 * 2}px`
        }}
      >
        {characteristic?.split('_and_')?.map((c, i) => (
          <div
            key={`${type}-${c}-${i}`}
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
    );
  }

  switch (characteristic) {
    case 'Asia':
      return <FaGlobeAsia />;
    case 'Africa':
      return <FaGlobeAfrica />;
    case 'North America':
      return <FaGlobeAmericas />;
    case 'South America':
      return <FaGlobeAmericas />;
    case 'Europe':
      return <FaGlobeEurope />;
    case 'Oceania':
      return <FaGlobeAsia />;
    case 'contains_circle':
      return <FaCircle />;
    case 'contains_triangle':
      return <IoTriangle />;
    case 'line_symmetry':
      return <BsSymmetryVertical />;
    case 'rotational_symmetry':
      return <FaRotateRight />;
    case 'no_symmetry':
      return <FaBan />;
    case 'red_stars':
      return <FaStar style={{ color: 'red' }} />;
    case 'white_stars':
      return (
        <FaStar
          style={{ color: 'white', stroke: 'black', strokeWidth: '50px' }}
        />
      );
    case 'three_plus_stars':
      return <GiStarsStack />;
    case 'triband':
      return (
        <div
          style={{
            border: '2px solid black',
            borderRadius: '1rem',
            height: '1rem',
            width: '1rem',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              height: '0.33rem',
              width: '1rem',
              backgroundColor: 'red',
              position: 'absolute',
              top: 0
            }}
          />
          <div
            style={{
              height: '0.33rem',
              width: '1rem',
              backgroundColor: 'yellow',
              position: 'absolute',
              top: '0.33rem'
            }}
          />
          <div
            style={{
              height: '0.33rem',
              width: '1rem',
              backgroundColor: 'green',
              position: 'absolute',
              top: '0.66rem'
            }}
          />
        </div>
      );

    case 'horizontal_stripes':
      return (
        <div
          style={{
            border: '2px solid black',
            borderRadius: '1rem',
            height: '1rem',
            width: '1rem',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'blue'
          }}
        >
          <div
            style={{
              height: '0.33rem',
              width: '1rem',
              backgroundColor: 'yellow',
              position: 'absolute',
              top: '0.33rem'
            }}
          />
        </div>
      );

    case 'three_horizontal_stripes':
      return (
        <div
          style={{
            border: '2px solid black',
            borderRadius: '1rem',
            height: '1rem',
            width: '1rem',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'blue'
          }}
        >
          <div
            style={{
              height: '0.33rem',
              width: '1rem',
              backgroundColor: 'red',
              position: 'absolute',
              top: 0
            }}
          />
          <div
            style={{
              height: '0.33rem',
              width: '1rem',
              backgroundColor: 'yellow',
              position: 'absolute',
              top: '0.33rem'
            }}
          />
          <div
            style={{
              height: '0.33rem',
              width: '1rem',
              backgroundColor: 'green',
              position: 'absolute',
              top: '0.66rem'
            }}
          />
        </div>
      );

    case 'three_vertical_stripes':
      return (
        <div
          style={{
            border: '2px solid black',
            borderRadius: '1rem',
            height: '1rem',
            width: '1rem',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'blue'
          }}
        >
          <div
            style={{
              height: '1rem',
              width: '0.33rem',
              backgroundColor: 'red',
              position: 'absolute',
              right: 0
            }}
          />
          <div
            style={{
              height: '1rem',
              width: '0.33rem',
              backgroundColor: 'yellow',
              position: 'absolute',
              right: '0.33rem'
            }}
          />
          <div
            style={{
              height: '1rem',
              width: '0.33rem',
              backgroundColor: 'green',
              position: 'absolute',
              right: '0.66rem'
            }}
          />
        </div>
      );

    case 'four_plus_horizontal_stripes':
      return (
        <div
          style={{
            border: '2px solid black',
            borderRadius: '1rem',
            height: '1rem',
            width: '1rem',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              height: '0.25rem',
              width: '1rem',
              backgroundColor: 'red',
              position: 'absolute',
              top: 0
            }}
          />
          <div
            style={{
              height: '0.25rem',
              width: '1rem',
              backgroundColor: 'green',
              position: 'absolute',
              top: '0.25rem'
            }}
          />
          <div
            style={{
              height: '0.25rem',
              width: '1rem',
              backgroundColor: 'red',
              position: 'absolute',
              top: '0.50rem'
            }}
          />
          <div
            style={{
              height: '0.25rem',
              width: '1rem',
              backgroundColor: 'green',
              position: 'absolute',
              top: '0.75rem'
            }}
          />
        </div>
      );

    case 'vertical_stripes':
      return (
        <div
          style={{
            border: '2px solid black',
            borderRadius: '1rem',
            height: '1rem',
            width: '1rem',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'blue'
          }}
        >
          <div
            style={{
              height: '1rem',
              width: '0.33rem',
              backgroundColor: 'yellow',
              position: 'absolute',
              right: '0.33rem'
            }}
          />
        </div>
      );

    case 'two_vertical_stripes':
      return (
        <div
          style={{
            border: '2px solid black',
            borderRadius: '1rem',
            height: '1rem',
            width: '1rem',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'white'
          }}
        >
          <div
            style={{
              height: '1rem',
              width: '0.5rem',
              backgroundColor: 'red',
              position: 'absolute',
              right: '0rem'
            }}
          />
        </div>
      );

    case 'two_horizontal_stripes':
      return (
        <div
          style={{
            border: '2px solid black',
            borderRadius: '1rem',
            height: '1rem',
            width: '1rem',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'white'
          }}
        >
          <div
            style={{
              height: '0.5rem',
              width: '1rem',
              backgroundColor: 'red',
              position: 'absolute',
              top: '0rem'
            }}
          />
        </div>
      );

    case 'diagonal_stripes':
      return (
        <div
          style={{
            border: '2px solid black',
            borderRadius: '1rem',
            height: '1rem',
            width: '1rem',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'blue'
          }}
        >
          <div
            style={{
              height: '0.35rem',
              width: '1.3rem',
              backgroundColor: 'yellow',
              position: 'absolute',
              top: '0.35rem',
              transform: 'rotate(45deg)',
              right: ' -0.2rem'
            }}
          />
        </div>
      );
    case 'contains_moon':
      return <FaMoon />;
    case 'contains_sun':
      return <FaSun />;
    case 'yellow_stars':
      return (
        <FaStar
          style={{ color: 'yellow', stroke: 'black', strokeWidth: '50px' }}
        />
      );
    case 'black_star':
      return <FaStar />;
    case 'bordered':
      return <RiRectangleLine />;
    case 'contains_canton':
      return <TbBoxAlignTopLeftFilled />;
    case 'contains_cross':
      return <FaCross />;
    case 'contains_headwear':
      return <FaCrown />;
    case 'contains_animal':
      return <FaKiwiBird />;
    case 'contains_coat_of_arms':
      return <FaShieldHeart />;
    case 'contains_plant':
      return <RiPlantFill />;
    case 'contains_weapon':
      return <FaGun />;
    case 'contains_tool':
      return <FaTools />;
    case 'contains_human':
      return <FaPerson />;
    case 'contains_building':
      return <FaBuilding />;
    case 'contains_writing':
      return <FaPen />;
    case 'centered_emblem':
      return <TbFocusCentered />;
    case 'moon_and_stars':
      return <FaStarAndCrescent />;
    case 'one_star':
      return <FaStarHalfAlt />;
  }
}
