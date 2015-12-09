#!/usr/bin/env node

var fs = require( 'fs' );
var IndentChecker = require( '../lib/indent-checker' );

var files = process.argv.slice( 2 );
var messages = files.reduce( function( warnings, file ) {
	var input = fs.readFileSync( file, 'utf8' );
	warnings[ file ] = IndentChecker.getLinesWithLessCommonType( input );
	return warnings;
}, {} );

Object.keys( messages ).map( function( file ) {
	console.log( 'File:', file );
	messages[ file ].map( function( line ) {
		console.log( '  Line', line, 'has indentation that differs from the rest of the file.' );
	} );
} );
