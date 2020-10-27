/**
 * Pads a number adding 0s at left
 * @param {number} number number to pad
 * @param {number} length length to obtain
 * @returns {string} padded string
 */
const pad = (number: number, length: number): string => {
  let str = `${number}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
}

/**
 * Gets the current date in YYYYMMDDhhmmss format
 */
const getDateString = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear().toString();
  const MM = pad(now.getMonth() + 1, 2);
  const dd = pad(now.getDate(), 2);
  const hh = pad(now.getHours(), 2);
  const mm = pad(now.getMinutes(), 2)
  const ss = pad(now.getSeconds(), 2)
  return yyyy + MM + dd + hh + mm + ss;
};

export default getDateString;