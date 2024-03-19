const { Arm } = require("../models/arm");
const { getForwardPointsSet } = require("../utils");

// Dimensions
const A = 94;
const B = 53;
const C = 43;

const sendMessage = (m) => {};

// Settings
let step = 1; //1 mm per time
let speed = 30;
let S = 120; //mm
let y0 = -90; //mm
let z0 = 50; //mm
let kY = 30; //mm

let interval = null;

const oneStep = (2 * S) / 3;
const xInit = 5;

const controllerArm = {
  // Create instances of legs(arms)
  init() {
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
    // this.leftArm.setPosition(pointSet[0][currentPointsNumber[0]]);
    // this.rightArm.setPosition(pointSet[1][currentPointsNumber[1]]);
    // this.leftArmBack.setPosition(pointSet[2][currentPointsNumber[2]]);
    // this.rightArmBack.setPosition(pointSet[3][currentPointsNumber[3]]);

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

  send(msg) {
    const { id } = msg;
    switch (id) {
      case "position_stop":
        interval && clearInterval(interval);
        return;
      case "go_step_up":
        interval && clearInterval(interval);
        const points = getForwardPointsSet({ oneStep, y0, z0, S, xInit, kY });
        const func = this.setPositionsForLeg(points);

        interval = setInterval(func, speed);
        return;
      case "go_step_down":
        return;
    }
  },
};

module.exports = {
  controllerArm,
};
