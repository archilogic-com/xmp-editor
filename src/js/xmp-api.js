// TODO: add XMP size limit warning
// TODO: compress XMP white space


import * as helpers from './xmp-api-helpers.js'


const XMP_HEADER = 'http://ns.adobe.com/xap/1.0/\x00'
const XMP_END_META = '</x:xmpmeta>'
const XMP_END_PACKETS = [`<?xpacket end="w"?>`, `<?xpacket end='w'?>`]

const JPG_SEGMENT_MARKER_LENGTH = 4
const JPG_FILE_MARKER = [0xFF, 0xD8]
const JPG_APP1_MARKER = [0xFF, 0xE1]
const JPG_MARKERS = {
  0xD8: 'Start Of Image',
  0xC0: 'Start Of Frame (baseline DCT)',
  0xC2: 'Start Of Frame (progressive DCT)',
  0xC4: 'Define Huffman Table',
  0xDB: 'Define Quantization Table',
  0xDD: 'Define Restart Interval',
  0xDA: 'Start Of Scan',
  0xD0: 'Restart',
  0xD1: 'Restart',
  0xD2: 'Restart',
  0xD3: 'Restart',
  0xD4: 'Restart',
  0xD5: 'Restart',
  0xD6: 'Restart',
  0xD7: 'Restart',
  0xE0: 'APP0',
  0xE1: 'APP1',
  0xE2: 'APP2',
  0xE3: 'APP3',
  0xE4: 'APP4',
  0xE5: 'APP5',
  0xE6: 'APP6',
  0xE7: 'APP7',
  0xE8: 'APP8',
  0xE9: 'APP9',
  0xEE: 'Comment',
  0xD9: 'End Of Image'
}

function pngReadXmp(buffer) {

}

function pngWriteXmp(buffer) {
  
}

function jpgReadXmp(buffer) {
  const { markerOffset, segmentLength } = jpgFindXmpSegment(buffer)
  if (!markerOffset) {
    return null
  } else {
    const arr = new Uint8Array(buffer)
    return getStrFromUint8(
      arr,
      markerOffset + JPG_SEGMENT_MARKER_LENGTH + XMP_HEADER.length,
      segmentLength - JPG_SEGMENT_MARKER_LENGTH - XMP_HEADER.length
    )
  }
}

function jpgWriteXmp(buffer, xmpString) {
  // check if JPG file buffer already contains an XMP segment
  let { markerOffset, segmentLength } = jpgFindXmpSegment(buffer)
  // insert at existing XMP segment offset or right after file start marker
  markerOffset = markerOffset || JPG_FILE_MARKER.length
  const oldSegmentLength = segmentLength || 0
  const newSegmentLength = jpgGetXmpSegmentLength(xmpString, false, false)
  const odlArr = new Uint8Array(buffer)
  const newArr = new Uint8Array(odlArr.length - oldSegmentLength + newSegmentLength)
  // write file part before XMP segment
  copyArr(newArr, 0, odlArr, 0, markerOffset)
  // insert XMP segment
  jpgWriteXmpSegment(newArr, markerOffset, xmpString)
  // file part after XMP segment 
  copyArr(newArr, markerOffset + newSegmentLength, odlArr, markerOffset + oldSegmentLength)
  return newArr.buffer
}

function jpgRemoveXmp(buffer) {
  // check if JPG file buffer contains an XMP segment
  let { markerOffset, segmentLength } = jpgFindXmpSegment(buffer)
  // file contains no XMP: nothing to remove
  if (!markerOffset || !segmentLength) return buffer
  const odlArr = new Uint8Array(buffer)
  const newArr = new Uint8Array(odlArr.length - segmentLength)
  // write file part before XMP segment
  copyArr(newArr, 0, odlArr, 0, markerOffset)
  // file part after XMP segment 
  copyArr(newArr, markerOffset, odlArr, markerOffset + segmentLength)
  return newArr.buffer
}

