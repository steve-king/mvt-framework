# MVT FRAMEWORK
A new and consistent approach for building the old style (i.e pre-nextgen) Multi Variant Tests.

## Usage
- `npm run build -- --env [folderName]`
- `npm start -- --env [folderName]`

`[folderName]` is the name of the test folder you are working on in `./src/mvt` - (which should be named with the job number only?)

Your test folder root __must__ contain 1 JS entry file for each variant in your test. Any other JS code must be placed in a sub folder

SCSS files need to be imported into your JS so that webpack may compile them.

`build` runs once. `start` will watch for changes.

## Build output
- Variants are compiled by webpack into separate folders in `./dist`, named as per your entry files __(should we force a convention here? e.g. v1, v2, v3)__
- Each variant output will comprise of a single `script.js` and `styles.css` file.
- From the above two files, our custom compile script then generates two additional files:
- `offer.html` formats the code for an Adobe Target "offer" so you can paste it there in and deploy the test
- `console.js` formats the code for the browser console - paste it there for a low-tech local development solution

## Node proxy server
The high tech version! (to be continued...)


## To do
- Add a proxy solution so that having a working knowledge of CharlesProxy isn't a development requirement
- Add eslint and sasslint rules
- Add a unit testing framework
- Port over and test/refactor the utils we need from the old Target repo

### Pre-commit hooks we should add:
- eslint/sasslint must pass
- A unit test/spec file must be present for every JS file (is this appropriate, or too much?)
- unit tests must pass
- A `README.md` must be present (and not empty) in each test folder