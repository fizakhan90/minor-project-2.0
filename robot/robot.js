const { controllerArm } = require("./controllers/controller_arm");

const robotController = {
  state: {},
  init() {
    this.controllerArm = controllerArm;
    return this.controllerArm.init();
  },
  serverConnected() {},
  serverDisconnected() {},
  send(msg) {
    const { controllerId, id } = msg;
    switch (controllerId) {
      case "ARM":
        this.controllerArm.send({ id });
        return;
      default:
        return;
    }
  },
};

module.exports = {
  robotController,
};
