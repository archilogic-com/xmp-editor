# XMP Editor and JavaScript Library

Online editor and JavaScript library for XMP data in image files. Library mode supports browser and Node.js environments. [XMP](https://en.wikipedia.org/wiki/Extensible_Metadata_Platform) is a data format to store any set of standardized and custom metadata properties in digital documents and data sets. Currently reading and writing JPG images is supported. PNG and GIF support will be added later. Contributions are always welcome.

## Editor

Visit: [https://xmp-editor.archilogic.com](https://xmp-editor.archilogic.com)

## Library

WARNING: This is still work in progress. Expect API changes.

### Browser example

[Open live demo](https://codesandbox.io/s/xmp-editor-lib-browser-example-2gh88?fontsize=14&hidenavigation=1)

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Load lib via CDN -->
    <script src="https://code.archilogic.com/xmp-editor/xmpEditor.umd.min.js"></script>
  </head>
  <body>
    <!-- XMP code will be displayed here -->
    <pre id="xmp-code"></pre>
    <script>
      // Image URL to read XMP from
      var imageUrl =
        "https://storage.3d.io/535e624259ee6b0200000484/2019-06-16_00-16-32_1BCodw/004.jpg";
      // Fetch image as arrayBuffer
      xmpEditor.helpers.urlToArrayBuffer(imageUrl).then(function(arrBuf) {
        // Extract XMP as text. You can use a XML parser to read the nodes.
        var xmpStr = xmpEditor.jpgReadXmp(arrBuf);
        // Show XMP in DOM
        document.getElementById("xmp-code").textContent = xmpStr;
        // Generate new XMP from template
        var xmpStr = xmpEditor.helpers.createNewXmp();
      });
    </script>
  </body>
</html>
```

### Node.js example:

Install:

```sh
npm install archilogic-com/xmp-editor#master
```

Use:

```js
const { jpgReadXmp } = require('archilogic-com/xmp-editor#master')
const pathUtil = require('path')
const { promisify } = require('util')
const { readFile } = require('fs')

async function getXmpString(imgPath) {
  // Read file from disk
  const buf = await promisify(readFile)(imgPath)
  // Convert to array buffer
  const arrBuf = new Uint8Array(buf).buffer
  // Extract XMP string
  return jpgReadXmp(arrBuf)
}

const IMG_PATH = pathUtil.resolve(`image-with-xmp-metadata.jpg`)
getXmpString(IMG_PATH).then(console.log)
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
