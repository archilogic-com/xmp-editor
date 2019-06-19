// https://github.com/archilogic-com/dashboard/blob/master/src/components/order/order-form.vue
// https://github.com/archilogic-com/dashboard/blob/master/src/components/common/upload-image.vue

<template>
  <div class="img-io">
    <div class="img-io__dropzone">
        
        <input
          type="file"
          @dragenter="dragEnter"
          @dragleave="dragLeave"
          @dragover="dragOver"
          @drop="onFileChange"
          @change="onFileChange">

        <div
          class="img-io__dropzone__overlay"
          :class="{'img-io__dropzone__overlay-hover': hovering}">
        </div>

        <div class="img-io__dropzone__info" v-if="!imgArrBuf">
          Drag & drop file here
        </div>

        <div
          class="img-io__dropzone__preview"
          v-if="imgArrBuf"
          :style="{ 'background-image': 'url(' + imgDataUrl + ')' }">
        </div>

    </div>

  </div>
</template>

<script>
import FileSaver from 'file-saver'
import { blobToArrayBuffer, arrayBufferToDataUrl } from '../js/xmp-api-helpers.js'

export default {
  name: 'upload-image',

  props: {
    imgArrBuf: ArrayBuffer
  },

  data: function() {
    return {
      hovering: false
    }
  },

  computed: {

    imgDataUrl() {
      // convert ArrayBuffer to DataUrl
      return `"${arrayBufferToDataUrl('image/jpeg', this.imgArrBuf)}"`
    }

  },

  methods: {
    
    dragEnter: function(e) {
      e.preventDefault()
      this.hovering = true
      return false
    },

    dragOver: function(e) {
      e.preventDefault()
      return false
    },

    dragLeave: function(e) {
      e.preventDefault()
      this.hovering = false
      return false
    },

    onFileChange: async function(e) {
      e.preventDefault()
      this.hovering = false

      // from file drop
      var files = e.target.files
      // from input field
      if (e.dataTransfer && e.dataTransfer.files) files = e.dataTransfer.files
      if (!files.length) return

      var numFiles = this.isMultiple ? files.length : 1
      var file = files[0]

      // workaround for empty file.type property
      var fileType = file.type
      if (file.type && file.type.toLowerCase() !== 'image/jpeg') {
        window.alert('Only *.jpg files are supported in this version.') 
        return
      }
      if (!fileType) {
        var _fileType = file.name.split('.')
        fileType = 'application/' + _fileType[_fileType.length - 1]
      }
      const imgArrBuf = await blobToArrayBuffer(file)
      this.$el.querySelector('input').value = null
      this.$emit('fileChanged', imgArrBuf)
    }

  }
}
</script>

<style lang="scss">
@import '../style/common.scss';

.img-io {
  position: absolute;
  top: 100px;
  left: 20px;
  &__dropzone {
    display: block;
    width: 260px;
    height: 260px;
    background-color: $panel-color;
    border-radius: $panel-border-radius;
    input {
      position: absolute;
      cursor: pointer;
      z-index: 1000;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    &__overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 10px solid transparent;
      z-index: 10;
      &-hover {
        background-color: rgba(175, 223, 45, 0.4);
        border: 10px solid rgba(175, 223, 45, 0.6);
      }
    }
    &__preview {
      position: absolute;
      top: 15px;
      right: 15px;
      bottom: 15px;
      left: 15px;
      z-index: 0;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 50% 50%;
    }
    &__info {
      line-height: 260px;
      text-align: center;
    }

  }
}

// .content-drop-images {
//   top: 1em;
// }

// .content-drop-images div {
//   display: inline-block;
//   margin-right: 0.25em;
//   margin-bottom: 0.25em;
// }

// .content-drop-floorplans {
//   position: relative;
//   padding: 1em;
//   float: left;
//   width: 100%;
//   height: 80px;
//   background: $white-0;
//   border: solid 1px $grey-20;
//   box-sizing: border-box;
//   margin-bottom: 1em;
//   &:hover {
//     border: solid 1px $grey-40;
//   }
// }

// .content-drop-photos {
//   position: relative;
//   padding: 10px 10px 0 10px;
//   min-height: 75px;
//   width: 100%;
//   box-sizing: border-box;
//   display: inline-block;
//   background: $white-0;
//   border: solid 1px $grey-20;
//   &:hover {
//     border: solid 1px $grey-40;
//   }
// }

// .content-drop-previews {
//   position: relative;
//   float: left;
//   margin-bottom: 0.5em;
// }

// .content-drop-preview-pic {
//   float: left;
//   width: 60px;
//   height: 40px;
//   line-height: 40px;
//   text-align: center;
//   margin-right: 0.25em;
//   img {
//     max-width: 100%;
//     max-height: 100%;
//     vertical-align: middle;
//   }
//   .product-drop-preview & {
//     height: 90px;
//     line-height: 90px;
//     width: 120px;
//   }
// }

// .content-drop-button-delete {
//   display: inline-block !important;
//   width: 20px;
//   height: 20px;
//   margin-right: 0.5em;
//   border-radius: 50px;
//   vertical-align: top;
//   cursor: pointer;
//   background-image: url(../../assets/icon-close-black.svg);
//   background-position: center;
//   background-size: 20px;
//   background-repeat: no-repeat;
//   &:hover {
//     background-color: $white-3;
//   }
// }

// .content-drop-photo-add {
//   width: 80px;
//   padding: 0.3em;
//   cursor: pointer;
//   border-radius: 1em;
//   &:hover {
//     color: $grey-80;
//     background: $white-3;
//   }
// }

// .dropzone-info {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: flex-start;
//   > * {
//     text-align: center;
//   }
// }

// .dropzone-info-text {
//   color: $grey-40;
//   font-size: 14px;
//   text-align: center;
//   display: block;
// }
</style>