/**
 *
 * NodeJs Module : MPU9250
 * @description Simple reading data for node js and mpu9250
 * @dependent extend, sleep
 * @license MIT
 *
 */

///////////////////////////////////////////////////////////////////////////////////////
//***********************************************************************************//
//**                                                                               **//
//**                                                                               **//
//** The MIT License (MIT)                                                         **//
//**                                                                               **//
//** Copyright (c) <2015> <BENKHADRA Hocine>                                       **//
//**                                                                               **//
//** Permission is hereby granted, free of charge, to any person obtaining a copy  **//
//** of this software and associated documentation files (the "Software"), to deal **//
//** in the Software without restriction, including without limitation the rights  **//
//** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell     **//
//** copies of the Software, and to permit persons to whom the Software is         **//
//** furnished to do so, subject to the following conditions:                      **//
//**                                                                               **//
//** The above copyright notice and this permission notice shall be included in    **//
//** all copies or substantial portions of the Software.                           **//
//**                                                                               **//
//** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR    **//
//** IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,      **//
//** FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE   **//
//** AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER        **//
//** LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, **//
//** OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN     **//
//** THE SOFTWARE.                                                                 **//
//**                                                                               **//
//***********************************************************************************//
///////////////////////////////////////////////////////////////////////////////////////

/*********************/
/** Module required **/
/*********************/
const i2c = require("i2c-bus");
const extend = require("extend");
const sleep = require("sleep");

/*****************/
/** MPU9250 MAP **/
/*****************/
// documentation:
//   https://www.invensense.com/products/motion-tracking/9-axis/mpu-9250/
//   https://www.invensense.com/wp-content/uploads/2015/02/MPU-9250-Datasheet.pdf
//   https://www.invensense.com/wp-content/uploads/2015/02/MPU-9250-Register-Map.pdf

const MPU9250 = {
  ID_MPU_9250: 0x71,
  ID_MPU_9255: 0x73,

  I2C_ADDRESS_AD0_LOW: 0x68,
  I2C_ADDRESS_AD0_HIGH: 0x69,
  WHO_AM_I: 0x75,

  SMPLRT_DIV: 0x19,
  RA_CONFIG: 0x1a,
  RA_GYRO_CONFIG: 0x1b,
  RA_ACCEL_CONFIG_1: 0x1c,
  RA_ACCEL_CONFIG_2: 0x1d,

  RA_INT_PIN_CFG: 0x37,

  INTCFG_ACTL_BIT: 7,
  INTCFG_OPEN_BIT: 6,
  INTCFG_LATCH_INT_EN_BIT: 5,
  INTCFG_INT_ANYRD_2CLEAR_BIT: 4,
  INTCFG_ACTL_FSYNC_BIT: 3,
  INTCFG_FSYNC_INT_MODE_EN_BIT: 2,
  INTCFG_BYPASS_EN_BIT: 1,
  INTCFG_NONE_BIT: 0,

  // BY_PASS_MODE: 0x02,

  ACCEL_XOUT_H: 0x3b,
  ACCEL_XOUT_L: 0x3c,
  ACCEL_YOUT_H: 0x3d,
  ACCEL_YOUT_L: 0x3e,
  ACCEL_ZOUT_H: 0x3f,
  ACCEL_ZOUT_L: 0x40,
  TEMP_OUT_H: 0x41,
  TEMP_OUT_L: 0x42,
  GYRO_XOUT_H: 0x43,
  GYRO_XOUT_L: 0x44,
  GYRO_YOUT_H: 0x45,
  GYRO_YOUT_L: 0x46,
  GYRO_ZOUT_H: 0x47,
  GYRO_ZOUT_L: 0x48,

  RA_USER_CTRL: 0x6a,
  RA_PWR_MGMT_1: 0x6b,
  RA_PWR_MGMT_2: 0x6c,
  PWR1_DEVICE_RESET_BIT: 7,
  PWR1_SLEEP_BIT: 6,
  PWR1_CYCLE_BIT: 5,
  PWR1_TEMP_DIS_BIT: 3, // (PD_PTAT)
  PWR1_CLKSEL_BIT: 0,
  PWR1_CLKSEL_LENGTH: 3,

  GCONFIG_FS_SEL_BIT: 3,
  GCONFIG_FS_SEL_LENGTH: 2,
  GYRO_FS_250: 0x00,
  GYRO_FS_500: 0x01,
  GYRO_FS_1000: 0x02,
  GYRO_FS_2000: 0x03,
  GYRO_SCALE_FACTOR: [131, 65.5, 32.8, 16.4],

  ACONFIG_FS_SEL_BIT: 3,
  ACONFIG_FS_SEL_LENGTH: 2,
  ACCEL_FS_2: 0x00,
  ACCEL_FS_4: 0x01,
  ACCEL_FS_8: 0x02,
  ACCEL_FS_16: 0x03,
  ACCEL_SCALE_FACTOR: [16384, 8192, 4096, 2048],

  CLOCK_INTERNAL: 0x00,
  CLOCK_PLL_XGYRO: 0x01,
  CLOCK_PLL_YGYRO: 0x02,
  CLOCK_PLL_ZGYRO: 0x03,
  CLOCK_KEEP_RESET: 0x07,
  CLOCK_PLL_EXT32K: 0x04,
  CLOCK_PLL_EXT19M: 0x05,

  I2C_SLV0_DO: 0x63,
  I2C_SLV1_DO: 0x64,
  I2C_SLV2_DO: 0x65,

  USERCTRL_DMP_EN_BIT: 7,
  USERCTRL_FIFO_EN_BIT: 6,
  USERCTRL_I2C_MST_EN_BIT: 5,
  USERCTRL_I2C_IF_DIS_BIT: 4,
  USERCTRL_DMP_RESET_BIT: 3,
  USERCTRL_FIFO_RESET_BIT: 2,
  USERCTRL_I2C_MST_RESET_BIT: 1,
  USERCTRL_SIG_COND_RESET_BIT: 0,

  DEFAULT_GYRO_OFFSET: { x: 0, y: 0, z: 0 },
  DEFAULT_ACCEL_CALIBRATION: {
    offset: { x: 0, y: 0, z: 0 },
    scale: {
      x: [-1, 1],
      y: [-1, 1],
      z: [-1, 1],
    },
  },

  /** For Gyro */
  DLPF_CFG_250HZ: 0x00,
  DLPF_CFG_184HZ: 0x01,
  DLPF_CFG_92HZ: 0x02,
  DLPF_CFG_41HZ: 0x03,
  DLPF_CFG_20HZ: 0x04,
  DLPF_CFG_10HZ: 0x05,
  DLPF_CFG_5HZ: 0x06,
  DLPF_CFG_3600HZ: 0x07,

  /** Sample rate min/max value */
  SAMPLERATE_MIN: 5,
  SAMPLERATE_MAX: 32000,

  /** For accel. */
  A_DLPF_CFG_460HZ: 0x00,
  A_DLPF_CFG_184HZ: 0x01,
  A_DLPF_CFG_92HZ: 0x02,
  A_DLPF_CFG_41HZ: 0x03,
  A_DLPF_CFG_20HZ: 0x04,
  A_DLPF_CFG_10HZ: 0x05,
  A_DLPF_CFG_5HZ: 0x06,
  A_DLPF_CFG_460HZ_2: 0x07,
  A_DLPF_CFG_MASK: 0x07,
};

