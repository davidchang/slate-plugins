import MarkHotkeys, { renderMark } from 'slate-mark-hotkeys';
import React from 'react';
import initialValue from './value.json';
import { Editor } from 'slate-react';
import { Value } from 'slate';

/**
 * Example.
 *
 * @type {Component}
 */

class Example extends React.Component {
  plugins = [MarkHotkeys()];

  state = {
    value: Value.fromJSON(initialValue),
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render = () => {
    return (
      <Editor
        value={this.state.value}
        plugins={this.plugins}
        onChange={this.onChange}
        renderMark={renderMark}
      />
    );
  };
}

/**
 * Export.
 *
 * @type {Component}
 */

export default Example;
