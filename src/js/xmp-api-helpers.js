import base64js from 'base64-js'

export { dataUrlToArrayBuffer, urlToArrayBuffer, createNewXmp, blobToArrayBuffer, formatXml, arrayBufferToDataUrl }

function createNewXmp() {
  // A basic XMP template including common namespaces.
  // Source: https://github.com/exif-js/exif-js/blob/master/exif.js
  // Many custom written programs embed xmp/xml without any namespace. Following are some of them.
  // Without these namespaces, XML is thought to be invalid by parsers
  // TODO: add common namespaces in XMP reading method, only when needed
  return `<?xpacket begin="?" id="W5M0MpCehiHzreSzNTczkc9d"?>
  <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core  5.6-c138 79.159824, 2016/09/14-01:09:01        ">
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about="XMP template with common namespaces"
          xmlns:archilogic="https://ns.archilogic.com/1.0/"
          xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:exif="http://ns.adobe.com/exif/1.0/"
          xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0"
          xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"
          xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
          xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
          xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus"
          xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#"
          xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#"
          xmlns:tiff="http://ns.adobe.com/tiff/1.0/"
          xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/"
          xmlns:xmp="http://ns.adobe.com/xap/1.0/"
          xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <archilogic:comment>XMP based on XMP API JS lib template.</archilogic:comment>
      </rdf:Description>
    </rdf:RDF>
  </x:xmpmeta>        
<?xpacket end="w"?>`
}

function minifyXml(str) {
  // a very basic XML minifier, removing indentation at beginning and end of each line
  return str.replace(/(^\s+)/mg, '').replace(/(\s+$)/mg, '')
}

function formatXml(xml) {
  const PADDING = ' '.repeat(2); // set desired indent size here
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;

  xml = xml.replace(reg, '$1\r\n$2$3');

  return xml.split('\r\n').map((node, index) => {
    console.log(index, node)
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
      } else if (node.match(/^<\/\w/) && pad > 0) {
          pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
      } else {
          indent = 0;
      }

      pad += indent;

      return PADDING.repeat(pad - indent) + node;
  }).join('\r\n');
}

function imgToArrayBuffer(obj) {
  return Promise.resolve().then(function () {
    if (obj.src) {
      // Data URI
      if (/^data\:/i.test(img.src)) return Promise.resolve(base64ToArrayBuffer(img.src))
      // Object URL
      else if (/^blob\:/i.test(img.src)) return blobUrlToArrayBuffer(img.src)
      // URL
      else return urlToArrayBuffer(img.src)
    } else {
      const isBlob = (img instanceof window.Blob || img instanceof window.File)
      if (isBlob) {
        if (window.FileReader) {
          return blobToArrayBuffer(img)
        } else {
          return Promise.reject('FileReader Browser API not available.')
        }
      } else {
        return Promise.reject('Unknown format')
      }
    }
  })
}

function urlToArrayBuffer(url) {
  return new Promise(function (resolve, reject) {
    let http = new XMLHttpRequest()
    http.responseType = 'arraybuffer'
    http.onload = function() {
      if (this.status == 200 || this.status === 0) resolve(http.response)
      else reject('Could not load image from URL: '+ url)
      http = null
    }
    http.onError = function (error) {
      reject(error)
    }
    http.open('GET', url, true)
    http.send(null)
  })
}

async function blobToArrayBuffer(blob) {
  return new Promise(function (resolve, reject) {
    const fileReader = new FileReader()
    fileReader.onload = event => resolve(event.target.result)
    fileReader.onerror = reject
    fileReader.readAsArrayBuffer(blob)
  })
}

function blobUrlToArrayBuffer(blobUrl) {
  return new Promise(function (resolve, reject) {
    // convert blobURL to blob
    const http = new XMLHttpRequest()
    // TODO: use 'arrayBuffer' instead of blob (might not need blobToArrayBuffer conversion)
    http.responseType = 'blob'
    http.onload = function (event) {
      if (this.status === 200 || this.status === 0) {
        blobToArrayBuffer(blob).then(resolve).catch(reject)
      }
    }
    http.onError = function (error) {
      reject(error)
    }
    http.open('GET', blobUrl, true)
    http.send()
  })
}

// function base64ToArrayBuffer(base64) {
//   const binary = atob(base64)
//   const len = binary.length
//   const buffer = new ArrayBuffer(len)
//   const view = new Uint8Array(buffer)
//   for (let i = 0; i < len; i++) view[i] = binary.charCodeAt(i)
//   return buffer
// }

function dataUrlToArrayBuffer(dataUrl) {
  const base64 = dataUrl.replace(/^data\:([^\;]+)\;base64,/gmi, '')
  const arrBuf = base64js.toByteArray(base64)
  return arrBuf
}

function arrayBufferToDataUrl(mimeType, arrBuf) {
  const base64 = base64js.fromByteArray(new Uint8Array(arrBuf))
  const dataUrl = `data:${mimeType};base64,${base64}`
  return dataUrl
}

// function getFruits(xml) {
//   var fruits = xml.getElementsByTagName("fruits")[0];
//   if (fruits) {
//     var fruitsNodes = fruits.childNodes;
//     if (fruitsNodes) {
//       for (var i = 0; i < fruitsNodes.length; i++) {
//         var name = fruitsNodes[i].getAttribute("name");
//         var colour = fruitsNodes[i].getAttribute("colour");
//         alert("Fruit " + name + " is coloured " + colour);
//       }
//     }
//   }
// }

// function xml2Object(xml) {
//   try {
//       var obj = {};
//       if (xml.children.length > 0) {
//         for (var i = 0; i < xml.children.length; i++) {
//           var item = xml.children.item(i);
//           var attributes = item.attributes;
//           for(var idx in attributes) {
//               var itemAtt = attributes[idx];
//               var dataKey = itemAtt.nodeName;
//               var dataValue = itemAtt.nodeValue;

//               if(dataKey !== undefined) {
//                   obj[dataKey] = dataValue;
//               }
//           }
//           var nodeName = item.nodeName;

//           if (typeof (obj[nodeName]) == "undefined") {
//             obj[nodeName] = xml2json(item);
//           } else {
//             if (typeof (obj[nodeName].push) == "undefined") {
//               var old = obj[nodeName];

//               obj[nodeName] = [];
//               obj[nodeName].push(old);
//             }
//             obj[nodeName].push(xml2json(item));
//           }
//         }
//       } else {
//         obj = xml.textContent;
//       }
//       return obj;
//     } catch (e) {
//         console.log(e.message);
//     }
// }

// function xml2json(xml) {
//   var json = {};

//   if (xml.nodeType == 1) { // element node
//     if (xml.attributes.length > 0) {
//       json['@attributes'] = {};
//       for (var j = 0; j < xml.attributes.length; j++) {
//         var attribute = xml.attributes.item(j);
//         json['@attributes'][attribute.nodeName] = attribute.nodeValue;
//       }
//     }
//   } else if (xml.nodeType == 3) { // text node
//     return xml.nodeValue;
//   }

//   // deal with children
//   if (xml.hasChildNodes()) {
//     for(var i = 0; i < xml.childNodes.length; i++) {
//       var child = xml.childNodes.item(i);
//       var nodeName = child.nodeName;
//       if (json[nodeName] == null) {
//         json[nodeName] = xml2json(child);
//       } else {
//         if (json[nodeName].push == null) {
//           var old = json[nodeName];
//           json[nodeName] = [];
//           json[nodeName].push(old);
//         }
//         json[nodeName].push(xml2json(child));
//       }
//     }
//   }
  
//   return json;
// }