/****************/
/** AK8963 MAP **/
/****************/
// Technical documentation available here: https://www.akm.com/akm/en/file/datasheet/AK8963C.pdf
const AK8963 = {
  ADDRESS: 0x0c,
  WHO_AM_I: 0x00, // should return 0x48,
  WHO_AM_I_RESPONSE: 0x48,
  INFO: 0x01,
  ST1: 0x02, // data ready status bit 0
  XOUT_L: 0x03, // data
  XOUT_H: 0x04,
  YOUT_L: 0x05,
  YOUT_H: 0x06,
  ZOUT_L: 0x07,
  ZOUT_H: 0x08,
  ST2: 0x09, // Data overflow bit 3 and data read error status bit 2
  CNTL: 0x0a, // Power down (0000), single-measurement (0001), self-test (1000) and Fuse ROM (1111) modes on bits 3:0
  ASTC: 0x0c, // Self test control
  I2CDIS: 0x0f, // I2C disable
  ASAX: 0x10, // Fuse ROM x-axis sensitivity adjustment value
  ASAY: 0x11, // Fuse ROM y-axis sensitivity adjustment value
  ASAZ: 0x12,

  ST1_DRDY_BIT: 0,
  ST1_DOR_BIT: 1,

  CNTL_MODE_OFF: 0x00, // Power-down mode
  CNTL_MODE_SINGLE_MEASURE: 0x01, // Single measurement mode
  CNTL_MODE_CONTINUE_MEASURE_1: 0x02, // Continuous measurement mode 1 - Sensor is measured periodically at 8Hz
  CNTL_MODE_CONTINUE_MEASURE_2: 0x06, // Continuous measurement mode 2 - Sensor is measured periodically at 100Hz
  CNTL_MODE_EXT_TRIG_MEASURE: 0x04, // External trigger measurement mode
  CNTL_MODE_SELF_TEST_MODE: 0x08, // Self-test mode
  CNTL_MODE_FUSE_ROM_ACCESS: 0x0f, // Fuse ROM access mode

  DEFAULT_CALIBRATION: {
    offset: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
};

class LOCAL_I2C {
  constructor(adrs, params) {
    this.i2c = i2c.openSync(params.device);
    this.address = adrs;
  }

  bitMask(bit, length) {
    return ((1 << length) - 1) << bit;
  }
  readBytes(cmd, length, callback) {
    const buff = Buffer.alloc(length);
    this.i2c.readI2cBlockSync(this.address, cmd, length, buff);
    return buff;
  }
  writeBytes(cmd, buffer) {
    console.log(this.address, cmd, buffer);
    const bf = Buffer.from(buffer);
    return this.i2c.writeI2cBlockSync(this.address, cmd, buffer.length, bf);
  }
  readByte(adrs, callback) {
    callback = callback || function () {};
    // wire.readBytes(command, length, function(err, res) {
    // result contains a buffer of bytes })
    const buf = this.readBytes(adrs, 1, callback);
    return buf[0];
  }
  readBit(adrs, bit, callback) {
    const buf = this.readByte(adrs, callback);
    return (buf >> bit) & 1;
  }

  writeBits(adrs, bit, length, value, callback) {
    callback = callback || function () {};
    const oldValue = this.readByte(adrs);
    const mask = this.bitMask(bit, length);
    const newValue = oldValue ^ ((oldValue ^ (value << bit)) & mask);
    // wire.writeBytes(command, [byte0, byte1], function(err) {});
    // bus.i2cWriteSync(adrs, 1, [newValue])
    return this.writeBytes(adrs, [newValue], callback);
  }
  writeBit(adrs, bit, value, callback) {
    return this.writeBits(adrs, bit, 1, value, callback);
  }
}

class DebugConsole {
  constructor(debug) {
    this.enabled = debug || false;
  }
  log(type, str) {
    if (this.enabled) {
      const date = new Date();
      const strdate =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      const strhour = date.getHours() + ":" + date.getMinutes();
      console.log(
        "[" + type.toUpperCase() + "][" + strhour + " " + strdate + "]:" + str
      );
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////
// /** ---------------------------------------------------------------------- **/ //
//  *		 						MPU Configuration						   *  //
// /** ---------------------------------------------------------------------- **/ //
////////////////////////////////////////////////////////////////////////////////////

class Mpu9250 {
  constructor(cfg) {
    const _default = {
      device: 1, //"/dev/i2c-1"
      address: MPU9250.I2C_ADDRESS_AD0_LOW,
      UpMagneto: false,
      DEBUG: false,
      scaleValues: false,
      ak_address: AK8963.ADDRESS,
      GYRO_FS: 0,
      ACCEL_FS: 2,
      gyroBiasOffset: MPU9250.DEFAULT_GYRO_OFFSET,
      accelCalibration: MPU9250.DEFAULT_ACCEL_CALIBRATION,
    };

    this.config = extend({}, _default, cfg);
  }

  initialize() {
    this.i2c = new LOCAL_I2C(this.config.address, {
      device: this.config.device,
    });
    this.debug = new DebugConsole(this.config.DEBUG);
    this.debug.log("INFO", "Initialization MPU9250 ....");

    // clear configuration
    this.i2c.writeBit(MPU9250.RA_PWR_MGMT_1, MPU9250.PWR1_DEVICE_RESET_BIT, 1);
    this.debug.log("INFO", "Reset configuration MPU9250.");
    sleep.usleep(10000);

    // defined sample rate
    if (
      this.config.SAMPLE_RATE &&
      this.config.SAMPLE_RATE > MPU9250.SAMPLERATE_MIN &&
      this.config.SAMPLE_RATE < MPU9250.SAMPLERATE_MAX
    ) {
      this.setSampleRate(this.config.SAMPLE_RATE);
      sleep.usleep(100000);
    }

    // define DLPF_CFG
    if ("DLPF_CFG" in this.config && this.config.DLPF_CFG) {
      this.setDLPFConfig(this.config.DLPF_CFG);
      sleep.usleep(100000);
    }

    // define A_DLPF_CFG
    if ("A_DLPF_CFG" in this.config && this.config.A_DLPF_CFG) {
      this.setAccelDLPFConfig(this.config.DLPF_CFG);
      sleep.usleep(100000);
    }

    // define clock source
    this.setClockSource(MPU9250.CLOCK_PLL_XGYRO);
    sleep.usleep(10000);

    // define gyro range
    const gyro_fs = [
      MPU9250.GYRO_FS_250,
      MPU9250.GYRO_FS_500,
      MPU9250.GYRO_FS_1000,
      MPU9250.GYRO_FS_2000,
    ];
    let gyro_value = MPU9250.GYRO_FS_250;
    if (this.config.GYRO_FS > -1 && this.config.GYRO_FS < 4)
      gyro_value = gyro_fs[this.config.GYRO_FS];
    this.setFullScaleGyroRange(gyro_value);
    sleep.usleep(10000);

    // define accel range
    const accel_fs = [
      MPU9250.ACCEL_FS_2,
      MPU9250.ACCEL_FS_4,
      MPU9250.ACCEL_FS_8,
      MPU9250.ACCEL_FS_16,
    ];
    let accel_value = MPU9250.ACCEL_FS_4;
    if (this.config.ACCEL_FS > -1 && this.config.ACCEL_FS < 4)
      accel_value = accel_fs[this.config.ACCEL_FS];
    this.setFullScaleAccelRange(accel_value);
    sleep.usleep(10000);

    // disable sleepEnabled
    this.setSleepEnabled(false);
    sleep.usleep(10000);

    if (this.config.UpMagneto) {
      this.debug.log(
        "INFO",
        "Enabled magnetometer. Starting initialization ...."
      );
      this.enableMagnetometer();
      this.debug.log("INFO", "END of magnetometer initialization.");
    }

    this.debug.log("INFO", "END of MPU9150 initialization.");

    // Print out the configuration
    if (this.config.DEBUG) {
      this.printSettings();
      this.printAccelSettings();
      this.printGyroSettings();
      if (this.ak8963) {
        this.ak8963.printSettings();
      }
    }

    return this.testDevice();
  }

  testDevice() {
    const currentDeviceID = this.getIDDevice();
    console.log("test device!", currentDeviceID);
    return (
      currentDeviceID === 112 ||
      currentDeviceID === MPU9250.ID_MPU_9250 ||
      currentDeviceID === MPU9250.ID_MPU_9255
    );
  }

  enableMagnetometer() {
    if (this.i2c) {
      this.setI2CMasterModeEnabled(false);
      sleep.usleep(100000);

      this.setByPASSEnabled(true);
      sleep.usleep(100000);

      if (this.getByPASSEnabled()) {
        this.ak8963 = new Ak8963(this.config);
        return true;
      } else {
        this.debug.log("ERROR", "Can't turn on RA_INT_PIN_CFG.");
      }
    }
    return false;
  }

  getIDDevice() {
    if (this.i2c) {
      return this.i2c.readByte(MPU9250.WHO_AM_I);
    }
    return false;
  }

  getTemperature() {
    if (this.i2c) {
      const buffer = this.i2c.readBytes(MPU9250.TEMP_OUT_H, 2, function () {});
      return buffer.readInt16BE(0);
    }
    return false;
  }

  getTemperatureCelsius() {
    /*
  ((TEMP_OUT – RoomTemp_Offset)/Temp_Sensitivity) + 21degC
  */
    const TEMP_OUT = this.getTemperatureCelsiusDigital();
    if (TEMP_OUT) {
      return TEMP_OUT + "°C";
    }
    return "no data";
  }

  getTemperatureCelsiusDigital() {
    const TEMP_OUT = this.getTemperature();
    if (TEMP_OUT) {
      return TEMP_OUT / 333.87 + 21.0;
    }
    return 0;
  }

  getMotion6() {
    if (this.i2c) {
      const buffer = this.i2c.readBytes(
        MPU9250.ACCEL_XOUT_H,
        14,
        function () {}
      );
      const gCal = this.config.gyroBiasOffset;
      const aCal = this.config.accelCalibration;

      const xAccel = buffer.readInt16BE(0) * this.accelScalarInv;
      const yAccel = buffer.readInt16BE(2) * this.accelScalarInv;
      const zAccel = buffer.readInt16BE(4) * this.accelScalarInv;

      return [
        this.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
        this.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
        this.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
        // Skip Temperature - bytes 6:7
        buffer.readInt16BE(8) * this.gyroScalarInv + gCal.x,
        buffer.readInt16BE(10) * this.gyroScalarInv + gCal.y,
        buffer.readInt16BE(12) * this.gyroScalarInv + gCal.z,
      ];
    }
    return false;
  }

  /**
   * This wee function just simplifies the code.  It scales the Accelerometer values appropriately.
   * The values are scaled to 1g and the offset it taken into account.
   */
  scaleAccel(val, offset, scalerArr) {
    if (val < 0) {
      return -(val - offset) / (scalerArr[0] - offset);
    } else {
      return (val - offset) / (scalerArr[1] - offset);
    }
  }

  getMotion9() {
    if (this.i2c) {
      const mpudata = this.getMotion6();
      let magdata;
      if (this.ak8963) {
        magdata = this.ak8963.getMagAttitude();
      } else {
        magdata = [0, 0, 0];
      }
      return mpudata.concat(magdata);
    }
    return false;
  }

  getAccel() {
    if (this.i2c) {
      const buffer = this.i2c.readBytes(
        MPU9250.ACCEL_XOUT_H,
        6,
        function () {}
      );
      const aCal = this.config.accelCalibration;

      const xAccel = buffer.readInt16BE(0) * this.accelScalarInv;
      const yAccel = buffer.readInt16BE(2) * this.accelScalarInv;
      const zAccel = buffer.readInt16BE(4) * this.accelScalarInv;

      return [
        this.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
        this.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
        this.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
      ];
    }
    return false;
  }

  getGyro() {
    if (this.i2c) {
      const buffer = this.i2c.readBytes(MPU9250.GYRO_XOUT_H, 6, function () {});
      const gCal = this.config.gyroBiasOffset;
      return [
        buffer.readInt16BE(0) * this.gyroScalarInv + gCal.x,
        buffer.readInt16BE(2) * this.gyroScalarInv + gCal.y,
        buffer.readInt16BE(4) * this.gyroScalarInv + gCal.z,
      ];
    }
    return false;
  }

  getSleepEnabled() {
    if (this.i2c) {
      return this.i2c.readBit(MPU9250.RA_PWR_MGMT_1, MPU9250.PWR1_SLEEP_BIT);
    }
    return false;
  }

  getClockSource() {
    if (this.i2c) {
      return this.i2c.readByte(MPU9250.RA_PWR_MGMT_1) & 0x07;
    }
    return false;
  }

  getFullScaleGyroRange() {
    if (this.i2c) {
      const byte = this.i2c.readByte(MPU9250.RA_GYRO_CONFIG);
      byte = byte & 0x18;
      byte = byte >> 3;
      return byte;
    }
    return false;
  }

  getGyroPowerSettings() {
    if (this.i2c) {
      const byte = this.i2c.readByte(MPU9250.RA_PWR_MGMT_2);
      byte = byte & 0x07;
      return [
        (byte >> 2) & 1, // X
        (byte >> 1) & 1, // Y
        (byte >> 0) & 1, // Z
      ];
    }
    return false;
  }

  getAccelPowerSettings() {
    if (this.i2c) {
      const byte = this.i2c.readByte(MPU9250.RA_PWR_MGMT_2);
      byte = byte & 0x38;
      return [
        (byte >> 5) & 1, // X
        (byte >> 4) & 1, // Y
        (byte >> 3) & 1, // Z
      ];
    }
    return false;
  }

  getFullScaleAccelRange() {
    if (this.i2c) {
      const byte = this.i2c.readByte(MPU9250.RA_ACCEL_CONFIG_1);
      byte = byte & 0x18;
      byte = byte >> 3;
      return byte;
    }
    return false;
  }

  getByPASSEnabled() {
    if (this.i2c) {
      return this.i2c.readBit(
        MPU9250.RA_INT_PIN_CFG,
        MPU9250.INTCFG_BYPASS_EN_BIT
      );
    }
    return false;
  }

  getI2CMasterMode() {
    if (this.i2c) {
      return this.i2c.readBit(
        MPU9250.RA_USER_CTRL,
        MPU9250.USERCTRL_I2C_MST_EN_BIT
      );
    }
    return false;
  }

  getPitch(value) {
    return (Math.atan2(value[0], value[2]) + Math.PI) * (180 / Math.PI) - 180;
  }

  getRoll(value) {
    return (Math.atan2(value[1], value[2]) + Math.PI) * (180 / Math.PI) - 180;
  }

  getYaw(value) {
    return 0;
  }

  setClockSource(adrs) {
    if (this.i2c) {
      return this.i2c.writeBits(
        MPU9250.RA_PWR_MGMT_1,
        MPU9250.PWR1_CLKSEL_BIT,
        MPU9250.PWR1_CLKSEL_LENGTH,
        adrs
      );
    }
    return false;
  }

  setFullScaleGyroRange(adrs) {
    if (this.i2c) {
      if (this.config.scaleValues) {
        this.gyroScalarInv = 1 / MPU9250.GYRO_SCALE_FACTOR[adrs];
      } else {
        this.gyroScalarInv = 1;
      }
      return this.i2c.writeBits(
        MPU9250.RA_GYRO_CONFIG,
        MPU9250.GCONFIG_FS_SEL_BIT,
        MPU9250.GCONFIG_FS_SEL_LENGTH,
        adrs
      );
    }
    return false;
  }

  setFullScaleAccelRange(adrs) {
    if (this.i2c) {
      if (this.config.scaleValues) {
        this.accelScalarInv = 1 / MPU9250.ACCEL_SCALE_FACTOR[adrs];
      } else {
        this.accelScalarInv = 1;
      }
      return this.i2c.writeBits(
        MPU9250.RA_ACCEL_CONFIG_1,
        MPU9250.ACONFIG_FS_SEL_BIT,
        MPU9250.ACONFIG_FS_SEL_LENGTH,
        adrs
      );
    }
    return false;
  }

  setSleepEnabled(bool) {
    const val = bool ? 1 : 0;
    if (this.i2c) {
      return this.i2c.writeBit(
        MPU9250.RA_PWR_MGMT_1,
        MPU9250.PWR1_SLEEP_BIT,
        val
      );
    }
    return false;
  }

  setI2CMasterModeEnabled(bool) {
    const val = bool ? 1 : 0;
    if (this.i2c) {
      return this.i2c.writeBit(
        MPU9250.RA_USER_CTRL,
        MPU9250.USERCTRL_I2C_MST_EN_BIT,
        val
      );
    }
    return false;
  }

  setByPASSEnabled(bool) {
    const adrs = bool ? 1 : 0;
    if (this.i2c) {
      return this.i2c.writeBit(
        MPU9250.RA_INT_PIN_CFG,
        MPU9250.INTCFG_BYPASS_EN_BIT,
        adrs
      );
    }
    return false;
  }

  setDLPFConfig(dlpf_cfg) {
    if (this.i2c) {
      return this.i2c.writeBits(MPU9250.RA_CONFIG, 0, 3, dlpf_cfg, (r) => {
        if (r) {
          this.debug.log("ERROR", "setDLPFConfig " + r.message);
        }
      });
    }
    return false;
  }

  setAccelDLPFConfig(a_dlpf_cfg) {
    if (this.i2c) {
      return this.i2c.writeBits(
        MPU9250.RA_ACCEL_CONFIG_2,
        0,
        4,
        a_dlpf_cfg,
        (r) => {
          if (r) {
            this.debug.log("ERROR", "setAccelDLPFConfig " + r.message);
          }
        }
      );
    }
    return false;
  }

  setSampleRate(sample_rate) {
    if (this.i2c) {
      if (sample_rate < MPU9250.SAMPLERATE_MAX && rate >= 8000) {
        sample_rate = 8000;
      }
      if (sample_rate < 8000 && sample_rate > 1000) {
        sample_rate = 1000;
      }
      if (sample_rate < 1000) {
        const rate = 1000 / sample_rate - 1;
        sample_rate = 1000 / (1 + sample_rate);
      }
      return this.i2c.writeBits(MPU9250.SMPLRT_DIV, 0, 8, sample_rate, (r) => {
        if (r) {
          this.debug.log("ERROR", "setSampleRate " + r.message);
        }
      });
    }
    return false;
  }

  printSettings() {
    const CLK_RNG = [
      "0 (Internal 20MHz oscillator)",
      "1 (Auto selects the best available clock source)",
      "2 (Auto selects the best available clock source)",
      "3 (Auto selects the best available clock source)",
      "4 (Auto selects the best available clock source)",
      "5 (Auto selects the best available clock source)",
      "6 (Internal 20MHz oscillator)",
      "7 (Stops the clock and keeps timing generator in reset)",
    ];
    this.debug.log("INFO", "MPU9250:");
    this.debug.log(
      "INFO",
      "--> Device address: 0x" + this.config.address.toString(16)
    );
    this.debug.log("INFO", "--> i2c bus: 0x" + this.getIDDevice().toString(16));
    this.debug.log(
      "INFO",
      "--> Device ID: 0x" + this.getIDDevice().toString(16)
    );
    this.debug.log(
      "INFO",
      "--> BYPASS enabled: " + (this.getByPASSEnabled() ? "Yes" : "No")
    );
    this.debug.log(
      "INFO",
      "--> SleepEnabled Mode: " + (this.getSleepEnabled() === 1 ? "On" : "Off")
    );
    this.debug.log(
      "INFO",
      "--> i2c Master Mode: " +
        (this.getI2CMasterMode() === 1 ? "Enabled" : "Disabled")
    );
    this.debug.log("INFO", "--> Power Management (0x6B, 0x6C):");
    this.debug.log(
      "INFO",
      "  --> Clock Source: " + CLK_RNG[this.getClockSource()]
    );
    this.debug.log(
      "INFO",
      "  --> Accel enabled (x, y, z): " +
        vectorToYesNo(this.getAccelPowerSettings())
    );
    this.debug.log(
      "INFO",
      "  --> Gyro enabled (x, y, z): " +
        vectorToYesNo(this.getGyroPowerSettings())
    );
  }

  vectorToYesNo(v) {
    const str = "(";
    str += v[0] ? "No, " : "Yes, ";
    str += v[1] ? "No, " : "Yes, ";
    str += v[2] ? "No" : "Yes";
    str += ")";
    return str;
  }

  printAccelSettings() {
    const FS_RANGE = ["±2g (0)", "±4g (1)", "±8g (2)", "±16g (3)"];
    this.debug.log("INFO", "Accelerometer:");
    this.debug.log(
      "INFO",
      "--> Full Scale Range (0x1C): " + FS_RANGE[this.getFullScaleAccelRange()]
    );
    this.debug.log("INFO", "--> Scalar: 1/" + 1 / this.accelScalarInv);
    this.debug.log("INFO", "--> Calibration:");
    this.debug.log("INFO", "  --> Offset: ");
    this.debug.log(
      "INFO",
      "    --> x: " + this.config.accelCalibration.offset.x
    );
    this.debug.log(
      "INFO",
      "    --> y: " + this.config.accelCalibration.offset.y
    );
    this.debug.log(
      "INFO",
      "    --> z: " + this.config.accelCalibration.offset.z
    );
    this.debug.log("INFO", "  --> Scale: ");
    this.debug.log(
      "INFO",
      "    --> x: " + this.config.accelCalibration.scale.x
    );
    this.debug.log(
      "INFO",
      "    --> y: " + this.config.accelCalibration.scale.y
    );
    this.debug.log(
      "INFO",
      "    --> z: " + this.config.accelCalibration.scale.z
    );
  }

  printGyroSettings() {
    const FS_RANGE = [
      "+250dps (0)",
      "+500 dps (1)",
      "+1000 dps (2)",
      "+2000 dps (3)",
    ];
    this.debug.log("INFO", "Gyroscope:");
    this.debug.log(
      "INFO",
      "--> Full Scale Range (0x1B): " + FS_RANGE[this.getFullScaleGyroRange()]
    );
    this.debug.log("INFO", "--> Scalar: 1/" + 1 / this.gyroScalarInv);
    this.debug.log("INFO", "--> Bias Offset:");
    this.debug.log("INFO", "  --> x: " + this.config.gyroBiasOffset.x);
    this.debug.log("INFO", "  --> y: " + this.config.gyroBiasOffset.y);
    this.debug.log("INFO", "  --> z: " + this.config.gyroBiasOffset.z);
  }
}

////////////////////////////////////////////////////////////////////////////////////
// /** ---------------------------------------------------------------------- **/ //
//  *		 					Magnetometer Configuration					   *  //
// /** ---------------------------------------------------------------------- **/ //
////////////////////////////////////////////////////////////////////////////////////

class Ak8963 {
  constructor(config, callback) {
    callback = callback || function () {};
    this.config = config;
    this.debug = new DebugConsole(config.DEBUG);
    this.config.ak_address = this.config.ak_address || AK8963.ADDRESS;
    this.config.magCalibration =
      this.config.magCalibration || AK8963.DEFAULT_CALIBRATION;

    // connection with magnetometer
    this.i2c = new LOCAL_I2C(this.config.ak_address, {
      device: this.config.device,
    });
    sleep.usleep(10000);
    const buffer = this.getIDDevice();

    if (buffer & AK8963.WHO_AM_I_RESPONSE) {
      this.getSensitivityAdjustmentValues();
      sleep.usleep(10000);
      this.setCNTL(AK8963.CNTL_MODE_CONTINUE_MEASURE_2);
    } else {
      this.debug.log(
        "ERROR",
        "AK8963: Device ID is not equal to 0x" +
          AK8963.WHO_AM_I_RESPONSE.toString(16) +
          ", device value is 0x" +
          buffer.toString(16)
      );
    }
    callback(true);
  }

  printSettings() {
    const MODE_LST = {
      0: "0x00 (Power-down mode)",
      1: "0x01 (Single measurement mode)",
      2: "0x02 (Continuous measurement mode 1: 8Hz)",
      6: "0x06 (Continuous measurement mode 2: 100Hz)",
      4: "0x04 (External trigger measurement mode)",
      8: "0x08 (Self-test mode)",
      15: "0x0F (Fuse ROM access mode)",
    };

    this.debug.log("INFO", "Magnetometer (Compass):");
    this.debug.log(
      "INFO",
      "--> i2c address: 0x" + this.config.ak_address.toString(16)
    );
    this.debug.log(
      "INFO",
      "--> Device ID: 0x" + this.getIDDevice().toString(16)
    );
    this.debug.log("INFO", "--> Mode: " + MODE_LST[this.getCNTL() & 0x0f]);
    this.debug.log("INFO", "--> Scalars:");
    this.debug.log("INFO", "  --> x: " + this.asax);
    this.debug.log("INFO", "  --> y: " + this.asay);
    this.debug.log("INFO", "  --> z: " + this.asaz);
  }

  getDataReady() {
    if (this.i2c) {
      return this.i2c.readBit(AK8963.ST1, AK8963.ST1_DRDY_BIT);
    }
    return false;
  }

  getIDDevice() {
    if (this.i2c) {
      return this.i2c.readByte(AK8963.WHO_AM_I);
    }
    return false;
  }

  /**
   * Get the Sensitivity Adjustment values.  These were set during manufacture and allow us to get the actual H values
   * from the magnetometer.
   * @name getSensitivityAdjustmentValues
   */
  getSensitivityAdjustmentValues() {
    if (!this.config.scaleValues) {
      this.asax = 1;
      this.asay = 1;
      this.asaz = 1;
      return;
    }

    // Need to set to Fuse mode to get valid values from this.
    const currentMode = this.getCNTL();
    this.setCNTL(AK8963.CNTL_MODE_FUSE_ROM_ACCESS);
    sleep.usleep(10000);

    // Get the ASA* values
    this.asax = ((this.i2c.readByte(AK8963.ASAX) - 128) * 0.5) / 128 + 1;
    this.asay = ((this.i2c.readByte(AK8963.ASAY) - 128) * 0.5) / 128 + 1;
    this.asaz = ((this.i2c.readByte(AK8963.ASAZ) - 128) * 0.5) / 128 + 1;

    // Return the mode we were in before
    this.setCNTL(currentMode);
  }

  getMagAttitude() {
    // Get the actual data
    const buffer = this.i2c.readBytes(AK8963.XOUT_L, 6, function (e, r) {});
    const cal = this.config.magCalibration;

    // For some reason when we read ST2 (Status 2) just after reading byte, this ensures the
    // next reading is fresh.  If we do it before without a pause, only 1 in 15 readings will
    // be fresh.  The setTimeout ensures this read goes to the back of the queue, once all other
    // computation is done.
    const self = this;
    setTimeout(function () {
      self.i2c.readByte(AK8963.ST2);
    }, 0);

    return [
      (buffer.readInt16LE(0) * this.asax - cal.offset.x) * cal.scale.x,
      (buffer.readInt16LE(2) * this.asay - cal.offset.y) * cal.scale.y,
      (buffer.readInt16LE(4) * this.asaz - cal.offset.z) * cal.scale.z,
    ];
  }

  getCNTL() {
    if (this.i2c) {
      return this.i2c.readByte(AK8963.CNTL);
    }
    return false;
  }

  /**
   * @name setCNTL
   * CNTL_MODE_OFF: 0x00, // Power-down mode
   * CNTL_MODE_SINGLE_MEASURE: 0x01, // Single measurement mode
   * CNTL_MODE_CONTINUE_MEASURE_1: 0x02, // Continuous measurement mode 1
   * CNTL_MODE_CONTINUE_MEASURE_2: 0x06, // Continuous measurement mode 2
   * CNTL_MODE_EXT_TRIG_MEASURE: 0x04, // External trigger measurement mode
   * CNTL_MODE_SELF_TEST_MODE: 0x08, // Self-test mode
   * CNTL_MODE_FUSE_ROM_ACCESS: 0x0F  // Fuse ROM access mode
   * @return undefined | false
   */
  setCNTL(mode) {
    if (this.i2c) {
      return this.i2c.writeBytes(AK8963.CNTL, [mode], function () {});
    }
    return false;
  }
}
////////////////////////////////////////////////////////////////////////////////////
// /** ---------------------------------------------------------------------- **/ //
//  *		 				Kalman filter									   *  //
// /** ---------------------------------------------------------------------- **/ //
////////////////////////////////////////////////////////////////////////////////////

class Kalman_filter {
  constructor() {
    this.Q_angle = 0.001;
    this.Q_bias = 0.003;
    this.R_measure = 0.03;

    this.angle = 0;
    this.bias = 0;
    this.rate = 0;

    this.P = [
      [0, 0],
      [0, 0],
    ];

    this.S = 0;
    this.K = [];
    this.Y = 0;
  }
  getAngle(newAngle, newRate, dt) {
    this.rate = newRate - this.bias;
    this.angle += dt * this.rate;

    this.P[0][0] +=
      dt * (dt * this.P[1][1] - this.P[0][1] - this.P[1][0] + this.Q_angle);
    this.P[0][1] -= dt * this.P[1][1];
    this.P[1][0] -= dt * this.P[1][1];
    this.P[1][1] += this.Q_bias * dt;

    this.S = this.P[0][0] + this.R_measure;

    this.K[0] = this.P[0][0] / this.S;
    this.K[1] = this.P[1][0] / this.S;

    this.Y = newAngle - this.angle;

    this.angle += this.K[0] * this.Y;
    this.bias += this.K[1] * this.Y;

    this.P[0][0] -= this.K[0] * this.P[0][0];
    this.P[0][1] -= this.K[0] * this.P[0][1];
    this.P[1][0] -= this.K[1] * this.P[0][0];
    this.P[1][1] -= this.K[1] * this.P[0][1];

    return this.angle;
  }

  getRate() {
    return this.rate;
  }
  getQangle() {
    return this.Q_angle;
  }
  getQbias() {
    return this.Q_bias;
  }
  getRmeasure() {
    return this.R_measure;
  }

  setAngle(value) {
    this.angle = value;
  }
  setQangle(value) {
    Q_angle = value;
  }
  setQbias(value) {
    this.Q_bias = value;
  }
  setRmeasure(value) {
    this.R_measure = value;
  }
}

Mpu9250.MPU9250 = MPU9250;
Mpu9250.AK8963 = AK8963;

module.exports = Mpu9250;
