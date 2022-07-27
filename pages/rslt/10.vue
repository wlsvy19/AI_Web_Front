<template>
  <rslt pageType="미오인식" />
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import rslt from "./rslt.vue";
@Component({ components: { Layout, rslt } })
export default class extends Vue {
  isRun = "";
  onRun(run) {
    this.isRun = run;
  }
}
</script>
<style scoped></style>
