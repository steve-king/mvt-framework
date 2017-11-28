# MVT FRAMEWORK
A new and consistent approach for building the old style (i.e pre-nextgen) Multi Variant Tests.

## Usage
- `npm run build -- --env [srcFolder]`
- `npm start -- --env [srcFolder]`

`build` runs once. `start` will watch for changes and recompile continuously.

`[srcFolder]` is the name of the test folder you are working on in `./src/mvt` - (what is the naming convention for these folders? Job number only? Or descriptive?)

Your test folder root __must__ contain 1 JS entry file for each variant in your test. Any other JS code must be placed in a sub folder (enforce a convention here?)

SCSS files need to be imported into your JS so that webpack may compile them. Keep these in a `/styles` subfolder and arrange these as you want depending on the test you are building. This might be for example `v1.scss` or more component specific files that can be shared between variants e.g. `cta.scss`

## Build output
- Variants are compiled by webpack into separate folders in `./dist`, named as per your entry files __(should we force a convention here? e.g. v1, v2, v3)__
- Each variant output will comprise of a single `script.js` and `styles.css` file.
- From the above two files, our custom compile script then generates two additional files:
- `offer.html` formats the code for an Adobe Target "offer" so you can paste it in to the Target web interface and deploy/test your MVT
- `console.js` formats the code for the browser console - so you can paste it directly into your dev tools for an very simple and laborious local dev setup

## Node proxy server
- Run `npm run proxy` in a separate console to start a local proxy server at `127.0.0.1:8001`.
- You can see the traffic going through it at `http://localhost:8002`
- Use the SwitchyOmega Chrome extension and configure it to use the above proxy server.
- HTML responses from webpages will now be modified to include the markup from `offer.html` before the closing `</body>` tag, provided the following conditions are met:
  1) The domain matches one of those in the `domains` array at the top of `scripts/proxy.js`
  2) The url contains an mvt query parameter e.g. `?mvt=variantName` - where v1 matches the folder name of the variant you wish to load in `./dist`.
- For this to work on secure (SSH) domains, you will need to run `./node_modules/.bin/anyproxy-ca` and follow the instructions to generate and trust the rootCA.crt


## Pre-commit hooks:
We're using `stylelint` and `eslint` on a pre-commit hook so it's recommended that you install the relevant plugins to your text editor to flag help you fix any issues when they arise

## TODO:
- Port over and test/refactor the utils we need from the old Target repo
- run unit tests? pre-commit hook for these
- `README.md` must be present (and not empty) in each test folder
