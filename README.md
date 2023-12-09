# Getting Started
IRLAmongUs is developed in JavaScript, React, and firebase (BaaS). As such, this project requires `node.js` to be installed on the system running it. If node.js is not already installed, download the latest (stable) version [here](https://nodejs.org/en/download).


Node comes with two package managers, `npm` and `yarn`. This project uses `yarn`. Note: it is recommended not to mix-and-match managers, i.e., do not use `npm`.

Once node has been installed, `cd` into the root project directory and install project dependencies:

```
$ cd <root-project-directory>
$ yarn install
```

This command installs all "dependencies" and "devDependencies" in *package.json* to an (untracked) directory, **node_packages** in the root project directory.

Once dependencies have been added, you are ready to develop, test, and build! Below are available `yarn` scripts to get you off the ground.

Go ahead, give `yarn start` a shot and see how it goes!

##Steps to Trigger build

After installing Node.js, do the following: 

1) Run ```yarn install```
2) Run ```yarn build``` to build the project
3) Run ```yarn start``` to run the application on your local machine.
4) Run ```yarn test``` to run tests.
   
## Available `yarn` Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### Deployment
 Our deployed site is available at: https://irl-among-us-d5453.web.app
