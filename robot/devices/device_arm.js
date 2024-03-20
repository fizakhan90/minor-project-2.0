const i2c = require("i2c-bus");
const { msleep } = require("usleep");

const ADDR = 0x40;

const MIN = 102;
const MAX = 491;

const mapping = (angle, max = MAX, min = MIN) => {
  return Math.ceil(((max - min) * angle) / 180 + min);
};

const IDS = ["sendMessage"];

const messagesIdsMap = {
  serverConnected: "serverConnected",
  serverDisconnected: "serverDisconnected",
  initUser: "initUser",
  sendMessage: "sendMessage",
};

const deviceArm = {
  id: "DEVICE_ARM_I2C",
  messagesIdsMap,
  async initDevice(args) {
    try {
      this.i2c0 = i2c.openSync(1);
      this.i2c0.writeByte(ADDR, 0x00, 0x00, cb);
      //Reset
      this.i2c0.writeByte(ADDR, 0x00, 0x01, cb);
      this.i2c0.writeByte(ADDR, 0x01, 0x04, cb);

      this.i2c0.writeByte(ADDR, 253, 16, cb);
      //Set Hz = 50, pre=scale = 121
      this.i2c0.writeByte(ADDR, 0x00, 0x17, cb);
      this.i2c0.writeByte(ADDR, 254, 121, cb); //121
      this.i2c0.writeByte(ADDR, 0x00, 0x01, cb);
      await msleep(1);
      this.i2c0.writeByte(ADDR, 0, 129, cb);
      await msleep(10);
      console.log("init arm!");
    } catch (e) {
      return false;
    }

    return true;
  },
  sendMessage(msg) {
    const { id, body } = msg;

    switch (id) {
      case messagesIdsMap.sendMessage:
        const { channel, width: baseWidth } = body;
        const width = baseWidth >= 0 ? (baseWidth <= 180 ? baseWidth : 180) : 0;
        const value = mapping(width);
        const BASE_CHANNEL = 0x06;

        const buff = [channel * 4 + BASE_CHANNEL, 0 & 0xff];
        const buff_1 = [channel * 4 + BASE_CHANNEL + 1, (0 >> 8) & 0x0f];
        const buff_2 = [channel * 4 + BASE_CHANNEL + 2, value & 0xff];
        const buff_3 = [channel * 4 + BASE_CHANNEL + 3, (value >> 8) & 0x0f];

        this.i2c0.writeByte(ADDR, buff[0], buff[1], cb);
        this.i2c0.writeByte(ADDR, buff_1[0], buff_1[1], cb);
        this.i2c0.writeByte(ADDR, buff_2[0], buff_2[1], cb);
        this.i2c0.writeByte(ADDR, buff_3[0], buff_3[1], cb);

        return;
    }
  },
};

module.exports = {
  deviceArm,
};
