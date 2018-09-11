[![Build Status](https://travis-ci.com/tchak/better-ujs.svg?branch=master)](https://travis-ci.com/tchak/better-ujs)
[![npm version](https://badge.fury.io/js/better-ujs.svg)](https://badge.fury.io/js/better-ujs)

# better-ujs

This unobtrusive scripting support file is developed for the Ruby on Rails framework, but is not strictly tied to any specific backend. You can drop this into any application to:

* force confirmation dialogs for various actions
* make non-GET requests from hyperlinks
* make forms or hyperlinks submit data asynchronously with `fetch`
* have submit buttons become automatically disabled on form submit to prevent double-clicking

These features are achieved by adding certain data attributes to your HTML markup. In Rails, they are added by the framework's template helpers.

## Installation

* `yarn add better-ujs`

## Usage

```js
  import start from 'better-ujs';

  start();
```
