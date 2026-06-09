<template>
  <div
    :class="[popperClass]"
    :style="{ width: width + 'px' }"
    class="h-tree-select-popover"
    style="overflow-y: auto;"
  >
    <slot />
  </div>
</template>

<script type="text/babel">
import Popper from './utils/vue-popper.js';

export default {
  name: 'HTreeSelectDropdown',

  componentName: 'HTreeSelectDropdown',

  mixins: [Popper],

  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },

    width: {
      type: [String, Number],
      default: 240
    },

    appendToBody: {
      type: Boolean,
      default: true
    },

    boundariesPadding: {
      type: null,
      default: 0
    },
    popperOptions: {
      type: null,
      default() {
        return {
          forceAbsolute: true,
          gpuAcceleration: false
        };
      }
    }
  },

  computed: {
    popperClass() {
      return this.$parent.popperClass;
    }
  },

  mounted() {
    this.referenceElm = this.$parent.$refs.reference;
    this.$parent.popperElm = this.popperElm = this.$el;
    this.$on('updatePopper', () => {
      if (this.$parent.isShowPop) this.updatePopper();
    });
    this.$on('destroyPopper', this.destroyPopper);
  }
};
</script>
