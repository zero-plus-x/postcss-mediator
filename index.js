'use strict';

let postcss = require('postcss');

module.exports = postcss.plugin('postcss-mediator', opts => {
    opts = opts || {};

    let mediaRegexMatch = /^((not|only)_)?(all|screen|print|speech)$/i;

    function extractOneMode(mediatorModes, rule) {
        if (rule.name === 'mediator') {
            let firstSpace = rule.params.indexOf(' ');
            let key = rule.params.substr(0, firstSpace);
            let value = rule.params.substr(firstSpace + 1);

            // Make sure mediator modes are not named after media types
            // to avoid possible conflicts
            if (mediaRegexMatch.test(key)) {
                throw rule.error('Naming a Mediator Mode after a media ' +
                    'type (all, screen, print, speech) may cause undesired ' +
                    'conflicts. Please rename it.',
                    { plugin: 'postcss-mediator' });
            }

            mediatorModes[key] = value;
            rule.remove();
        }
    }

    function extractModes(css) {
        let mediatorModes = {};
        let extractor = extractOneMode.bind(this, mediatorModes);
        css.walkAtRules(extractor);
        return mediatorModes;
    }

    function extractOneRule(mediatorModes, mediatorOutputRules, decl) {
        if (decl.prop.indexOf('.') === -1) {
            return;
        }

        // Breaks the property declaration to extract its modes
        let modes = decl.prop.split('.');
        // First element is the propety
        let prop = modes.shift();

        // Check if any of the modes is actually a media type
        let mediaTypes = modes.filter(element => {
            return mediaRegexMatch.test(element);
        });

        // If so, remove media types from modes array
        if (mediaTypes.length > 0) {
            modes = modes.filter(element => {
                return mediaTypes.indexOf(element) === -1;
            });
        } else {
            // Default media type
            mediaTypes = ['all'];
        }

        // Filter modes to make sure only pre-defined modes will be used
        modes = modes.filter(element => {
            return mediatorModes[element] !== undefined;
        });

        if (modes.length === 0) {
            return;
        }

        // Have the modes ordered to prevent mode mismatching
        modes.sort();

        // Create unique string to repesent mode
        let ruleMode = modes.join('.');
        // Currently only one media type is supported per declaration
        ruleMode = mediaTypes[0] + '.' + ruleMode;

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
    }

    function extractRules(mediatorModes, css) {
        let mediatorOutputRules = {};
        let extractor = extractOneRule.bind(this,
            mediatorModes,
            mediatorOutputRules);
        css.walkDecls(extractor);
        return mediatorOutputRules;
    }

    function mutateCSS(mediatorModes, mediatorOutputRules, css) {
        for (let mode in mediatorOutputRules) {
            let artifacts = mode.split('.');
            let mediaq = '@media ';
            for (let i in artifacts) {
                if (i === 0) {
                    // Media type
                    mediaq += artifacts[i] + ' ';
                } else {
                    // Mediator mode (media expression)
                    mediaq += 'and ';
                    mediaq += '(' + mediatorModes[artifacts[i]] + ') ';
                }
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
    }

    return function (css) {
        let mediatorModes = extractModes(css);

        let mediatorOutputRules =  extractRules(mediatorModes, css);

        mutateCSS(mediatorModes, mediatorOutputRules, css);
    };
});
