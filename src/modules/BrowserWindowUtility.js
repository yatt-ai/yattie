module.exports.setBrowserWindow = (browserWindow) => {
  this._browserWindow = browserWindow;
};

module.exports.getBrowserWindow = () => {
  return this._browserWindow;
};
