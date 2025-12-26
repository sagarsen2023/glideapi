/**
 * Converts a string to camelCase format
 * @param str - The string to convert
 * @param separator - The separator used in the string (default: "-")
 * @returns The camelCase string
 */
export const textToCamelCase = ({
  str,
  separator = "-",
}: {
  str: string;
  separator?: string;
}): string => {
  return str
    .split(separator)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

export default textToCamelCase;
