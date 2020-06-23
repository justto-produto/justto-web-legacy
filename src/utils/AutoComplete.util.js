/**
 * `querySearch` is a void function that filters search items.
 * @returns {void} execute a callback function that receives search result.
 * @param {Array} searchItems An any array with result items
 * @param {string} queryString Search term for filter search searchItems
 * @param {Function} filter Filter function
 * @param {Function} callback A callback function that receives search result
 */
export const querySearch = (searchItems, queryString, filter, callback) => {
  const result = queryString
    ? searchItems.filter(filter)
    : searchItems

  return callback(result)
}
