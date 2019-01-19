NAVWRIST-WEB
==================

A tool to navigate the world of office ping-pong competition.

Based on [aspnet-starter-kit-2.0](https://github.com/Luteceo/aspnet-starter-kit-2.0), without Redux.

## Features

&nbsp; &nbsp; ✓ Component-based front-end development via [Webpack](https://webpack.github.io/) and [React](https://facebook.github.io/react) (see [`webpack.config.js`](webpack.config.js))
&nbsp; &nbsp; ✓ Static type checking with [TypeScript](https://www.typescriptlang.org)
&nbsp; &nbsp; ✓ Universal cross-stack routing and navigation [`history`](https://github.com/ReactJSTraining/history) (see [`client/routes.tsx`](client/routes.tsx))
&nbsp; &nbsp; ✓ Hot Module Replacement ([HMR](https://webpack.github.io/docs/hot-module-replacement.html)) /w [React Hot Loader](http://gaearon.github.io/react-hot-loader/)
&nbsp; &nbsp; ✓ Lightweight build automation with plain JavaScript (see [`run.js`](run.js))
&nbsp; &nbsp; ✓ Cross-device testing with [Browsersync](https://browsersync.io/)

## Prerequisites

* OS X, Windows or Linux
* [Node.js](https://nodejs.org) v6 or newer
* [.NET Core](https://www.microsoft.com/net/core) and [.NET Core SDK](https://www.microsoft.com/net/core)
* [Visual Studio Code](https://code.visualstudio.com/) or your prefered IDE.

### Getting Started

**Step 1**. Clone the latest version on your local machine by running:

```shell
$ git clone -o navwrist-web -b master --single-branch \
      https://github.com/flipdoubt/navwrist-web navwrist-web
$ cd navwrist-web
```

**Step 2**. Install project dependencies listed in [`project.json`](server/project.json) and
[`package.json`](package.json) files using Yarn:

```shell
$ yarn install                   # Install both Node.js and .NET Core dependencies
```

**Step 3**. Finally, launch your web app:

```shell
$ yarn start                      # Compile and lanch the app
```

The app should become available at [http://localhost:5000/](http://localhost:5000/).
See [`run.js`](run.js) for other available commands such as `node run build` etc.
You can also run your app in a release (production) mode by running `node run --release`, or without
Hot Module Replacement (HMR) by running `node run --no-hmr`.

### TODO
* ~~Style with [Bulma](https://bulma.io/)~~
* ~~Javascript data model~~
* Database via entity framework
* Put player
* ~~Put completed game~~
* ~~The slightest bit of functionality~~
* Add player UI
* Start current game via drag-n-drop
* Track current serve
* ~~Add points in current game~~
* ~~Win game~~
* Calculate [player ranking](https://www.teamusa.org/usa-table-tennis/ratings/rating-system)
