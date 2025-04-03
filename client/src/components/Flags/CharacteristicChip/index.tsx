import { FlexDiv } from '@components/common/FlexDiv';
import { Text } from '@components/common/Text';
import { capitaliseFirst } from '@utils/capitaliseFirst';
import { removeSnakeCase } from '@utils/removeSnakeCase';
import { Chip } from '@components/common/Chip';
import { CharacteristicIcon } from '@components/Flags/CharacteristicIcon';

import styles from './styles.module.scss';

interface RenderChipProps {
  chipType: string;
  chars: string[];
}

export const CharacteristicChip = ({ chipType, chars }: RenderChipProps) => {
  switch (chipType) {
    case 'colors':
      return (
        <Chip>
          <FlexDiv alignItems="center" className={styles.chipContainer}>
            <Text fontSize="small">{capitaliseFirst(chipType)}</Text>
            <div
              className={styles.colorWrapper}
              style={{
                width: `${12 + 8 * chars.length}px`
              }}
            >
              {chars?.map((color, i) => (
                <div
                  key={`${chipType}-${color}-${i}`}
                  className={styles.colorIcon}
                  style={{
                    backgroundColor: color,
                    right: `${i * 8}px`
                  }}
                />
              ))}
            </div>
          </FlexDiv>
        </Chip>
      );
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
    default:
      return chars.map((char, i) => (
        <Chip key={`${chipType}-${i}`}>
          <FlexDiv alignItems="center" className={styles.chipContainer}>
            <CharacteristicIcon type={chipType} characteristic={char} />
            <Text fontSize="small">
              {capitaliseFirst(removeSnakeCase(char))}
            </Text>
          </FlexDiv>
        </Chip>
      ));
  }
};
