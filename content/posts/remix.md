+++
title = "Using Remix as a New Web Developer"
date = "2023-03-10"
draft = "true"
+++

Recently, I have started to learn [Remix](https://remix.run/) for my project [message-in-a-bottle](https://message-in-a-bottle.fly.dev/). This has been an interesting experience, especially because I'm not familiar with any of the previously accepted web development stacks (e.g. SPAs, React, Next.js, etc.). My experience with Remix is that it seems to "just work" in ways where web developers have run into headache after headache in the past. In a sense, I feel like I am fast-forwarding past the problems of the past, and what's left is to build my application

I would recommend the framework to anyone looking to get into web development in 2023, and especially if you have a background in backend development like myself. Remix simplifies the flow of development, avoiding many of the problems associated with splitting codebases based on the client-server split.

In a Remix application, you can express all of the logic that gives your application value in the place where it makes sense to be. Information is passed easily between the client and server, but only as much as needed. Pages can be prefetched based on inferred user intent, and using native Web functionality is the star of the show in Remix, providing snappy response times thanks to [fly.io](https://www.fly.io)

If you want to get started with a Remix application yourself, you can refer to the [Remix Stacks](https://remix.run/docs/en/main/pages/stacks) or the [fly.io Remix App documentation](https://fly.io/docs/languages-and-frameworks/remix/).