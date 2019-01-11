
### `slate-mark-hotkeys`

A [**Slate**](https://github.com/ianstormtaylor/slate) plugin to toggle marks based on hotkeys. Useful for adding basic formatting utils like making text bold, italicized, or underlined (through the conventional means of modifier+b, modifier+i, modifier+u, respectively).

[View Demo ⬈](https://davidchang.github.io/slate-plugins/#/slate-mark-hotkeys)

```js
import MarkHotkeys from 'slate-mark-hotkeys';
import { Editor } from 'slate-react';

// Add the plugin to your set of plugins...
const plugins = [
  MarkHotkeys()
]

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
/>
```

If you call `MarkHotKeys()` without any parameters, the following marks are set up by default:

Hotkey | Rendered Tag
--- | ---
`b` | `<strong>`
`i` | `<em>`
`u` | `<u>`
``` ` ``` | `<code>`
`~` | `<del>`

You may overwrite the default options by passing additional options as an object.

```js
const plugins = [
  MarkHotkeys({
    optionKey: optionValue
  })
]
```

Option | Type | Description
--- | --- | ---
**`keysToMarks`** | `Object` | An optional object whose keys are hotkey descriptors and whose respective values are the marks to be applied when the hotkey is triggered. Keys without a `+` in them are automatically prepended with `mod+`, but those with an `+` are not modified. They are all passed to `isHotkey`, which has its own [API](https://www.npmjs.com/package/is-hotkey) for defining hotkeys. Defaults to a map containing marks for bold, underline, italics, strikethrough, and code.
**`ignoreIn`** | `Function` `Array` `String` | An optional block matcher to ignore triggers inside. If passed an array or string it will match by `node.type`.
**`onlyIn`** | `Function` `Array` `String` | An optional block matcher to only replace triggers inside. If passed an array or string it will match by `node.type`.
