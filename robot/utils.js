const getForwardPointsSet = ({
  count,
  countUp,
  oneStep,
  y0,
  z0,
  S,
  xInit,
  kY,
}) => [
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

const getStandUpPointsSet = ({ oneStep, y0, z0, count }) => [
  [
    //left
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: y0, z: z0, count },
  ],
  [
    //right
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: y0, z: z0, count },
  ],
  [
    //left back
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: y0, z: z0, count },
  ],
  [
    //right back
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: y0, z: z0, count },
  ],
];

const getToDownPointsSet = ({ oneStep, y0, z0, count }) => [
  [
    //left
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: y0, z: z0, count }, //y0=20
    { x: oneStep, y: y0, z: 0, count },
  ],
  [
    //right
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: y0, z: z0, count },
    { x: oneStep, y: y0, z: 0, count },
  ],
  [
    //left back
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: y0, z: z0, count },
    { x: oneStep, y: y0, z: 0, count },
  ],
  [
    //right back
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: 0, z: z0, count },
    { x: oneStep, y: y0, z: z0, count },
    { x: oneStep, y: y0, z: 0, count },
  ],
];

const getTurnPointsSet = ({
  count,
  countUp,
  oneStep,
  y0,
  z0,
  S,
  xInit,
  kY,
  alpha,
}) => {
  const getX = (a) =>
    2 * oneStep * Math.cos((a / 180) * Math.PI) -
    z0 * Math.sin((a / 180) * Math.PI);
  const getZ = (a) =>
    2 * oneStep * Math.sin((a / 180) * Math.PI) +
    z0 * Math.cos((a / 180) * Math.PI);

  return [
    [
      //left
      { x: getX(-alpha * 3), y: y0, z: getZ(-alpha * 3), count },
      { x: getX(-alpha * 2), y: y0, z: getZ(-alpha * 2), count },
      { x: getX(-alpha), y: y0, z: getZ(-alpha), count },
      { x: getX(-alpha * 4), y: y0 + kY, z: getZ(-alpha * 4), count: countUp },
      {
        x: getX(-alpha * 4),
        y: y0,
        z: getZ(-alpha * 4),
        count: count - countUp,
      },
    ],
    [
      //right
      { x: getX(alpha * 4), y: y0 + kY, z: getZ(alpha * 4), count: countUp },
      { x: getX(alpha * 4), y: y0, z: getZ(alpha * 4), count: count - countUp },
      { x: getX(alpha * 3), y: y0, z: getZ(alpha * 3), count },
      { x: getX(alpha * 2), y: y0, z: getZ(alpha * 2), count },
      { x: getX(alpha), y: y0, z: getZ(alpha), count },
    ],
    [
      //left back
      { x: getX(alpha * 2), y: y0, z: getZ(alpha * 2), count },
      { x: getX(alpha), y: y0, z: getZ(alpha), count },
      { x: getX(alpha * 4), y: y0 + kY, z: getZ(alpha * 4), count: countUp },
      { x: getX(alpha * 4), y: y0, z: getZ(alpha * 4), count: count - countUp },
      { x: getX(alpha * 3), y: y0, z: getZ(alpha * 3), count },
    ],
    [
      //right back///ch
      { x: getX(-alpha), y: y0, z: getZ(-alpha), count },
      { x: getX(-alpha * 4), y: y0 + kY, z: getZ(-alpha * 4), count: countUp },
      {
        x: getX(-alpha * 4),
        y: y0,
        z: getZ(-alpha * 4),
        count: count - countUp,
      },
      { x: getX(-alpha * 3), y: y0, z: getZ(-alpha * 3), count },
      { x: getX(-alpha * 2), y: y0, z: getZ(-alpha * 2), count },
    ],
  ];
};

module.exports = {
  getForwardPointsSet,
  getStandUpPointsSet,
  getToDownPointsSet,
  getTurnPointsSet,
};
