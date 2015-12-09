#!/usr/bin/env node

var fs = require( 'fs' );
var IndentChecker = require( '../lib/indent-checker' );

var args = process.argv.slice( 2 );
var files = args.filter( function( arg ) {
	return arg.substr( 0, 2 ) !== '--';
} );

if ( args[0] === '--version' ) {
	var version = require( '../package.json' ).version;
	console.log( 'mixedindentlint version ' + version );
	process.exit( 0 );
}

var messages = files.reduce( function( warnings, file ) {
	var input = fs.readFileSync( file, 'utf8' );
	var lines = IndentChecker.getLinesWithLessCommonType( input );
	if ( lines.length > 0 ) warnings[ file ] = lines;
	return warnings;
}, {} );

Object.keys( messages ).map( function( file ) {
	messages[ file ].map( function( line ) {
		console.log( 'Line ' + line + ' in ' + file + ' has indentation that differs from the rest of the file.' );
	} );
} );

if ( Object.keys( messages ).length > 0 ) process.exit( 1 );
