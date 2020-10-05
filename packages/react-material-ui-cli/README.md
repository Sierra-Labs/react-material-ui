# react-material-ui-cli

CLI for migrating existing projects that have locally stored components to use the `@sierralabs/react-material-ui` library.

## Development

Open a terminal window and run:

```bash
$ cd packages/react-material-ui-cli
$ yarn start
```

Open another terminal window and run to make the CLI globally available.

```bash
$ cd packages/react-material-ui-cli
$ npm link
```

On a consuming project (i.e. FIT Cloud repo) you can run the CLI by navigating to the project's root where `tsconifg.json` is located and running:

```bash
$ cd path/to/project/with/tsconfig
$ react-material-ui
```
