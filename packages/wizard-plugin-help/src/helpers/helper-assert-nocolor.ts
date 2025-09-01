/**
 * @description
 * Assert no color.
 *
 * @param noColor - The no color.
 * @param newNoColor - The new no color.
 * @returns The no color.
 */
export const assertNoColor = (
  noColor: boolean,
  newNoColor?: boolean
): boolean => {
  if (newNoColor === undefined) {
    return noColor;
  }
  return newNoColor ? true : false;
};
