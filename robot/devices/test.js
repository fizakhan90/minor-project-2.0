const { deviceArm } = require('./device_arm.js');

deviceArm.initDevice();

let width = 0;
let c = 1;
setInterval(() => {
if (width < 0) {
c = 1;
width = 0;
}
if (width > 180) {
width = 180;
c = -1;
}
const msg = { id: 'sendMessage', body: { channel: 0, width } };
width += c;
deviceArm.sendMessage(msg);
deviceArm.sendMessage({ ...msg, body: { channel: 4, width }});
deviceArm.sendMessage({ ...msg, body: { channel: 8, width }});
deviceArm.sendMessage({ ...msg, body: { channel: 12, width }});
deviceArm.sendMessage({ ...msg, body: { channel: 15, width }});

}, 5);
