// Raspberry Pi model B/B+ are slow, they need a longer timeout
module.exports.orm = {
  _hookTimeout: 240000,
  skipProductionWarnings:true
};