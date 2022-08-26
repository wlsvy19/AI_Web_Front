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
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in weightList">
                    <tr :key="index" @click="onClickWeight(item, $event)">
                    <!-- <tr :key="index"> -->
                      <td class="tx-c">{{ ngtpCode[item.weightType] }}</td>
                      <td class="tx-c">{{ item.weightId }}</td>
                      <td class="tx-c">{{ item.workDate }}</td>
                      <td>
                        <button type="button" @click="onDelWeight(item)">
                            삭제
                        </button>
                      </td>
                    </tr>
                  </template>
                  <tr v-if="weightList.length === 0">
                    <td class="tx-c" colspan="4">검색된 기록이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
              <pagination
                :pageInfo="pageInfo"
                @pagination="(p) => onWeightList(p.pageNo)"
              />
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
                  <button type="button" @click="onSearch('단위', 1)">
                    단위 데이터셋
                  </button>
                </li>
                <li :class="`${dtstShowType === '통합' ? 'active' : ''}`">
                  <button type="button" @click="onSearch('통합', 1)">
                    통합 데이터셋
                  </button>
                </li>
              </ul>
            </div>

            <div id="step1bx" class="table-l1 tb-op1 tb-ov1 tabBox" v-if="dtstShowType=='단위'">
              <table>
                <thead>
                  <tr>
                    <th>데이터셋 ID</th>
                    <th>총 데이터수</th>
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
              <pagination
                :pageInfo="pageInfo"
                @pagination="(p) => onWeightList(p.pageNo)"
              />
            </div>

            <div
              id="step2bx"
              class="table-l1 tb-op1 tb-ov1 tabBox"
              v-else
            >
              <table>
                <thead>
                  <tr>
                    <th>데이터셋 ID</th>
                    <th>총 데이터수</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in dtstListBak">
                    <tr :key="index" class="st3tr" data-val="TD-20220305-0001">
                      <td class="tx-c">{{ item.combDtstId }}</td>
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
              <pagination
                :pageInfo="pageInfo"
                @pagination="(p) => onSearch('통합',p.pageNo)"
              />
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
import { IPageInfoModel } from "~/models/common-model";
@Component({ components: { Layout, dtling, dtlfinish } })
export default class extends Vue {
  isRun = "";
  @Prop()
  pageType: string;
  ngtpCode = {};
  weightList = [];
  unitDtstList = [];
  combDtstList = [];
  dtstListBak = [];
  currentMenu: any = {};
  dtstShowType = "단위";
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  weightType = "";


  created() {
    this.currentMenu = this.$store.state.currentMenu;
    this.getNgtpCode();
    this.onWeightList(1);
  }
  async onWeightList(pageNo: number) {    
    const newpage = { ...this.pageInfo, pageNo };
    console.log(this.pageType);

    const data = await commonService.request(
      { pageType: this.pageType, ...newpage },
      "/api/weight-info/list"
    );
    newpage.totalCount = data.page.totalCount+1;
    this.pageInfo = { ...newpage };
    this.weightList = data.list;
    console.log("======", this.weightList);
  }
  onRun(run) {
    this.isRun = run;
  }
  async onShowType(type, newpage) {
    this.dtstShowType = type;
    if (type === "단위") {
      const unitDtstList = await commonService.request(
        { unitDtstType: this.weightType, ...newpage },
        "/api/unit-dtst/list"
      );
      this.unitDtstList = unitDtstList.list;
      console.log("==unitDtstList====", this.unitDtstList);

      // const dtstListBak = this.unitDtstList.filter((v) => v.combDtstInclYn === "N");
      // this.dtstListBak = dtstListBak;
      this.dtstListBak = this.unitDtstList;
    }

    if (type === "통합") {
      const combDtstList = await commonService.request(
        { combDtstType: this.weightType, ...newpage },
        "/api/comb-dtst/list"
      );
      this.combDtstList = combDtstList.list;
      console.log("==dtstList====", this.combDtstList);

      // const dtstListBak = this.combDtstList.filter((v) => v.dtrmYn === "Y");
      // this.dtstListBak = dtstListBak;
      this.dtstListBak = this.combDtstList;
    }
  }
  async onClickWeight(item, event) {
    if (event.target.innerText == '삭제') return;
    console.log("======item===", item);
    this.weightType = item.weightType;
    const pageNo = 1;
    const newpage = { ...this.pageInfo, pageNo };
    this.onShowType("단위", newpage);
  }
  async onSearch(type:string, pageNo: number) {
    const newpage = { ...this.pageInfo, pageNo };
    this.onShowType(type, newpage)
  }
  async getNgtpCode() {
    const ngtpCode = await commonService.request(
      {},
      "/api/cmmn-cd-info/ngtp"
    );
    console.log("ngtpCode==", ngtpCode); 
    this.ngtpCode = ngtpCode;
  }
  async onDelWeight(item) {
    const rs = await commonService.request(
      { 
        weightId:item.weightId,
        filePath:item.filePath
      },
      "/api/weight-info/delete"
    );
    console.log("result==", rs); 
    if (rs == 1) {
      this.weightList = this.weightList.filter((v) => v.weightId != item.weightId);
    }
    else {
      this.$alert('삭제에 실패하였습니다.', '에러', {'type':'error'})
    }
    
  }
}
</script>
<style scoped></style>
