exports.randomNumber = function (length) {
	var text = "";
	var possible = "123456789";
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possible.length);
		text += i > 0 && sup == i ? "0" : possible.charAt(sup);
	}
	return Number(text);
};


exports.haversineDistance = function(source, destination) {
	const R = 6371e3; // metres
	const srcLatRad = source.lat * Math.PI/180; // φ, λ in radians
	const destLatRad = destination.lat * Math.PI/180;
	const deltaLat = destLatRad - srcLatRad;
	const deltaLon = (destination.lon-destination.lon) * Math.PI/180;

	const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
			Math.cos(srcLatRad) * Math.cos(destLatRad) *
			Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return d = R * c; // in metres
};

/**
 * IndexOfSum.
 * 
 * @param {Object}      arr 
 * @param {Number}      val
 * 
 * @returns {index}
 */
exports.indexBeforeTarget = (arr, target) => {
	// this is to find the index at which the cumulative sum of values in the array exceeds the target value.
	// Used specifically on the array of durations, of each step, to return at which step the cumulative duration exceeds the given target time. 
	let duration = 0;
	var i=0;
	let len = arr.length;
	while (duration < target && i < len) {
		duration += arr[i];
		i++;
	} 
	return i;
};