export { jpgReadXmp, jpgWriteXmp, jpgRemoveXmp, helpers }

// private helpers

function jpgWriteXmpSegment (arr, position, xmpString) {
  const dv = new DataView(arr.buffer)
  copyArr(arr, position, JPG_APP1_MARKER)
  dv.setUint16(position + JPG_APP1_MARKER.length, jpgGetXmpSegmentLength(xmpString, false, true))
  writeStrToUint8(arr, position + JPG_SEGMENT_MARKER_LENGTH, XMP_HEADER)
  writeStrToUint8(arr, position + JPG_SEGMENT_MARKER_LENGTH + XMP_HEADER.length, xmpString)
}

function jpgGetXmpSegmentLength (xmpString, truncate, withoutMarker) {
  let length = JPG_SEGMENT_MARKER_LENGTH + XMP_HEADER.length
  if (!truncate) {
    // Full APP1 XMP segment length, including closing XMP packet tag.
    length += xmpString.length
  } else {
    // Truncated APP1 XMP segment length, ending after closing XMP meta tag, omitting closing XMP packet tag.
    // Mimicking Photoshop behavior which might be related to extended XMP spreading over multiple APP1 segments (?).
    length += xmpString.indexOf(XMP_END_META) + XMP_END_META.length
  }
  if (withoutMarker) length -= JPG_APP1_MARKER.length
  return length
}

function jpgFindXmpSegment (buffer) {
  const arr = new Uint8Array(buffer)
  const dv = new DataView(buffer)
  // const arr16 = new Uint16Array(buffer)
  let markerOffset
  let segmentLength
  let segmentLengthFromHeader
  let offset = 0
  const segments = {}
  let first219Marker
  let firstQtMarker
  // while (!segmentLength && offset < arr.length) {
  while (offset < arr.length) {
    if (arr[offset] === 0xFF && JPG_MARKERS[arr[offset+1]]) {
      segments[offset] = JPG_MARKERS[arr[offset+1]] //  + ' __ ' + getStrFromUint8(arr, offset, 20)
    }
    if (!markerOffset) {
      if (arr[offset] === 0xFF) {
        // 1. Find APP1 XMP segment marker
        if (
          arr[offset+1] === 0xE1
          && getStrFromUint8(arr, offset+4, XMP_HEADER.length) === XMP_HEADER
        ) {
          markerOffset = offset
          segmentLengthFromHeader = dv.getUint16(offset+2)
        }
      }
    } else if (
      // 2. Find XMP segment end
      !segmentLength
      && arr[offset] === 0x3C && arr[offset+1] === 0x3F // ascii char: '<?'
    ) {
      XMP_END_PACKETS.forEach(p => {
        if (getStrFromUint8(arr, offset, p.length) === p) {
          segmentLength = offset + p.length - markerOffset
        }
      })
    }
    offset++
  }
  return { markerOffset, segmentLength, segmentLengthFromHeader, first219Marker, firstQtMarker }
}

function isJpg (arr) {
  return arr[0] === JPG_FILE_MARKER[0] && arr[1] === JPG_FILE_MARKER[1]
}

function copyArr (targetArr, targetPos, sourceArr, sourcePos, sourceLen ) {
  if (!sourcePos) sourcePos = 0
  if (!sourceLen) sourceLen = sourceArr.length - sourcePos
  for (let i = 0; i < sourceLen; i++) targetArr[targetPos+i] = sourceArr[sourcePos+i]
}

function getStrFromUint8(arrUint8, start, length) {
  if (!start) start = 0
  if (!length) length = arrUint8.length - start 
  let out = ''
  for (var n = start; n < start+length; n++) {
      out += String.fromCharCode(arrUint8[n])
  }
  return out
}

function writeStrToUint8(arrUint8, start, str) {
  for(let i=0, l=str.length; i<l; ++i){
    arrUint8[start+i]=str.charCodeAt(i)
  }
}
