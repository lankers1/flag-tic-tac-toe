export const removeSnakeCase = (str: string) => str.split('_').join(' ');
export const capitalise = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
