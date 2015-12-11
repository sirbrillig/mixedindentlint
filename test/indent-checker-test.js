var chai = require( 'chai' );
var expect = chai.expect;

var IndentChecker = require( '../lib/indent-checker' );

describe( 'IndentChecker', function() {
	describe( '.getLineType()', function() {
		it( 'returns "spaces" when the input starts with spaces', function() {
			expect( IndentChecker.getLineType( '  foo' ) ).to.equal( 'spaces' );
		} );

		it( 'returns "tabs" when the input starts with tabs', function() {
			expect( IndentChecker.getLineType( '\tfoo' ) ).to.equal( 'tabs' );
		} );

		it( 'returns "none" when the input starts with no indentation', function() {
			expect( IndentChecker.getLineType( 'foo' ) ).to.equal( 'none' );
		} );

		it( 'returns "none" when the input is empty', function() {
			expect( IndentChecker.getLineType( '\n' ) ).to.equal( 'none' );
		} );

		it( 'returns "spaces" when the input starts with a space and a multiline comment block starter', function() {
			expect( IndentChecker.getLineType( ' /**' ) ).to.equal( 'spaces' );
		} );

		it( 'returns "spaces" when the input starts with a space and a comment block', function() {
			expect( IndentChecker.getLineType( ' //' ) ).to.equal( 'spaces' );
		} );

		it( 'returns "spaces" when the input starts with a space and a multiline comment block terminator', function() {
			expect( IndentChecker.getLineType( ' */' ) ).to.equal( 'spaces' );
		} );

		it( 'returns "none" when the input starts a comment block', function() {
			expect( IndentChecker.getLineType( '/**' ) ).to.equal( 'none' );
		} );
	} );

	describe( '.getLinesByType()', function() {
		it( 'returns an object with keys for each type found', function() {
			var input = '  foobar1\n  foobar2\n\tfoobar3\n  foobar4';
			var types = IndentChecker.getLinesByType( input );
			expect( Object.keys( types ) ).to.have.length( 2 );
		} );

		it( 'returns a list of lines for each type', function() {
			var input = '  foobar1\n  foobar2\n\n\tfoobar3\n  foobar4';
			var types = IndentChecker.getLinesByType( input );
			expect( types.spaces ).to.have.length( 3 );
			expect( types.tabs ).to.have.length( 1 );
		} );
	} );

	describe( '.getMostCommonIndentType()', function() {
		it( 'returns "spaces" when the input contains more space indentations than tabs', function() {
			var input = '  foobar1\n  foobar2\n\tfoobar3\n  foobar4\n';
			expect( IndentChecker.getMostCommonIndentType( input ) ).to.equal( 'spaces' );
		} );

		it( 'returns "tabs" when the input contains more tabs indentations than spaces', function() {
			var input = '\tfoobar1\n\tfoobar2\n  foobar3\n\tfoobar4\n';
			expect( IndentChecker.getMostCommonIndentType( input ) ).to.equal( 'tabs' );
		} );

		it( 'returns "none" when the input contains equal tab and space indentation', function() {
			var input = '\tfoobar1\n  foobar2\n\tfoobar3\n  foobar4\n';
			expect( IndentChecker.getMostCommonIndentType( input ) ).to.equal( 'none' );
		} );
	} );

	describe( '.getLinesWithLessCommonType()', function() {
		it( 'returns an array of line numbers with the less-common indentation type from the input', function() {
			var input = '  foobar1\n  foobar2\n\tfoobar3\n  foobar4\n\tfoobar5';
			expect( IndentChecker.getLinesWithLessCommonType( input ) ).to.have.same.members( [ 3, 5 ] );
		} );

		it( 'returns an empty array if the input is entirely one type', function() {
			var input = '  foobar1\n  foobar2\n  foobar3\n  foobar4\n';
			expect( IndentChecker.getLinesWithLessCommonType( input ) ).to.be.empty;
		} );

		it( 'returns an empty array if the input indentation types are equal', function() {
			var input = '  foobar1\n  foobar2\n\tfoobar3\n\tfoobar4\n';
			expect( IndentChecker.getLinesWithLessCommonType( input ) ).to.be.empty;
		} );

		it( 'ignores comment block indentations', function() {
			var input = '\tfoobar1\n/** foobar2\n * foobar3\n * foobar4\n */\n foobar6\n\tfoobar7';
			expect( IndentChecker.getLinesWithLessCommonType( input ) ).to.have.same.members( [ 6 ] );
		} );
	} );

	describe( '.lint()', function() {
		it( 'returns an array of line numbers with the less-common indentation type from the input', function() {
			var input = '  foobar1\n  foobar2\n\tfoobar3\n  foobar4\n\tfoobar5';
			expect( IndentChecker.lint( input ) ).to.have.same.members( [ 3, 5 ] );
		} );

		it( 'returns an array of line numbers without the specified indentation type from the input, if option is set', function() {
			var input = '  foobar1\n  foobar2\n\tfoobar3\n  foobar4\n\tfoobar5';
			expect( IndentChecker.lint( input, { indent: 'tabs' } ) ).to.have.same.members( [ 1, 2, 4 ] );
		} );

		it( 'returns an array of line numbers including comments', function() {
			var input = '\tfoobar1\n  /** foobar2\n  * foobar3\n  * foobar4\n  */foobar5\n foobar6\n\t// foobar7\n\tfoobar8';
			expect( IndentChecker.lint( input ) ).to.have.same.members( [ 1, 7, 8 ] );
		} );

		it( 'returns an array of line numbers ignoring comments, if option is set', function() {
			var input = '\tfoobar1\n  /** foobar2\n  * foobar3\n  foobar4\n  */foobar5\n foobar6\n  // foobar7\n\tfoobar8';
			expect( IndentChecker.lint( input, { comments: true } ) ).to.have.same.members( [ 6 ] );
		} );
	} );
} );
