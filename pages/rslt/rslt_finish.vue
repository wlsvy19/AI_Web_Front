<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top flex flex-btw">
          <h2 class="ti">
            {{ menu }}엔진 검증 완료
            <!-- {{ ((currentMenu || {}).subMenu || {}).MENU_NM }} 완료 -->
          </h2>
        </div>
      </div>

      <div id="conts" class="conts-box1">
        <div class="class-ver-top">
          <div class="verifi-file-info">
            정확도 <strong>98.6%</strong
            ><span class="verifi-file-cnt">(일치 32,445장 / 33,245장)</span>
          </div>
          <div class="chkbox2">
            <input type="checkbox" id="th001" />
            <label for="th001" class="th_chk">확인 필요만 보기</label>
          </div>
        </div>

        <div class="class-ver-body">
          <div class="ver-file_list">
            <template v-for="(item, index) in imgDataList">
              <div :key="index" class="file-item" @click="onClickImg(item)">
                <figure>
                  <img :src="'/v1/api/incn-img/data?workDate=' + item.imgWorkDate +'&workNo=' + item.imgWorkNo" width="191" height="107" alt="" />
                </figure>
                <!-- 결과가 동일시 -->
                <span class="ver-chk ver-checked">동일함</span>
                <!-- <span class="ver-chk ver-exam">확인필요</span>
                                  <span class="ver-chk ver-confm">확인완료</span> -->
              </div>
            </template>                        
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
                  <td>45가1528</td>
                  <td>
                    <button type="button" class="btn btn-sz2 btn-l-b-gn" @click="onShowPop(false)">
                      정답
                    </button>
                  </td>
                </tr>
                <tr>
                  <th>검증 데이터</th>
                  <td>46가1526</td>
                  <td>
                    <button type="button" class="btn btn-sz2 btn-l-b-gn" @click="onShowPop(false)">
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
  statusInfo: any = { 'dtstType': 'U'};
  plate = ['A'];
  charNum = ['B','C','D'];
  imgc = ['E', 'F'];
  menu = '';
  imgDataList = null;
  totalCount = 0;
  offset = 0;
  selWorkDate = null;
  selWorkNo = null;
  selIndex = 0;
  url = '';
  async created() {
    await this.getValidationStatusInfo();
    this.currentMenu = this.$store.state.currentMenu;
    await this.getValidationResult(this.offset);
  }
  onShowPop(show) {
    this.showPop = show;
  }
  async getValidationStatusInfo() {
    const data = await commonService.request(
      {},
      "/api/validation-status/data"
    );
    console.log('status ===== ',data);
    this.statusInfo = data;
    // 제목
    if(this.statusInfo.engineType in this.plate) this.menu = '번호판 탐색';
    else if(this.statusInfo.engineType in this.charNum) this.menu = '차량번호 인식';
    else this.menu = '미오인식 분류';

    // 검증 데이터 전체 수
    this.totalCount = this.statusInfo.totalDataCnt;
  }
  async getValidationResult(offset) {
    const data = await commonService.request(
      {
        validatingId:this.statusInfo.validatingId,
        offset: offset
      },
      "/api/validation-result/data"
    );
    console.log('result===', data);
    this.imgDataList = data;
  }
  async onClickComplete() {
    const rs = await commonService.request(
      {},
      "/api/validation-status/data/complete"
    );
    if(rs == 1) {
      this.$emit('onRun', '');
    }
    else {
      await this.$alert('검증 완료에 실패했습니다.', '서버 에러', {'type':'error'})
    }
  }
  async onClickNext() {    
    if (this.totalCount - this.offset > 0) {
      this.offset += 20;
      this.getValidationResult(this.offset);
    }
  }
  async onClickPrev() {
    this.offset -= 20;
    if (this.offset < 0) this.offset = 0;
    else this.getValidationResult(this.offset);
  }
  async onClickImg(item) {
    this.url = '/v1/api/incn-img/data?workDate=' + item.imgWorkDate +'&workNo=' + item.imgWorkNo;
    this.onShowPop(true)
  }
}
</script>
<style scoped></style>
