<template>
  <layout>
    <div id="contents">
      <div id="ing-content">
        <h1 class="ti">
          {{ ((currentMenu || {}).subMenu || {}).MENU_NM }} 진행중
        </h1>

        <div class="table-v1 mb20">
          <table>
            <colgroup>
              <col width="85px" />
              <col width="*" />
            </colgroup>
            <tbody>
              <tr>
                <th>종류</th>
                <td>단위 테스트 셋</td>
              </tr>
              <tr>
                <th>ID</th>
                <td>UD-20220103-0001</td>
              </tr>
              <tr>
                <th>영상 개수</th>
                <td>85,162 장</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 진행률 progress bar -->
        <div class="progressBox">
          <strong class="prgs-ing">150장</strong>
          <span class="prgs-val">/ 10000000장 진행중</span>
          <!-- progress value에 데이터 값 넣으면 됩니다. -->
          <progress
            class="prog-bar"
            id="ver-prgs"
            value="30"
            min="10"
            max="100"
          ></progress>
          <div class="prgs-ing-per"><span class="per">76%</span> 검증중</div>
        </div>

        <div class="tx-c mt50">
          <button
            type="button"
            class="btn btn-sz4 btn-gr1"
            @click="$emit('onRun', 'FINISH')"
          >
            검증 중지
          </button>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
@Component({ components: { Layout } })
export default class extends Vue {
  currentMenu: any = {};
  created() {
    this.currentMenu = this.$store.state.currentMenu;
  }
}
</script>
<style scoped></style>
