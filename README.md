# Vehicle Route Planning using OSRM API  

A basic project to expose an API for a specific problem of vehicle routing, exploring REST API Development with Node.js, Express (ES6 mostly)


## Getting started


This is a basic API skeleton mostly written in JavaScript ES2015 and more latest sometimes. Very useful to build a RESTful web APIs for several vehicle routing problems.

This project runs on **NodeJs**. The code structure is fairly easy to adopt to build more similar routing APIs and of course improve the structure further. Project is open for suggestions, Bug reports and pull requests. 


## Features

-   Basic secret verification in the requst header.
-   JWT Tokens, make requests with a token after login with `Authorization` header with value `Bearer yourToken` where `yourToken` will be returned in Login response.
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