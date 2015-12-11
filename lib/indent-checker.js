var IndentChecker = {
	options: {},

	isInsideComment: false,

	isScanning: false,

	getLinesByType: function( input ) {
		IndentChecker.isInsideComment = false;
		IndentChecker.isScanning = true;
		var linesByType = input.split( /\n/ ).reduce( function( types, line, index ) {
			var type = IndentChecker.getLineType( line );
			if ( IndentChecker.options.debug ) console.log( 'Line type "' + type + '":', line );
			types[ type ] = types[ type ] || [];
			types[ type ].push( { line: line, number: index + 1 } );
			return types;
		}, {} );
		IndentChecker.isScanning = false;
		return linesByType;
	},

	isLineAComment: function( line ) {
		return !! line.match( /^\s*(\/\/|\/\*|#)/ );
	},

	getLineType: function( line ) {
		var beginning = line.substr( 0, 10 );
		if ( false ) {
			return 'none';
		} else if ( IndentChecker.isInsideComment && beginning.match( /^\s*\*\// ) ) {
			// Always ignore end line of multiline comments
			if ( IndentChecker.options.debug ) console.log( 'Exiting multiline:', line );
			IndentChecker.isInsideComment = false;
			return 'none';
		} else if ( IndentChecker.isInsideComment ) {
			// Always ignore multiline comments
			if ( IndentChecker.options.debug ) console.log( 'Ignoring multiline comment:', line );
			return 'none';
		} else if ( IndentChecker.isScanning && beginning.match( /^\/\*/ ) ) {
			// Always ignore first line of multiline comments
			if ( IndentChecker.options.debug ) console.log( 'Entering multiline:', line );
			IndentChecker.isInsideComment = true;
			return 'none';
		} else if ( IndentChecker.isScanning && IndentChecker.options.comments && beginning.match( /^\s*\/\*/ ) ) {
			// If ignoring comments, ignore multiline comments even if they start with whitespace
			if ( IndentChecker.options.debug ) console.log( 'Ignoring comment and entering multiline:', line );
			IndentChecker.isInsideComment = true;
			return 'none';
		} else if ( IndentChecker.options.comments && IndentChecker.isLineAComment( line ) ) {
			if ( IndentChecker.options.debug ) console.log( 'Ignoring comment:', line );
			return 'none';
		} else if ( beginning.match( /^\t/ ) ) {
			return 'tabs';
		} else if ( beginning.match( /^ / ) ) {
			return 'spaces';
		}
		return 'none';
	},

	getMostCommonIndentType: function( input ) {
		var types = IndentChecker.getLinesByType( input );
		return Object.keys( types ).reduce( function( prev, type ) {
			var count = types[ type ].length;
			if ( type === 'none' ) {
				prev = prev;
			} else if ( count === prev.count ) {
				prev = { type: 'none', count: count };
			} else if ( count > prev.count ) {
				prev = { type: type, count: count };
			}
			return prev;
		}, { type: 'none', count: 0 } ).type;
	},

	getLinesWithoutType: function( input, mostCommonType ) {
		var types = IndentChecker.getLinesByType( input );
		if ( mostCommonType === 'none' ) return [];
		return Object.keys( types ).reduce( function( lines, type ) {
			if ( type !== mostCommonType && type !== 'none' ) {
				lines = lines.concat( types[ type ].map( function( line ) {
					return line.number;
				} ) );
			}
			return lines;
		}, [] );
	},

	getLinesWithLessCommonType: function( input ) {
		return IndentChecker.getLinesWithoutType( input, IndentChecker.getMostCommonIndentType( input ) );
	},

	lint: function( input, options ) {
		IndentChecker.options = options || {};
		if ( IndentChecker.options.indent ) {
			return IndentChecker.getLinesWithoutType( input, IndentChecker.options.indent );
		}
		return IndentChecker.getLinesWithLessCommonType( input );
	}
};

module.exports = IndentChecker;
