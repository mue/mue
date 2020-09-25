/**
 * Merges 2 objects into a huge one
 * @template T The original object
 * @template U The object that is returned
 * @param {...T} items The objects to merge
 * @returns {U} The merged object
 */
export const merge = (...items) => {
  const obj = {};
  for (let i = 0; i < items.length; i++) {
    for (const k in items[i]) {
      if (!obj.hasOwnProperty(k)) obj[k] = items[i][k];
    }
  }

  return obj;
};