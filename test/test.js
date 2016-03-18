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
  return "./" + name + ".css"
}
function read(name) {
  return fs.readFileSync(name, "utf8")
}

// Gently "borrowed" from https://github.com/postcss/postcss-custom-media/blob/master/test/index.js#L15
function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {}
  postcssOpts.from = filename("fixtures/" + name)
  opts = opts || {}
  var result = postcss().use(plugin(opts))
    .process(read(postcssOpts.from), postcssOpts)
  var actual = result.css
  var expected = read(filename("fixtures/" + name + ".expected"))
  fs.writeFile(filename("fixtures/" + name + ".actual"), actual)
  t.same(actual.trim(), expected.trim(), msg)

  return result
}


/* Write tests here

test('does something', t => {
    return run(t, 'a{ }', 'a{ }', { });
});

*/

test('@mediator', t => {
  return compareFixtures(t, 'mediator-modes', 'should create specific media queries')
});
