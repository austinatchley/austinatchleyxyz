+++
title = "Easily Prefetch Links in Remix"
date = "2023-10-15"
draft = true
+++

## Introduction

Recently, I have been diving deeper into [Remix](https://www.remix.run), a framework for building better websites based on web standards and a pleasing UX, for my project [`message-in-a-bottle`](https://message-in-a-bottle.fly.dev). Discovering the world of frontend programming has been quite interesting, and I've run into a few unexpected features in Remix worth sharing.

Here, I'd like to deep dive on the [prefetch link features](https://remix.run/docs/en/main/components/link#prefetch) provided by Remix.

Example usage of the React component:
```html
<Link to="/about" prefetch="intent" className="...">
  About
</Link>
```

## Features

Because Remix is built primarily to be used with React (and deals significantly with improving routing between React components), the Remix team provides a collection of React components that allow developers to take full advantage of the Remix model for extremely common tasks. These components are often drop-in replacements of common React primitives, such as `Link`.

The Remix documentation provides the following values for the `prefetch` field on the `Link` component:

* `none` - default, no prefetching
* `intent` - prefetches when the user hovers or focuses the link
* `render` - prefetches when the link renders
* `viewport` - prefetches when the link is in the viewport, very useful for mobile

Let's dive a bit deeper on each one and its respective behavior.

### `none`

### `intent`

### `render`

### `viewport`

## Conclusion

```md
Notes: // TODO: remove this
-----------
Source: https://dev.to/isnan__h/remix-prefetch-fetch-data-ahead-of-time-1dhb
-----------
The main advantage of this is this eliminates about 1-2seconds of latency delay to fetch data from our server. Along with the subtle benefits like respecting HTTP cache headers, doing the work in browser idle time, using a different thread than your app and more. Link can automatically prefetch all the resources the next page needs: JavaScript modules, stylesheets, and data. This prop controls if and when that happens.

We can pass three different options to prefetch.

"none"
Default behavior. This will prevent any prefetching from happening. This is recommended when linking to pages that require a user session that the browser won't be able to prefetch anyway.

"intent"
Recommended if you want to prefetch. Fetches when Remix thinks the user intends to visit the link. Right now the behavior is simple: if they hover or focus the link it will prefetch the resources. In the future we hope to make this even smarter. Links with large click areas/padding get a bit of a head start. It is worth noting that when using prefetch="intent", elements will be inserted on hover/focus and removed if the loses hover/focus. Without proper cache-control headers on your loaders this could result in repeated prefetch loads if a user continually hovers on and off a link.

"render"
Fetches when the link is rendered.

This is taken from official documentation of Remix. You can find it here. You can also prefetch all the assets like data, modules, css before time please lean more about it here.

Remix uses browser cache under the hood for prefetching HTML which is really cool.
```
