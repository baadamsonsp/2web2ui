# SparkPost App

[![Build Status](https://travis-ci.org/SparkPost/2web2ui.svg?branch=master)](https://travis-ci.org/SparkPost/2web2ui)
[![Coverage Status](https://coveralls.io/repos/github/SparkPost/2web2ui/badge.svg?branch=master)](https://coveralls.io/github/SparkPost/2web2ui?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/SparkPost/2web2ui.svg)](https://greenkeeper.io/)


A re-build of the current SparkPost web app using React and Redux.

## Installing dependencies

This project uses `npm6`, so upgrade if you haven't.
```
npm install npm@6 -g
```

Then `npm install` to install deps.

## Local development

`npm start` will start a dev server backed by api.sparkpost.dev with live reload on http://localhost:3100/

## Tests

Running the test suite:
```
npm test
```
**NOTE:** You may need to `brew install watchman` for jest to run in watch mode on OS X.
https://github.com/facebook/react-native/issues/9309#issuecomment-238966924

## Learning Resources

A good comparison of React and Redux and how they relate to Angular is here:
https://github.com/jasonrhodes/how-to-react

If you're new to React, you should have a basic understanding of how it works before jumping into this project. Mainly, you should understand what `JSX` is, the difference between a functional/stateless and class component, and how `setState` works inside class components.

Here are some resources for learning basic React:

- https://reactforbeginners.com/
- https://reactjs.org/tutorial/tutorial.html

Once you're familiar with React, you should also begin to understand what Redux is. For Redux, you should understand what an action creator and a reducer is, how you `connect` a component to the Redux store using `react-redux` (and using connect's 2 arguments, `mapStateToProps` and `bindActionCreators`), and when to use Redux vs. local component state.

Good resources for learning Redux:

- https://egghead.io/courses/getting-started-with-redux
- https://learnredux.com/

A few other things you will want to understand that we make heavy use of in this app:

- [Redux Thunk](https://github.com/gaearon/redux-thunk) - A "middleware" library for redux that lets us dispatch a function instead of a plain object action. Helps with doing async stuff in actions.
- [React Router](https://reacttraining.com/react-router/web/guides/philosophy) - This is the router we use for the entire application. We add new routes using declarative config but for things like `Link` and `props.location.match` you'll need to understand how RR works on some level.
- [Reselect](https://github.com/reactjs/reselect) - Selectors are a redux idea that lets us move all logic out of `mapStateToProps` functions so it can be properly tested. The reselect library helps us create selectors that also get a nice memoization benefit.

## About the project

Before jumping into writing code, here are a few conventions you should be aware of:

1. We use ESLint to enforce automated linting. The config is extended from a few places and defined inside the package.json file, under the "eslintConfig" key (instead of using a root level .eslintrc file).
    * To run our linting, you can run `npm run lint` or `npm run lint -- --fix` to run in "auto fix mode".
    * Linting is run during the build process but NOT during tests (jest runs tests in watch mode)
    * We are always looking for ways to move things into automated linting instead of just having "conventions" listed later in this section.
    * We should consider looking at some combination of prettier and eslint at some point.

1. **File and folder names:** everything is camelCase except for component files and other class-only files, which are PascalCase. When in doubt, file names should match the default export's function/class/variable name.

1. **index.js "directory" files:** when there are 3 or more components in a sub-directory (e.g. src/pages/webhooks), export all of them inside of an index.js file there, for easier and less verbose imports elsewhere.

1. **Sub-directory groups:** Any time you have more than one file making up a component or related set of components, put them in a sub-directory (e.g. src/components/collection/*)

1. **Magic module resolution:** we use webpack tomfoolery and jest shenanigans to make our modules resolve relative to `src/`, so you can `import something from whatever/yeah` so long as there is a `src/whatever/yeah.js` file. And so on. You should prefer this style to relative imports unless the files are directly next to each other or are related to each other and no more than one directory away.
    * Note: we should change this to resolve relative to the root, and then ever import from `src/` e.g. `import something from 'src/whatever/yeah'` to limit the scope of possible node_modules conflicts. Will need to change all existing references and then edit Jest and Webpack configs.

1. **Don't use lodash `_.chain`.** We use [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash#limitations) to tree-shake our use of lodash so we only have to bundle methods we use, but `_.chain` breaks all of that. If you want to do something like chaining, you can use `flow` from `lodash/fp`, which is somewhat explained in [this article](https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba).
    * Note: use `flow` and not `compose` bc compose is backwards and weird. ;)
    * Other note: you can import directly from `lodash/fp` because of our babel transform. (e.g. `import { map, flow } from 'lodash/fp'`)

### Testing Conventions

* `tests/` folders are to be included as a sibling to the files they test, with all test files for that folder contained inside the `tests/` directory there.

* We use jest for testing and, as much as possible, for all unit test mocking. See our [jest guide](./docs/jest.md) for how we accomplish this black magic.

* Always prefer to use built in jest assertions over generic equality comparisons:
    ```javascript
    // do this
    expect(fn).toHaveBeenCalledWith(arg1, arg2);

    // not this
    expect(fn.mock.calls[0]).toEqual([arg1, arg2]);
    ```

* We use *a lot* of snapshot testing. It works great for anything serializable. We first thought we would keep these tests separate in their own files but that turned out to be a silly idea, Jason. Now we just incorporate them into any test where they make sense, so you'll see lots of `tests/__snapshots__` directories all over.

* We use a good amount of enzyme for any kind of logic testing (simulating actions in a component) or for shallow rendering, usually so we can snapshot test something without testing all of its dependency components.

* We believe in direct regular old unit testing wherever possible, mostly for helpers. In other words, if we don't have to involve react in a test, we don't.

* We try not to unit test redux, i.e. no tests for connected components or for mapStateToProps functions etc., we mock connected state and actions and pull any mapStateToProps logic into selectors where they can be tested more easily. We do sometimes use redux-mock-store to test chains of dispatches, but in those cases we just end up snapshot testing the dispatch chain.

### Docs

We have two types of internal docs: general and directory-based. You'll find general docs like testing guides and general redux patterns, etc. in [our top level docs folder](./docs), but component directories will often have their own README.md files or docs folders (similar to tests) where individual docs related to those specific components can be found.

- [Access Control](./docs/access-control.md)
- [Jest](./docs/jest.md)
- [Redux Form](./docs/redux-form.md)
- [Redux](./docs/redux-redux.md)
- [Styles](./docs/styles.md)

Components:
- [Collection](./src/components/collection/docs/Collection.md)
- [PlanPicker](./src/components/planPicker/readme.md)

![](https://media0.giphy.com/media/5y1LH29N3k556/giphy.gif)

*Testing a change to a .md file, should not trigger a bamboo build*
