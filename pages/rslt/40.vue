<template>
  <list v-if="isRun === ''" @onRun="onRun" />
  <run v-else-if="isRun === 'RUN'" @onRun="onRun" />
  <finish v-else-if="isRun === 'FINISH'" @onRun="onRun" />
  <error v-else-if="isRun === 'ERROR'" @onRun="onRun" />
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import list from "./re_list.vue";
import run from "./re_run.vue";
import finish from "./re_finish.vue";
import error from "./re_error.vue";
@Component({ components: { Layout, list, run, finish, error } })
export default class extends Vue {
  isRun = "";
  onRun(run) {
    this.isRun = run;
  }
}
</script>
<style scoped></style>
