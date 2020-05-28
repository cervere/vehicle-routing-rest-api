const utility = require("../helpers/utility");
const OSRMApiCall = require("../thirdparty/OSRMApiCall");

const getClosestDistanceToDestination = (possiblePaths) => {
	var closest = possiblePaths[0].distanceToDestAtTargetTime ;
	possiblePaths.forEach(path => {
		if (path.distanceToDestAtTargetTime < closest ) {
			closest = path.distanceToDestAtTargetTime;
		}
	});
	return closest;
};

const getClosestVehicleToDestination = (itinerary) => {
	var finalrespDup = {"winnerName" : "", "delays" : {}};
	var closestDistanceToDestination = getClosestDistanceToDestination(itinerary.possiblePaths)
	itinerary.possiblePaths.forEach(possiblePath => {
		if (possiblePath.distanceToDestAtTargetTime - closestDistanceToDestination == 0) {
			finalrespDup.winnerName = possiblePath.name;
			finalrespDup.delays[possiblePath.name] = 0;
		} else {
			var delay = 0;
			var startStepIndex = possiblePath.stepIndexAtTarget + 1;
			while(possiblePath.distanceToDestAtTargetTime > closestDistanceToDestination && startStepIndex < possiblePath.pathStepDurations.length) {
				delay += possiblePath.pathStepDurations[startStepIndex];
				let coordsAtTargetTime = possiblePath.pathStepCoords[startStepIndex+1];
				const loc = OSRMApiCall.convertOSRMStepCoordsToJSON(coordsAtTargetTime);
				var distanceToDestAtTargetTime = utility.haversineDistance(loc, itinerary.destination);
				possiblePath.distanceToDestAtTargetTime = distanceToDestAtTargetTime;
				startStepIndex++;
			}
			finalrespDup.delays[possiblePath.name] = delay;
		}
	});
	return finalrespDup;
};

exports.processPathGenerationRequest = (itinerary, time) => {
	itinerary = this.updateItineraryAccordingToTimeElapsed(itinerary, time);
	return getClosestVehicleToDestination(itinerary);
};

exports.updateItineraryAccordingToTimeElapsed = (itinerary, timeElasped) => {
    itinerary.possiblePaths.forEach(possiblePath => {
        let stepIndexAtTarget = utility.indexBeforeTarget(possiblePath.pathStepDurations, timeElasped);
        possiblePath.stepIndexAtTarget = stepIndexAtTarget;
        let coordsAtTargetTime = possiblePath.pathStepCoords[stepIndexAtTarget+1];//duration[0] corresponds to stepCoords[1]
        let loc = OSRMApiCall.convertOSRMStepCoordsToJSON(coordsAtTargetTime);
        let distanceToDestAtTargetTime = utility.haversineDistance(loc, itinerary.destination); 
        possiblePath.distanceToDestAtTargetTime = distanceToDestAtTargetTime;
    });
    return itinerary;
}
