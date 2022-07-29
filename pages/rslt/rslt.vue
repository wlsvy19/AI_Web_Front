<template>
  <layout>
    <div id="contents" v-if="isRun === ''">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top">
          <h2 class="ti">
            {{ ((currentMenu || {}).subMenu || {}).MENU_NM }}
          </h2>
        </div>
      </div>

      <div class="clmFlex clmBox-col2 mt15">
        <!-- step1. [S] -->
        <div class="clmBox">
          <div class="clm-head">
            <div class="st-i">Step1</div>
            <p class="st-c"><span>검색할 가중치를 선택하세요.</span></p>
          </div>
          <div class="clm-body2">
            <div id="step1bx" class="table-l1 tb-op1 tb-ov1">
              <table>
                <thead>
                  <tr>
                    <th>유형</th>
                    <th>가중치ID</th>
                    <th>학습일자</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in weightList">
                    <!-- <tr :key="index" @click="onSearchDataset(item)"> -->
                    <tr :key="index">
                      <td class="tx-c">{{ item.weightType }}</td>
                      <td class="tx-c">{{ item.weightId }}</td>
                      <td class="tx-c">{{ item.workDate }}</td>
                    </tr>
                  </template>
                  <tr v-if="weightList.length === 0">
                    <td class="tx-c" colspan="2">검색된 기록이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- step2. [E] -->

        <!-- step3. [S] -->
        <div class="clmBox">
          <div class="clm-head">
            <div class="st-i">Step2</div>
            <p class="st-c">
              <span>검증에사용할 데이터 셋을 선택하세요.</span>
            </p>
          </div>
          <div class="clm-body2">
            <div class="tab mb15">
              <ul class="tabList">
                <li :class="`${dtstShowType === '단위' ? 'active' : ''}`">
                  <button type="button" @click="onShowType('단위')">
                    단위 데이터셋
                  </button>
                </li>
                <li :class="`${dtstShowType === '통합' ? 'active' : ''}`">
                  <button type="button" @click="onShowType('통합')">
                    통합 데이터셋
                  </button>
                </li>
              </ul>
            </div>

            <div id="step1bx" class="table-l1 tb-op1 tb-ov1 tabBox">
              <table>
                <thead>
                  <tr>
                    <th>가중치 ID</th>
                    <th>Iteretion</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in dtstListBak">
                    <tr :key="index" class="st3tr" data-val="TD-20220305-0001">
                      <td class="tx-c">{{ item.unitDtstId }}</td>
                      <td class="tx-c">{{ item.totalCnt }}</td>
                    </tr>
                  </template>
                  <tr
                    v-if="dtstListBak.length === 0"
                    class="st3tr"
                    data-val="TD-20220305-0002"
                  >
                    <td class="tx-c" colspan="2">검색된 기록이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              id="step2bx"
              class="table-l1 tb-op1 tb-ov1 tabBox"
              style="display: none"
            >
              <table>
                <thead>
                  <tr>
                    <th>가중치 ID</th>
                    <th>Iteretion</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in dtstListBak">
                    <tr :key="index" class="st3tr" data-val="TD-20220305-0001">
                      <td class="tx-c">{{ item.unitDtstId }}</td>
                      <td class="tx-c">{{ item.totalCnt }}</td>
                    </tr>
                  </template>
                  <tr
                    v-if="dtstListBak.length === 0"
                    class="st3tr"
                    data-val="TD-20220305-0002"
                  >
                    <td class="tx-c" colspan="2">검색된 기록이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- step3. [E] -->
      </div>

      <!-- button -->
      <div class="mt50 tx-c">
        <button type="button" class="btn-bg-gn wid220" @click="onRun('RUN')">
          검증 시작
        </button>
      </div>
    </div>
    <dtling v-if="isRun === 'RUN'" @onRun="onRun" />
    <dtlfinish v-if="isRun === 'FINISH'" @onRun="onRun" />
  </layout>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import dtling from "./rslt_ing.vue";
import dtlfinish from "./rslt_finish.vue";
import commonService from "~/service/common-service";
@Component({ components: { Layout, dtling, dtlfinish } })
export default class extends Vue {
  isRun = "";
  @Prop()
  pageType: string;
  code = {};
  weightList = [];
  dtstList = [];
  dtstListBak = [];
  currentMenu: any = {};
  dtstShowType = "단위";
  created() {
    this.currentMenu = this.$store.state.currentMenu;
    this.onWeightList();
  }
  async onWeightList() {
    const combDtstType = "A";
    const weightList = await commonService.request(
      { weightType: combDtstType },
      "/api/weight-info/list"
    );
    console.log("======", weightList);
    this.weightList = weightList;
  }
  onRun(run) {
    this.isRun = run;
  }
  onShowType(type) {
    this.dtstShowType = type;
    if (type === "단위") {
      console.log(this.dtstList);
      const dtstListBak = this.dtstList.filter((v) => v.combDtstInclYn === "N");
      this.dtstListBak = dtstListBak;
    }
    if (type === "통합") {
      console.log(this.dtstList);
      const dtstListBak = this.dtstList.filter((v) => v.combDtstInclYn === "Y");
      this.dtstListBak = dtstListBak;
    }
  }
  async onSearchDataset(item) {
    console.log("======item===", item);
    const dtstList = await commonService.request(
      { combDtstId: item.weightId },
      "/api/unit-dtst/list"
    );
    console.log("==dtstList====", dtstList);
    this.dtstList = dtstList;
    this.onShowType("단위");
  }
}
</script>
<style scoped></style>
