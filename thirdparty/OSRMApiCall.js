const fetch = require('node-fetch');
const utility = require("../helpers/utility");
const PathModels = require('../models/PathModels');
const constants = require('../helpers/constants');

// Ideally this should be in ../models/PathModels as an interface with any provider like OSRM can implement
let PossiblePath = class {
	constructor(name, source, destination, OSRMResponse) {
		// From the super detailed output by OSRM, choosing the relevant ones for the current problem.
		this.name = name;
		this.source = source;
		this.destination = destination;
		// Each OSRMResponse is a request for source->waypoint->destination. So interested in only one (shortest) route provided by the response.
		this.pathStepCoords = OSRMResponse.routes[0].geometry.coordinates;
		var pathStepDurationsArr = [];
		for (var i = 0, len = OSRMResponse.routes[0].legs.length; i < len; i++) {
			pathStepDurationsArr.push(OSRMResponse.routes[0].legs[i].annotation.duration); //each is an array
		}
		this.pathStepDurations = pathStepDurationsArr.flat(1); //Technically of size 1 less than that of this.pathStepCoords
		this.stepIndexAtTarget = 0;
		this.distanceToDestAtTargetTime = utility.haversineDistance(source, destination);
	}
}

const BASE_OSRM_URL = 'http://router.project-osrm.org/route/v1/driving/';

let OSRM_ROUTE_SERVICE_OPTIONS = {
	"overview": "full",
	"annotations" : "duration",
	"geometries" : "geojson",
	"steps" : "true"
};

const getOSRMRequestParams = () => {
	let params = '';
	let options = constants.OSRM_ROUTE_SERVICE_OPTIONS;
	Object.keys(options).forEach(key => params += key+'='+options[key]+'&')
	params  = params.slice(0,-1);
	return params;
}

const getCoordinatesForOSRMRouteService = (origin, destination, waypoints) => {
	let coords = origin.lon+','+origin.lat+';';
	waypoints.forEach(wp => {
		coords += wp.lon+','+wp.lat+';';
	})
	coords += destination.lon+','+destination.lat;
	return coords;
}

exports.convertOSRMStepCoordsToJSON = (coordsarr) => {
	return {"lat" : coordsarr[1], "lon" : coordsarr[0]}; //OSRM response locations : [lon, lat]
}


exports.shortestPath = async (origin, destination, waypoints) => {
	coords = getCoordinatesForOSRMRouteService(origin, destination, waypoints);
	//origin.lon+','+origin.lat+';'+wp.lon+','+wp.lat+';'+destination.lon+','+destination.lat;
	const fullurl = BASE_OSRM_URL+coords+'?overview=full&annotations=duration&geometries=geojson&steps=true';
	const response = await fetch(fullurl);
	const data = await response.json();
	return data
};

const prepareItinerary = (origin, destination, waypoints, allOSRMPathResponses) => {
	let allPossiblePaths = []; // simplified PossiblePath objects for each waypoint
	for (var j = 0, lenj = waypoints.length; j < lenj; j++) {
		osrmPathResponse = allOSRMPathResponses[waypoints[j].name];
		let possiblePath = new PossiblePath(waypoints[j].name, origin, destination, osrmPathResponse);
		allPossiblePaths.push(possiblePath);
	}
	return new PathModels.Itinerary(origin, destination, allPossiblePaths);
};


/**
 * Prepare itinerary with all possible paths via each waypoint.
 * 
 * @param {Object}      origin 
 * @param {Object}      destination
 * @param {Object}      waypoints
 * 
 * @returns {Object}
 */
exports.requestUrl = async (origin, destination, waypoints) => {
	let pathresponses = {};
	
	for (var i = 0, len = waypoints.length; i < len; i++) {
		let wp = waypoints[i];
		let eachRoute = await this.shortestPath(origin, destination, [wp]);
		pathresponses[wp.name] = eachRoute;
	}

	let itinerary = prepareItinerary(origin, destination, waypoints, pathresponses)

	return itinerary;
};