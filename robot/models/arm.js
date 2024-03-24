const checkAngle = (angle) =>
  !isNaN(angle) && angle !== undefined && angle !== null;

class Arm {
  constructor(props) {
    const {
      chA,
      chB,
      chC,
      invert = false,
      invertX = false,
      A,
      B,
      C,
      a,
      b,
      c,
      sendMessage,
    } = props;
    // pins on pca9685
    this.chA = chA;
    this.chB = chB;
    this.chC = chC;
    //
    this.invert = invert;
    this.invertX = invertX;
    // Leg's dimension
    this.A = A;
    this.B = B;
    this.C = C;
    // For calibration
    this.a = a;
    this.b = b;
    this.c = c;
    // for position state
    this.x = 0;
    this.y = 0;
    this.z = 0;
    //
    this.sendMessage = sendMessage;
    this.setCoord = this.setCoord.bind(this);
    this.count = 0;
  }

  calcBetta(D) {
    const cosB = (D * D + this.B * this.B - this.A * this.A) / (2 * D * this.B);
    return (Math.acos(cosB) * 180) / Math.PI;
  }

  calcAlpha(D) {
    const cosB =
      (this.A * this.A + this.B * this.B - D * D) / (2 * this.A * this.B);
    return (Math.acos(cosB) * 180) / Math.PI;
  }

  calcDelta(_x, _y) {
    return (Math.atan(_y / _x) * 180) / Math.PI;
  }

  calcGamma(_x, _z) {
    return (Math.atan(_z / _x) * 180) / Math.PI;
  }
  setCH(width, channel) {
    this.sendMessage({
      id: channel.toString(),
      width,
    });
  }
  setA(w) {
    this.setCH(w, this.chA);
  }
  setB(w) {
    this.setCH(w, this.chB);
  }
  setC(w) {
    this.setCH(w, this.chC);
  }
  setCoord(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    const xn = Math.sqrt(x * x + z * z) - this.C;
    const dist = Math.sqrt(xn * xn + y * y);

    const Alpha = this.calcAlpha(dist);
    const Betta = this.calcBetta(dist);
    const Delta = this.calcDelta(xn, y);

    const Gamma = this.invert
      ? this.calcGamma(x, z)
      : 180 - this.calcGamma(x, z);
    const _Betta = Betta + Delta;
    const newGamma = Gamma < 0 ? 180 + Gamma : Gamma;

    checkAngle(Alpha) && this.setA(this.invertX ? Alpha+this.a : 180 - Alpha-this.a);
    checkAngle(_Betta) && this.setB(this.invertX ? 180 - (90 + _Betta+this.b) : 90 + _Betta+this.b);
    checkAngle(Gamma) && this.setC(Gamma+this.c);
  }
  /////
  setPosition({ x, y, z, count: t }) {
    const dX = (x - this.x) / t;
    const dY = (y - this.y) / t;
    const dZ = (z - this.z) / t;

    this.dX = dX;
    this.dY = dY;
    this.dZ = dZ;
    this.count = t;
  }
  next() {
    if (this.count > 0) {
      this.x += this.dX;
      this.y += this.dY;
      this.z += this.dZ;
      this.setCoord(this.x, this.y, this.z);
    }
    this.count -= 1;
    return this.count < 0;
  }
}

module.exports = { Arm };
