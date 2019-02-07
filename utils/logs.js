// Rotating file stream name generator
function pad(num) {
  return (num > 9 ? '' : '0') + num;
}

module.exports.generator = (time, index) => {
  if (!time) return 'file.log';

  const month = time.getFullYear() + '' + pad(time.getMonth() + 1);
  const day = pad(time.getDate());
  const hour = pad(time.getHours());
  const minute = pad(time.getMinutes());

  return (
    month + '/' + month + day + '-' + hour + minute + '-' + index + '-file.log'
  );
};
