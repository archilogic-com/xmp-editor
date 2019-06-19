<template>
  <div id="app" class="app">

    <h1>XMP Editor</h1>
    <div class="app__info-buttons">
      <a href="https://en.wikipedia.org/wiki/Extensible_Metadata_Platform" target="_blank">
        <img class="app__info-buttons__button" src="./assets/img/help.png"/>
      </a>
      <a href="https://github.com/archilogic-com/xmp-editor#api" target="_blank">
        <img class="app__info-buttons__button" src="./assets/img/js.png"/>
      </a>
      <a href="https://github.com/archilogic-com/xmp-editor" target="_blank">
        <img class="app__info-buttons__button" src="./assets/img/github.png"/>
      </a>
    </div>

    <image-io v-on:fileChanged="updateImgArrBuf"
              :imgArrBuf="imgArrBuf"/>
    <tab-menu v-if="imgArrBuf"
              :activeTab="activeTab"
              :setActiveTab="setActiveTab"
              :xmpVendorItems="xmpVendorItems"/>
    <xmp-code v-if="activeTab === 'raw-metadata'"
              :updateXmpStr="updateXmpStr"
              :imgArrBuf="imgArrBuf"
              :xmpStr="xmpStr"/>
    <linked-data v-if="activeTab === 'linked-data'"
                 :xmpStr="xmpStr"
                 :xmpUrlItems="xmpUrlItems"
                 :setActiveTab="setActiveTab"/>
    <vendor-tab v-if="activeTab === 'vendor'"
                 :xmpVendorItems="xmpVendorItems"/>

    <div class="app__credits">
      <!-- <img src="./assets/img/archilogic-logo.svg"/> -->
      <p><a href="https://archilogic.com" target="_blank">Powered by:<br/>Archilogic.com</a></p>
      <p><a href="https://twitter.com/tomaspolach" target="_blank">2019 @TomasPolach</a></p>
    </div>

  </div>
</template>

<script>
import ImageIo from './components/image-io.vue'
import TabMenu from './components/tab-menu.vue'
import XmpCode from './components/xmp-code.vue'
import LinkedData from './components/linked-data.vue'
import VendorTab from './components/vendor-tab.vue'

import { jpgReadXmp } from './js/xmp-api.js'
import { xmpFindItems } from './js/xmp-find-items.js'


export default {
  el: '#app',
  name: 'app',
  components: {
    'image-io': ImageIo,
    'tab-menu': TabMenu,
    'xmp-code': XmpCode,
    'linked-data': LinkedData,
    'vendor-tab': VendorTab
  },
  data: {
    activeTab: null,
    imgArrBuf: null,
    xmpStr: null,
    xmpUrlItems: [],
    xmpVendorItems: []
  },
  methods: {
    async updateImgArrBuf(val) {
      this.imgArrBuf = val
      const xmpStr = jpgReadXmp(this.imgArrBuf)
      await this.updateXmpStr(xmpStr)
    },
    async updateXmpStr(val) {
      this.xmpStr = val
      await this.findUrlItems(val)
    },
    async findUrlItems(xmpStr) {
      const { urlItems, vendorItems } = await xmpFindItems(xmpStr)
      this.xmpUrlItems = urlItems
      this.xmpVendorItems = vendorItems
      if (!this.activeTab) {
        if (vendorItems.length) this.setActiveTab('vendor')
        else if (urlItems.length) this.setActiveTab('linked-data')
        else this.setActiveTab('raw-metadata')
      }
    },
    setActiveTab(name) {
      this.activeTab = name
    }
  }
}
</script>

<style lang="scss">
@import './style/common.scss';
@import './style/reset.scss';

body {
  padding: 20px 0 0 20px;
  margin: 0px;
}

.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;

  h1 {
    margin: 0;
    line-height: 60px;
    font-size: 32px;
    padding: 0px;
  }

  a {
    cursor: pointer;
  }

  &__info-buttons {
    position: absolute;
    top: 34px;
    right: 20px;
    &__button {
      height: 30px;
      margin-left: 8px;
      opacity: 0.2;
      &:hover {
      opacity: 0.5;
    }
    }
  }

  &__credits {
    position: absolute;
    bottom: 20px;
    left: 20px;
    line-height: 1.3;
    img {
      width: 34px;
      display: block;
    }
    a {
      color: black;
      opacity: 0.4;
      text-decoration: none;
      &:hover {
        opacity: 0.6;
      }
    }
    p {
      margin: 2px 0 0 0;
    }
  }
}

</style>
