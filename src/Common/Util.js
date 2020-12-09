/**
 * Cleanse entered url
 * @param {*} raw - url to be cleansed
 * @return {string} - cleansed url
 */
export function cleanseUrl(raw) {
  let cleansed = raw;
  if (raw.indexOf('//') === 0) {
    cleansed = location.protocol + cleansed;
  } else {
    const matched = cleansed.match(/https*:\/\//);
    if (!matched || matched.index !== 0) {
      cleansed = 'https://' + cleansed;
    }
  }

  return cleansed.replace(/\/+$/, '');
}
