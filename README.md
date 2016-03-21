# PostCSS Mediator

[PostCSS-Mediator] is a [PostCSS] plugin to simplify responsive CSS
writing.

Don't ever worry again about finding element's properties scattered across
several different `@media` queries. Have them **all in one place**: the
element's style declaration itself!

## I/O Example

### You'll input:

```css
@mediator lowres max-width: 768px;
@mediator mediumres max-width: 1024px;
@mediator highres max-width: 2560px;
@mediator landscape orientation: landscape;
@mediator portrait orientation: portrait;

a {
  height: 100px;
  width.lowres.portrait: 100%;
  width.lowres.landscape: 50%;
  width.mediumres.portrait: 100%;
  width.highres: 30%;
  display: block;
}
div.test {
  width.highres: 100%;
}
div#id {
  width.mediumres: 80%;
}
```

### PostCSS-Mediator will output:

```css
a {
  height: 100px;
  display: block;
}
@media (max-width: 768px) and (orientation: portrait) {
  a {
    width: 100%;
  }
}
@media (orientation: landscape) and (max-width: 768px) {
  a {
    width: 50%;
  }
}
@media (max-width: 1024px) and (orientation: portrait) {
  a {
    width: 100%;
  }
}
@media (max-width: 2560px) {
  a {
    width: 30%;
  }
  div.test {
    width: 100%;
  }
}
@media (max-width: 1024px) {
  div#id {
    width: 80%;
  }
}
```

## Usage

1. Add [PostCSS] to your build tool.
1. Add [PostCSS-Mediator] as a PostCSS process.

```sh
npm install postcss-mediator --save-dev
```

_Use the `--save-dev` option to make sure `npm` updates `devDependencies` on
your project's `package.json`._

### Node

```js
postcss([ require('postcss-conic-gradient')() ])
```

### Grunt

Install [Grunt PostCSS]:

```shell
npm install grunt-postcss --save-dev
```

Enable [PostCSS-Mediator] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
            // ... ,
				require('postcss-mediator')()
			]
		},
        // ...
	}
});
```





[PostCSS-Mediator]: https://github.com/zero-plus-x/postcss-mediator
[PostCSS]: https://github.com/postcss/postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
