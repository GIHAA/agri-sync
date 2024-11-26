export function toTitleCase(inputString : string, delimiter = '_') {
    return inputString
      .split(delimiter)
      .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase())
      .join(' ');
}
  