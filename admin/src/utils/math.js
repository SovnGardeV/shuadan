/**
 * @param {int} 除法
 * @returns {string}
 */
const division = (data) => {
  if (!data) return 0
  return (data / 100).toFixed(2)
}

export default {
  division
}
