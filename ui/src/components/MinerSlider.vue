<template>
  <div class="miner-slider">
    <Slider
      v-model="value"
      :tooltip="'always'"
      :min="minValue"
      :max="maxValue"
      :interval="1"
      :disabled="disabled"
      @change="change"
    >

    </Slider>
  </div>
</template>

<script>
import Slider from '@vueform/slider'

export default {
  components: {
    Slider
  },
  data() {
    return {
      value: this.startingValue
    };
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    minValue: {
      type: Number,
      required: true
    },
    maxValue: {
      type: Number,
      required: true
    },
    startingValue: {
      type: Number,
      required: true
    }
  },
  computed: {},
  methods: {
    change() {
      return this.$emit("change", this.value);
    }
  }
};
</script>
<style src="@vueform/slider/themes/default.css"></style>

<style lang="scss">
$dotShadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
$dotShadowFocus: 0px 4px 10px rgba(0, 0, 0, 0.4);

.custom-tooltip {
  transform: translateY(50px);
}

// .miner-slider .vue-slider-rail {
//   cursor: pointer;
//   background: linear-gradient(to right, #a7f82d, #fe0606);
// }

// .miner-slider .vue-slider-process {
//   background-color: transparent;
// }

// .miner-slider .vue-slider-disabled {
//   .vue-slider-rail {
//     cursor: not-allowed;
//     background: #ccc;
//   }
// }

.miner-slider {
  --slider-connect-bg: #f09605;
  --slider-connect-bg-disabled: #9CA3AF;
  --slider-height: 6px;
  --slider-vertical-height: 300px;
  --slider-radius: 9999px;

  --slider-handle-bg: #fff;
  --slider-handle-border: 0;
  --slider-handle-width: 16px;
  --slider-handle-height: 16px;
  --slider-handle-radius: 9999px;
  --slider-handle-shadow: 0.5px 0.5px 2px 1px rgba(0,0,0,.32);
  --slider-handle-shadow-active: 0.5px 0.5px 2px 1px rgba(0,0,0,.42);
  --slider-handle-ring-width: 3px;
  --slider-handle-ring-color: #10B98130;

  --slider-tooltip-font-size: 0.875rem;
  --slider-tooltip-line-height: 1.25rem;
  --slider-tooltip-font-weight: 600;
  --slider-tooltip-min-width: 20px;
  --slider-tooltip-bg: #f09605;
  --slider-tooltip-bg-disabled: #9CA3AF;
  --slider-tooltip-color: #fff;
  --slider-tooltip-radius: 5px;
  --slider-tooltip-py: 2px;
  --slider-tooltip-px: 6px;
  --slider-tooltip-arrow-size: 5px;
  --slider-tooltip-distance: 3px;
}
</style>
