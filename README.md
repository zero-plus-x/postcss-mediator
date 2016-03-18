# PostCSS Mediator [![Build Status][ci-img]][ci]

[PostCSS] plugin for easy multiscreen handling..

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/Nek/postcss-mediator.svg
[ci]:      https://travis-ci.org/Nek/postcss-mediator

```css
/* CSS Input */
/* Settings */
/* lowres is a 'mediator mode' */
@mediator lowres max-width: 768px;
@mediator mediumres max-width: 1024px;
@mediator highres max-width: 2560px;
@mediator landscape orientation: landscape;
@mediator portrait orientation: portrait;

/* CSS files */
/* phone.portrait is a 'mediator rule' */
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

div {
  width.mediumres: 80%;
}
```

```css
/* CSS output */
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

```js
postcss([ require('postcss-mediator') ])
```

See [PostCSS] docs for examples for your environment.
