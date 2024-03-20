const getForwardPointsSet = ({ count, countUp, oneStep, y0, z0, S, xInit, kY}) => [
  [
    //left
    //{ x: 2 * oneStep, y: y0, z: z0, count: 30 },
    { x: oneStep, y: y0, z: z0, count },
    { x: xInit, y: y0, z: z0, count },
    { x: oneStep, y: y0 + kY, z: z0, count: countUp },
    { x: S, y: y0, z: z0, count: count - countUp },
    { x: 2 * oneStep, y: y0, z: z0, count }, //
  ],
  [
    //right
    //{ x: xInit, y: y0, z: z0, count: 30 },
    { x: oneStep, y: y0 + kY, z: z0, count: countUp },
    { x: S, y: y0, z: z0, count: count - countUp },
    { x: 2 * oneStep, y: y0, z: z0, count },
    { x: oneStep, y: y0, z: z0, count },
    { x: xInit, y: y0, z: z0, count }, //
  ],
  [
    //left back
    //{ x: 2 * oneStep, y: y0, z: z0, count: 30 },
    { x: S, y: y0, z: z0, count },
    { x: oneStep, y: y0 + kY, z: z0, count: countUp },
    { x: xInit, y: y0, z: z0, count: count - countUp },
    { x: oneStep, y: y0, z: z0, count },
    { x: 2 * oneStep, y: y0, z: z0, count }, //
  ],
  [
    //right back
    //{ x: xInit, y: y0, z: z0, count: 20 },
    { x: oneStep, y: y0, z: z0, count },
    { x: 2 * oneStep, y: y0, z: z0, count },
    { x: S, y: y0, z: z0, count },
    { x: oneStep, y: y0 + kY, z: z0, count: countUp },
    { x: xInit, y: y0, z: z0, count: count - countUp }, //
  ],
];

module.exports = {
  getForwardPointsSet,
};
