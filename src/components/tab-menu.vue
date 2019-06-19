// http://farhadg.github.io/code-mirror-themes/

<template>
  <div class="tab-menu text-menu">
    <a @click="setActiveTab('raw-metadata')" :class="{'tab-menu__raw-active': activeTab === 'raw-metadata'}">Raw Metadata</a>
    <span class="text-menu-spacer"></span>
    <a @click="setActiveTab('linked-data')" :class="{'tab-menu__linked-active': activeTab === 'linked-data'}">Resources</a>
    <span class="text-menu-spacer"></span>
    <a v-if="xmpVendorItems.length" @click="setActiveTab('vendor')" :class="{'tab-menu__vendor-active': activeTab === 'vendor'}">Vendor</a>
  </div>
</template>

<script>
export default {
  name: 'TabMenu',
  props: {
    activeTab: String,
    setActiveTab: Function,
    xmpVendorItems: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only
<style scoped lang="scss"> -->
<style lang="scss">
@import '../style/common.scss';

.tab-menu {
  position: absolute;
  top: 100px;
  right: 20px;
  left: 300px;
  height: 50px;
  line-height: 50px;
  padding-left: 15px;
  background-color: $panel-color;
  border-top-left-radius: $panel-border-radius;
  border-top-right-radius: $panel-border-radius;
  &__raw-active {
    border-bottom: 10px solid #2e3440;
  }
  &__linked-active {
    border-bottom: 10px solid scale-color($panel-color, $lightness: -10%);
  }
  &__vendor-active {
    border-bottom: 10px solid scale-color($panel-color, $lightness: -10%);
  }
}

</style>
