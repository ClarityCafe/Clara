# Directory Structure

commands are put inside ``commands`` folder.
then, you must have a seperate folder for your command.

You will also need a ``package.json`` inside your command's Directory
otherwise you will indefinitely crash the bot at init.

# Code Styling

We follow the ES6 and the ES5 Standards coding structure. We recommend
you to folloe the Standard Node.js guidelines on coding.


# Pull Requests

You must create your own branch then pull to ``master`` (for discord.js) or ``discord.htc`` (for Discord.HTC [Experimental]).
this is to make sure to prevent clutter.

#Coding Verification

we use Travis for Code Verification. If your code fails at runtime.
It will not be merged until it's fixed.

there's exception if the linter is a bitch.

We use two different programs to check your PR's validity:

- Babel (Minification and Linting)
- ESLint (Linting using ECMA-262 guidelines)

you need to pass at least one (1)in order to get your PR merged.