+++
title = "Using Remix as a New Web Developer"
date = "2023-04-26"
+++

Recently, I started using the [Remix framework](https://remix.run/) for my WIP project [message-in-a-bottle](https://message-in-a-bottle.fly.dev/). This has been an interesting experience, and I think this has been so especially because I wasn't previously familiar with any current Javascript web development stacks (e.g. React, Angular, the recent proliferation of using Next.js, etc.). 

My experience with Remix is that it seems to work well "out of the box," and this can help tremendously for new web developers, like myself. For anyone who is new to something as complicated as web development, seemingly small roadblocks can lead to a surprising amount of friction in the learning process, and ultimately to failure for an outsized portion of potential new users. 

Using [Remix's Stacks](https://remix.run/docs/en/main/pages/stacks) makes me feel like I am fast-forwarding past the roadblocks, and it allows developers to focus on the core logic of their idea right out of the gate. In a Remix application, you can express all of the logic that gives your application value in the place where it makes sense to be. Information is passed easily between the client and server in code, and on the backend, Remix transfers only as much data as needed for each request. Native Web functionality and plain HTML forms are treated as first-class concepts in Remix, leading to low bloat, low latencies, and a snappy UX. Pages can also be prefetched based on inferred user intent to optimize even more for latency.

I would recommend the framework to anyone looking to get into web development in 2023, and especially if you have a background in backend development like myself. Remix simplifies the flow of development. One particularly nice thing that I've noticed is the ease of passing data between client and server. Remix wraps the complexity of figuring what data needs to go where into the framework model itself, meaning that the developer can focus on the core logic of the application. Using TypeScript's type system in conjunction with Remix means that you can even use the same types for your data across frontend and backend. In my experience, this leads to clean representations of logic and state on unified data structures flowing through the codebase. For me, this nature of a Remix codebase makes it enjoyable to work with, and I will continue to do so on this message-in-a-bottle project.

If you want to learn more about Remix, I found the following documentation particularly helpful in my development: [Remix Stacks docs](https://remix.run/docs/en/main/pages/stacks) and [fly.io's Remix App documentation](https://fly.io/docs/languages-and-frameworks/remix/)