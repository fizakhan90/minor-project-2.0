const getForwardPointsSet = ({ oneStep, y0, z0, S, xInit, kY}) => [
  [
    //left
    //{ x: 2 * oneStep, y: y0, z: z0, count: 30 },
    { x: oneStep, y: y0, z: z0, count: 30 },
    { x: xInit, y: y0, z: z0, count: 30 },
    { x: oneStep, y: y0 + kY, z: z0, count: 10 },
    { x: S, y: y0, z: z0, count: 20 },
    { x: 2 * oneStep, y: y0, z: z0, count: 30 }, //
  ],
  [
    //right
    //{ x: xInit, y: y0, z: z0, count: 30 },
    { x: oneStep, y: y0 + kY, z: z0, count: 10 },
    { x: S, y: y0, z: z0, count: 20 },
    { x: 2 * oneStep, y: y0, z: z0, count: 30 },
    { x: oneStep, y: y0, z: z0, count: 30 },
    { x: xInit, y: y0, z: z0, count: 30 }, //
  ],
  [
    //left back
    //{ x: 2 * oneStep, y: y0, z: z0, count: 30 },
    { x: S, y: y0, z: z0, count: 30 },
    { x: oneStep, y: y0 + kY, z: z0, count: 10 },
    { x: xInit, y: y0, z: z0, count: 20 },
    { x: oneStep, y: y0, z: z0, count: 30 },
    { x: 2 * oneStep, y: y0, z: z0, count: 30 }, //
  ],
  [
    //right back
    //{ x: xInit, y: y0, z: z0, count: 20 },
    { x: oneStep, y: y0, z: z0, count: 30 },
    { x: 2 * oneStep, y: y0, z: z0, count: 30 },
    { x: S, y: y0, z: z0, count: 30 },
    { x: oneStep, y: y0 + kY, z: z0, count: 10 },
    { x: xInit, y: y0, z: z0, count: 20 }, //
  ],
];

module.exports = {
  getForwardPointsSet,
};
