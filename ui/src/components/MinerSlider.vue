<template>
  <div class="miner-slider">
    <vue-slider
      v-model="value"
      :tooltip="'always'"
      :min="minValue"
      :max="maxValue"
      :interval="1"
      :contrained="true"
      :disabled="disabled"
      @change="change"
    >
      <template v-slot:tooltip="{ value, focus }">
        <div :class="['custom-tooltip', { focus }]">
          <small class="text-muted">{{ value }}%</small>
        </div>
      </template>
    </vue-slider>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  components: {
    VueSlider
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

<style lang="scss">
$dotShadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
$dotShadowFocus: 0px 4px 10px rgba(0, 0, 0, 0.4);

.custom-tooltip {
  transform: translateY(50px);
}

.miner-slider .vue-slider-rail {
  cursor: pointer;
  background: linear-gradient(to right, #a7f82d, #fe0606);
}

.miner-slider .vue-slider-process {
  background-color: transparent;
}

.miner-slider .vue-slider-disabled {
  .vue-slider-rail {
    cursor: not-allowed;
    background: #ccc;
  }
}
</style>
