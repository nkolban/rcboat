$(function() {
	const width = 500;
	const height = 500;
	boatPos =  {
		latitude: 32.868144,
		longitude: -97.188237
	};

	function pointDistance(pt1, pt2) {
		const dX = pt1.x - pt2.x;
		const dY = pt1.y - pt2.y;
		const ret = Math.sqrt(dX*dX + dY*dY);
		return Math.round(ret*10000)/10000;
	}

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
	}

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
	}
	const elm = document.getElementById('main');
	const params = {
		width: width,
		height: height
	};
	const two = new Two(params).appendTo(elm);

	function addWayPoint(x,y) {
		two.makeCircle(x,y, 10);
		two.update();
	}
	const circle = two.makeCircle(width/2, height/2, 10);
	two.update();
	$(elm).click((e) => {
		debugger;
		addWayPoint(e.offsetX, e.offsetY);
	});
	$(elm).mousemove((e) => {
//		$("#lat").text(e.offsetX);
//		$("#lon").text(e.offsetY);
		const newPos = pointToPos({x:e.offsetX, y:e.offsetY});
		$("#lat").text(newPos.latitude);
		$("#lon").text(newPos.longitude);
	});
});
