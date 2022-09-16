<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top">
          <h2 class="ti">재인식 엔진 비교 검증</h2>
        </div>
      </div>

      <div id="conts" class="conts-box1">
        <fieldset>
          <legend>검색영역</legend>
          <div class="engineSchBar">
            <label for="sel002" class="sl-nm">본부</label>
            <select id="sel002" class="select" @change="onChangeHdqr($event)">
              <!-- <option value="ALL">전체</option> -->
              <option :key="index" :value='index' v-for="(item, index) in hdqrList">{{ item.hdqrNm }}</option>
            </select>

            <label for="sel002" class="sl-nm">지사</label>
            <select id="sel002" class="select" @change="onChangeMtn($event)">
              <!-- <option value="ALL">전체</option> -->
              <option :key="index" :value='index' v-for="(item, index) in mtnList">{{ item.mtnofNm }}</option>
            </select>

            <label for="sel002" class="sl-nm">영업소</label>
            <select id="sel002" class="select" @change="onChangeTol($event)">
              <!-- <option value="ALL">전체</option> -->
              <option :key="index" :value='index' v-for="(item, index) in tolList">{{ item.korTolofNm }}</option>
            </select>

            <label for="sel002" class="sl-nm">TCS/HIPASS</label>
            <select id="sel002" class="select" @change="onChangeCrgwTypeCd($event)">
              <option value="A">전체</option>
              <option value="T">TCS</option>
              <option value="H">HIPASS</option>
            </select>

            <label for="sel002" class="sl-nm">차로</label>
            <select id="sel002" class="select" @change="onChangeCrgwNo($event)">
              <!-- <option value="-1">전체</option> -->
              <option :key="index" :value='index' v-for="(item, index) in crgwList"
                :style="selectCrgwTypeCd=='A' || selectCrgwTypeCd == item.crgwTypeCd 
                || item.crgwTypeCd == 'A' ? '' : 'display:none;'"
              >
                {{ item.crgwNo }}
              </option>
            </select>
            <br /><br />
            <label for="sel002" class="sl-nm">일시</label>
            <el-date-picker type="date" v-model="selectDate" :picker-options="dateOption" format="yyyy-MM-dd" :value-format="'yyyy-MM-dd'"/>
            
            <label for="sel001" class="hidden">선택해주세요</label>
            <el-time-select
              v-model="startTime"
              :picker-options="stTimeOption"
              class="mr-4"
              placeholder="시작 시간"
            />
            <em>~</em>
            <el-time-select
              v-model="endTime"
              :picker-options="etTimeOption"
              placeholder="종료 시간"
            />
          </div>
        </fieldset>

        <div class="clmFlex clmBox-col2 mt15">
          <div v-if="isShowSpinner==true" 
              style="position: absolute;
                    left: 46%;
                    top: 50%;
                    z-index: 9999;"
          >
            <div class="spinner" style="width:80px;height:80px"></div>  
          </div>       
          <div class="clmBox">
            <h1 class="ti-s">가중치 선택</h1>
            <div class="clm-body3">
              <div class="tab2 mb15">
                <ul class="tabList">
                  <li :class="selIndex == 0 ? 'active': ''" @click="onClickCategory(0)">
                    <button type="button">번호판탐색</button>
                  </li>
                  <li :class="selIndex == 1 ? 'active': ''" @click="onClickCategory(1)">
                    <button type="button">문자/숫자1</button>
                  </li>
                  <li :class="selIndex == 2 ? 'active': ''" @click="onClickCategory(2)">
                    <button type="button">문자/숫자2</button>
                  </li>
                  <li :class="selIndex == 3 ? 'active': ''" @click="onClickCategory(3)">
                    <button type="button">문자/숫자3</button>
                  </li>
                  <li :class="selIndex == 4 ? 'active': ''" @click="onClickCategory(4)">
                    <button type="button">꺾임/훼손</button>
                  </li>
                  <li :class="selIndex == 5 ? 'active': ''" @click="onClickCategory(5)">
                    <button type="button">스미어/비차량</button>
                  </li>
                </ul>
              </div>

              <div id="" class="table-l1 tb-op1 tb-ov1 tabBox">
                <table>
                  <thead>
                    <tr>
                      <th>가중치 ID</th>
                      <th>학습일자</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="Object.keys(this.weightList).length < 1">
                      <tr>
                        <td class="tx-c">학습된 가중치가 존재하지 않습니다.</td>
                        <td class="tx-c"></td>
                      </tr>
                    </template>
                    <template v-for="(item, index) in weightList">
                      <tr
                        class="st3tr"
                        data-val="TD-20220305-0001"
                        :key="index"
                        :class="selWeigthList[selIndex] === item.weightId ? 'active' : ''"
                        @click="onClickSelectWeight(item)"
                      >
                        <td v-if="item.weightId == null" class="tx-c">가중치 선택안함</td>
                        <td v-else class="tx-c">{{ item.weightId }}</td>
                        <td class="tx-c">{{ item.workDate }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
                <pagination
                  :pageInfo="weightPageInfo"            
                  :layout="'total, sizes, prev, pager, next'"
                  @pagination="(p) => getWeightList(p.pageNo)"
                />
              </div>              
            </div>
          </div>
          <div class="clmBox">
            <h1 class="ti-s">선택된 가중치</h1>
            <div class="clm-body3">
              <div class="table-l1">
                <table>
                  <thead>
                    <tr>
                      <th>유형</th>
                      <th>가중치ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td v-if="plateDetection == null" class="tx-c">재인식 서버 가중치</td>
                      <td v-else class="tx-c">{{ plateDetection }}</td>
                    </tr>
                    <tr>
                      <td class="tx-c">문자/숫자1</td>
                      <td v-if="charNum1 == null" class="tx-c">재인식 서버 가중치</td>
                      <td v-else class="tx-c" v-html="charNum1"></td>
                    </tr>
                    <tr>
                      <td class="tx-c">문자/숫자2</td>
                      <td v-if="charNum2 == null" class="tx-c">재인식 서버 가중치</td>
                      <td v-else class="tx-c">{{ charNum2 }}</td>
                    </tr>
                    <tr>
                      <td class="tx-c">문자/숫자3</td>
                      <td v-if="charNum3 == null" class="tx-c">재인식 서버 가중치</td>
                      <td v-else class="tx-c">{{ charNum3 }}</td>
                    </tr>
                    <tr>
                      <td class="tx-c">꺾임/훼손</td>
                      <td v-if="inCn == null" class="tx-c">재인식 서버 가중치</td>
                      <td v-else class="tx-c">{{ inCn }}</td>
                    </tr>
                    <tr>
                      <td class="tx-c">스미어/비차량</td>
                      <td v-if="smBr == null" class="tx-c">재인식 서버 가중치</td>
                      <td v-else class="tx-c">{{ smBr }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- button -->
        <div class="mt50 tx-c">
          <button type="button" class="btn-bg-gn btn-gray wid220" @click="onClickPrev()">
            이전 검증 확인
          </button>
          <button
            type="button"
            class="btn-bg-gn wid220"
            @click="onClickStartValidation()"
          >
            검증 시작
          </button>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import moment from "moment";
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import commonService from "~/service/common-service";
import rslt from "./rslt.vue";
import { IPageInfoModel } from "~/models/common-model";

@Component({ components: { Layout, rslt } })
export default class extends Vue {
  isRun = "";
  currentMenu: any = {};
  uiId = 40;
  hdqrList = [];
  mtnList = [];
  tolList = [];
  crgwList = [];
  selectHdqr = 'ALL';
  selectHdqrCd = 0;
  selectMtn = 'ALL';
  selectMtnCd = 0;
  selectTol = 'ALL';
  selectTolCd = 0;
  selectCrgwTypeCd = 'A';
  selectCrgwNo = 'ALL';
  selectHdqrDbip = '0.0.0.0';
  selectDate = moment().format('YYYY-MM-DD');
  limitDate = moment().add(-8, 'day');
  startTime = '00:00';
  endTime = '23:30';
  dateOption = {
    disabledDate : (date) => {
      return date > moment() || date < this.limitDate;
    },
  };
  stTimeOption = {
    maxTime : this.endTime,
    start: "00:00",
    end : "23:59",
    format : "hh:mm",
  };
  etTimeOption = {
    minTime : this.startTime,
    start: "00:00",
    end : "23:59",
    format : "hh:mm",
  };
  snowNonVehicle = '';
  selIndex = 0;
  ngtpCds = ['A','B','C','D','E','F']
  selectNgtpCd = 'A'
  weightPageInfo: IPageInfoModel = commonService.getPageInitInfo();
  weightList = [];
  plateDetection = null;
  charNum1 = null;
  charNum2 =null;
  charNum3 =null;
  inCn =null;
  smBr =null;
  selWeigthList = [null, null, null, null, null, null];
  statusTimer = null;
  isShowSpinner = false;

  onRun(run) {
    this.isRun = run;
  }
  created() {
    this.getValidationStatusInfo();
    this.getHdqrList();
    this.getWeightList(1);
  }
  async mounted() {
    this.statusTimer= setInterval(this.getValidationStatusInfo, 5000);
  }
  async destroyed() {
    clearInterval(this.statusTimer);
  }
  async getValidationStatusInfo() {
    const data = await commonService.request(
      { uiId:this.uiId, },
      "/api/rpcs-status/data"
    );
    console.log('status ===== ',data);         

    if (data.validatingStep == 3) {
      this.$emit('onRun','FINISH');
    }
    else if (data.validatingStep == 4 && data.wantToStop != "Y") {
      this.$emit('onRun','ERROR');
    }
    else if (data.validatingYn == 'Y' && data.wantToStop != 'Y') {
      this.$emit('onRun','RUN');
    }
  }
  
  // 본부, 지사, 영업소 등 선택시 동작
  async getHdqrList() {
    this.hdqrList = [];
    const data = await commonService.request(
      {},
      "/api/tolof-info/data/hdqr"
    );
    this.hdqrList = data;
    console.log("hdqrList ===",this.hdqrList);    
    this.selectHdqr = this.hdqrList[0].hdqrNm;   // 전체 기능 쓰는 경우 제거
    this.selectHdqrCd = this.hdqrList[0].hdqrCd;

    this.getMtnList();
  }
  async getMtnList() {
    this.mtnList = [];
    const data = await commonService.request(
      { hdqrCd : this.selectHdqrCd },
      "/api/tolof-info/data/mtn"
    );
    this.mtnList = data;
    console.log("mtnList ===",this.mtnList);    
    this.selectMtn = this.mtnList[0].mtnofNm;
    this.selectMtnCd = this.mtnList[0].mtnofCd;
    
    this.getTolList();
  }
  async getTolList() {
    this.tolList = [];
    const data = await commonService.request(
      { 
        hdqrCd : this.selectHdqrCd,
        mtnofCd : this.selectMtnCd,
      },
      "/api/tolof-info/data/tol"
    );
    this.tolList = data;
    console.log("tolList ===",this.tolList);    
    this.selectTol = this.tolList[0].tolofNm;   // 전체 기능 쓰는 경우 제거
    this.selectTolCd = this.tolList[0].tolofCd;
    
    this.getCrgwList();
  }
  async getCrgwList() {
    this.crgwList = [];
    const data = await commonService.request(
      { 
        hdqrCd : this.selectHdqrCd,
        mtnofCd : this.selectMtnCd,
        tolofCd : this.selectTolCd,
      },
      "/api/tolof-info/data/crgw"
    );
    this.crgwList = data;
    this.selectHdqrDbip = this.crgwList[0].hdqrDbIp;
    this.crgwList.unshift({
      crgwTypeCd: 'A',
      crgwNo: '전체',
      hdqrDbIp: this.selectHdqrDbip,
    })
    console.log("crgwList ===",this.crgwList);        
    this.selectCrgwNo = this.crgwList[0].crgwNo;
  }
  onChangeHdqr(event) {
    const idx = event.target.value;
    this.selectHdqr = this.hdqrList[idx].hdqrNm;
    this.selectHdqrCd = this.hdqrList[idx].hdqrCd;
    this.getMtnList();
  }
  onChangeMtn(event) {
    const idx = event.target.value;
    this.selectMtn = this.mtnList[idx].mtnofNm;
    this.selectMtnCd = this.mtnList[idx].mtnofCd;
    this.getTolList();
  }
  onChangeTol(event) {
    const idx = event.target.value;
    this.selectTol = this.tolList[idx].korTolofNm;
    this.selectTolCd = this.tolList[idx].tolofCd;
    this.getCrgwList();
  }
  onChangeCrgwTypeCd(event) {
    this.selectCrgwTypeCd = event.target.value;
  }
  onChangeCrgwNo(event) {
    const idx = event.target.value;
    this.selectCrgwNo = this.crgwList[idx].crgwNo;
    this.selectHdqrDbip = this.crgwList[idx].hdqrDbIp; 
    console.log(this.selectHdqrDbip);
  }
  
  // 가중치 선택 관련
  async onClickCategory(idx) {
    this.selIndex = idx;
    this.selectNgtpCd = this.ngtpCds[idx];
    this.getWeightList(1);
  }
  async getWeightList(pageNo: number) {
    const newpage = { ...this.weightPageInfo, pageNo};
    const data = await commonService.request(
      { weightType: this.selectNgtpCd, ...newpage },
      "/api/weight-info/list"
    );
    newpage.totalCount = data.page.totalCount;
    this.weightPageInfo = { ...newpage };
    this.weightList = data.list;
    this.weightList.unshift({
      weightId: null,
      workDate: '',
    })
    console.log('===weightList', this.weightList)
  }
  async onClickSelectWeight(item) {
    if(this.selIndex == 0) this.plateDetection = item.weightId;
    else if(this.selIndex == 1) this.charNum1 = item.weightId;
    else if(this.selIndex == 2) this.charNum2 = item.weightId;
    else if(this.selIndex == 3) this.charNum3 = item.weightId;
    else if(this.selIndex == 4) this.inCn = item.weightId;
    else if(this.selIndex == 5) this.smBr = item.weightId;
    else {}
    this.selWeigthList[this.selIndex] = item.weightId;
  }

  // 검증 시작 버튼
  async onClickStartValidation() {

    if(this.selectHdqr == 'ALL' || this.selectMtn == 'ALL' || this.selectTol == 'ALL') {
      console.log(this.selectHdqr, this.selectMtn, this.selectTol);
      this.$alert('본부, 지사, 영업소를 선택해야합니다.', '경고', {'type':'warning'});
      return;
    }

    console.log(this.selWeigthList.toString());
    let isSelect = false
    this.selWeigthList.forEach((value, index) => {
      if (value != null) {
        isSelect = true;
      }
    })
    if (isSelect == false) {
      this.$alert('가중치를 선택해 주세요.', '경고', {'type':'warning'});
      return;
    }
    console.log('date===========',this.selectDate);
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
        uiId:this.uiId, 
        validatingId: validatingId,        
        weightA: this.plateDetection,
        weightB: this.charNum1,
        weightC: this.charNum2,
        weightD: this.charNum3,
        weightE: this.inCn,
        weightF: this.smBr,
        hdqrNm: this.selectHdqr,
        hdqrCd: this.selectHdqrCd,
        mtnofNm: this.selectMtn,
        mtnofCd: this.selectMtnCd,
        tolofNm: this.selectTol,
        tolofCd: this.selectTolCd,
        crgwTypeCd: this.selectCrgwTypeCd,
        crgwNo: this.selectCrgwNo,
        hdqrDbIp: this.selectHdqrDbip,
        searchWorkDate : this.selectDate,
        searchStartTime : this.startTime,
        searchEndTime : this.endTime,
        startDttm: startDttm        
      },
      "/api/rpcs-status/data/start"
    );
    
    const rs2 = await commonService.request(
      {},
      "/api/rpcs-result/data/remove-all"
    );
    console.log('rs2 =======', rs2);

    if(rs == 1) {
      
      clearInterval(this.statusTimer);
      this.$emit('onRun','RUN');
    }
    else {
      await this.$alert('검증 시작에 실패했습니다.', '에러', {'type':'error'})
    }
  }
  async onClickPrev() {
    const rs = await commonService.request(
      { 
        uiId:this.uiId,
        validatingStep: 3,
      },
      "/api/rpcs-status/data/step"
    );
    if(rs != 1) {
      this.$alert('이전 검증내역 조회에 실패하였습니다.', '에러', {'type':'error'})
      this.isShowSpinner = false;
    }
    else {
      this.isShowSpinner = true;
    }
  }
}
</script>
<style scoped></style>
