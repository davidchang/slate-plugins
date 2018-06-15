
### `slate-auto-replace-iframe`

A [**Slate**](https://github.com/ianstormtaylor/slate) plugin to replace matching text with iframes. This is triggered upon the Enter button on a block that matches a regular expression. For example, if you copy/paste a Youtube link into a block and then press Enter, that block will be transformed from the URL into the iframe text.

[View Demo ⬈](https://davidchang.github.io/slate-plugins/#/slate-auto-replace-iframe)

```js
import AutoIframeReplace, { renderNodeHOF } from 'slate-auto-replace-iframe';
import { Editor } from 'slate-react';

// Add the plugin to your set of plugins...
const plugins = [
  AutoIframeReplace(),
];

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
  renderNode={renderNodeHOF()}
/>
```

Option | Type | Description
--- | --- | ---
**`iframeProvidersMap`** | `Object` | An optional object where the key is some string and the value is an object with `regex` and `getIframeSrc` keys. `regex` should be a Regular Expression and `getIframeSrc` should be a function taking in a single parameter, the result of matching the block text with the `regex`. This defaults to a map containing some common providers - Youtube, Vimeo, and Twitch.
**`ignoreIn`** | `Function` `Array` `String` | An optional block matcher to ignore triggers inside. If passed an array or string it will match by `node.type`.
**`onlyIn`** | `Function` `Array` `String` | An optional block matcher to only replace triggers inside. If passed an array or string it will match by `node.type`.
