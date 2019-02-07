const fs = require('fs');

module.exports = () => ({
  key: fs.readFileSync('/etc/letsencrypt/live/tupolev.io/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tupolev.io/cert.pem', 'utf8'),
});