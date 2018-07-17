# Pulse Dashboard
[![Build Status](https://travis-ci.org/Recidiviz/pulse-dashboard.svg?branch=master)](https://travis-ci.org/Recidiviz/pulse-dashboard) [![Coverage Status](https://coveralls.io/repos/github/Recidiviz/pulse-dashboard/badge.svg?branch=master)](https://coveralls.io/github/Recidiviz/pulse-dashboard?branch=master)

An in-progress effort to visualize criminal justice metrics.

## Contents
1. [Development](#development)
1. [Tooling](#tooling)
1. [Application Structure](#application-structure)
1. [Data Sources](#data-sources)
1. [License](#license)

## Development

### Getting set up
1. Grab the source:

   ```git clone git@github.com:Recidiviz/pulse-dashboard.git```
1. Install Yarn package manager:

   ```brew install yarn```

   For alternative Yarn installation options, see [Yarn Installation](https://yarnpkg.com/en/docs/install).
1. Install dependencies:

   ```yarn install```

That's it! We suggest installing a linting package for your preferred code editor that hooks into [eslint](#eslint). We recommend [linter-eslint](https://atom.io/packages/linter-eslint) for Atom.

### Linting & running tests
A yarn script is available to run both [eslint](#eslint) and tests via [Jest](#jest):

```yarn test```

This is the generally advisable way to roll. This task will also be executed prior to any `git commit` or `git push` action using [husky](#husky). Running tests this way will also write code coverage statistics to stdout and the `coverage` directory.

To run eslint manually:

```eslint src```

To run Jest manually:

```jest [optional-filepath]```

If you would like to get your TDD on and run Jest in watch mode, you can use:

```yarn test:watch```

### Running the application locally
A yarn script is available for starting the development server. This will also automatically open a browser to localhost on the appropriate port.

```yarn start```

Each time this is run, the `build` directory will be wiped clean. A [bundle analysis](#Bundle-analysis) report, found in `build/report.html`, will also be generated on each invocation of this script.

The development server will remain active until you either close your terminal or shut down the server using `control+c`.

**Note:** The development server does not need to be restarted when source code is modified. The assets will automatically be recompiled and the browser will be refreshed. Thanks, webpack!

### Generating a production build
To generate a production build, invoke the following yarn script:

```yarn build```

Each time this is run, the `build` directory will be wiped clean. A bundle analysis report, found in `build/report.html`, will also be generated on each invocation of this script.

### Running the application in production [TODO]

## Tooling

### Yarn
[Yarn](https://yarnpkg.com/en/) is a package manager for Node modules that is similar to npm but with [superior performance](https://github.com/pnpm/node-package-manager-benchmark). It is used to specify and install dependencies for the application. Adding a dependency is as simple as:

```yarn add package```

If the package is not required in production it should be added as a development dependency with the `--dev` flag:

```yarn add --dev package```

See the [Yarn documentation](https://yarnpkg.com/en/docs) for more details and a full list of commands available via the CLI.

### webpack
[webpack](https://webpack.js.org/) is a highly-configurable tool for compiling JavaScript modules. We use it to bundle all of our JavaScript, CSS, and static assets for efficient distribution in production.

webpack has a reputation for being intimidating but don't let that deter you. The core idea of webpack is to specify a set of inputs (file types and locations), indicate how those inputs should be processed (via loaders and plugins), and specify how the resulting output should be generated. Check out the webpack [Getting Started guide](https://webpack.js.org/guides/getting-started/) if you're interested in learning more.

#### Our webpack config
A few points of note about our current webpack configuration which can be found in `webpack.config.js`:

1. The app is simple at this point so we specify a single entry point, `src/index.js`, and a single output bundle, `app.bundle.js`. Output is configured to dynamically create bundles based on entry points. If additional bundles are desired, simply add an additional entry point to the `entry` property.
1. Production bundles and assets will be written to the `build` directory. This directory is wiped clean each time a production build is initiated.
1. We use `HtmlWebpackPlugin` to dynamically insert generated bundles to `index.html` during production builds. For this reason, you won't find any JavaScript bundle references in `src/index.html`. The resulting production version of `index.html` will be written to the `build` directory. If you inspect that file, you'll see the dynamically generated `<script>` tags with our bundle(s).

#### Bundle analysis
We have configured `BundleAnalyzerPlugin` to facilitate bundle analysis. This can be useful for managing bundle bloat or spotting unnecessary dependencies. For convenience, a yarn script has been created to launch the bundle analyzer tool. To run this, execute the following command:

```yarn analyze-bundle```

**Note**: you will need to have either started the development server or executed a production build at least one time for this to work as the `build/report.html` file is generated during either of these actions.

### Jest
[Jest](https://facebook.github.io/jest/) is our testing framework. It provides a friendly testing API, a powerful and easy-to-use mocking functionality, and plenty of speed. Snapshot testing is also a nice feature but should be used with caution. It is served best as a supplement, rather than a substitute, of a robust set of unit tests that properly describes what a piece of code is intended to do.

To execute tests, see [Linting & running tests](#linting--running-tests).

To add new tests, create a file with the same name as the file you are testing and append the extension `.test.js`. This file should be located in the same directory as the file you are testing.

For example, if you are testing the `Recidiviz` component which is defined in `Recidiviz.js`, you would add tests in `Recidiviz.test.js`.

See Jest [API](https://facebook.github.io/jest/docs/en/api.html) and [Docs](https://facebook.github.io/jest/docs/en/getting-started.html) for more information.

### Enzyme

[Enzyme](http://airbnb.io/enzyme/) is a utility for unit testing React components. It's particularly handy for its ability to shallow render a component for isolated testing, fully mount a component to test lifecycle methods, select elements in a variety of ways with ease, and simulate events to test handlers.

See Enzyme [API](http://airbnb.io/enzyme/docs/api/) for more information.

### eslint
[eslint](https://eslint.org/) is a flexible linter for JavaScript. We have configured eslint to adhere to the Airbnb style guides for [Javascript](https://github.com/airbnb/javascript) and [React](https://github.com/airbnb/javascript/tree/master/react), with a few [exceptions](https://github.com/Recidiviz/pulse-dashboard/.eslintrc), in addition to the base eslint JS rules.

To run the linter, see [Linting & running tests](#linting--running-tests).

We suggest installing a linting package for your preferred code editor that hooks into eslint. This will allow you to get real time feedback on code while you're writing it. We recommend [linter-eslint](https://atom.io/packages/linter-eslint) for Atom.

### husky
[husky](https://github.com/typicode/husky) is a package that provides easy-to-use Git hooks. These are defined in `package.json` under the `husky` property. We have configured husky to run linting and testing prior to all git commits and pushes using the `pre-commit` and `pre-push` hooks.

### React
[React](https://reactjs.org/) is a JavaScript framework for building user interfaces. Unlike some other popular JS frameworks, it focuses exclusively on the view layer and is agnostic as to your choices for other parts of your application.

React [documentation](https://reactjs.org/docs/hello-world.html) is very high quality and helpful for getting started.

## Application Structure
A quick overview of the directory structure and suggestions on where to put different things.

```
/__mocks__
/build
/coverage
/data
/src
  components/
  config/
  lib/
    static/
      css/
      js/
/static
  fonts/
  images/
```
### Application root (/)
Home to files such as `webpack.config.js` and `package.json` for configuring build, dependencies, etc. Files in the application root are generally not bundled by webpack.

### src
Application source code. If you're writing it, it should most likely end up here.

#### src/components
All React components should exist under this directory. Each component should have a separate directory. Add an `index.js` file in each component directory that exports the React component:

```export { default } from './Recidiviz';```

This will let you import like so:

```import Recidiviz from './Recidiviz';```

rather than doing this:

```import Recidiviz from './Recidiviz/Recidiviz';```

It's common for React components to have one or more sub-components. This hierarchy should be reflected in the directory structure. Add sub-component directories within the containing parent component directory. For example:

```
/src/components/Recidiviz
  Recidiviz.js
  Recidiviz.test.js
  Recidiviz.css
  index.js
/src/components/Recidiviz/RecidivizSlider
  RecidivizSlider.js
  RecidivizSlider.test.js
  index.js
```

Test files and CSS files should also be placed in the component directory.

For further discussion on React application structure and rationale for the above choices, see [this blog post](https://hackernoon.com/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed).

#### src/config
Application configuration files, shared constants, etc.

#### src/lib
Third-party code. If you're not writing it, it should probably live here. Individual files should live in the appropriate sub-directory under `lib/static`. If entire libraries are being manually included, they should live in their own directory. It should rarely, if ever, be necessary to manually include an entire third party library. That's what we have [Yarn](#yarn) for!

As all code in this directory is intended to be third-party, this directory is ignored by eslint as it is not our responsibility to maintain third-party code.

**Note:** JS and CSS files from the original version of recidiviz.com live under `lib/static`. This was an intentional choice to prevent having to rewrite that code, much of which was used or extended from third-party code, after implementing linting.

### static
Static assets like fonts and images. Place assets in the appropriate sub-directory.

### data
Data sets and code for generating them. See [Data Sources](#Data-Sources) for more details.

### build
Contains production bundles and assets. Automatically populated by [Generating a production build](#generating-a-production-build). This directory will be wiped on each production build or after [running the application locally](#running-the-application-locally).

### coverage
Contains code coverage reports which are automatically generated when [running tests](#linting--running-tests).

### __mocks__
Used to house mock files and functions. Loaded by [Jest](#jest) when running tests.

## Data Sources
Standardized data sets for tracking recidivism are difficult to come by. Data that we are using for this project can be found in the `/data` directory, grouped by source. Inside each source directory will be scripts for extracting and transforming the data into a suitable format, as well as extracts we have created for the project.

### Bureau of Justice Statistics
The [United States Bureau of Justice Statistics](https://bjs.gov/) published [_Recidivism Of Prisoners Released In 30 States In 2005: Patterns From 2005 To 2010_](https://www.bjs.gov/index.cfm?ty=pbdetail&iid=4986), which gathered and analyzed data regarding inmates released from prisons in 30 states in 2005 to determine recidivism rates among inmates over the ensuing 5 years. The data is broken down by demographics, sentence history, and criminal offense. The BJS in turn built [a tool for sifting through that data](https://www.bjs.gov/recidivism_2005_arrest/#) to look up recidivism rates for inmates matching certain characteristics.

We wrote a script to repeatedly request the endpoint behind that tool to create bulk extracts of certain projections of the data set. Those extracts are included here and are totally free for any use you see fit, as long as you provide citation to the underlying study and obey any terms of use on the BJS website. Citation:

Snyder, Howard N., Durose, Matthew R., Cooper, Alexia, and Mulako-Wangota, Joseph. Bureau of Justice Statistics. Generated using the Prisoner Recidivism Analysis Tool - 2005 (PRAT-2005) at http://www.bjs.gov/recidivism_2005_arrest/. (02/04/2016).

## License
This project is licensed under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
