# Directory Structure

All commands go into the `commands` folder in their own folder with a `package.json` and the command file.
Look at the `package.json` for other commands to see the structure of them.

Any modules that are used by several commands/the main bot/whatever, go into the `modules` folder.

`data` is used for any data files by various commands, bot, etc.

`logs` is for the logs output by pm2.

## Creating Commands

Information on properly creating commands for the bot can be found [here](https://github.com/awau/Clara/wiki).

# Code Styling

To fit in with the 'theme' of the bot, please use any ES6 features where possible/needed, e.g. arrow functions, template strings, promises, etc.
Remember, arrow functions don't change `this`, so if for some reason you need `this` changed, eg. using a library which does so, then you'll need to use the regular `function() {}`.

Although we would like you to follow Harmony, we use strictly **Promises** for async to be backwards-compatible
with older Node versions.

If you can, use ESLint to make sure that your code complies to the standards for the repository, otherwise, have fun reading the .eslintrc

As of August 08, 2017, we now use async/await

# Pull Requests

PRs are only accepted in the `development` branch. if you PR to `master`, it will be closed.

# Code Verification

We use CodeClimate for code coverage. If your code falls below A, it won't be merged.

# Docker CI

We use CircleCI to test if the Dockerfile can build. If you edited the Dockerfile and it fails, your PR would not be merged.

# Versioning

Reminder our versioning follows the Eclipse Che style of versioning.

- Pre-release versions - x.y.z-SNAPSHOT
- Release versions - x.y.z

semver layout is as follows:

- x : Major revision, not moved until y has reached above 9 (0.10.0 would be 1.0.0)
- y : Minor revision, although we usually only increment this every major release.
- z : Patch
