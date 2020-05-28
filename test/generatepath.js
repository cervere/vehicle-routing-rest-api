const { chai, server, should } = require("./testConfig");

/**
 * Test cases to test all the Path Generating APIs
 * Covered Routes:
 * (1) Generate paths
 */

describe("GeneratePath", () => {
	// Prepare data for testing
	const testData = {
      origin: {
        "lat": 50.023226,
        "lon": 14.439855
      },
      destination: {
        "lat": 50.121765629793295,
        "lon": 14.489431312606477
      },
      time: 180,
      waypoints: [{
        "name": "Point A",
        "lat": 50.058010,
        "lon": 14.406775
      },{
        "name": "Point B",
        "lat": 50.060757,
        "lon": 14.431909
      },{
        "name": "Point C",
        "lat": 50.078847,
        "lon": 14.538084
      }]
    };

  /*
  * Test the /POST/api/path for several failure criteria
  * 1) GeneratePath NO 'x-secret' in the header : Should FAIL
  * 2) GeneratePath INVALID 'x-secret' value in the header : Should FAIL
  * 3) GeneratePath No origin (or destination) : Should FAIL
  * 4) GeneratePath 'x-secret' and all valid params : Should PASS
  * 5) GeneratePath 'x-secret', all valid params, onle ONE waypoint : Should PASS
  * 6) GeneratePath 'x-secret', all valid params, but NO waypoint : Should FAIL
  * 7) GeneratePath 'x-secret', all valid params, but non-numeric time : Should FAIL
  */


 describe("/POST GeneratePath NO 'x-secret' in the header : Should FAIL", () => {
  it("It should make an api call without a secret and fail.", (done) => {
    chai.request(server)
      .post("/api/path")
      .set({'content-type': 'application/x-www-form-urlencoded'})
      .send({origin : JSON.stringify(testData.origin), destination : JSON.stringify(testData.destination), time: testData.time, waypoints : JSON.stringify(testData.waypoints)})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("message").eql("Validation Error.");
        done();
      });
  });
});

	describe("/POST GeneratePath INVALID 'x-secret' value in the header : Should FAIL", () => {
		it("It should make an api call with an invalid secret and fail.", (done) => {
			chai.request(server)
        .post("/api/path")
        .set({'x-secret': 'WRONG_SECRET', 'content-type': 'application/x-www-form-urlencoded'})
        .send({origin : JSON.stringify(testData.origin), destination : JSON.stringify(testData.destination), time: testData.time, waypoints : JSON.stringify(testData.waypoints)})
				.end((err, res) => {
          res.should.have.status(400);
					res.body.should.have.property("message").eql("Validation Error.");
					done();
				});
		});
	});

  describe("/POST GeneratePath No origin (or destination) : Should FAIL", () => {
		it("It should make an api call without origin input and fail.", (done) => {
			chai.request(server)
        .post("/api/path")
        .set({'x-secret': 'Mileus', 'content-type': 'application/x-www-form-urlencoded'})
        .send({destination : JSON.stringify(testData.destination), time: testData.time, waypoints : JSON.stringify(testData.waypoints)})
				.end((err, res) => {
          res.should.have.status(400);
					res.body.should.have.property("message").eql("Validation Error.");
					done();
				});
		});
	});

  /*
  * Test the /POST route for all valid inputs - {secret in header, origin, destination, time and waypoints}
  */
	describe("/POST GeneratePath 'x-secret' and all valid params : Should PASS", () => {
		it("It should make a successful request with a valid secret and valid params.", (done) => {
			chai.request(server)
        .post("/api/path")
        .set({'x-secret': 'Mileus', 'content-type': 'application/x-www-form-urlencoded'})
        .send({origin : JSON.stringify(testData.origin), destination : JSON.stringify(testData.destination), time: testData.time, waypoints : JSON.stringify(testData.waypoints)})
				.end((err, res) => {
          res.should.have.status(200);
					res.body.should.have.property("message").eql("PathGeneration Successful.");
					done();
				});
		});
	});

  describe("/POST GeneratePath 'x-secret', all valid params, onle ONE waypoint : Should PASS", () => {
		it("It should make a successful request with a valid secret and params even with only one waypoint.", (done) => {
			chai.request(server)
        .post("/api/path")
        .set({'x-secret': 'Mileus', 'content-type': 'application/x-www-form-urlencoded'})
        .send({origin : JSON.stringify(testData.origin), destination : JSON.stringify(testData.destination), time: testData.time, 
          waypoints : JSON.stringify([testData.waypoints[0]])})
				.end((err, res) => {
          res.should.have.status(200);
					res.body.should.have.property("message").eql("PathGeneration Successful.");
					done();
				});
		});
	});

  describe("/POST GeneratePath 'x-secret', all valid params, but NO waypoint : Should FAIL", () => {
		it("The request should fail with a valid secret and params but no waypoints.", (done) => {
			chai.request(server)
        .post("/api/path")
        .set({'x-secret': 'Mileus', 'content-type': 'application/x-www-form-urlencoded'})
        .send({origin : JSON.stringify(testData.origin), destination : JSON.stringify(testData.destination), time: testData.time, 
          waypoints : JSON.stringify([])})
				.end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("message").eql("Validation Error.");
          done();
				});
		});
	});

  describe("/POST 'x-secret', all valid params, but non-numeric time : Should FAIL", () => {
		it("The request should fail without a valid (numeric) time param", (done) => {
			chai.request(server)
        .post("/api/path")
        .set({'x-secret': 'Mileus', 'content-type': 'application/x-www-form-urlencoded'})
        .send({origin : JSON.stringify(testData.origin), destination : JSON.stringify(testData.destination), time: 'SOME_STRING', 
          waypoints : JSON.stringify(testData.waypoints)})
				.end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("message").eql("Validation Error.");
          done();
				});
		});
	});

});