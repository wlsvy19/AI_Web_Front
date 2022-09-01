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
                      <td class="tx-c" :style="item.weightId == selWeight? 'background-color:var(--green2)':''">{{ ngtpCode[item.weightType] }}</td>
                      <td class="tx-c" :style="item.weightId == selWeight? 'background-color:var(--green2)':''">{{ item.weightId }}</td>
                      <td class="tx-c" :style="item.weightId == selWeight? 'background-color:var(--green2)':''">{{ item.workDate }}</td>
                      <td class="tx-c" :style="item.weightId == selWeight? 'background-color:var(--green2)':''">
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
                <li :class="`${dtstShowType === 'U' ? 'active' : ''}`">
                  <button type="button" @click="onSearch('U', 1)">
                    단위 데이터셋
                  </button>
                </li>
                <li :class="`${dtstShowType === 'T' ? 'active' : ''}`">
                  <button type="button" @click="onSearch('T', 1)">
                    통합 데이터셋
                  </button>
                </li>
              </ul>
            </div>

            <div id="step1bx" class="table-l1 tb-op1 tb-ov1 tabBox" v-if="dtstShowType=='U'">
              <table>
                <thead>
                  <tr>
                    <th>데이터셋 ID</th>
                    <th>총 데이터수</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in dtstListBak">
                    <tr :key="index" class="st3tr" data-val="TD-20220305-0001" @click="onClickDtst(item)">
                      <td class="tx-c" :style="item.unitDtstId == selDtst? 'background-color:var(--green2)':''">{{ item.unitDtstId }}</td>
                      <td class="tx-c" :style="item.unitDtstId == selDtst? 'background-color:var(--green2)':''">{{ item.totalCnt }}</td>
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
                    <tr :key="index" class="st3tr" data-val="TD-20220305-0001" @click="onClickDtst(item)">
                      <td class="tx-c" :style="item.combDtstId == selDtst? 'background-color:var(--green2)':''">{{ item.combDtstId }}</td>
                      <td class="tx-c" :style="item.combDtstId == selDtst? 'background-color:var(--green2)':''">{{ item.totalCnt }}</td>
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
                @pagination="(p) => onSearch('T',p.pageNo)"
              />
            </div>
          </div>
        </div>
        <!-- step3. [E] -->
      </div>

      <!-- button -->
      <div class="mt50 tx-c">
        <button type="button" class="btn-bg-gn wid220" @click="onClickStart()">
          검증 시작
        </button>
      </div>
    </div>
    <dtling v-if="isRun === 'RUN'" @onRun="onRun" />
    <dtlfinish v-if="isRun === 'FINISH'" @onRun="onRun" />
    <dterror v-if="isRun === 'ERROR'" @onRun="onRun" />
  </layout>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import dtling from "./rslt_ing.vue";
import dtlfinish from "./rslt_finish.vue";
import dterror from "./rslt_error.vue";
import commonService from "~/service/common-service";
import { IPageInfoModel } from "~/models/common-model";
@Component({ components: { Layout, dtling, dtlfinish, dterror }})
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
  dtstShowType = "U";
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  weightType = "";
  selWeight = '';
  selDtst = '';
  statusTimer = null;


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
  async mounted() {
    await this.getValidationStatusInfo();
    this.statusTimer= setInterval(this.getValidationStatusInfo, 5000);
  }
  async destroyed() {
    clearInterval(this.statusTimer);
  }
  async getValidationStatusInfo() {
    const data = await commonService.request(
      {},
      "/api/validation-status/data"
    );
    console.log('status ===== ',data);         

    if (data.validatingStep == 3) {
      this.$alert(
        '완료된 검증 내역이 있습니다.',
        '알림',
        {
          'type':'info',
          'callback':(action) => {
            clearInterval(this.statusTimer);
            this.onRun('FINISH');
          }
        })
    }

    if (data.validatingStep == 4 && data.wantToStop != "Y") {
      clearInterval(this.statusTimer);
      this.$alert(
        '확인하지않은 에러 내역이 있습니다.',
        '알림',
        {
          'type':'error',
          'callback':(action) => {
            this.onRun('ERROR');
          }
        })
    }

    if (data.validatingYn == 'Y') {
      this.$alert(
        '진행중인 검증이 있습니다.',
        '알림',
        {
          'type':'info',
          'callback':(action) => {
            clearInterval(this.statusTimer);
            this.onRun('RUN');
          }
        })

    }
  }
  async onClickStart() {
    if(this.selWeight =='') return this.$alert('검증할 가중치를 선택해 주세요.', '에러', {'type':'error'});
    if(this.selDtst =='') return this.$alert('검증에 사용할 데이터셋을 선택해 주세요.', '에러', {'type':'error'});
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth()+1)).slice(-2)
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2); 
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2); 

    const validatingId = "" + year+month+day+hours+minutes+seconds
    const startDttm = year + "-" + month + "-" + day+ " " + hours + ":" + minutes + ":" + seconds
    
    const rs = await commonService.request(
      { 
        validatingId: validatingId,
        engineType: this.weightType,
        dtstType: this.dtstShowType,
        dtstId: this.selDtst,
        weightId: this.selWeight,
        startDttm: startDttm
      },
      "/api/validation-status/data/start"
    );
    
    if(rs == 1) {
      clearInterval(this.statusTimer);
      this.onRun('RUN');
    }
    else {
      await this.$alert('검증 시작에 실패했습니다.', '에러', {'type':'error'})
    }
  }
  async onShowType(type, newpage) {
    this.dtstShowType = type;
    this.selDtst = "";
    if (type === "U") {
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

    if (type === "T") {
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
    this.selDtst = "";
    if (event.target.innerText == '삭제') return;
    console.log("======item===", item);
    this.selWeight = item.weightId;
    this.weightType = item.weightType;
    const pageNo = 1;
    const newpage = { ...this.pageInfo, pageNo };
    this.onShowType("U", newpage);
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
    await this.$confirm(item.weightId + '를 삭제하시겠습니까?', '삭제',{'callback': async (action) => {
      if (action == 'cancel') return;
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
    }});  
  }  
  async onClickDtst(item) {
    console.log(item);
    if (Object.keys(item).includes('unitDtstCnt')) {
      this.selDtst = item.combDtstId;
    }
    else {
      this.selDtst = item.unitDtstId;
    }
    console.log(this.selDtst);
    console.log(this.selWeight);
  }
}
</script>
<style scoped></style>
