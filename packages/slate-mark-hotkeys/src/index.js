import React from 'react';
import isHotkey from 'is-hotkey';
import typeOf from 'type-of';

const DEFAULT_KEYS_TO_MARKS = {
  b: 'markHotkeys-bold',
  i: 'markHotkeys-italic',
  u: 'markHotkeys-underline',
  '`': 'markHotkeys-code',
  '~': 'markHotkeys-strikethrough',
};

/**
 * A Slate plugin to automatically replace a block when a string of matching
 * text is typed.
 *
 * @param {Object} opts
 * @return {Object}
 */
function MarkHotkeys(opts = {}) {
  const customKeysToMarksDefined = typeof opts.keysToMarks !== 'undefined';
  const { keysToMarks = DEFAULT_KEYS_TO_MARKS } = opts;

  const ignoreIn = opts.ignoreIn && normalizeMatcher(opts.ignoreIn);
  const onlyIn = opts.onlyIn && normalizeMatcher(opts.onlyIn);

  const normalizedHotkeys = Object.entries(keysToMarks).map(([key, mark]) => ({
    triggerFn: isHotkey(key.indexOf('+') === -1 ? `mod+${key}` : key),
    mark,
  }));

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   * @return {Value}
   */

  function onKeyDown(event, change, editor) {
    const { mark: markToApply } =
      normalizedHotkeys.find(({ triggerFn }) => triggerFn(event)) || {};
    if (!markToApply) {
      return;
    }

    const { value } = change;
    const { startBlock } = value;
    if (!startBlock) {
      return;
    }

    const { type } = startBlock;
    if (onlyIn && !onlyIn(type)) {
      return;
    }

    if (ignoreIn && ignoreIn(type)) {
      return;
    }

    // Prevent the default characters from being inserted.
    event.preventDefault();

    // Toggle the mark.
    change.toggleMark(markToApply);
    return true;
  }

  const renderMark = props => {
    switch (props.mark.type) {
      case 'markHotkeys-bold':
        return <strong>{props.children}</strong>;
      case 'markHotkeys-code':
        return <code>{props.children}</code>;
      case 'markHotkeys-italic':
        return <em>{props.children}</em>;
      case 'markHotkeys-strikethrough':
        return <del>{props.children}</del>;
      case 'markHotkeys-underline':
        return <u>{props.children}</u>;
    }
  };

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  if (customKeysToMarksDefined) {
    return { onKeyDown };
  }

  return { onKeyDown, renderMark };
}

/**
 * Normalize a node matching plugin option.
 *
 * @param {Function|Array|String} matcher
 * @return {Function}
 */

function normalizeMatcher(matcher) {
  switch (typeOf(matcher)) {
    case 'function':
      return matcher;
    case 'array':
      return node => matcher.includes(node);
    case 'string':
      return node => node == matcher;
    default:
      throw new Error('unexpected type for matcher received');
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default MarkHotkeys;
