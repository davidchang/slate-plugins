import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, NavLink, Route, Redirect, Switch } from 'react-router-dom';

import MarkHotkeys from './slate-mark-hotkeys';
import AutoReplaceIframe from './slate-auto-replace-iframe';

/**
 * Examples.
 *
 * @type {Array}
 */

const EXAMPLES = [
  ['slate-mark-hotkeys', MarkHotkeys, '/slate-mark-hotkeys'],
  [
    'slate-auto-replace-iframe',
    AutoReplaceIframe,
    '/slate-auto-replace-iframe',
  ],
];

/**
 * App.
 *
 * @type {Component}
 */

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="nav">
          <span className="nav-title">
            @davidchang's Slate Plugins Examples
          </span>
          <div className="nav-links">
            <a
              className="nav-link"
              href="https://github.com/davidchang/slate-plugins"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="tabs">
          {EXAMPLES.map(([name, Component, path]) => (
            <NavLink
              key={path}
              to={path}
              className="tab"
              activeClassName="active"
            >
              {name}
            </NavLink>
          ))}
        </div>
        <div className="example">
          <Switch>
            {EXAMPLES.map(([name, Component, path]) => (
              <Route key={path} path={path} component={Component} />
            ))}
            <Redirect from="/" to={EXAMPLES[0][2]} />
          </Switch>
        </div>
      </div>
    );
  }
}

/**
 * Router.
 *
 * @type {Element} router
 */

const router = (
  <HashRouter>
    <App />
  </HashRouter>
);

/**
 * Mount the router.
 */

const root = document.body.querySelector('main');
ReactDOM.render(router, root);
