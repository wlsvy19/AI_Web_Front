<template>
  <layout>
    <sel v-if="isRun === ''" @onRun="onRun" />
    <dtl v-if="isRun === 'RUN'" @onRun="onRun" />
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import common from "~/plugins/common";
import commonService from "~/service/common-service";
import { comma } from "~/utils/common";
import dtl from "./10_ing.vue";
import sel from "./10_sel.vue";
@Component({ components: { Layout, dtl, sel } })
export default class extends Vue {
  isRun = "";
  dataset: any = {};
  mounted() {
    this.dataset = commonService.getDataset();
    console.log("==dataset===", this.dataset);
    if (this.dataset?.trainingYn == "Y") {
      this.isRun = "RUN";
    }
  }
  onRun(run) {
    this.isRun = run;
  }
}
</script>
<style scoped>
.actived {
  background-color: var(--green2);
}
</style>
