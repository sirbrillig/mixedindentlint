#!/usr/bin/env node

var fs = require( 'fs' );
var path = require( 'path' );
var parseArgs = require( 'minimist' );
var globby = require( 'globby' );
var IndentChecker = require( '../lib/indent-checker' );

var argv = parseArgs( process.argv.slice( 2 ), {
	boolean: [
		'version',
		'ignore-comments',
		'spaces',
		'tabs'
	],
	default: {
		version: null,
		'ignore-comments': null,
		spaces: null,
		tabs: null
	}
} );

// --exclude is redundant now, it's equivalent to put a file pattern with a "!" at the start. Keep backwards-compatibility:
if ( argv.exclude ) {
	if ( ! Array.isArray( argv.exclude ) ) {
		argv.exclude = [ argv.exclude ];
	}
	argv._ = argv._.concat( argv.exclude.map( function( file ) { return '!' + file; } ) );
}

var files = globby.sync( argv._ );

if ( argv.version ) {
	var version = require( '../package.json' ).version;
	console.log( 'mixedindentlint version ' + version );
	process.exit( 0 );
}

if ( files.length < 1 ) {
	console.log( 'No files to lint' );
	console.log( 'Usage: mixedindentlint [options] <file1> [<file2>...]' );
	console.log( 'Options:' );
	console.log( '  --version\t\tPrint the current version.' );
	console.log( '  --ignore-comments\t\tIgnore anything identified as a comment line.' );
	console.log( '  --spaces\t\tAssume all files should use spaces rather than the most common indentation.' );
	console.log( '  --tabs\t\tAssume all files should use tabs rather than the most common indentation.' );
	console.log( '  --exclude=<file>\t\tDo not scan <file> even if it is listed. Useful when passing a blob. Can be used multiple times.' );
	process.exit( 0 );
}

var messages = files.reduce( function( warnings, file ) {
	try {
		var input = fs.readFileSync( file, 'utf8' );
	} catch ( err ) {
		console.error( 'Error trying to read file "' + file + '":', err.message );
		process.exit( 1 );
	}
	var lintOptions = {
		indent: null,
		comments: argv[ 'ignore-comments' ]
	};
	if ( argv.spaces ) {
		lintOptions.indent = 'spaces';
	} else if ( argv.tabs ) {
		lintOptions.indent = 'tabs';
	}
	var lines = IndentChecker.lint( input, lintOptions );
	if ( lines.length > 0 ) warnings[ file ] = lines;
	return warnings;
}, {} );

var indentationType = 'the most common type';
if ( argv.spaces ) {
	indentationType = 'spaces';
} else if ( argv.tabs ) {
	indentationType = 'tabs';
}
Object.keys( messages ).map( function( file ) {
	messages[ file ].map( function( line ) {
		console.log( 'Line ' + line + ' in "' + file + '" has indentation that differs from ' + indentationType + '.' );
	} );
} );

if ( Object.keys( messages ).length > 0 ) process.exit( 1 );
