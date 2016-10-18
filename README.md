# owo-whats-this [![Build Status](https://travis-ci.org/sr229/owo-whats-this.svg?branch=master)](https://travis-ci.org/sr229/owo-whats-this)
A really experimental (and borked) Discord.js bot written in EsNEXT (Es6)

# Building and Running

<strike>From a fresh download/clone, you cannot run the script directly. You have to compile it using [Babel](https://babeljs.io/) in order to make it work through Node.js

append to your terminal the following:
```sh
$ npm install --save
$ npm install -g babel-cli babel
$ npm install babel-preset-es2015 --save
```

then run:
```sh
$ babel -D -d out --no-comments src
```

if you've used Babel before, it's really easy.</strike> We are working on a way to make it work without compilation.


NOTE: you need a installation of Node v6.6.0 or v6.1.0, this is possible by installing [nvm](http://nvm.sh) and make the following Node Environments your default (you can only set one).
Linux users require this since the official packages in some distros like Ubuntu only has 4.x.x. We hadn't tested against 4.xx.

# Contributing

Check out CONTRIBUTING.md for guidelines 
