<template>
  <div class="linked-data">
    
    <div v-if="!xmpStr">
      This File has no embedded XMP metadata. <a @click="setActiveTab('raw-metadata')" style="text-decoration: underline;">Add new metadata in the XMP editor.</a>
    </div>

    <div v-if="xmpStr && !xmpUrlItems.length">
      This file contains no URL resources. <a @click="setActiveTab('raw-metadata')" style="text-decoration: underline;">Show raw XMP metadata.</a>
    </div>
    
    <div v-if="xmpStr && xmpUrlItems.length">
      <h2>URL references extracted from XMP metadata:</h2>
    </div>

    <div v-for="item in xmpUrlItems" class="linked-data__item">
      <a :href="item.url"  target="_blank">
        <div class="linked-data__item__preview">
          <img src="../assets/img/linked-resource.png">
        </div>
        <div class="linked-data__item__info">
          <h2>{{item.title}}</h2>
          <div class="linked-data__item__info__url">{{item.url}}</div>
        </div>
      </a>
    </div>

  </div>
</template>

<script>
// import { find } from 'lodash'

export default {
  name: 'LinkedData',
  props: {
    xmpStr: String,
    xmpUrlItems: Array,
    setActiveTab: Function
  }
}

</script>

<style lang="scss">
@import '../style/common.scss';

.linked-data {
  position: absolute;
  top: 150px;
  right: 20px;
  bottom: 20px;
  left: 300px;
  background-color: scale-color($panel-color, $lightness: -10%);
  border-bottom-left-radius: $panel-border-radius;
  border-bottom-right-radius: $panel-border-radius;
  padding: 30px 16px 30px 16px;
  overflow: auto;

  h2 {
    margin-bottom: 30px;
  }

  &__item {
    display: block;
    position: relative;
    margin: 0 0 26px 0;
    white-space: nowrap;
    width: 100%;
    height: 50px;
    &__preview {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 50px;
      height: 50px;
      background-color: scale-color($panel-color, $lightness: -20%);
      border-radius: $panel-border-radius;
      img {
        margin: 8px;
        max-width: 34px;
        max-height: 34px;
        // border: 1px dotted black;
      }
    }
    &__info {
      position: absolute;
      top: 0px;
      left: 50px;
      right: 0px;
      padding: 4px 0 0 12px;
      vertical-align: top;
      width: auto;
      overflow: hidden;
      white-space: nowrap;
      color: $text-color;
      &:hover {
        color: desaturate(lighten($text-color, 20%), 66%);
      }
      a {
        text-decoration: none !important;
      }
      h2 {
        
        font-size: 24px;
        padding: 0 0 6px 0;
        margin: 0;
        text-decoration: none !important;
      }
      &__url {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

}

</style>
