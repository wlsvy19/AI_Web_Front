<template>
  <labl pageType="빛" />
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import labl from "./labl.vue";
@Component({ components: { Layout, labl } })
export default class extends Vue {
  isRun = "";
  onRun(run) {
    this.isRun = run;
  }
}
</script>
<style scoped></style>
