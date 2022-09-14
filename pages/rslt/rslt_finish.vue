<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top flex flex-btw">
          <h2 class="ti">
            <!-- {{ menu }}엔진 검증 완료 -->
            {{ ((currentMenu || {}).subMenu || {}).MENU_NM }} 완료
          </h2>
        </div>
      </div>

      <div id="conts" class="conts-box1">
        <div class="class-ver-top">
          <div class="verifi-file-info">
            정확도 <strong>{{ accuracy }}%</strong
            ><span class="verifi-file-cnt">(일치 {{ this.correctCount }}장 / {{ this.totalCount }}장)</span>
          </div>
          <div class="chkbox2">
            <input type="checkbox" id="th001" @change="onClickOnlyNotPros($event)"/>
            <label for="th001" class="th_chk">확인 필요만 보기</label>
          </div>
        </div>

        <div class="class-ver-body">
          <div v-if="imgDataList!=null && imgDataList.length!=0" class="ver-file_list">
            <template v-for="(item, index) in imgDataList">
              <div :key="index" class="file-item" @click="onClickImg(item, index)">
                <figure>
                  <img v-if="statusInfo.engineType == 'E'" :src="'/v1/api/incn-img/data?workDate=' + item.imgWorkDate +'&workNo=' + item.imgWorkNo" width="191" height="107" alt="" />
                  <img v-else-if="statusInfo.engineType == 'A'" :src="'/v1/api/plate-img/data?workDate=' + item.imgWorkDate +'&workNo=' + item.imgWorkNo"  width="191" height="107" alt="" />
                  <img v-else :src="'/v1/api/crgw-img/data?workDate=' + item.imgWorkDate +'&workNo=' + item.imgWorkNo" width="191" height="107" alt="" />                
                </figure>
                <!-- 결과가 동일시 -->
                <span v-if="item.isCorrect == 1" class="ver-chk ver-checked">동일함</span>
                <span v-if="item.isCorrect == 0 && item.prosYn == 'Y'" class="ver-chk ver-x">오답</span>
                <span v-if="item.isCorrect == 0 && item.prosYn == 'N'" class="ver-chk ver-exam">확인필요</span>
              </div>
            </template>                        
          </div>
          <div v-else class="ver-file_list">
            <div id="nf404" style="margin: 10% auto 0 auto;">
              <p>이전 검증 결과가 없습니다.</p>
            </div>
          </div>
          <button type="button" class="file-nav file-prev">이전</button>
          <button type="button" class="file-nav file-next">다음</button>

          <div class="tx-c mt45">
            <button
              type="button"
              class="btn-bg-gn wid220"
              @click="onClickComplete()"
            >
              검증 완료
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="popup pop2" v-if="showPop" :style="`display:block;left:30%`">
      <div class="pop-body">
        <figure class="ver-m-img">
          <img :src="this.url" width="666" height="373" alt="" />
        </figure>
        <div class="ver-i-cont">
          <figure class="ver-s-img">
            <img :src="this.url" width="232" height="129" alt="" />
          </figure>
          <div class="table-v3 ver-s-cont">
            <table class="tx-c">
              <colgroup>
                <col width="137" />
                <col width="*" />
                <col width="120" />
              </colgroup>
              <tbody>
                <tr>
                  <th>라벨링 데이터</th>
                  <td>{{ selAnswer }}</td>
                  <td>
                    <button type="button" class="btn btn-sz2 btn-l-b-gn" @click="onClickAnswer(0)">
                      정답 or <br/> 둘다 틀림
                    </button>
                  </td>
                </tr>
                <tr>
                  <th>검증 데이터</th>
                  <td>{{ selItem.result }}</td>
                  <td>
                    <button type="button" class="btn btn-sz2 btn-l-b-gn" @click="onClickAnswer(1)">
                      정답
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
import Layout from "~/components/layout_sub.vue";
import commonService from "~/service/common-service";
@Component({ components: { Layout } })
export default class extends Vue {
  showPop = false;
  currentMenu: any = {};
  statusInfo: any = { 
    'dtstType': 'U',
    'engineType': 'A',
  };
  // plate = ['A'];
  // charNum = ['B','C','D'];
  // imgc = ['E', 'F'];
  // menu = '';
  uiId=0;
  imgDataList = null;
  totalCount = 0;
  offset = 0;
  selItem = null;
  selIndex = 0;
  selAnswer = '';
  url = '';
  correctCount = 0;
  accuracy = 0;  
  prosYn = '';
  isCorrect = null;
  async created() {
    this.currentMenu = this.$store.state.currentMenu;
    this.uiId = this.currentMenu.subMenu.MENU_TORD;
    this.$emit('setStatusTimer', 0);
    await this.getValidationStatusInfo();    
    await this.getCorrectCount();
    await this.getValidationResult();
  }
  onShowPop(show) {
    this.showPop = show;
  }
  async getValidationStatusInfo() {
    const data = await commonService.request(
      { uiId:this.uiId, },
      "/api/validation-status/data"
    );
    console.log('status ===== ',data);
    this.statusInfo = data;
    // 제목
    // if(this.statusInfo.engineType in this.plate) this.menu = '번호판 탐색';
    // else if(this.statusInfo.engineType in this.charNum) this.menu = '차량번호 인식';
    // else this.menu = '미오인식 분류';

    // 검증 데이터 전체 수
    this.totalCount = this.statusInfo.totalDataCnt;
  }
  async getCorrectCount() {
    const data = await commonService.request(
      {
        uiId:this.uiId,
        validatingId: this.statusInfo.validatingId,
        isCorrect: 1,
      },
      "/api/validation-result/data/count"
    );
    this.correctCount = data;
    this.accuracy = parseFloat(((this.correctCount/this.totalCount) * 100).toFixed(1));
  }
  async getValidationResult() {
    console.log(this.isCorrect);
    const data = await commonService.request(
      {
        uiId:this.uiId,
        validatingId:this.statusInfo.validatingId,
        engineType:this.statusInfo.engineType,
        offset: this.offset,
        isCorrect:this.isCorrect,
        prosYn: this.prosYn,
      },
      "/api/validation-result/data"
    );
    console.log('result===', data);
    this.imgDataList = data;    
  }
  async onClickComplete() {
    const rs = await commonService.request(
      { uiId:this.uiId, },
      "/api/validation-status/data/complete"
    );
    if(rs == 1) {    
      this.$emit('setStatusTimer', 5000);
      this.$emit('showSpinner', false);
      this.$emit('onRun', '');
    }
    else {
      await this.$alert('검증 완료에 실패했습니다.', '서버 에러', {'type':'error'})
    }
  }
  async onClickOnlyNotPros(event) {
    if(event.target.checked==true) {
      this.prosYn = 'N';
      this.isCorrect = '0';
    }
    else {
      this.prosYn = '';
      this.isCorrect = '';
    }
    this.getValidationResult();
  }
  async onClickNext() {    
    if (this.totalCount - this.offset > 0) {
      this.offset += 20;
      this.getValidationResult();
    }
    this.getValidationResult()
  }
  async onClickPrev() {
    this.offset -= 20;
    if (this.offset < 0) this.offset = 0;
    else this.getValidationResult();
  }
  async onClickImg(item, index) {    
    this.url = '/v1/api/incn-img/data?workDate=' + item.imgWorkDate +'&workNo=' + item.imgWorkNo;
    this.selItem = item;
    this.selIndex = index;
    if(this.statusInfo.engineType == 'E') {
      let arr = [];
      const json_data = JSON.parse(item.answer);
      for(let i=0; i<json_data.length;i++){
        arr.push(json_data[i].data);
      }
      console.log(arr);
      const answer_dict = this.bentClassify(arr);
      if (0 < answer_dict['snow']  && answer_dict['snow'] < 4) {
        this.selAnswer = 'SR';
      }
      else {
        if (answer_dict['h_bent_mid'] >= 1) {
          this.selAnswer = 'CN';
          if ((answer_dict['v_bent_edge'] + answer_dict['h_bent_edge']) >= 2) {
            this.selAnswer = 'IN';
          }
        }
        else {
          this.selAnswer = 'EN';
        }
      }
    }
    else {
      this.selAnswer = item.answer;
    }
    this.onShowPop(true)
  }
  bentClassify(label_list: any[]) {
    let v_bent_edge_cnt = 0    
    let h_bent_edge_cnt = 0
    let h_rolled_edge_cnt = 0
    let h_bent_middle_cnt = 0
    let snow_cnt = 0

    label_list.forEach((val, index) => {
      if (val == 'v_bent') v_bent_edge_cnt += 1;
      if (val == 'h_bent') h_bent_edge_cnt += 1;
      if (val == 'h_rolled') h_rolled_edge_cnt += 1;
      if (val == 'm_bent') h_bent_middle_cnt += 1;
      if (val == 'snow') snow_cnt += 1;
    })    
    const imgc_dict = {
      "v_bent_edge" : v_bent_edge_cnt,
      "h_bent_edge" : h_bent_edge_cnt + h_rolled_edge_cnt,
      "h_bent_mid" : h_bent_middle_cnt,
      "snow" : snow_cnt,
    }

    return imgc_dict
  }
  async onClickAnswer(correct) {
    const rs = await commonService.request(
      {
        uiId:this.uiId,
        isCorrect:correct,
        validatingId:this.statusInfo.validatingId,
        imgWorkDate:this.selItem.imgWorkDate,
        imgWorkNo:this.selItem.imgWorkNo,
      },
      "/api/validation-result/data/update-correct"
    );
    console.log(rs);
    if (rs == 1) {
      this.imgDataList[this.selIndex].isCorrect = correct;
      this.imgDataList[this.selIndex].prosYn = 'Y';
      if (correct == 1) {
        this.correctCount += 1;
        this.accuracy = parseFloat(((this.correctCount/this.totalCount) * 100).toFixed(1))
      }
    }
    this.onShowPop(false)
  }
}
</script>
<style scoped></style>
