var postcss = require('postcss');

module.exports = postcss.plugin('postcss-mediator', function (opts) {
    opts = opts || {};

    mediatorModes = {};
  	mediatorOutputRules = {};

    return function (css, result) {
    	css.walkAtRules(function (rule) {
        if (rule.name == 'mediator') {
          var firstSpace = rule.params.indexOf(' ')
          var key = rule.params.substr(0, firstSpace)
          var value = rule.params.substr(firstSpace + 1)
          mediatorModes[key] = value

          rule.remove()
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
        var prop = artifacts.shift();

        artifacts = artifacts.filter(function(element){
          return mediatorModes[element] != undefined
        });


    		if (artifacts.length == 0) {
    			return;
    		}

        // Have the artifacts ordered to prevent mode mismatching
        artifacts.sort()

        var ruleMode = artifacts.join('.')
        if(typeof mediatorOutputRules[ruleMode] === 'undefined'){
          mediatorOutputRules[ruleMode] = {}
        }

        var selector = decl.parent.selector
        if(typeof mediatorOutputRules[ruleMode][selector] === 'undefined'){
          mediatorOutputRules[ruleMode][selector] = {}
        }

        mediatorOutputRules[ruleMode][selector][prop] = decl.value

        if (decl.parent.nodes.length == 1) {
          decl.parent.remove();
        }else{
          decl.remove();
        }
      });

      console.log(mediatorOutputRules)


    };
});
