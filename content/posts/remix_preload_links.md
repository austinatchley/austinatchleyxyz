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

