# mixedindentlint
A general-purpose linter for lines that do not match the indentation style of a file

# Installing
There are two ways to use mixedindentlint: as a node (javascript) module, or as a command-line tool.

## Installing the command-line tool
You will need to install [Node](https://nodejs.org/) if you don't have it already.

First, install using npm globally:

```
npm install -g mixedindentlint
```

Then you can run checks on specific files like this:

```
mixedindentlint file1.scss file2.js
```

The output will be empty unless there are warnings ("no news is good news!"). Warnings look like this:

```
Line 183 in "./assets/stylesheets/sections/something.scss" has indentation that differs from the rest of the file.
Line 229 in "./assets/stylesheets/sections/something.scss" has indentation that differs from the rest of the file.
Line 335 in "./assets/stylesheets/sections/something-else.scss" has indentation that differs from the rest of the file.
Line 339 in "./assets/stylesheets/sections/something-else.scss" has indentation that differs from the rest of the file.
```

## Installing as a node module
If you want to use mixedindentlint inside javascript, you can just require it.

First, install using npm:

```
npm install mixedindentlint
```

Then require it in your code and call the `lint` function, which takes a string of input and will check each line.

```javascript
var lint = require( 'mixedindentlint' ).lint;
var warnings = lint( fileContents ); // Each warning is a line number which doesn't match the indentation of the file
```
