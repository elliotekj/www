---
title: "Improving webfont performance with FontFaceObserver and sessionStorage"
date: 2017-01-11
slug: "/2017/01/11/improving-webfont-performance-with-fontfaceobserver-and-sessionstorage"
category: Code
tags:
  - Typography
---

I spent some time trying to optimise webfont loading on this site yesterday. The current best-practice for most websites leverages [FontFaceObserver](https://github.com/bramstein/fontfaceobserver) and [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

FontFaceObserver is a fairly small Javascript library made by Bram Stein that will load one or multiple `@font-face`s, then notify you once they have finished loading via a `Promise`. `sessionStorage` is like `localStorage` except that, as it’s name suggests, it expires at the end of the session. We’ll be using it to keep track of whether or not the fonts have been loaded.

Let’s start by adding the necessary `@font-face` syntax to our CSS. This site uses [Domine](https://fonts.google.com/specimen/Domine), which I self-host. FontFaceObserver is compatible with any webfont service though.

```css
@font-face {
  font-family: 'Domine';
  font-style: normal;
  font-weight: 400;
  src: local('Domine'),
       local('Domine-Regular'),
       url(../fonts/domine-regular.woff2) format('woff2'),
       url(../fonts/domine-regular.woff) format('woff');
}

@font-face {
  font-family: 'Domine';
  font-style: normal;
  font-weight: 700;
  src: local('Domine Bold'),
       local('Domine-Bold'),
       url(../fonts/domine-bold.woff2) format('woff2'),
       url(../fonts/domine-bold.woff) format('woff');
}
```

Next, we’ll break out our final font stack from our first-paint font stack. As things stand at the moment, your webfont is probably included as the first item in your `body`‘s `font-family`, like so:

```css
body {
  font-family: 'Domine', Georgia, "Times New Roman", Times, serif;
}
```

We need to change that as we’ll only be applying the webfont via a class once it has finished loading. This prevents a flash of invisible text.

```scss
$base-font-family: Georgia, "Times New Roman", Times, serif;

body {
  font-family: $base-font-family;
}

.fonts-loaded body {
  font-family: 'Domine', $base-font-family;
}
```

Time to switch over to our JS. First you’ll need to download FontFaceObserver. There are a few options here: [NPM](https://github.com/bramstein/fontfaceobserver#installation), a [minified version](https://github.com/bramstein/fontfaceobserver/blob/master/fontfaceobserver.js) that includes a `Promise` polyfill or a [standalone version](https://github.com/bramstein/fontfaceobserver/blob/master/fontfaceobserver.standalone.js) without the polyfill. As this site wasn’t already using a polyfill for `Promise`s, I went with the second option.

We’ll start by creating a new `FontFaceObserver` for each webfont we’re loading.

```js
const domineRegular = new FontFaceObserver('Domine', {
  weight: 400
})

const domineBold = new FontFaceObserver('Domine', {
  weight: 700
})
```

Once the fonts have finished loading, we want to apply the `.fonts-loaded` class to our `html` element so they can be put to use. Underneath the above, add the following:

```js
Promise.all([domineRegular.load(), domineBold.load()]).then(function () {
  document.documentElement.classList.add('fonts-loaded')
})
```

Excellent. Time to add `sessionStorage` to the mix. Start by wrapping the above in an `if` statement like so.

```js
if (sessionStorage.fontsLoaded) {
  document.documentElement.classList.add('fonts-loaded')
} else {
  Promise.all([domineRegular.load(), domineBold.load()]).then(function () {
    document.documentElement.classList.add('fonts-loaded')
    sessionStorage.fontsLoaded = true
  })
}
```

You’ll notice a few changes in the snippet above. Firstly, we’re setting `sessionStorage.fontsLoaded` to `true` once the `Promise` has resolved. Secondly, we’re leveraging that boolean to avoid running the `Promise` if the fonts have already been loaded. The last thing to do is to `catch` a failed attempt at loading the webfonts. Change line 7 in the above snippet to the following.

```js
}).catch(function () {
  sessionStorage.fontsLoaded = false
})
```

* * *

When using webfonts without a special loading tool like FontFaceObserver, browsers will hide the text using those fonts until they have finished loading. If they haven’t loaded after 3 seconds, most browsers will forget about them and show the text with whatever fallback fonts are specified. Nobody wants to look at nothing for 3 seconds though—most users on slow connections will jump ship before that time is up.

With this approach, we show the text with the fallback fonts straight away, then introduce the webfonts once they’ve finished loading. This results in what’s known as a flash of unstyled text rather than the flash of invisible text. I daresay you’ll agree that in most cases, the former provides a much nicer experience.

Here’s what this should all look like once put together:

```scss:title=typography.scss
@font-face {
  font-family: 'Domine';
  font-style: normal;
  font-weight: 400;
  src: local('Domine'),
       local('Domine-Regular'),
       url(../fonts/domine-regular.woff2) format('woff2'),
       url(../fonts/domine-regular.woff) format('woff');
}

@font-face {
  font-family: 'Domine';
  font-style: normal;
  font-weight: 700;
  src: local('Domine Bold'),
       local('Domine-Bold'),
       url(../fonts/domine-bold.woff2) format('woff2'),
       url(../fonts/domine-bold.woff) format('woff');
}

$base-font-family: Georgia, "Times New Roman", Times, serif;

body {
  font-family: $base-font-family;
}

.fonts-loaded body {
  font-family: 'Domine', $base-font-family;
}
```

```js:title=typography.js
(() => {
  // Promise polyfill
  // ...

  // FontFaceObserver
  // ...

  const domineRegular = new FontFaceObserver('Domine', {
    weight: 400
  })

  const domineBold = new FontFaceObserver('Domine', {
    weight: 700
  })

  if (sessionStorage.fontsLoaded) {
    document.documentElement.classList.add('fonts-loaded')
  } else {
    Promise.all([domineRegular.load(), domineBold.load()]).then(function () {
      document.documentElement.classList.add('fonts-loaded')
      sessionStorage.fontsLoaded = true
    }).catch(function () {
      sessionStorage.fontsLoaded = false
    })
  }
})()
```

