var postcss = require('postcss');

module.exports = postcss.plugin('postcss-mediator', function (opts) {
    opts = opts || {};

    var mediatorModes = {};
    var mediatorOutputRules = {};

    return function (css) {
        css.walkAtRules(function (rule) {
            if (rule.name === 'mediator') {
                var firstSpace = rule.params.indexOf(' ');
                var key = rule.params.substr(0, firstSpace);
                var value = rule.params.substr(firstSpace + 1);
                mediatorModes[key] = value;
                rule.remove();
            }
        });

        css.walkDecls(function (decl) {
            if (decl.prop.indexOf('.') === -1) {
                return;
            }

            var artifacts = decl.prop.split('.');
            var prop = artifacts.shift();
            artifacts = artifacts.filter(function (element) {
                return mediatorModes[element] !== undefined;
            });

            if (artifacts.length === 0) {
                return;
            }

            // Have the artifacts ordered to prevent mode mismatching
            artifacts.sort();

            var ruleMode = artifacts.join('.');
            if (typeof mediatorOutputRules[ruleMode] === 'undefined') {
                mediatorOutputRules[ruleMode] = {};
            }

            var selector = decl.parent.selector;
            var mediatorRuleSelector = mediatorOutputRules[ruleMode][selector];
            if (typeof mediatorRuleSelector === 'undefined') {
                mediatorRuleSelector = {};
            }

            mediatorRuleSelector[prop] = decl.value;

            if (decl.parent.nodes.length === 1) {
                decl.parent.remove();
            } else {
                decl.remove();
            }
        });

        for (var mode in mediatorOutputRules) {
            var artifacts = mode.split('.');
            var mediaq = '@media ';
            for (var i in artifacts) {
                if (i > 0) {
                    mediaq += 'and ';
                }
                mediaq += '(' + mediatorModes[artifacts[i]] + ') ';
            }
            mediaq += '{';

            for (var element in mediatorOutputRules[mode]) {
                mediaq += element + ' {';
                for (var prop in mediatorOutputRules[mode][element]) {
                    mediaq += prop + ': ';
                    mediaq += mediatorOutputRules[mode][element][prop] + ';';
                }
                mediaq += '}';
            }

            mediaq += '}';

            css.append(mediaq);
        }
    };
});
