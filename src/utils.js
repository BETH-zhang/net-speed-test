const log = console.log.bind(console);
// const log = () => {}

function convertBytesToMbps(bytes) {
  const KB = bytes / 1000;
  const MB = KB / 1000;
  const Mb = MB * 8;
  return Mb;
}

function convertBytesToKb(bytes) {
  const KB = bytes / 1000;
  return KB
}

function convertMbpsToKb(mbps) {
  return mbps * 1024 / 8
}

function convertBytes(bytes) {
  return bytes
}

function convertMillisecondToSecond(ms) {
  return ms / 1000
}

/**
 * 计算网速 kb / s
 * @param {number} size 
 * @param {number} start 
 * @param {number} end 
 * @returns number
 */
function calculateSpeed(size, start, end) {
  log('calculateSpeed: ', size, end - start)
  return Math.floor(size / convertMillisecondToSecond(end - start))
}

function getNewUrl(url) {
  return `${url}?t=${new Date().getTime()}`
}

module.exports = {
  convertBytesToMbps,
  convertMbpsToKb,
  convertBytes,
  calculateSpeed,
  convertMillisecondToSecond,
  convertBytesToKb,
  getNewUrl,
}