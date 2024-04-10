const Mpu9250 = require("./gyro/mpu9250");

const mpu = new Mpu9250({});

if (mpu.initialize()) {
  console.log("!gyro!");
  const values = mpu.getMotion9();
  const pitch = mpu.getPitch(values);
  const roll = mpu.getRoll(values);
  const yaw = mpu.getYaw(values);
  console.log("pitch value : ", pitch);
  console.log("roll value : ", roll);
  console.log("yaw value : ", yaw);
} else {
  console.log("!no gyro!");
}
