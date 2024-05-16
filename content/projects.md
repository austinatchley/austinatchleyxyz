+++
title = "Projects"
date = "2022-06-05"
aliases = ["/projects/"]
+++

## Projects

See [my GitHub](https://github.com/austinatchley) for the up-to-date list of open-source projects I've been working on.

### This website

I created this website using Hugo, Markdown, and [my fork of an open-source Hugo theme](https://github.com/austinatchley/hugo-theme-hello-friend-ng). You can see how I got it setup initially from the [Hello World blog post](/posts/2022/10/hello-world/) I wrote previously. One of my goals was to optimize page load speeds by serving the whole website statically from a globally-distributed CDN, allowing the entire website to be fetched quickly no matter where you are in the world.

### Message in a Bottle

I created a project called [message-in-a-bottle](https://message-in-a-bottle.fly.dev/) using TypeScript, Remix, and PostgreSQL, hosted on Fly.io. It was quite a learning experience since I hadn't used any of the technologies previously. The project isn't under current development, but you can check my progress on [the GitHub repo](https://github.com/austinatchley/message-in-a-bottle) or check [my posts](/posts/) for updates.

![Message in a Bottle](/images/message_in_a_bottle.jpg "Message in a Bottle")

## School Projects 

Here are a few projects from school that I'm still proud to show:

---

### [`gtracer`](https://github.com/loganzartman/gtracer)

A GPU-accelerated, highly-parallel path tracer renderer. Supports multiple rendering paradigms and features, such as CPU multithreading, CUDA multithreading, scene management, and realistic reflection/refraction simulation

| Rabbit with diffuse material | | Rabbit with refractive material |
| ----------- | ----------- | ----------- |
| ![](/images/bunny.jpg "A bunny") | | ![](/images/refraction_bunny.jpg "A bunny made with material that has refractive properties") |


---

### [`F-1/10 Autonomous Vehicle AI`](https://github.com/austinatchley/F1-10-Autonomous-Driving)

![An example of the hardware used for this project](/images/f1-10_cars.jpg "An example of the hardware used for this project")

This course required me to write software to autonomously drive an R/C car that is approximately 1/10th the size of a real F1 car (which is where the name F1/10 comes from). I wrote code borrowing algorithms from domains of time-optimal control, path planning, and state estimation. The pandemic forced us to finish this course online, but my class was able to create a software simulation of the racetrack in order to accurately evaluate each driving agent's progress.

---

### [`fortress-commander`](https://github.com/kasrasadeghi/fortress-commander)

![fortress commander](/images/fortress_commander.jpg "fortress commander")

An RTS from scratch, including its own engine. This was a group project, and we implemented a rendering engine in OpenGL, an Entity-Component-System library in pure C++, and an AI engine as individual components. Complete with programmer art :)