<template>
  <div id="progress-bar-cylinder" style="height:80%;width:100%;display: flex; justify-content: center;">
    <svg
      id="cylinder-progress"
      width="80%"
      height="100%"
    >
      <g
        class="progress-container"
        :stroke="cylinderBackgroundColorStroke"
        :fill="backgroundColor"
      >
        <rect
          x="32"
          y="20"
          width="90%"
          height="76%"
        />
        <ellipse
          cx="50%"
          cy="20"
          rx="45%"
          ry="20"
          class="top"
        />
        <ellipse
          cx="50%"
          cy="80%"
          rx="45%"
          ry="20"
          class="bottom"
        />
      </g>
      <g
        class="progress-content"
        :stroke="cylinderColorStroke"
        :fill="cylinderProgressColor"
      >
        <rect
          x="32"
          :y="rectY"
          width="90%"
          :height="rectHeight"
        />
        <ellipse
          cx="50%"
          :cy="topCy"
          rx="45%"
          ry="20"
          class="top"
        />
        <ellipse
          cx="50%"
          cy="80%"
          rx="45%"
          ry="20"
          class="bottom"  
        />
      </g>
      <g class="progress-container">
        <ellipse
          :stroke="cylinderBackgroundColorStroke"
          cx="50%"
          cy="20"
          rx="45%"
          ry="20"
          class="top"
          fill="none"
        />
      </g>
      <text
        :style="textStyle"
        :x="horizontalTextAlignP"
        :y="verticalTextAlignP"
      >
        {{ value }}%
      </text>
    </svg>
  </div>
</template>

<script>
import { ProgressBarMixin } from './ProgressBarMixin'

export default {
  name: 'ProgressBarCylinder',
  mixins: [ProgressBarMixin],
  props: {
    options: {
      type: Object,
      required: false,
      default: () => {}
    },
    value: {
      type: Number,
      required: false,
      default: 50
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-container {
  stroke-width: 2px;
  .top {
    z-index: 2;
  }
}
.progress-content {
  stroke-width: 2px;
  .top {
    z-index:1;
  }
}
</style>
