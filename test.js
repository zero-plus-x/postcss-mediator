import postcss from 'postcss';
import test    from 'ava';
import fs      from 'fs';

import plugin from './';

var DATA_DIR='data';

function run(t, input, output, opts = { }) {
  	return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.same(result.css, output);
            t.same(result.warnings().length, 0);
        });
}

function read(name) {
  return fs.readFileSync(name, "utf8")
}

/* Write tests here

test('does something', t => {
    return run(t, 'a{ }', 'a{ }', { });
});

*/

test('dummy test', t => {
  return run(t, read (DATA_DIR+'/dummy_test/source.css'), read (DATA_DIR+'/dummy_test/expected.css'), { });
});
