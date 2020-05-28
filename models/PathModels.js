exports.Itinerary = class {
	// Ideally this class should be owned by our own controller, with PossiblePaths supplied by any provider like OSRM
	constructor(origin, destination, possiblePaths) {
		this.origin = origin;
		this.destination= destination;
		this.possiblePaths = possiblePaths;
	}
}