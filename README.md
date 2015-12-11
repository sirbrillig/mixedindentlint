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

# Options

## Force indentation type

Rather than scanning each file for the most common type of indentation and then reporting lines which differ (the default behavior), it is possible to specify the style of indentation which the file should have.

On the command-line, this is done with the `--spaces` or `--tabs` options. So the following command will return the line numbers of each line in myFile.js that was NOT indented with tabs:

`mixedindentlint --tabs myFile.js`

Using the node module this is done by passing the `indent` option to `lint()`. Therefore, the following line will return the line numbers of each line in `input` that was NOT indented with spaces:

`lint( input, { indent: 'spaces' } );`

## Ignore comments

By default, mixedindentlint will report mixed indentation for all the lines of a file, including code comments. It is possible to ignore comment lines altogether, however.

On the command-line, using the `--ignore-comments` option will prevent scanning lines that mixedindentlint thinks are comments. If you find a type of comment that is still scanned, please open an issue to report it.

Using the node module this is done by passing the `comments` option to `lint()`. The following example will return lines of input that have incorrect indentation while completely ignoring comments.

`lint( input, { comments: true } );`

## Exclude file

This is an option that only exists on the command-line tool. Since you can pass a blob or a group of files to `mixedindentlint`, there may be files you want to skip. For each of these files you can specify either the file name or the full path name to the file with the `--exclude` option.

For example, if you wanted to scan all the JavaScript files in the directory `src` except for `src/config.js` and `src/data/input.js`, you could run the following command:

`mixedindentlint --exclude=config.js --exclude=src/data/input.js src/*.js`
