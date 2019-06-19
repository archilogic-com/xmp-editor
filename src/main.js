import Vue from 'vue'
import FileSaver from 'file-saver'

import App from './App.vue'
import { jpgReadXmp, jpgWriteXmp } from './js/xmp-api'
import { dataUrlToArrayBuffer, createNewXmp } from './js/xmp-api-helpers'

Vue.config.productionTip = false

// const app = new Vue({
//   render: h => h(App)
// }).$mount('#app')

const app = new Vue(App)

// TODO: move this to test script

async function createJpg(name) {
  console.log('create image')
  const canvas = document.createElement('canvas')
  canvas.width = 100
  canvas.height = 100
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = "#00FF00"
  ctx.fillRect(0, 0, 100, 100)
  ctx.strokeStyle = "#FF0000"
  ctx.strokeRect(20, 20, 60, 60)
  const imgDataUrl = canvas.toDataURL('image/jpeg')
  const buffer = dataUrlToArrayBuffer(imgDataUrl)

  const newXmpStr = createNewXmp()
  const newBuffer = await jpgWriteXmp(buffer, newXmpStr)
  const xmpStr = await jpgReadXmp(newBuffer)
  app.$data.xmpStr = xmpStr

  // const blob = new Blob([new Uint8Array(newBuffer)], { type: 'image/jpeg' })
  // FileSaver.saveAs(blob, name)
}

async function updateJpg(url, name) {
  console.log('load url', url)
  const response = await fetch(url)
  const arrayBuf = await response.arrayBuffer()

  const xmpStr = createNewXmp()
  // const xmpStr = await jpgReadXmp(arrayBuf)
  // console.log(arrayBuf, xmpStr)
  const newBuffer = await jpgWriteXmp(arrayBuf, xmpStr)
  console.log(await jpgReadXmp(newBuffer))

  const blob = new Blob([new Uint8Array(newBuffer)], { type: 'image/jpeg' })
  FileSaver.saveAs(blob, name)
}

async function parseJpg(url) {
  const response = await fetch(url)
  const arrayBuf = await response.arrayBuffer()
  return jpgReadXmp(arrayBuf)
}

;(async () => {
  // console.log(await updateJpg('/data/jpg/has_xmp_small.jpg', 'updated_has_xmp_small_'+Date.now()+'.jpg'))
  // await createJpg('new_'+Date.now()+'.jpg') // not working
  // console.log(await updateJpg('/data/jpg/no_xmp_small.jpg', 'updated_no_xmp_small_'+Date.now()+'.jpg')) // not working
  // console.log(await updateJpg('/data/jpg/no_xmp_large.jpg', 'updated_no_xmp_large_'+Date.now()+'.jpg'))
})()
