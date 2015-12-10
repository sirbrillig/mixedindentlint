#!/usr/bin/env node

var fs = require( 'fs' );
var parseArgs = require( 'minimist' );
var IndentChecker = require( '../lib/indent-checker' );

var argv = parseArgs( process.argv.slice( 2 ) );
var files = argv._;

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
	process.exit( 0 );
}

var messages = files.reduce( function( warnings, file ) {
	try {
		var input = fs.readFileSync( file, 'utf8' );
	} catch ( err ) {
		console.error( 'Error trying to read file "' + file + '":', err.message );
		process.exit( 1 );
	}
	var lines = IndentChecker.getLinesWithLessCommonType( input );
	if ( lines.length > 0 ) warnings[ file ] = lines;
	return warnings;
}, {} );

Object.keys( messages ).map( function( file ) {
	messages[ file ].map( function( line ) {
		console.log( 'Line ' + line + ' in "' + file + '" has indentation that differs from the rest of the file.' );
	} );
} );

if ( Object.keys( messages ).length > 0 ) process.exit( 1 );
