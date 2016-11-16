# Directory Structure

All commands go into the `commands` folder in their own folder with a `package.json` and the command file.
Look at the `package.json` for other commands to see the structure of them.

Any modules that are used by several commands/the main bot/whatever, go into the `lib` folder.

## Creating Commands

Information on properly creating commands for the bot can be found [here](example/sample_command/README.md).

# Code Styling

To fit in with the "theme" of the bot, please use any ES6 features where possible/needed, e.g. arrow functions, template strings, promises, etc.
Remember, arrow functions don't change `this`, so if for some reason you need `this` changed, eg. using a library which does so, then you"ll need to use the regular `function() {}`.

Also, please make sure to follow the way that the code in the repository is set out for consistency.

# Pull Requests

Please fork this repository, make your changes, and then submit a pull request to the `master` branch. If you have write access to the repo, please create your own branch in the repo and then pull into `master`.

# Code Verification

We use Travis for Code Verification. If your code fails at runtime, it will not be merged until it"s fixed.
There's an exception if the linter is a bitch.