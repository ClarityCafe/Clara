# Directory Structure

commands are put inside ``commands`` folder.
then, you must have a seperate folder for your command.

You will also need a ``package.json`` inside your command's Directory
otherwise you will indefinitely crash the bot at init.

# Code Styling

We follow the ES6 and the ES5 Standards coding structure. We recommend
you to use ES6 for your code.


# Pull Requests

You must create your own branch then pull to ``master``.
this is to make sure to prevent clutter.

#Coding Verification

we use Travis for Code Verification. If your code fails at runtime.
It will not be merged until it's fixed.

there's exception if the linter is a bitch.

We use three different programs to check your PR's validity:

- Babel (Minification and Linting)
- Standard.js (NPM Coding Styling Suggestions)
- ESLint (Linting using ECMA-262 guidelines)

you need to pass at least one (1)in order to get your PR merged.