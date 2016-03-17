import postcss from 'postcss';
import test    from 'ava';
import fs      from 'fs';

import plugin from './';

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

test('does something', t => {
  return run(t, 'a{ }', 'a{ }', { });
});
