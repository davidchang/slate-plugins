
### `slate-bible-references`

A [**Slate**](https://github.com/ianstormtaylor/slate) plugin to replace Bible references with their text. This is triggered upon the Enter button on a block that matches a Bible reference. For example, if you type a reference like "John 3:16" into a block and then press Enter, that block will be transformed into a container with the actual John 3:16 text in it.

[View Demo ⬈](https://davidchang.github.io/slate-plugins/#/slate-bible-references)

```js
import BibleReferences from 'slate-bible-references';
import { Editor } from 'slate-react';

// Add the plugin to your set of plugins...
const plugins = [
  BibleReferences(),
];

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
/>
```

Option | Type | Description
--- | --- | ---
**`esvAPIKey`** | `String` | Your ESV API key, required for making API calls - register for one at https://api.esv.org/
**`ignoreIn`** | `Function` `Array` `String` | An optional block matcher to ignore triggers inside. If passed an array or string it will match by `node.type`.
**`onlyIn`** | `Function` `Array` `String` | An optional block matcher to only replace triggers inside. If passed an array or string it will match by `node.type`.
