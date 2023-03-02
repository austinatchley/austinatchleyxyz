+++
title = "Centering Images by Default in Hugo"
date = "2023-03-01"
+++

## Introduction

Recently I have been teaching myself more about web development using static-site generation for this website, and Remix for [my other main project](/projects). CSS has been one of the biggest learning curves, as I have thus far considered myself as primarily a backend engineer and never got around to learning the basics of the front-end world

For this website, I use a modified version of https://github.com/rhazdon/hugo-theme-hello-friend-ng. Recently I realized that, by default, images are left justified, and I thought it might improve the aesthetics of my site if they were center justified by default instead. It wasn't straightforward to change this since each theme is different and you will have to dive into the CSS for your project in order to find a solution that works for you. Here, I will briefly detail my solution in case it helps anyone else facing the same issue.

## Solution

The first step is to find out how your hugo theme organizes its CSS files. Because I use `hello-friend-ng`, I am using SASS. Another common setup is to use PostCSS with Hugo instead

I will assume that you are using SASS for the rest of this post, but you should be able to adapt these steps to PostCSS easily. First, find the default `img` class in your project. I did this by simply searching for `img` in my style directory (for me, this is `themes\hello-friend-ng\assets\scss`). For this theme, most of the style defaults are located in `_main.scss`

This was the default style:

```css
img {
  display: block;
  max-width: 100%;

  &.left {
    margin-right: auto;
  }

  &.center {
    margin-left: auto;
    margin-right: auto;
  }

  &.right {
    margin-left: auto;
  }
  &.circle {
    border-radius: 50%;
    max-width: 25%;
    margin: auto;
  }
}
```

To center images by default, I simply removed the `left`, `right`, and `center` [nested selectors](https://sass-lang.com/documentation/style-rules/parent-selector), and used the contents of `center` by default. So the end result looks like:

```css
img {
  display: block;
  max-width: 100%;

  margin-left: auto;
  margin-right: auto;

 
  &.circle {
    border-radius: 50%;
    max-width: 25%;
    margin: auto;
  }
}
```

Generally I don't like deleting things I don't fully understand, but in this case, I couldn't figure out how these nested tags were meant to be used from Markdown-land, and nothing changed after I removed them, so I felt OK about deleting this. Plus, there is quite a bit of boilerplate in these themes, and in theory I would prefer to only use code I understand. Deleting dead code will do the trick for now until I get annoyed enough to create my own theme from scratch :smile: