const { Arm } = require("../models/arm");
const {
  getForwardPointsSet,
  getStandUpPointsSet,
  getToDownPointsSet,
  getTurnPointsSet,
} = require("../utils");
const { deviceArm } = require("../devices/device_arm");

// Dimensions
const A = 90;
const B = 53;
const C = 43;

const sendMessage = ({ id, width }) =>
  deviceArm.sendMessage({ id: "sendMessage", body: { channel: id, width } });

// Settings
let step = 1; //1 mm per time
let speed = 20;
let S = 100; //mm
let y0 = -80; //mm
let z0 = 60; //mm
let kY = 30; //mm
let count = 15;
let countUp = 6;
let interval = null;
let alpha = 11;

const oneStep = S / 3;
const xInit = 5;

const controllerArm = {
  // Create instances of legs(arms)
  async init() {
    await deviceArm.initDevice();
    this.leftArm = new Arm({
      chA: 0,
      chB: 1,
      chC: 2,
      sendMessage: sendMessage,
      invert: true,
      A,
      B,
      C,
      a: 0,
      b: 0,
      c: 0,
    });

    this.rightArm = new Arm({
      chA: 4,
      chB: 5,
      chC: 6,
      sendMessage: sendMessage,
      invertX: true,
      A,
      B,
      C,
      a: 0,
      b: 0,
      c: 0,
    });

    this.leftArmBack = new Arm({
      chA: 8,
      chB: 9,
      chC: 10,
      sendMessage: sendMessage,
      invertX: true,
      A,
      B,
      C,
      a: 0,
      b: 0,
      c: 0,
    });

    this.rightArmBack = new Arm({
      chA: 12,
      chB: 13,
      chC: 14,
      sendMessage: sendMessage,
      invert: true,
      A,
      B,
      C,
      a: 0,
      b: 0,
      c: 0,
    });
  },
  setPositionsForLeg(pointSet) {
    const currentPointsNumber = [0, 0, 0, 0];
    const maxPositionsNumber = [
      pointSet[0].length,
      pointSet[1].length,
      pointSet[2].length,
      pointSet[3].length,
    ];
    this.leftArm.setPosition(pointSet[0][currentPointsNumber[0]]);
    this.rightArm.setPosition(pointSet[1][currentPointsNumber[1]]);
    this.leftArmBack.setPosition(pointSet[2][currentPointsNumber[2]]);
    this.rightArmBack.setPosition(pointSet[3][currentPointsNumber[3]]);

    return () => {
      const statuses = [
        this.leftArm.next(),
        this.rightArm.next(),
        this.leftArmBack.next(),
        this.rightArmBack.next(),
      ];
      // If status === true set next point for leg
      statuses[0] &&
        this.leftArm.setPosition(pointSet[0][currentPointsNumber[0]]);
      statuses[1] &&
        this.rightArm.setPosition(pointSet[1][currentPointsNumber[1]]);
      statuses[2] &&
        this.leftArmBack.setPosition(pointSet[2][currentPointsNumber[2]]);
      statuses[3] &&
        this.rightArmBack.setPosition(pointSet[3][currentPointsNumber[3]]);

      for (let i = 0; i < 4; i++) {
        if (statuses[i]) {
          currentPointsNumber[i] += 1;
        }
        if (currentPointsNumber[i] === maxPositionsNumber[i]) {
          currentPointsNumber[i] = 0;
        }
      }
    };
  },
  setPositionsForLegSync(pointSet, readyCallback) {
    let currentPointsNumber = 0;
    const maxPositionsNumber = pointSet[0].length;
    this.leftArm.setPosition(pointSet[0][currentPointsNumber]);
    this.rightArm.setPosition(pointSet[1][currentPointsNumber]);
    this.leftArmBack.setPosition(pointSet[2][currentPointsNumber]);
    this.rightArmBack.setPosition(pointSet[3][currentPointsNumber]);
    return () => {
      const statuses = [
        this.leftArm.next(),
        this.rightArm.next(),
        this.leftArmBack.next(),
        this.rightArmBack.next(),
      ];
      // If status === true set next point for leg
      const isReady = statuses.every((s) => s);
      if (isReady) {
        currentPointsNumber += 1;
        if (currentPointsNumber === maxPositionsNumber) {
          currentPointsNumber = 0;
          readyCallback();
          return;
        }
        this.leftArm.setPosition(pointSet[0][currentPointsNumber]);
        this.rightArm.setPosition(pointSet[1][currentPointsNumber]);
        this.leftArmBack.setPosition(pointSet[2][currentPointsNumber]);
        this.rightArmBack.setPosition(pointSet[3][currentPointsNumber]);
      }
    };
  },
  send(msg) {
    const { id } = msg;
    console.log(msg);
    switch (id) {
      case "position_stop":
        interval && clearInterval(interval);
        return;
      case "go_step_up":
        interval && clearInterval(interval);
        const points = getForwardPointsSet({
          count,
          countUp,
          oneStep,
          y0,
          z0,
          S,
          xInit,
          kY,
        });
        const func = this.setPositionsForLeg(points);

        interval = setInterval(func, speed);
        return;
      case "go_step_down":
        return;
      case "position_up":
        {
          interval && clearInterval(interval);
          const points = getStandUpPointsSet({
            count,
            oneStep: 2 * oneStep,
            y0,
            z0,
          });
          const cb = () => clearInterval(interval);
          const funcUp = this.setPositionsForLegSync(points, cb);

          interval = setInterval(funcUp, speed);
        }
        return;
      case "position_down":
        {
          interval && clearInterval(interval);
          const points = getToDownPointsSet({
            count,
            oneStep: 2 * oneStep,
            y0: 20,
            z0,
          });
          const cb = () => clearInterval(interval);
          const funcDown = this.setPositionsForLegSync(points, cb);

          interval = setInterval(funcDown, speed);
        }
        return;
      case "turn_right":
        {
          interval && clearInterval(interval);
          const points = getTurnPointsSet({
            count,
            countUp,
            oneStep,
            y0,
            z0,
            S,
            xInit,
            kY,
            alpha,
          });
          const func = this.setPositionsForLeg(points);

          interval = setInterval(func, speed);
        }
        return;
      case "turn_left":
        {
          interval && clearInterval(interval);
          const points = getTurnPointsSet({
            count,
            countUp,
            oneStep,
            y0,
            z0,
            S,
            xInit,
            kY,
            alpha,
          });
          const newPoints = [points[1], points[0], points[3], points[2]];
          const func = this.setPositionsForLeg(newPoints);

          interval = setInterval(func, speed);
        }
        return;
    }
  },
};

module.exports = {
  controllerArm,
};
