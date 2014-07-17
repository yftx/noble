var mongo;

if (process.env.VCAP_SERVICES) {
  var env = JSON.parse(process.env.VCAP_SERVICES);
  mongo = env['mongodb-1.8'][0]['credentials'];
} else {
  mongo = {
    "hostname": "localhost",
    "host": "localhost",
    "port": 27017,
    "username": "",
    "password": "",
    "name": "",
    "db": "noble"
  }
} 

mongo.cookieSecret = 'noble';

module.exports = mongo;