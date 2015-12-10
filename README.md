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
var fileContents = "  foo\n  bar\n\tbaz";
var warnings = lint( fileContents ); // Each warning is a line number which doesn't match the indentation of the file
console.log( warnings ); // Will print [3] because the third line uses a tab and the other two lines use spaces
```

# Use in Editors

You can automatically use mixedindentlint in your favorite editor with a plugin.

## Atom

For the excellent [Atom](https://atom.io/) editor, install the [linter-mixed-indent](https://github.com/sirbrillig/linter-mixed-indent) plugin.

## Vim

For vim, install mixedindentlint globally on your system as described above, then install the [Syntastic](https://github.com/scrooloose/syntastic/) plugin. Synatastic is filetype-specific, so mixedindentlint will only run on JavaScript, CSS, and SCSS files currently. You may need to configure Syntastic to activate the plugin.
