import { useRef, useState } from 'react';
import { capitalise, removeSnakeCase } from '@utils/removeSnakeCase';
import { FlexDiv } from '../FlexDiv';
import { ListItem } from '../List/ListItem';
import { Text } from '../Text';
import styles from './styles.module.scss';
import { Chip } from '../Chip';
import { CharacteristicIcon } from '@components/Flags/CharacteristicIcon';

interface Props {
  items: { name: string; type: string }[];
  selectedItems: string[];
  name: string;
  onRemove: (index: number) => void;
  onSelect: (name: string) => void;
  label: string;
}

export const MultiSelect = ({
  items,
  name,
  selectedItems,
  onRemove,
  onSelect,
  label
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayItems, setDisplayItems] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <FlexDiv className={styles.container}>
        <div
          className={styles.combobox}
          onClick={() => {
            setDisplayItems(true);
          }}
        >
          {selectedItems.map((item, index) => (
            <Chip removable key={item} handleRemove={() => onRemove(index)}>
              <Text fontSize="small">{capitalise(removeSnakeCase(item))}</Text>
            </Chip>
          ))}
        </div>
        <input
          name={name}
          ref={inputRef}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
          onClick={() => {
            setDisplayItems(true);
          }}
          className={styles.input}
        />
        <fieldset
          className={`${styles.fieldset} ${displayItems ? styles.active : ''}`}
        >
          <legend>
            <Text fontSize="small">{label}</Text>
          </legend>
        </fieldset>
        <div
          className={`${styles.listContainer}  ${
            displayItems ? styles.displayedList : styles.hiddenList
          }`}
        >
          <ul className={`${styles.list}`}>
            {items
              .filter(
                (item) =>
                  removeSnakeCase(item.name.toLowerCase()).includes(
                    inputValue.toLowerCase()
                  ) ||
                  item.type.toLowerCase().includes(inputValue.toLowerCase())
              )
              .map((item) => {
                const isSelected = selectedItems.find((i) => i === item.name);
                const selectedIndex = selectedItems.findIndex(
                  (i) => i === item.name
                );

                return (
                  <ListItem
                    key={`select-list-item-${item.name}`}
                    className={isSelected ? styles.selectedListItem : ''}
                    clickable
                    handleClick={
                      isSelected
                        ? () => onRemove(selectedIndex)
                        : () => {
                            onSelect(item.name);
                            inputRef?.current?.focus();
                            setInputValue('');
                          }
                    }
                    content={
                      <FlexDiv justifyContent="spaceBetween">
                        <FlexDiv alignItems="center">
                          <div className={styles.iconContainer}>
                            <CharacteristicIcon
                              characteristic={item.name}
                              type={item.type}
                            />
                          </div>
                          <Text>{capitalise(removeSnakeCase(item.name))}</Text>
                        </FlexDiv>
                        <Chip>
                          <Text fontSize="small">
                            {capitalise(removeSnakeCase(item.type))}
                          </Text>
                        </Chip>
                      </FlexDiv>
                    }
                  />
                );
              })}
          </ul>
        </div>
      </FlexDiv>
      {displayItems && (
        <div
          onClick={() => setDisplayItems(false)}
          className={styles.background}
        />
      )}
    </>
  );
};
