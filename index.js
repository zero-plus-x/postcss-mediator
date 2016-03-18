'use strict';

let postcss = require('postcss');

module.exports = postcss.plugin('postcss-mediator', opts => {
    opts = opts || {};

    let mediatorModes = {};
    let mediatorOutputRules = {};

    return function (css) {
        css.walkAtRules(rule => {
            if (rule.name === 'mediator') {
                let firstSpace = rule.params.indexOf(' ');
                let key = rule.params.substr(0, firstSpace);
                let value = rule.params.substr(firstSpace + 1);
                mediatorModes[key] = value;
                rule.remove();
            }
        });

        css.walkDecls(decl => {
            if (decl.prop.indexOf('.') === -1) {
                return;
            }

            let artifacts = decl.prop.split('.');
            let prop = artifacts.shift();
            artifacts = artifacts.filter(element => {
                return mediatorModes[element] !== undefined;
            });

            if (artifacts.length === 0) {
                return;
            }

            // Have the artifacts ordered to prevent mode mismatching
            artifacts.sort();

            let ruleMode = artifacts.join('.');
            if (typeof mediatorOutputRules[ruleMode] === 'undefined') {
                mediatorOutputRules[ruleMode] = {};
            }

            let selector = decl.parent.selector;
            let mediatorRuleSelector = mediatorOutputRules[ruleMode][selector];
            if (typeof mediatorRuleSelector === 'undefined') {
                mediatorOutputRules[ruleMode][selector] = {};
            }

            mediatorOutputRules[ruleMode][selector][prop] = decl.value;

            if (decl.parent.nodes.length === 1) {
                decl.parent.remove();
            } else {
                decl.remove();
            }
        });

        for (let mode in mediatorOutputRules) {
            let artifacts = mode.split('.');
            let mediaq = '@media ';
            for (let i in artifacts) {
                if (i > 0) {
                    mediaq += 'and ';
                }
                mediaq += '(' + mediatorModes[artifacts[i]] + ') ';
            }
            mediaq += '{';

            for (let element in mediatorOutputRules[mode]) {
                mediaq += element + ' {';
                for (let prop in mediatorOutputRules[mode][element]) {
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
