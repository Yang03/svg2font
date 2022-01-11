### svg2font

```
  npm install webfonts-helper --g
```

### js
```
  const webFontsHelper = require('webfonts-helper')
  webFontsHelper(options)
```

### command

```
  webFontsHelper
```

### feature

+ [x] support svg to 'ttf', 'woff', 'woff2', 'eot'
+ [ ] support ttf to 'woff', 'woff2', 'eot'
### options

|  props  | defaultValue |  description  |
| :---- | :------ | :---- |
| src | - | svg dir |
| formats | ['svg', 'ttf', 'woff', 'woff2', 'eot'] | font type |
| fontName | icon-font | font family name you want |
| fontPath | - | font family dest|
| className | icon | css className|
