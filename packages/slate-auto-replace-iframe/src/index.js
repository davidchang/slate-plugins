import React from 'react';

const PLUGIN_BLOCK_TYPE = 'autoReplaceIframe-iframe';

const YOUTUBE_REGEX = /^https:\/\/www\.youtube\.com\/watch\?v=(.*)$/;
const VIMEO_REGEX = /^https:\/\/vimeo\.com\/channels\/.*\/(.*)/;
const TWITCH_REGEX = /^https:\/\/www\.twitch\.tv\/(.*)/;

const DEFAULT_IFRAME_PROVIDERS_MAP = {
  youtube: {
    regex: YOUTUBE_REGEX,
    getIframeSrc: regexMatches =>
      `https://www.youtube.com/embed/${regexMatches[1]}`,
  },
  vimeo: {
    regex: VIMEO_REGEX,
    getIframeSrc: regexMatches =>
      `https://player.vimeo.com/video/${regexMatches[1]}`,
  },
  twitch: {
    regex: TWITCH_REGEX,
    getIframeSrc: regexMatches =>
      `https://player.twitch.tv/?channel=${regexMatches[1]}`,
  },
};

/**
 * A Slate plugin to automatically replace a block with an iframe whenever a matching
 * string is typed.
 *
 * @param {Object} opts
 * @return {Object}
 */
function AutoReplaceIframe(opts = {}) {
  const ignoreIn = opts.ignoreIn && normalizeMatcher(opts.ignoreIn);
  const onlyIn = opts.onlyIn && normalizeMatcher(opts.onlyIn);

  const iframeProvidersMap =
    opts.iframeProvidersMap || DEFAULT_IFRAME_PROVIDERS_MAP;

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
    const { anchorKey, document, startBlock, startText } = value;
    if (!startBlock) {
      return;
    }

    let potentialLinkText = startText.text;
    if (!potentialLinkText) {
      const previousSibling = document.getPreviousSibling(anchorKey);
      if (
        previousSibling &&
        previousSibling.object === 'inline' &&
        previousSibling.type === 'link'
      ) {
        potentialLinkText = previousSibling.text;
      }
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

    const { type } = startBlock;
    if (onlyIn && !onlyIn(type)) {
      return;
    }

    if (ignoreIn && ignoreIn(type)) {
      return;
    }

    const [matchedProvider] =
      Object.entries(iframeProvidersMap).find(([provider, { regex }]) =>
        potentialLinkText.match(regex),
      ) || [];

    if (matchedProvider) {
      change
        .setBlocks({
          data: {
            regexMatches: potentialLinkText.match(
              iframeProvidersMap[matchedProvider].regex,
            ),
            provider: matchedProvider,
          },
          isVoid: true,
          type: PLUGIN_BLOCK_TYPE,
        })
        .insertBlock('paragraph');

      return true;
    }
  }

  const renderNode = props => {
    const iframeProvidersMap =
      opts.iframeProvidersMap || DEFAULT_IFRAME_PROVIDERS_MAP;
    const activeIframeStyles = opts.activeIframeStyles || '3px solid blue';

    const { node, attributes, children, isSelected } = props;
    switch (node.type) {
      case PLUGIN_BLOCK_TYPE:
        const provider = node.data.get('provider');
        const regexMatches = node.data.get('regexMatches');

        return (
          <div {...attributes}>
            <iframe
              width={opts.width || '700'}
              height={opts.height || '393'}
              src={iframeProvidersMap[provider].getIframeSrc(regexMatches)}
              style={{
                border: isSelected ? activeIframeStyles : '0px solid blue',
              }}
              title={`${provider} embed`}
              frameBorder="0"
              allowFullScreen
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

export default AutoReplaceIframe;
