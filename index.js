var postcss = require('postcss');

module.exports = postcss.plugin('postcss-mediator', function (opts) {
    opts = opts || {};

    mediatorModes = {};
	mediatorOutputRules = [];
    //mediatorQueries = {
    //  'desktop': [
    //    'div.myStyle{ width:100% }'
    //  ]
    //}

    return function (css, result) {
    	css.walkAtRules(function (rule) {
        if (rule.name == 'mediator') {
          console.log(rule.params);

          var firstSpace = rule.params.indexOf(' ')
          var key = rule.params.substr(0, firstSpace)
          var value = rule.params.substr(firstSpace + 1)
          mediatorModes[key] = value
        }
      });

      css.walkDecls(function(decl, i){
        // console.log(decl.prop)
        // console.log(decl.value)
        // console.log(decl)

        if (decl.prop.indexOf('.') == -1) {
          return;
        }

        var artifacts = decl.prop.split('.');
        var prop = artifacts.pop();
		var filteredArtifacts = [];
		
		for (var fact in artifacts) {
			if (mediatorModes[artifacts[fact]] == undefined) {
				continue;
			}
			
			filteredArtifacts.push (artifacts[fact]);
		}
		
		artifacts = filteredArtifacts;
		
		if (artifacts.length == 0) {
			// simple property: no mediator
		}
		else {
			
			//mediatorOutputRules
		}
		
        console.log(decl);
        console.log(prop)
        console.log(artifacts)


      });



    };
});
