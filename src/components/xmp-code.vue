// http://farhadg.github.io/code-mirror-themes/

<template>
  <div class="xmp-code">
    <div class="xmp-code__cm-container">
      <codemirror :code="xmpStrFormatted" v-on:blur="onCmBlur" v-on:update="onCmChange" :options="cmOptions" ref="cm"/>
    </div>
    <div class="xmp-code__export-menu text-menu">
      <a @click="downloadImage">Download Image</a>
      <span class="text-menu-spacer"></span>
      <a @click="exportXmp">Export</a>
      <span class="text-menu-spacer"></span>
      <span>
        <a @click="loadTemplate">Create new</a>
        <div v-if="!xmpStr || xmpStr === ''" class="xmp-code__tooltip-create">XMP data not provided. You can add new XMP data from a <a @click="loadTemplate">template.</a></div>
      </span>
    </div>
  </div>
</template>

<script>
import vkbeautify from 'vkbeautify'
import { debounce } from 'lodash'
import FileSaver from 'file-saver'
import { jpgWriteXmp, jpgRemoveXmp } from '../js/xmp-api.js'
import { createNewXmp } from '../js/xmp-api-helpers.js'
import { codemirror } from 'vue-codemirror'
// require styles
import 'codemirror/lib/codemirror.css'
// language js
import 'codemirror/mode/xml/xml.js'
// search
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
// theme css
// dark
import 'codemirror/theme/nord.css'
// import '../style/codemirror-theme/one-dark.css'
// import 'codemirror/theme/railscasts.css'
// import 'codemirror/theme/hopscotch.css'
// import 'codemirror/theme/twilight.css'
// import 'codemirror/theme/lucario.css'
// import 'codemirror/theme/zenburn.css'
// light
// import 'codemirror/theme/xq-light.css'
// import 'codemirror/theme/mdn-like.css'
// import 'codemirror/theme/neo.css'


export default {
  name: 'XmpCode',
  props: {
    xmpStr: {
      type: String,
      default: ''
    },
    imgArrBuf: ArrayBuffer,
    updateXmpStr: Function
  },
  data() {
    return {
      // showCreateTooltip: false,
      cmOptions: {
        mode: 'text/xml',
        theme: 'nord',
        lineNumbers: true
      }
    }
  },
  computed: {
    xmpStrFormatted() {
      if (!this.xmpStr || this.xmpStr === '') return ''
      return vkbeautify.xml(this.xmpStr, 2)
    },
    codemirror() {
      return this.$refs.cm.codemirror
    }
  },
  watch: {
    // imgArrBuf: async function (newVal, oldVal) {
    //   this.parseImgArrBuf()
    // }
  },
  methods: {
    onCmBlur() {
      const xmpStr = this.codemirror.doc.getValue()
      this.updateXmpStr(xmpStr)
    },
    onCmChange() {
      if (!this.xmpStr || this.xmpStr === '') {
        const xmpStr = this.codemirror.doc.getValue()
        this.updateXmpStr(xmpStr)
      }
    },
    // onCodeChange: debounce(function () {
    //   const xmpStr = this.codemirror.doc.getValue()
      
    // }, 100),
    async downloadImage() {
      // TODO: set image type based on input
      // TODO: use imagename
      const xmpStr = this.codemirror.doc.getValue()
      let arrBufOut
      if (!xmpStr || xmpStr === '') {
        // no XMP: remove XMP in original
        arrBufOut = await jpgRemoveXmp(this.imgArrBuf)
      } else {
        const xmpStrMin = vkbeautify.xmlmin(xmpStr, false)
        // will replace existing XMP or add new one
        arrBufOut = await jpgWriteXmp(this.imgArrBuf, xmpStrMin)
      }
      const blob = new Blob([new Uint8Array(arrBufOut)], { type: 'image/jpeg' })
      FileSaver.saveAs(blob, 'image-with-xmp-metadata.jpg')
    },
    exportXmp() {
      // TODO: use imagename
      const xmpStr = this.codemirror.doc.getValue()
      const blob = new Blob([xmpStr], {type : 'text/xml'})
      FileSaver.saveAs(blob, 'xmp-metadata.xml')
    },
    loadTemplate() {
      // TODO: check overwrite and import template with dc namespace
      if (this.codemirror.doc.getValue() !== '') {
        const ok = window.confirm('Creating a new XMP document will overwrite the current one. Continue?')
        if (!ok) return
      }
      const xmpStr = createNewXmp()
      this.updateXmpStr(xmpStr)
    }
  },
  components: {
    codemirror
  },
  mounted() {
    this.codemirror.doc.setCursor({line: 0, ch: 0})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only
<style scoped lang="scss"> -->
<style lang="scss">
@import '../style/common.scss';

.xmp-code {
  position: absolute;
  top: 150px;
  right: 20px;
  bottom: 20px;
  left: 300px;
  &__cm-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 50px;
    left: 0;
  }
  &__export-menu {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    background-color: $panel-color;
    line-height: 50px;
    padding-left: 15px;
    border-bottom-left-radius: $panel-border-radius;
    border-bottom-right-radius: $panel-border-radius;
  }
  &__tooltip-create {
    position: absolute;
    bottom: 70px;
    left: -110px;
    width: 310px;

    padding: 15px;
    line-height: 1.3;
    border-radius: $panel-border-radius;
    background: rgb(138, 9, 0);
    color: white;
    font-weight: bold;
    a {
      color: white !important;
      text-decoration: underline;
    }
    &::after {
      // arrow made of css border
      content: " ";
      position: absolute;
      top: 100%; /* At the bottom of the tooltip */
      left: 50%;
      margin-left: -12px;
      border-width: 12px;
      border-style: solid;
      border-color: rgb(138, 9, 0) transparent transparent transparent;
    }
  }
}

.vue-codemirror, .CodeMirror {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%!important;
}

</style>
