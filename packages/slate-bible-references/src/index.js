import React, { Component } from 'react';

import ReferenceParser from '@omysoul/bible-references';
import { en } from '@omysoul/bible-langs';
const { getVerseRanges } = new ReferenceParser(
  [en].map(({ abbreviations }) => abbreviations),
);

const PLUGIN_BLOCK_TYPE = 'bibleReferences-block';

const getRequestURL = text =>
  [
    `https://api.esv.org/v3/passage/html/?q=${encodeURIComponent(text)}`,
    'include-footnotes=false',
    'include-crossrefs=false',
    'include-headings=false',
    'include-subheadings=false',
    'include-audio-link=false',
  ].join('&');

class BibleReference extends Component {
  state = {
    loadedReference: null,
    errorLoadingReference: false,
  };

  componentDidMount() {
    const { esvAPIKey, text } = this.props;
    fetch(getRequestURL(text), {
      headers: {
        Authorization: `Token ${esvAPIKey}`,
      },
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          loadedReference: response.passages[0],
        });
      })
      .catch(err => {
        console.log('err', err);
        this.setState({
          errorLoadingReference: true,
        });
      });
  }

  render() {
    const { isSelected, text } = this.props;
    const { errorLoadingReference, loadedReference } = this.state;
    return (
      <div
        style={{
          padding: '1em',
          [!isSelected && 'borderTop']: '1px solid #CCC',
          [!isSelected && 'borderBottom']: '1px solid #CCC',
          [isSelected && 'border']: '1px solid #666',
        }}
      >
        {loadedReference ? (
          <div dangerouslySetInnerHTML={{ __html: loadedReference }} />
        ) : errorLoadingReference ? (
          `Error loading ${text}`
        ) : (
          `Loading ${text}...`
        )}
      </div>
    );
  }
}

/**
 * A Slate plugin to automatically replace a block with an iframe whenever a matching
 * string is typed.
 *
 * @param {Object} opts
 * @return {Object}
 */
function BibleReferences(opts = {}) {
  const ignoreIn = opts.ignoreIn && normalizeMatcher(opts.ignoreIn);
  const onlyIn = opts.onlyIn && normalizeMatcher(opts.onlyIn);
  const esvAPIKey = opts.esvAPIKey;

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   * @return {Value}
   */

  function onKeyDown(event, change, editor) {
    if (!['Enter', 'Backspace'].includes(event.key)) {
      return;
    }

    const { value } = change;
    const { startBlock, startText } = value;
    if (!startBlock) {
      return;
    }

    if (event.key === 'Backspace') {
      if (
        value.isCollapsed &&
        startBlock.type === PLUGIN_BLOCK_TYPE &&
        value.selection.startOffset === 0
      ) {
        change
          .setBlocks({ type: 'paragraph', isVoid: false })
          .collapseToEndOf(startBlock);
        return true;
      }

      return;
    }

    if (onlyIn && !onlyIn(startBlock.type)) {
      return;
    }

    if (ignoreIn && ignoreIn(startBlock.type)) {
      return;
    }

    if (getVerseRanges(startText.text).length) {
      change
        .setBlocks({
          data: { text: startText.text },
          isVoid: true,
          type: PLUGIN_BLOCK_TYPE,
        })
        .insertBlock('paragraph');

      return true;
    }
  }

  const renderNode = props => {
    const { node, attributes, editor, isSelected } = props;
    switch (node.type) {
      case PLUGIN_BLOCK_TYPE:
        const text = node.data.get('text');

        return (
          <div {...attributes}>
            <BibleReference
              text={text}
              esvAPIKey={esvAPIKey}
              isSelected={isSelected}
            />
          </div>
        );
      default:
        return null;
    }
  };

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return { onKeyDown, renderNode };
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

export default BibleReferences;
