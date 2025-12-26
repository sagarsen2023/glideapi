/**
 * Converts a string to UpperCamelCase (PascalCase) format
 * @param str - The string to convert
 * @param separator - The separator used in the string (default: "-")
 * @returns The UpperCamelCase string
 */
export const upperCamelCase = ({
  str,
  separator = "-",
}: {
  str: string;
  separator?: string;
}): string => {
  return str
    .split(separator)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

export default upperCamelCase;
