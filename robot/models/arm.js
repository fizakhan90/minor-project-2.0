const checkAngle = (angle) =>
    !isNaN(angle) && angle !== undefined && angle !== null;


class Arm {
    constructor(props) {
        const { chA, chB, chC, device, invert = false, invertX = false, A, B, C, cb } = props;
        this.chA = chA;
        this.chB = chB;
        this.chC = chC;
        this.device = device;
        this.invert = invert;
        this.invertX = invertX;
        this.cb = cb;
        this.A = A;
        this.B = B;
        this.C = C;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.setCoord = this.setCoord.bind(this);
    }

    calcBetta(D) {
        const cosB =
            (D * D + this.B * this.B - this.A * this.A) / (2 * D * this.B);
        return (Math.acos(cosB) * 180) / Math.PI;
    }

    calcYam(D) {
        const cosB =
            (this.A * this.A + this.B * this.B - D * D) / (2 * this.A * this.B);
        return (Math.acos(cosB) * 180) / Math.PI;
    }

    calcDelta(_x, _y) {
        return (Math.atan(_y / _x) * 180) / Math.PI;
    }

    calcOmega(_x, _z) {
        return (Math.atan(_z / _x) * 180) / Math.PI;
    }
    setCH(W, channel) {
        this.device.sendMessage({
            id: this.device.messagesIdsMap.sendMessage,
            body: {
                channel: channel,
                width: W,
            },
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
        this.cb && this.cb({ x, y, z });
        const xn = Math.sqrt(x * x + z * z) - this.C;
        const dist = Math.sqrt(xn * xn + y * y);
        const Betta = this.calcBetta(dist);
        const Yam = this.calcYam(dist) - 8;
        const Delta = this.calcDelta(xn, y);
        const Omega = this.invert
            ? this.calcOmega(x, z)
            : 180 - (this.calcOmega(x, z));
        const _Yam = Yam;
        const _Omega = Omega;
        const _Betta = Betta + Delta;
        checkAngle(_Yam) && this.setA(this.invertX ? _Yam : 180 - _Yam);
        checkAngle(_Betta) && this.setB(this.invertX ? 180 - (_Betta + 90) : _Betta + 90);
        checkAngle(_Omega) && this.setC(_Omega);
    }
    setPosition(x, y, z, t) {
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
