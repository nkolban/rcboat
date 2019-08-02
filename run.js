const HMC5883L = require('compass-hmc5883l');
const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyS0');
const Readline = require('@serialport/parser-readline');
const parser = port.pipe(new Readline({delimiter: `\r\n`}));
const GPS = require('gps');
const gps = new GPS;
let last = null;

let compass = new HMC5883L(1);
function getHeading() {
	compass.getHeadingDegrees('x', 'y', (err, heading) => {
        	console.log(heading);
	});
}


gps.on('data', (data) => {
        if (data.type != 'GGA') {
                return;
        }
	if (last != null) {
		const dist = GPS.Distance(last.lat, last.lon, data.lat, data.lon)*1000;
		console.log(`Drift: ${dist}`);
	}
	console.log('got GPS!!');
	console.log(data);
	last = data;
	getHeading();
});
//gps.update("$GPGGA,224900.000,4832.3762,N,00903.5393,E,1,04,7.8,498.6,M,48.0,M,,0000*5E");
parser.on('data', (data) => {
	//console.log(`New raw data: ${data}`);
	gps.update(data);
});

const express = require('express');
const app = express();
app.use(express.static('public'));
app.listen(80, () => {
	console.log('Listening on port 80');
});

/*
const five = require('johnny-five');
const Raspi = require('raspi-io').RaspiIO;
const board = new five.Board({
	io: new Raspi()
});
board.on('ready', () => {
	console.log('Johnny-Five is ready!');
	var compass = new five.Compass({
		controller: 'HMC5883L'
	});
	compass.on('change', function() {
		console.log('---> New bearing!');
	});
});
*/
