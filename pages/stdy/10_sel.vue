<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top">
          <h2 class="ti">영상학습</h2>
        </div>
      </div>

      <div class="clmFlex clmBox-col3 mt15">
        <!-- step1. [S] -->
        <div class="clmBox">
          <div class="clm-head">
            <div class="st-i">Step1</div>
            <p class="st-c"><span>학습할 엔진 종류를 선택해주세요.</span></p>
          </div>

          <p class="st1-class">
            <span class="cl-v" @click="onShowPop(true)">유형별 설명보기</span>

            <!-- 기회석에서 버튼인지 아닌지 설명이 없음... 혹시라도 버튼일 경우 아래 버튼 주석 해제후 사용, 위 span은 삭제. -->
            <!-- <button type="button" class="cl-v">유형별 설명보기</button> -->
          </p>
          <div id="step1Bx" class="st-ctg">
            <template v-for="(item, index) in code.NGTP">
              <span :key="index">
                <input
                  type="radio"
                  :id="`i${index}`"
                  name="step1"
                  @click="onSelEnginType(item.cmmnCd, item.cmmnCdNm)"
                />
                <label :for="`i${index}`"> {{ item.cmmnCdNm }}</label>
              </span>
            </template>
          </div>
        </div>
        <!-- step1. [E] -->

        <!-- step2. [S] -->
        <div class="clmBox" disabled>
          <div class="clm-head">
            <div class="st-i">Step2</div>
            <p class="st-c">
              <span>학습에 사용할 통합 데이터 셋을<br />선택해주세요.</span>
            </p>
          </div>
          <div class="clm-body mt30">
            <div id="step2bx" class="table-l1 tb-op1 tb-ov1">
              <table>
                <thead>
                  <tr style="background-color: var(--green2)">
                    <th>통합데이터 셋 ID</th>
                    <th>데이터 개수</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in dataSetList">
                    <tr
                      :key="index"
                      @click="learn_dtst_id = item.combDtstId"
                      :class="learn_dtst_id == item.combDtstId ? 'active' : ''"
                    >
                      <td class="tx-c">
                        {{ item.combDtstId }}
                      </td>
                      <td class="tx-c">
                        {{ item.totalCnt }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <pagination
                :pageInfo="combPageInfo"
                :layout="'total, sizes, prev, pager, next'"
                style="scale: 0.9em;"
                @pagination="(p) => onSearchCombDtstList(p.pageNo)"
              />
            </div>
          </div>
        </div>
        <!-- step2. [E] -->

        <!-- step3. [S] -->
        <div class="clmBox">
          <div class="clm-head">
            <div class="st-i">Step3</div>
            <p class="st-c">
              <span>베이스로 사용할 가중치파일을<br />선택해주세요.</span>
            </p>
          </div>
          <div class="clm-body mt30">
            <div id="step3bx" class="table-l1 tb-op1 tb-ov1">
              <table>
                <thead>
                  <tr>
                    <th>가중치 ID</th>
                    <th>Iteretion</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in weightList">
                    <tr
                      class="st3tr"
                      data-val="TD-20220305-0001"
                      :key="index"
                      :class="weight_id === item.weightId ? 'active' : ''"
                      @click="weight_id = item.weightId"
                    >
                      <td class="tx-c">{{ item.weightId }}</td>
                      <td class="tx-c">{{ comma(item.itertaionNo) }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <pagination
                :pageInfo="weightPageInfo"            
                :layout="'total, sizes, prev, pager, next'"
                style="scale: 0.9em;"
                @pagination="(p) => onSearchWeightList(p.pageNo)"
              />
            </div>
          </div>
        </div>
        <!-- step3. [E] -->
      </div>

      <!-- button -->
      <div class="mt50 tx-c">
        <button type="button" class="btn-bg-gn wid220" @click="onStudy()">
          학습 시작
        </button>
      </div>
    </div>
    <div class="popup pop1" v-if="showPop" :style="`display:block;left:30%`">
      <h1>엔진 종류 설명</h1>

      <div class="thumList-l1 pop-body scl">
        <ul>
          <template v-for="(item, index) in code.NGTP">
            <li :key="index" class="flex">
              <figure>
                <img
                  :src="`/v1/api/sample-info/data?grpCd=NGTP&cmmnCd=${item.cmmnCd}`"
                  :alt="item.cmmnCdNm"
                  width="120"
                  height="90"
                />
              </figure>
              <div class="thm-box">
                <strong class="thm-name">{{ item.cmmnCdNm }}</strong>
                <p class="thm-cp">{{ item.cmmnDesc }}</p>
              </div>
            </li>
          </template>
        </ul>
      </div>

      <button type="button" class="pop-close" @click="onShowPop(false)">
        닫기
      </button>
    </div>

    <div
      v-if="showPop"
      @click="showPop = false"
      class="mask"
      style="display: block"
    ></div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import { IPageInfoModel } from "~/models/common-model";
import commonService from "~/service/common-service";
import { comma, today } from "~/utils/common";
import dtl from "./10_ing.vue";
@Component({ components: { Layout, dtl } })
export default class extends Vue {
  study = { combDtstType: "", combDtstTypeNm: "" };
  showPop = false;
  code = {};
  dataSetList = [];
  weightList = [];
  serverData = {};
  isRun = false;
  learn_dtst_id = "";
  weight_id = "";
  statusTimer = null;
  isStop = "";

  combPageInfo: IPageInfoModel = commonService.getPageInitInfo();
  weightPageInfo: IPageInfoModel = commonService.getPageInitInfo();

  created() {
    this.codeList();
    const now = today();
    const now1 = today("L");
    console.log("now===", now);
    console.log("now1===", now1);
  }

  async mounted() {
    await this.getStatusInfo();
    this.statusTimer= setInterval(this.getStatusInfo, 5000);
  }

  async destroyed() {
    clearInterval(this.statusTimer);
    localStorage.removeItem('isStop');
  }

  onShowPop(show) {
    // const wid = (this.$refs.pop as any).offsetWidth;
    this.showPop = show;
  }
  async getStatusInfo() {
    // ====== status_info 테이블 ======
    const infoData = await commonService.request(
      {},
      "/api/learn-status/data/ing"
    );
    console.log("=statusInfo=", infoData);
    this.isStop = localStorage.getItem("isStop");
    
    if (infoData['trainingYn'] == "Y" && this.isStop != "stop") {
      clearInterval(this.statusTimer);
      this.$emit("onRun", "RUN");
    }
  }

  async onStudy() {
    if (!this.learn_dtst_id) return await alert("데이터셋을 선택해주세요.");
    if (!this.weight_id) return await alert("가중치를 선택해주세요.");
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth()+1)).slice(-2)
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2); 
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2); 

    const trainingId = "" + year+month+day+hours+minutes+seconds
    const startDttm = year + "-" + month + "-" + day+ " " + hours + ":" + minutes + ":" + seconds
    
    if (this.weight_id == '가중치 선택안함') this.weight_id = "";
    const param = {
      trainingId: trainingId,
      engineType: this.study.combDtstType,
      combDtstId: this.learn_dtst_id,
      weightId: this.weight_id,
      startDttm: startDttm,
      trainingYn: "Y"
    }
    const rs = await commonService.request(
      param,
      "/api/learn-status/data/start"
    );
    
    if (rs == 1){
      this.$emit("onRun", "RUN");
    }
    else {
      alert(rs);
    }
  }
  comma(num) {
    return comma(num);
  }
  async onSelEnginType(combDtstType, combDtstTypeNm) {
    this.study = { combDtstType, combDtstTypeNm };
    await this.onSearchCombDtstList(1);
    await this.onSearchWeightList(1)
  }
  async onSearchCombDtstList(pageNo:number) {
    const newpage = { ...this.combPageInfo, pageNo };
    const data = await commonService.request(
      { combDtstType:this.study.combDtstType, ...newpage },
      "/api/comb-dtst/learn/list"
    );    
    newpage.totalCount = data.page.totalCount;
    this.combPageInfo = { ...newpage };
    this.dataSetList = data.list;
    console.log('dataSetList===', this.dataSetList);
  }
  async onSearchWeightList(pageNo:number) {
    const newpage = { ...this.weightPageInfo, pageNo};
    const data = await commonService.request(
      { weightType: this.study.combDtstType, ...newpage },
      "/api/weight-info/list"
    );
    newpage.totalCount = data.page.totalCount;
    this.weightPageInfo = { ...newpage };
    this.weightList = data.list;
    
    if(pageNo == 1) {
      this.weightList.unshift({
        iterationNo: 0,
        weightId: "가중치 선택안함",
        weightType: this.study.combDtstTypeNm,
      })
    }
    console.log('===weightList', this.weightList)
  }

  async codeList() {
    const codeList = await commonService.request(
      ["NGTP"],
      "/api/common/code/list"
    );
    this.code = codeList;
  }
}
</script>
<style scoped>
.actived {
  background-color: var(--green2);
}
</style>
