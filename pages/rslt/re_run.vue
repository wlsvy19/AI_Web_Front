<template>
  <layout>
    <div id="contents">
      <div id="ing-content" style="width:900px">
        <h1 class="ti">재인식 엔진 비교 검증 진행중</h1>

        <div class="table-v1 mb20">
          <table>
            <colgroup>
              <col width="15%" />
              <col width="40%" />
              <col width="10%" />
              <col width="35%" />
            </colgroup>
            <tbody>
              <tr>
                <th>대상 영업소</th>
                <td>{{ statusInfo.hdqrNm }}본부 {{ statusInfo.mtnofNm }}지사 {{ statusInfo.tolofNm }}영업소</td>
                <th>날짜</th>
                <td>{{ statusInfo.searchWorkDate }}</td>
              </tr>
              <tr>
                <th>TCS/HIPASS</th>
                <td v-if="statusInfo.crgwTypeCd=='H'">HIPASS</td>
                <td v-else-if="statusInfo.crgwTypeCd=='T'">TCS</td>
                <td v-else>HIPASS / TCS</td>
                <th>시간</th>
                <td>{{ statusInfo.searchStartTime }}~{{ statusInfo.searchEndTime }}</td>
              </tr>
              <tr>
                <th>차로 번호</th>
                <td colspan="3">{{ statusInfo.crgwNo =='ALL'? '전체' : statusInfo.crgwTypNo }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-v2">
          <table>
            <tbody>
              <tr>
                <th>번호판 탐색</th>
                <th>문자/숫자1</th>
                <th>문자/숫자2</th>
              </tr>
              <tr>
                <td class="tx-c">{{ statusInfo.weightA == null? '재인식 서버 가중치' : statusInfo.weightA }}</td>
                <td class="tx-c">{{ statusInfo.weightB == null? '재인식 서버 가중치' : statusInfo.weightB  }}</td>
                <td class="tx-c">{{ statusInfo.weightC == null? '재인식 서버 가중치' : statusInfo.weightC  }}</td>
              </tr>
              <tr>
                <th>문자/숫자3</th>
                <th>꺾임/훼손</th>
                <th>스미어/비차량</th>
              </tr>
              <tr>
                <td class="tx-c">{{ statusInfo.weightD == null? '재인식 서버 가중치' : statusInfo.weightD  }}</td>
                <td class="tx-c">{{ statusInfo.weightE == null? '재인식 서버 가중치' : statusInfo.weightE  }}</td>
                <td class="tx-c">{{ statusInfo.weightF == null? '재인식 서버 가중치' : statusInfo.weightF  }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="statusInfo.validatingStep <=1" style="margin-top:2rem">
            <h1 v-if="elStatus=='exception'" style="margin-bottom:2rem;margin-top:2rem;text-align:center;">데이터셋 준비 에러</h1>            
            <h1 v-else-if="prepareProgress<100" style="margin-bottom:2rem;margin-top:2rem;text-align:center;">데이터셋 준비중</h1>
            <h1 v-else style="margin-bottom:3rem;text-align:center;">데이터셋 준비완료</h1>
          </div>
        </div>

        <!-- 진행률 progress bar -->
        <div v-if="statusInfo.validatingStep <=1" class='progressBox'>
          <div class='datsetProgress' style="text-align:center;">
            <el-progress type="circle" :percentage="this.prepareProgress" :status="elStatus" :width="200" :stroke-width="20" />
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
            학습중지
          </button>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import commonService from "~/service/common-service";
import rslt from "./rslt.vue";
@Component({ components: { Layout, rslt } })
export default class extends Vue {
  isRun = "";
  statusTimer = null;
  uiId = 40;
  statusInfo = {
    hdqrNm : 'OO',
    mtnofNm : 'OO',
    tolofNm : 'OO',
    crgwNo : 'ALL',
  };
  validationProgress = 0;
  prepareProgress = 0;
  elStatus = null;
  errMsg = '';
  onRun(run) {
    this.isRun = run;
  }
  async mounted() {
    this.statusTimer = setInterval(this.getValidationStatusInfo, 1000);
  }
  async destroyed() {
    clearInterval(this.statusTimer);
  }
  async getValidationStatusInfo() {
    const data = await commonService.request(
      { uiId:this.uiId, },
      "/api/rpcs-status/data"
    );
    this.statusInfo = data;
    console.log('status ===== ',data);         

    if (data.validatingStep == 1) {
      this.prepareProgress = data.progress;

      if(this.prepareProgress == 100) this.elStatus='success';
      else {
       if (data.errorMsg != '') {
          this.elStatus='exception';
          this.errMsg = data.errorMsg
        }
        else {
          this.elStatus = null;
        } 
      }      
    }
    else if (data.validatingStep == 0) {
      clearInterval(this.statusTimer);
      this.$alert(
        '검증이 중지되었습니다.',
        '알림',
        {
          'type':'info',
          'callback': () => {
            this.$emit('onRun', '');
          }
        }
      )
    }
    else {
      if (data.totalDataCnt != 0) {
        this.validationProgress = ((parseInt(data.completeCnt)/parseInt(data.totalDataCnt)) * 100);
        this.validationProgress = parseFloat(this.validationProgress.toFixed(1));
      }
      else this.validationProgress = 0;

      if (data.wantToStop == 'Y') {
        clearInterval(this.statusTimer);
        this.$emit('onRun','');
      }

      if (data.validatingStep == 3) {
        clearInterval(this.statusTimer);
        this.$emit('onRun','FINISH');
      }
      
      if (data.validatingStep == 4 && data.wantToStop != "Y") {
        clearInterval(this.statusTimer);
        this.$emit('onRun','ERROR');
      }
    }    
  }
  async onClickStop(){
    const rs = await commonService.request(
      { uiId:this.uiId, },
      "/api/rpcs-status/data/stop"
    )
    if(rs == 1) {
      clearInterval(this.statusTimer);
      this.$emit('onRun', '');
    }
  }
}
</script>
<style scoped></style>
