# Basic Website Template

A template for developing web sites with sass and ECMAScript 6.

## Getting Started

### Prerequisites

To run this project you will need to have node installed which can be installed at "https://nodejs.org/en/".

Once you have installed node you will need to install the gulp cli globally.

```
 npm install gulp-cli -g
```

I'd also suggest install jshint globally to lint your code.
```
 npm install jshint -g
```

### Installing

To get started simply clone this repository.

```
$ git clone https://github.com/dandouglas/template-website.git
```

Navigate into the template root.
```
$ cd template-website
```

Install the dependencies.
```
$ npm install
```

### Getting Started

To get started simply type `gulp`.

```
$ gulp
```

This will create a local tmp folder and serve all the files from there.  Browser sync will watch for changes to the app folder and automatically copy the changes to the tmp folder and refresh the browser.  

Script and style path links will be automatically injected into "index.html".

To run the project in a production environment run the following commamd.
```
$ gulp serve --env production
```

This will create a local "dist" folder and serve all the files from there.  The "dist" folder will contain minified versions of the css as well as minified and uglified versions of the javascript code.
