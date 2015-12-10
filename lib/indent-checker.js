var IndentChecker = {
	options: {},

	getLinesByType: function( input ) {
		return input.split( /\n/ ).reduce( function( types, line, index ) {
			var type = IndentChecker.getLineType( line );
			types[ type ] = types[ type ] || [];
			types[ type ].push( { line: line, number: index + 1 } );
			return types;
		}, {} );
	},

	isLineAComment: function( line ) {
		return !! line.match( /^\s*(\/\/|\/\*|#)/ );
	},

	getLineType: function( line ) {
		var beginning = line.substr( 0, 3 );
		if ( beginning.match( /^\t/ ) ) {
			return 'tabs';
		} else if ( IndentChecker.options.comments && IndentChecker.isLineAComment( line ) ) {
			return 'none';
		} else if ( beginning.match( /^\s*\*/ ) ) {
			if ( IndentChecker.isInsideComment ) return 'none';
			return 'spaces';
		} else if ( beginning.match( /^\s*\*/ ) ) {
			if ( IndentChecker.isInsideComment ) return 'none';
			return 'spaces';
		} else if ( beginning.match( /^\/\*/ ) ) {
			IndentChecker.isInsideComment = true;
			return 'none';
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
