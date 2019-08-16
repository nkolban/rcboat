$(function() {
	const width = 500;
	const height = 500;
	const SERVER='192.168.1.150';
	boatPos =  {
		latitude: 32.868144,
		longitude: -97.188237
	};

	/**
	 * Get the distance between two cartesian points.
	 */
	function pointDistance(pt1, pt2) {
		const dX = pt1.x - pt2.x;
		const dY = pt1.y - pt2.y;
		const ret = Math.sqrt(dX*dX + dY*dY);
		return Math.round(ret*10000)/10000;
	} // pointDistance


	/**
	 * Get the bearing from one cartesian point to another.
	 * @param {*} pt1 
	 * @param {*} pt2 
	 */
	function pointBearing(pt1, pt2) {
		let val = Math.round((180/Math.PI)*Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x));
		if (val < 0) {
			val +=360;
		}
		val = val - 90;
		if (val < 0) {
			val += 360;
		}
		return val;
	} // pointBearing


	/**
	 * Get a lat/lon position from a point.
	 * @param {*} point 
	 * 
	 * Algorithm
	 * We have a point on the cartesian plane that is relative to the center.  From this
	 * we can calculate the distance to that point and the bearing.  With both of those
	 * and knowing the location of the center point, we calculate the desired location
	 * by applying:
	 * 
	 * targetLocation = boatLocation + (dist, bearing)
	 * 
	 */
	function pointToPos(point) {
		const center = {
			x: width/2,
			y: height/2
		};
		const dist = pointDistance(point, center);
		const bearing = pointBearing(point, center);
		$("#dist").text(dist);
		$("#bearing").text(bearing);
		const newPoint = geolib.computeDestinationPoint(boatPos,
			dist,
			bearing);
		return newPoint;
	} // pointToPos


	const elm = document.getElementById('main');
	const params = {
		width: width,
		height: height
	};
	const two = new Two(params).appendTo(elm);

	function addWayPoint(x,y) {
		const circle = two.makeCircle(x,y, 10);
		circle.fill = '#009900';
		two.update();
		circle._renderer.elem.addEventListener('mousemove', function() {
			console.log("mouse move");
		});

	}
	const circle = two.makeCircle(width/2, height/2, 10);
	circle.fill = '#FF8000';
	two.update();

	// Clicked
	$(elm).click((e) => {
		debugger;
		addWayPoint(e.offsetX, e.offsetY);
	});

	// Mouse moved
	$(elm).mousemove((e) => {
//		$("#lat").text(e.offsetX);
//		$("#lon").text(e.offsetY);
		const newPos = pointToPos({x:e.offsetX, y:e.offsetY});
		$("#lat").text(newPos.latitude.toFixed(6));
		$("#lon").text(newPos.longitude.toFixed(6));
	});

	setInterval(() => {
		// Get the heading
		jQuery.get(`http://${SERVER}/heading`, (data) => {
			$("#heading").text(data);
		});
		jQuery.get(`http://${SERVER}/gps`, (data) => {
			data = JSON.parse(data);
			console.log(JSON.stringify(data));
			$('#gps').text(`Lat: ${geolib.getLatitude(data)}, Lon: ${geolib.getLongitude(data)}`);
		});
		// Get the position
	}, 5000);
});
