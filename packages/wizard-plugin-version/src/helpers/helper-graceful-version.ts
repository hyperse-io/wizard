/**
 * @description
 * Gracefully handle the version string.
 *
 * @param v - The version string.
 * @returns The gracefully handled version string.
 */
export const gracefulVersion = (v: string) =>
  v.length === 0 ? '' : v.startsWith('v') ? v : `v${v}`;
