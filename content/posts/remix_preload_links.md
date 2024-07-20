+++
title = "Easily Prefetch Links in Remix"
date = "2024-07-20"
+++

## Introduction

Over the past year, I have been diving deeper into [Remix](https://www.remix.run), a framework for building simpler websites based on web standards plus a pleasing UX, for my project [`message-in-a-bottle`](https://github.com/austinatchley/message-in-a-bottle). Discovering the world of frontend programming has been quite interesting, and I've run into a few unexpected features in Remix worth sharing.

Here, I'd like to do a short deep dive on the [prefetch link features](https://remix.run/docs/en/main/components/link#prefetch) provided by Remix to show an example of a simple feature that can have huge benefits on the UX of your site.

Example usage of the `Link` React component:
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

Let's dive a bit deeper on each one and its respective behavior:

### `none`
The none option disables prefetching entirely. It's the default behavior and is recommended for links that lead to pages requiring user sessions or dynamic data that shouldn't be prefetched unnecessarily.

### `intent`
When set to intent, Remix prefetches resources when it detects that the user intends to navigate to the linked page. This is triggered by user actions like hovering over or focusing on the link. It's a subtle yet effective way to reduce perceived load times by fetching resources preemptively.

### `render`
The render option triggers prefetching as soon as the link component itself is rendered. This ensures that necessary resources are fetched in advance, potentially reducing latency when the user decides to navigate.

### `viewport`
The viewport option is particularly useful for mobile devices. It prefetches resources when the linked component enters the viewport, optimizing resource usage by prefetching only when necessary.

## Conclusion
Remix's prefetching capabilities offer significant performance benefits by reducing latency and optimizing resource loading. By strategically prefetching data and assets, Remix enhances user experience while adhering to web standards and leveraging browser caching effectively. Whether you choose to prefetch on user intent, during rendering, or based on viewport visibility, Remix provides the tools to create fast, responsive web applications with minimal effort. Explore Remix's prefetching options to see how they can streamline your frontend development workflow and improve your site's performance.

-----------
Sources: 

* https://dev.to/isnan__h/remix-prefetch-fetch-data-ahead-of-time-1dhb
* https://www.remix.run
* https://remix.run/docs/en/main/components/link#prefetch
* https://github.com/austinatchley/message-in-a-bottle
* https://message-in-a-bottle.fly.dev
