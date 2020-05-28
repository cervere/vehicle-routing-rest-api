const { header, body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const validator = require("validator");
const OSRMApiCall = require("../thirdparty/OSRMApiCall");
const GeneratePaths = require("../core/GeneratePaths");
const Auth = require('../models/Authorization');

const customValidatorForLocations = (value, label) => {
	try {
		ori = JSON.parse(value);
	} catch(err) {
		throw new Error(label+' must be a valid JSON');
	}
	if (!validator.isLatLong(ori.lat+','+ori.lon)) {
		throw new Error('Invalid ' + label + ' Coordinates. Expected : {lat : , lon : }');
	}
	return true;
}
/**
 * Book store.
 * 
 * @param {Object}      origin 
 * @param {Object}      destination
 * @param {number}      time
 * @param {Object}      waypoints
 * 
 * @returns {Object}
 */
exports.generatePaths = [
	//Alternatively, is it ok to validate after sanitize?
	header("x-secret", "Invalid secret received. Try again ;)").equals(Auth.getSecretForHeader()),
	body("origin").custom((value, {req}) => {
		return customValidatorForLocations(value, 'Origin');
	}),
	body("destination").custom((value, {req}) => {
		return customValidatorForLocations(value, 'Destination');
	}),
    body("time", "Time should be positive").isNumeric(),
	body("waypoints", "Waypoints must be a non-empty JSON Array.").isJSON().custom((value, {req}) => {
		return JSON.parse(value).length > 0;
	}),
	sanitizeBody("*").unescape(),
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				let origin = JSON.parse(req.body.origin);
				let destination = JSON.parse(req.body.destination);
				let waypoints = JSON.parse(req.body.waypoints);
				let time = JSON.parse(req.body.time);
				let itinerary = await OSRMApiCall.requestUrl(origin, destination, waypoints, time);
				//console.log(pathresponses);
				return  apiResponse.successResponseWithData(res,"PathGeneration Successful.", GeneratePaths.processPathGenerationRequest(itinerary, time));
				}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];