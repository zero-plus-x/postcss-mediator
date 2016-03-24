# PostCSS Mediator

[PostCSS-Mediator] is a [PostCSS] plugin to simplify responsive CSS
writing.

**It's main purpose** is to keep all properties for each CSS selector in one
place instead of scattered across several different `@media` queries. 

## I/O Example

### Input:

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

### Output:

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

## Coding

Mediator **modes** will be translated into **one** `@media` query expression
each.

```css
/* Mediator Modes */
@mediator lowres max-width: 768px;
@mediator mediumres max-width: 1024px;
@mediator highres max-width: 2560px;
@mediator landscape orientation: landscape;
@mediator portrait orientation: portrait;
```

It's possible to combine different modes when setting up the element's
properties:

```css
div.example {
  width: 100%;
  width.highres: 30%;
  width.mediumres: 50%;
  width.lowres.portrait: 100%;
  width.lowres.landscape: 50%;
}

/* The above code will output: */
div.example {
  width: 100%;
}
@media (max-width: 2560px) {
  div.example {
    width: 30%;
  }
}
@media (max-width: 1024px) {
  div.example {
    width: 50%;
  }
}
@media (max-width: 768px) and (orientation: portrait) {
  div.example {
    width: 100%;
  }
}
@media (max-width: 768px) and (orientation: landscape) {
  div.example {
    width: 50%;
  }
}
```




[PostCSS-Mediator]: https://github.com/zero-plus-x/postcss-mediator
[PostCSS]: https://github.com/postcss/postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
