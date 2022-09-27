<template>
  <layout>
    <div id="contents">
      <div id="ing-content">
        <h1 class="ti">
        {{ ((currentMenu || {}).subMenu || {}).MENU_NM }} 에러

        </h1>

        <div class="table-v1 mb20">
          <table>
            <colgroup>
              <col width="15%" />
              <col width="47%" />
              <col width="8%" />
              <col width="30%" />
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

        <div class="progressBox">
          <div id="nf404" style="margin: 0 auto 0 auto;">
            <p>검증 진행중 에러가 발생했습니다.</p>
            <strong style="word-break: break-all;">에러 메세지: {{ errMsg }}</strong>
          </div>
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
  uiId = 0;
  statusInfo: any = { 'dtstType': 'U'};
  step = 2;
  prepareProgress = 0;
  validationProgress = 0;
  elStatus=null;
  statusTimer = null;
  errMsg = '';
  
  created() {
    this.currentMenu = this.$store.state.currentMenu;
    this.uiId = this.currentMenu.subMenu.MENU_TORD;
    this.getValidationStatusInfo();
  }
  async mounted() {
    this.statusTimer= setInterval(this.getValidationStatusInfo, 5000);
  }
  async destroyed() {
    clearInterval(this.statusTimer);
  }

  async getValidationStatusInfo() {
    const data = await commonService.request(
      { uiId: this.uiId },
      "/api/rpcs-status/data"
    );
    console.log('status ===== ',data);
    this.statusInfo = data;

    this.step = this.statusInfo.validatingStep;
    this.errMsg = this.statusInfo.errorMsg;
    if (this.step == 3) {
      clearInterval(this.statusTimer);
      this.$emit('onRun', 'FINISH');
    }
    else if (this.step > 0 && this.step <3) {
      this.$alert(
        '검증이 시작되었습니다.',
        '알림',
        {
          'type':'info',
          'callback': (action) => {
            clearInterval(this.statusTimer);
            this.$emit('onRun', 'RUN');
          }
        }
      )
    }
  }
  async onClickStop() {
    const rs = await commonService.request(
      { uiId: this.uiId },
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
