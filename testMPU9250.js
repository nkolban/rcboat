const MPU9250 = require('mpu9250');
let mpu = new MPU9250({
    DEBUG: true,
    address: 0x68,
    UpMagneto: true
});
if (mpu.initialize() == false) {
    console.log("Failed to initialize MPU-9250");
    return;
}
function compass_degrees(values) {
    let raw_pitch = getPitch_radians(values);
    let raw_roll = getRoll_radians(values);
    //let pitch = -raw_roll;
    //let roll = raw_pitch;
    let pitch = raw_pitch;
    let roll = raw_roll;

    let magX = values[6];
    let magY = values[7];
    let magZ = values[8];
    //let x = magX*Math.cos(pitch) + magY*Math.sin(roll)*Math.sin(pitch) - magZ*Math.cos(roll)*Math.sin(pitch);
    //let y = magY*Math.cos(roll) + magZ*Math.sin(roll);


    let x = magX*Math.cos(pitch) + magZ*Math.sin(pitch);
    let y = magX*Math.sin(roll)*Math.sin(pitch) + magY*Math.cos(roll) - magZ*Math.sin(roll)*Math.cos(pitch);

    //let y = magZ*Math.sin(roll) - magY*Math.cos(roll);
    //let z = magY*Math.sin(roll) + magZ*Math.cos(roll);
    //let x = magX*Math.cos(pitch) + z*Math.sin(pitch);

    let heading = Math.atan2(y,x)*180/Math.PI;
    console.log(`Pitch: ${radiansToDegrees(pitch)}, Roll: ${radiansToDegrees(roll)}, Heading: ${heading}`);
    return heading;
}

function getPitch_radians(values) {
    return Math.atan2(values[0], values[2]);
}

function getRoll_radians(values) {
    return Math.atan2(values[1], values[2]);
}

function radiansToDegrees(a) {
    return a*180/Math.PI;
}

setInterval(() => {
    const values = mpu.getMotion9();
    console.log(values);

    let pitch = mpu.getPitch(values);
    let roll = mpu.getRoll(values);
    let yaw = mpu.getYaw(values);
    console.log(`Pitch: ${pitch}, Roll: ${roll}, Yaw: ${yaw}`);
    compass_degrees(values);
}, 2000);