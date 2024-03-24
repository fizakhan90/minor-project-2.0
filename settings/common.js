const PcaDriver = require("pca9685").Pca9685Driver;
const i2cbus = require('i2c-bus');

const MIN = 500; //for MG92B//for MG90 use 500
const MAX = 2400; //for MG92B//for MG90 use 2600

const options = {
  i2c: i2cbus.openSync(1),
  address: 0x40,
  frequency: 50,
  debug: true,
};

const setZeroAnglesToLeg = (a, b, c, isFront, isLeft) => {
  const pwm = new PcaDriver(options, (err) => {
    const alpha = (isFront && isLeft) || (!isFront && !isLeft) ? 0 : 180; 
    const betta = (isFront && isLeft) || (!isFront && !isLeft) ? 180 : 0;
    const gamma = (isFront && isLeft) || (!isFront && !isLeft) ? 0 : 180;
    pwm.setPulseLength(a, Math.round((alpha * (MAX - MIN)) / 180 + MIN));
    pwm.setPulseLength(b, Math.round((betta * (MAX - MIN)) / 180 + MIN));
    pwm.setPulseLength(c, Math.round((gamma * (MAX - MIN)) / 180 + MIN));
  });
};

module.exports = {
  setZeroAnglesToLeg,
};
