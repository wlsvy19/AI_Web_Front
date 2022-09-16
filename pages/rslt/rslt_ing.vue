<template>
  <layout>
    <div id="contents">
      <div id="ing-content">
        <h1 class="ti">
          <!-- {{ menu }}엔진 검증 진행중 -->
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
                <!-- <td>{{ statusInfo.dtstType == "U"? '단위 데이터셋' : '통합 데이터셋'}}</td> -->
                <td v-if="statusInfo.dtstType =='U'">단위 데이터셋</td>
                <td v-else>통합 데이터셋</td>
              </tr>
              <tr>
                <th>ID</th>
                <td>{{ statusInfo.dtstId }}</td>
              </tr>
              <tr>
                <th>영상 개수</th>
                <td>{{ statusInfo.totalDataCnt }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="this.step <=1">
            <h1 v-if="elStatus=='exception'" style="margin-bottom:2rem;margin-top:2rem;text-align:center;">데이터셋 준비 에러</h1>            
            <h1 v-else-if="this.prepareProgress<100" style="margin-bottom:2rem;margin-top:2rem;text-align:center;">데이터셋 준비중</h1>
            <h1 v-else style="margin-bottom:3rem;text-align:center;">데이터셋 준비완료</h1>
          </div>
        </div>

        <!-- 진행률 progress bar -->
        <div v-if="this.step <=1" class='progressBox'>
          <div class='datsetProgress' style="text-align:center;">
            <el-progress type="circle" :percentage="this.prepareProgress" :status="elStatus" :width="350" :stroke-width="30" />
          </div>
        </div>

        <div v-else class="progressBox">
          <strong class="prgs-ing">{{ statusInfo.completeCnt }}장</strong>
          <span class="prgs-val">/ {{ statusInfo.totalDataCnt }}장 진행중</span>
          <!-- progress value에 데이터 값 넣으면 됩니다. -->
          <progress
            class="prog-bar"
            id="ver-prgs"
            :value="validationProgress"
            min="0"
            max="100"
          ></progress>
          <div class="prgs-ing-per"><span class="per">{{ validationProgress }}%</span> 검증중</div>
        </div>

        <div class="tx-c mt50">
          <button
            type="button"
            class="btn btn-sz4 btn-gr1"
            @click="onClickStop()"
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
import Layout from "~/components/layout_sub.vue";
import commonService from "~/service/common-service";
@Component({ components: { Layout } })
export default class extends Vue {
  currentMenu: any = {};
  // plate = ['A'];
  // charNum = ['B','C','D'];
  // imgc = ['E', 'F'];
  // menu = '';
  statusInfo: any = { 'dtstType': 'U'};
  step = 2;
  prepareProgress = 0;
  validationProgress = 0;
  elStatus=null;
  statusTimer = null;
  errMsg = '';
  uiId=0;
  created() {
    this.currentMenu = this.$store.state.currentMenu;
    this.uiId = this.currentMenu.subMenu.MENU_TORD;
    this.$emit('setStatusTimer', 0);
    this.getValidationStatusInfo();
  }
  async mounted() {
    this.statusTimer= setInterval(this.getValidationStatusInfo, 1000);
  }
  async destroyed() {
    clearInterval(this.statusTimer);
  }
  async getValidationStatusInfo() {
    const data = await commonService.request(
      { uiId:this.uiId, },
      "/api/validation-status/data"
    );
    console.log('status ===== ',data);
    this.statusInfo = data;

    this.step = this.statusInfo.validatingStep;
    // 에러 발생
    if (this.step == 4 && data.wantToStop != 'Y') {
      clearInterval(this.statusTimer);
      this.$alert(
        '에러가 발생했습니다.',
        '알림',
        {
          'type':'error',
          'callback':(action) => {
            this.$emit('onRun','ERROR');
          }
        })
    }
    // 검증 완료
    else if (this.step == 3) {
      clearInterval(this.statusTimer);
      this.$emit('onRun', 'FINISH');
    }
    // 데이터셋 준비 프로그래스
    else if (this.step == 1) {
      this.prepareProgress = this.statusInfo.progress;

      if(this.prepareProgress == 100) this.elStatus='success';
      else {
        if (this.statusInfo.errorMsg != '') {
          this.elStatus='exception';
          this.errMsg = this.statusInfo.errorMsg
        }
        else {
          this.elStatus = null;
        }
      }
    }
    else if (this.step == 0) {
      clearInterval(this.statusTimer);
      this.$alert(
        '검증이 중지되었습니다.',
        '알림',
        {
          'type':'info',
          'callback': () => {
            this.$emit('setStatusTimer', 5000);
            this.$emit('onRun', '');
          }
        }
      )
    }
    // 검증 진행 프로그래스
    else {
      this.validationProgress = ((parseInt(this.statusInfo.completeCnt)/parseInt(this.statusInfo.totalDataCnt)) * 100);
      this.validationProgress = parseFloat(this.validationProgress.toFixed(1));
    }
    
    // 현재 진행중인 검증 메뉴
    // if(this.statusInfo.engineType in this.plate) this.menu = '번호판 탐색';
    // else if(this.statusInfo.engineType in this.charNum) this.menu = '차량번호 인식';
    // else this.menu = '미오인식 분류';
  }
  async onClickStop() {
    const rs = await commonService.request(
      { uiId:this.uiId, },
      "/api/validation-status/data/stop"
    )
    if(rs == 1) {
      clearInterval(this.statusTimer);
      this.$emit('setStatusTimer', 5000);
      this.$emit('onRun', '');
    }
  }
  
}
</script>
<style scoped></style>
