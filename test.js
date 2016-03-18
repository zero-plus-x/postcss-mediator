import postcss from 'postcss';
import test    from 'ava';
import fs      from 'fs';

import plugin from './';

let DATA_DIR = 'data';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.same(result.css, output);
            t.same(result.warnings().length, 0);
        });
}

function read(name) {
    return fs.readFileSync(name, 'utf8');
}

test('should properly convert an input', t => {
    return run(t,
    	read(DATA_DIR + '/dummy_test/source.css'),
    	read(DATA_DIR + '/dummy_test/expected.css'),
    	{ });
});
