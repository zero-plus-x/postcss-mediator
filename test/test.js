import postcss from 'postcss';
import test    from 'ava';
import fs      from 'fs';

import plugin from '../';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.same(result.css, output);
            t.same(result.warnings().length, 0);
        });
}

function filename(name) {
    return './' + name + '.css';
}
function read(name) {
    return fs.readFileSync(name, 'utf8');
}

// Gently "borrowed" from https://github.com/postcss/
// postcss-custom-media/blob/master/test/index.js#L15
function compareFixtures(t, name, msg, opts, postcssOpts) {
    postcssOpts = postcssOpts || {};
    postcssOpts.from = filename('fixtures/' + name);
    opts = opts || {};
    let result = postcss().use(plugin(opts))
      .process(read(postcssOpts.from), postcssOpts);
    let actual = result.css;
    let expected = read(filename('fixtures/' + name + '.expected'));
    fs.writeFile(filename('fixtures/' + name + '.actual'), actual);
    t.same(actual.trim(), expected.trim(), msg);

    return result;
}

test('@mediator', t => {
    return compareFixtures(t,
      'mediator-modes',
      'should create specific media queries');
});
