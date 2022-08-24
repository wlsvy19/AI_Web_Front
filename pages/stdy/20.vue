<template>
  <layout>
    <his v-if="showGrpah === ''" @onGrpah="onGrpah" />
    <grp v-if="showGrpah === 'show'" @onGrpah="onGrpah" />
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import common from "~/plugins/common";
import commonService from "~/service/common-service";
import { comma } from "~/utils/common";
import his from "./20_history.vue";
import grp from "./20_graph.vue";
@Component({ components: { Layout, his, grp } })
export default class extends Vue {
  showGrpah = "";
  onGrpah(show) {
    this.showGrpah = show;
  }
}
</script>

