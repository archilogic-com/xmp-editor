<template>
  <div class="vendor">
    
  <div class="vendor__iframe">
    <iframe :src="getInfo.url"></iframe>
  </div>

  <div class="vendor__info" v-html="getInfo.info"></div>

  </div>
</template>

<script>

export default {
  name: 'VendorTab',
  props: {
    xmpVendorItems: Array
  },
  computed: {
    getInfo() {
      const item = this.xmpVendorItems[0]
      // currently only archilogic vendor is supported
      if (!item || item.vendor !== 'archilogic') return false
      const sceneId = item.sceneId
      const info = `<a href="https://dashboard.archilogic.com/scene/!${sceneId}/view" target="_blank">Open in Archilogic Dashboard</a>`
      const url = `https://viewer.archilogic.com/?sceneId=${sceneId}&s=m3fss1p3stmh`
      return { info, url }
    }
  }
}

</script>

<style lang="scss">
@import '../style/common.scss';

.vendor {
  position: absolute;
  display: block;
  top: 150px;
  right: 20px;
  bottom: 20px;
  left: 300px;
  background-color: scale-color($panel-color, $lightness: -10%);
  border-bottom-left-radius: $panel-border-radius;
  border-bottom-right-radius: $panel-border-radius;
  padding: 30px 16px 30px 16px;
  overflow: none;

  &__iframe {
    display: block;
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 4px;
    iframe {
      width: 100%;
      height: 100%;
    }
  }

  &__info {
    display: block;
    position: absolute;
    left: 10px;
    top: 10px;
    padding: 10px;
  }

}

</style>
