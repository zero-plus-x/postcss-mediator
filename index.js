var postcss = require('postcss');

module.exports = postcss.plugin('postcss-mediator', function (opts) {
    opts = opts || {};

    // Work with options here

    return function (css, result) {
    	css.walkDecls(function (decl) {
    		console.log(decl);
    	});
        // Transform CSS AST here
    };
});