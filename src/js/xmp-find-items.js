import parseXml from '@rgrove/parse-xml'
import { withinString } from 'urijs'

export { xmpFindItems }

async function xmpFindItems (xmpStr) {
  const result = {
    urlItems: [],
    vendorItems: []
  }
  if (!xmpStr || xmpStr === '') return result

  let xml
  try {
    xml = parseXml(xmpStr)
  } catch (err) {
    console.log('Error parsing XML: ', err)
    return result
  }
  
  // vendor specific items
  const sceneId = findArchilogicSceneId(xml)
  if (sceneId) {

    result.vendorItems.push({
      vendor: 'archilogic',
      sceneId
    })

    result.urlItems.push({
      title: 'Archilogic 3D Model',
      url: `https://dashboard.archilogic.com/scene/!${sceneId}/view`
    }, {
      title: 'Interactive Floor Plan',
      url: `https://dashboard.archilogic.com/scene/!${sceneId}/plan`
    }, {
      title: 'Space Profiler',
      url: `https://dashboard.archilogic.com/scene/!${sceneId}/profiler`
    })

  }
  
  // generic items with URL
  getUrlNodes(xml).forEach(([url, node]) => {
    // Ignore archilogic URLs if sceneId is provided
    if (sceneId && url.indexOf(sceneId) > -1) return
    result.urlItems.push({ url, src:'', title:node.name })
  })
  
  return result
}

function findArchilogicSceneId(xml) {
  let sceneId
  traverse(xml, node => {
    if (node.type === 'element') {
      if (node.name === 'archilogic:sceneId') sceneId = node.children[0].text
    }
  })
  return sceneId
}

function getUrlNodes(xml) {
  const urlNodes = {}
  traverse(xml, node => {
    if (node.type === 'text' && node.text && node.text !== '' && node.text !== '\n') {
      const url = withinString(node.text, url => {
        urlNodes[url] = node
      })
    }
  })
  return Object.entries(urlNodes)
}

function traverse (node, callback) {
  callback(node)
  if (node.children && node.children.length) {
    node.children.forEach(child => {
      traverse(child, callback)
    })
  }
}