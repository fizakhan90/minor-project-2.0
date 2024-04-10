const Mpu9250 = require("./gyro/mpu9250");

const mpu = new Mpu9250({ device: 1 });
console.log('test gyro!');
if (mpu.initialize()) {
  console.log("!gyro!");
  setInterval(() => {
  	const values = mpu.getMotion9();
  	const pitch = mpu.getPitch(values);
  	const roll = mpu.getRoll(values);
  	const yaw = mpu.getYaw(values);
  	console.log("value : ", Math.round(pitch*1)/1, Math.round(roll*1)/1, yaw);;
  	//console.log("roll value : ", roll);
  	//console.log("yaw value : ", yaw);
	}, 30);
} else {
  console.log("!no gyro!");
}
