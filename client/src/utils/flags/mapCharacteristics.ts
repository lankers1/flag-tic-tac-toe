import { Characteristic } from "@type-defs/flag";


export function mapCharacteristics(characteristics: Characteristic[]) {
  return characteristics?.reduce<Record<string, string[]>>(
    (acc, characteristic) => {
      if (characteristic.type === 'color') {
        acc['colors'] = [
          ...(acc['colors'] || []),
          characteristic.name.slice(9)
        ];
      }
      if (characteristic.type === 'symmetry') {
        acc['symmetry'] = [...(acc['symmetry'] || []), characteristic.name];
      }
      if (characteristic.type === 'main_color') {
        acc['main_color'] = [...(acc['main_color'] || []), characteristic.name];
      }
      if (characteristic.type === 'region') {
        acc['region'] = [...(acc['region'] || []), characteristic.name];
      }
      if (characteristic.type === 'shapes') {
        acc['shapes'] = [...(acc['shapes'] || []), characteristic.name];
      }
      if (characteristic.type === 'object') {
        acc['object'] = [...(acc['object'] || []), characteristic.name];
      }
      if (
        characteristic.type === 'astronomical' &&
        characteristic.name !== 'moon_and_stars' &&
        characteristic.name !== 'stars_and_stripes' &&
        characteristic.name !== 'contains_stars'
      ) {
        acc['astronomical'] = [
          ...(acc['astronomical'] || []),
          characteristic.name
        ];
      }
      return acc;
    },
    {}
  );
}
