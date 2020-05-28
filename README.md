# Vehicle Route Planning using OSRM API  

A basic project to expose an API for a specific problem of vehicle routing, exploring REST API Development with Node.js, Express (ES6 mostly)


## Getting started


This is a basic API skeleton mostly written in JavaScript ES2015 and more latest sometimes. Very useful to build a RESTful web APIs for several vehicle routing problems.

This project runs on **NodeJs**. The code structure is fairly easy to adopt to build more similar routing APIs and of course improve the structure further. Project is open for suggestions, Bug reports and pull requests. 


## Features

-   Basic secret verification in the requst header.
-   Pre-defined response structures with proper status codes.
-   Validations added.
-   Test cases with [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/).
-   Code coverage with [Istanbuljs (nyc)](https://istanbul.js.org/).
-   Linting with [Eslint](https://eslint.org/).

## Software Requirements

-   Node.js **8+**

## How to install

### Using Git (recommended)

1.  Clone the project from github. 

```bash
git clone https://github.com/cervere/vehicle-routing-rest-api.git 
```

### Install npm dependencies after installing (Git or manual download)

```bash
cd vehicle-routing-rest-api
npm install
```

### Setting up environments

1.  You will find a file named `.env.example` on root directory of project.
2.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## Project  structure
```sh
.
├── .env
├── app.js
├── package.json
├── bin
│   └── www
├── controllers
│   ├── GeneratePathController.js
├── core
│   ├── GeneratePaths.js
├── models
│   ├── Authorization.js
│   └── PathModels.js
├── routes
│   ├── api.js
│   ├── auth.js
│   └── book.js
├── middlewares
│   ├── jwt.js
├── helpers
│   ├── apiResponse.js
│   ├── constants.js
│   └── utility.js
├── test
│   ├── testConfig.js
│   ├── generatepath.js
└── public
    ├── index.html
    └── stylesheets
        └── style.css
```
## How to run

### Running  API server locally

```bash
npm run dev
```

You will know server is running by checking the output of the command `npm run dev`

```bash
App is running ...

Press CTRL + C to stop the process.
```
 
### Example
The server should be up and running. Test `http://localhost:3000/`, you should see a simple home page.

This porject is built with a specific example in mind. In short, given an `origin`, `destination` and `n waypoints` implying `n` possible routes between `origin` and `destination`, and assuming there is a car on each of these routes : the `POST` request to the API should return the `winner` car which is the closest to `destination` after `time` seconds after all cars started at `origin`.

To test the 'POST' api to get a winner :

Request `http://localhost:3000/api/path` with `POST` and in a property `x-secret` in the header of the request.
**Note:** the valid secret is configured in the `.env` file as `JWT_SECRET`. This is mix-up at the moment. Ideally `JWT` can be used when proper authentication is in place. The secret that need to be mathced with that in the `request header` could be fetched from a remote database.

The following is an example `data` to be sent in a POST request. 
```
{
    "origin": {
        "lat": 50.023226,
        "lon": 14.439855
    },
    "destination": {
        "lat": 50.121765629793295,
        "lon": 14.489431312606477
    },
    "time": 180,
    "waypoints": [
        {
        "name": "Point A",
        "lat": 50.058010,
        "lon": 14.406775
        },
        {
        "name": "Point B",
        "lat": 50.060757,
        "lon": 14.431909
        },
        {
        "name": "Point C",
        "lat": 50.078847,
        "lon": 14.538084
        }
    ]
}
```

The output should look like :
```
{
    "status": 1,
    "message": "PathGeneration Successful.",
    "data": {
        "winnerName": "Point B",
        "delays": {
            "Point A": 205.30000000000004,
            "Point B": 0,
            "Point C": 178.80000000000007
        }
    }
}
```

### Postman example 
(header : 'x-secret' : '<check .env file>')
![Alt text](git_resources/postmanexample.png?raw=true "Postman example")
### Creating new models

If you need to add more models to the project just create a new file in `/models/` and use them in the controllers.

### Creating new apis

If you need to add more api routes to the project just create a new file in `/routes/` and add it in `/routes/api.js` it will be loaded dynamically.
**Note:**  here _route_ refers to API routing on server, not vehicle routes. 

### Creating new controllers

If you need to add more controllers to the project just create a new file in `/controllers/` and use them in the routes.

## Tests

### Running  Test Cases

```bash
npm test
```

You can set custom command for test at `package.json` file inside `scripts` property. You can also change timeout for each assertion with `--timeout` parameter of mocha command.

### Creating new tests

If you need to add more test cases to the project just create a new file in `/test/` and run the command.

## Bugs or improvements

Many known-limitations will be added as bugs already.
Feel free to report any more bugs or improvements. Pull requests are always welcome.

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
