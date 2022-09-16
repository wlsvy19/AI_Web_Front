<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top flex flex-btw">
          <h2 class="ti wid6p">재인식 엔진 비교 검증</h2>
          <div class="wid4p tx-r pr25">
            <button type="button" class="btn wid138x btn-sz2 btn-bg-gn" @click="onClickComplete()">             
              신규 검증하기
            </button>
          </div>
        </div>
      </div>

      <div class="clmFlex mt15">
        <div class="compare-l">
          <!-- 비교 검증 대상 [S] -->
          <div class="cmp-target">
            <dl class="target-top">
              <dt class="wid4p">대상</dt>
              <dd class="wid6p">
                {{ statusInfo.hdqr_nm }}본부 {{ statusInfo.mtnofNm }}지사 {{ statusInfo.tolofNm }}영업소 {{ crgwType }} {{ statusInfo.crgwNo =='ALL'? '전체차로' : statusInfo.crgwTypNo }}
              </dd>
            </dl>
            <dl class="target-btm">
              <dt class="wid4p">검증시작 시간</dt>
              <dd class="wid6p">{{ statusInfo.startDttm }}</dd>
              <dt class="wid4p">검증완료 시간</dt>
              <dd class="wid6p">{{ statusInfo.finishDttm }}</dd>
              <dt class="wid4p">재인식 버전</dt>
              <dd class="wid6p">v1.0.0</dd>
              <dt class="wid4p">신규학습 버전</dt>
              <dd class="wid6p">v1.0.1</dd>
            </dl>
          </div>
          <!-- 비교 검증 대상 [E] -->

          <div class="chkbox-div">
            <div class="chkbox2">
              <input type="checkbox" id="th001" @change="onClickOnlyNumDiff($event)"/>
              <label for="th001" class="th_chk">번호인식 불일치 보기</label>
            </div>
            <div class="chkbox2">
              <input type="checkbox" id="th002" @change="onClickOnlyTypeDiff($event)"/>
              <label for="th002" class="th_chk">유형분류 불일치 보기</label>
            </div>
          </div>

          <div class="table-v4 mt20 tb-ov1" contenteditable="true" @keydown="onKeyDown($event)">
            <table contenteditable="false">
              <colgroup>
                <col width="*" />
                <col width="22%" />
                <col width="22%" />
                <col width="22%" />
                <col width="22%" />
              </colgroup>
              <thead>
                <tr>
                  <th rowspan="2">번호</th>
                  <th colspan="2">번호 인식 결과</th>
                  <th colspan="2">유형 분류 결과</th>
                </tr>
                <tr>
                  <th>재인식</th>
                  <th>신규학습</th>
                  <th>재인식</th>
                  <th>신규학습</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in resultList">
                  <tr :key="index" class="st3tr" @click="onClickRow(item, index)" :style="selectIdx == index? 'background-color:var(--green2)':''">
                    <td class="tx-c">{{ (pageNo-1)*10 + (index +1) }}</td>
                    <td class="tx-c">{{ item.rpcsNumRecgResult }}</td>
                    <td class="tx-c">{{ item.newNumRecgResult }}</td>
                    <td class="tx-c">{{ nmercgCd[item.rpcsTypeRecgResult] }}</td>
                    <td class="tx-c">{{ nmercgCd[item.newTypeRecgResult] }}</td>
                  </tr>
                </template>                
              </tbody>
            </table>
            <pagination
              :pageInfo="pageInfo"
              :layout="'prev, pager, next'"
              @pagination="(p) => getValidationResult(p.pageNo)"
            />
          </div>          
        </div>
        <div class="compare-r">
          <div class="cmp-statits-top">
            <div class="cmpNumstatis">
              <div id="chart-numStatis"></div>
              <span class="data-val-a">{{ numCorrect }}</span>
              <span class="data-val-b">{{ numIncorrect }}</span>
            </div>
            <div class="cmpTypestatis">
              <div id="chart-typeStatis"></div>
              <span class="data-val-a">{{ typeCorrect }}</span>
              <span class="data-val-b">{{ typeIncorrect }}</span>
            </div>
          </div>

          <div class="cmp-statits-btm" style="height:585px">            
            <div class="cmp-video">
              <!-- <img :src="'/v1/api/rpcs-img/data?workDate=' + selectWorkDate +'&workNo=' + selectWorkNo" width="700px" height="360px" alt="" /> -->
              <img v-if="selectImg != '' && selectImg != undefined" :src="'data:image/jpeg;base64,' +selectImg" width="700px" height="360px" alt="" />
              <div v-else class="no-img">
                <p class="card-text">
                  <img src="~/static/images/card-image.jpg" style="width: 5%;height: 8%;" />
                  이미지를 불러오지 못했습니다.
                </p>
              </div>
            </div>
            
            <div class="tx-c" style="margin-top:3rem">
              <button
                type="button"
                class="btn btn-sz5 btn-gnc"
                @click="onClickProcessViewBtn()"
              >
                재처리영상 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import dtling from "./rslt_ing.vue";
import dtlfinish from "./rslt_finish.vue";
import Rslt from "./rslt.vue";
import * as echarts from "echarts";
import commonService from "~/service/common-service";
import { IPageInfoModel } from "~/models/common-model";

@Component({ components: { Layout, dtling, dtlfinish, Rslt } })
export default class extends Vue {
  isRun = "";
  uiId = 40;
  nmercgCd = {};
  statusInfo = {
    validatingId : '',
    hdqrNm : 'OO',
    mtnofNm : 'OO',
    tolofNm : 'OO',
    crgwNo : 'ALL',
  };
  validatingId = '';
  crgwType = 'HIPASS/TCS'
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  resultList = [];
  selectIdx = -1;
  // selectWorkNo = '';
  // selectWorkDate = '';
  selectImg = null;
  numCorrect = 0;
  numIncorrect = 0;
  typeCorrect = 0;
  typeIncorrect = 0;
  pageNo = 1;
  viewProcessing = false;
  isCorrectNum = 1;
  isCorrectType = 1;
  dataLoading = false;


  onRun(run) {
    this.isRun = run;
  }
  mounted() {
    this.getNmercgCd();
    this.getValidationStatusInfo();
  }
  async getNmercgCd() {
    const data = await commonService.request(
      { grpCd: 'NMRECG_CD' },
      "/api/cmmn-cd-info/code"
    );    
    console.log(data);
    data.forEach(item => {
      this.nmercgCd[item.cmmnCd] = item.cmmnCdNm;
    });
    console.log(this.nmercgCd);
  }
  async getValidationStatusInfo() {
    const data = await commonService.request(
      { uiId:this.uiId, },
      "/api/rpcs-status/data"
    );
    this.statusInfo = data;
    console.log('status ===== ',data);

    if (data.crgwTypeCd == 'H') this.crgwType = 'HIPASS';
    else if (data.crgwTypeCd == 'T') this.crgwType = 'TCS';
    else this.crgwType = 'HIPASS/TCS';
    
    if (this.validatingId == '') {
      this.validatingId = this.statusInfo.validatingId;
      this.getIsCorrectResult();    
      this.getValidationResult(1);
    }    
  }
  async getIsCorrectResult() {
    const data = await commonService.request(
      { 
        uiId:this.uiId,
        validatingId: this.validatingId,
      },
      "/api/rpcs-result/data/count"
    );
    console.log(data);
    this.numCorrect = parseInt(data.numCorrect);
    this.numIncorrect = parseInt(data.numIncorrect);
    this.typeCorrect = parseInt(data.typeCorrect);
    this.typeIncorrect = parseInt(data.typeIncorrect);
    this.initChart();
  }
  async getValidationResult(pageNo: number, reverse=false) {
    if (this.dataLoading == true) return;
    this.dataLoading = true;
    // this.selectIdx = -1;
    const newpage = { ...this.pageInfo, pageNo };
    const data = await commonService.request(
      {
        validatingId : this.validatingId,
        isCorrectNum : this.isCorrectNum,
        isCorrectType : this.isCorrectType,
        ...newpage,
      },
      "/api/rpcs-result/data"
    )
    newpage.totalCount = data.page.totalCount+1;
    this.pageInfo = { ...newpage };
    this.pageNo = pageNo;
    this.resultList = data.list;
    console.log('result====', data);
    if (reverse == true) this.onClickRow(this.resultList[this.resultList.length-1], this.resultList.length-1);
    else this.onClickRow(this.resultList[0], 0);
  }
  async onClickRow(item, index) {
    // this.selectWorkDate = item.imgWorkDate;
    // this.selectWorkNo = item.imgWorkNo;
    // console.log(this.selectWorkNo);
    // console.log(this.selectWorkDate);
    this.selectImg = item.imgData;
    this.selectIdx = index;
    this.dataLoading = false;
  }
  async onClickComplete() {
    const rs = await commonService.request(
      { uiId:this.uiId, },
      "/api/rpcs-status/data/complete"
    );
    if(rs == 1) {    
      this.$emit('onRun', '');
    }
    else {
      await this.$alert('검증 완료에 실패했습니다.', '서버 에러', {'type':'error'})
    }
  }
  onClickProcessViewBtn() {
    this.viewProcessing = !this.viewProcessing;
    if (this.viewProcessing) this.selectImg = this.resultList[this.selectIdx].reprocessingImgData;
    else this.selectImg = this.resultList[this.selectIdx].imgData;
  }
  async onClickOnlyNumDiff(event) {
    if(event.target.checked==true) {
      this.isCorrectNum = 0;
    }
    else {
      this.isCorrectNum = 1;
    }
      this.getValidationResult(1);

  }
  async onClickOnlyTypeDiff(event) {
    if(event.target.checked==true) {
      this.isCorrectType = 0;
    }
    else {
      this.isCorrectType = 1;
    }
    this.getValidationResult(1);
  }
  initChart() {
    let colorPalette = ["#6CD9CE", "#4C87ED"];
    let dom = document.getElementById("chart-numStatis");
    let myChart = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    let option;
    console.log(this.numCorrect);
    option = {
      title: {
        text: "번호인식 통계",
        left: "20",
        top: "23",
        textStyle: {
          fontSize: 14,
        },
      },
      color: ["#B7B7B7"],
      tooltip: {
        show: false,
        trigger: "item",
      },
      width: "35%",
      legend: {
        top: "40%",
        right: "15%",
        orient: "vertical",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["77%", "100%"],
          avoidLabelOverlap: false,
          color: colorPalette,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "14",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: this.numCorrect, name: "일치" },
            { value: this.numIncorrect, name: "불일치" },
          ],
          top: "30%", // 비율
          center: ["100%", "30%"], //가로 세로 위치
        },
      ],
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);
    }

    window.addEventListener("resize", (myChart as any).resize);

    let dom2 = document.getElementById("chart-typeStatis");
    let myChart2 = echarts.init(dom2, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    let option2;

    option2 = {
      title: {
        text: "유형분류 통계",
        left: "20",
        top: "23",
        textStyle: {
          fontSize: 14,
        },
      },
      color: ["#B7B7B7"],
      tooltip: {
        show: false,
        trigger: "item",
      },
      width: "35%",
      legend: {
        top: "40%",
        right: "15%",
        orient: "vertical",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["77%", "100%"],
          avoidLabelOverlap: false,
          color: colorPalette,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "14",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: this.typeCorrect, name: "일치" },
            { value: this.typeIncorrect, name: "불일치" },
          ],
          top: "30%", // 비율
          center: ["100%", "30%"], //가로 세로 위치
        },
      ],
    };

    if (option2 && typeof option2 === "object") {
      myChart2.setOption(option2);
    }

    window.addEventListener("resize", (myChart2 as any).resize);
  }
  onKeyDown(event) {
    event.preventDefault();
    console.log(event.keyCode);
    // space
    if (event.keyCode === 32) {
      this.onClickProcessViewBtn();
    }
    // left
    else if (event.keyCode === 37) {
      if (this.pageNo != 1 && this.dataLoading == false) this.getValidationResult(this.pageNo-1);
    }
    // up
    else if (event.keyCode === 38) {
      if (this.selectIdx != 0) {
        this.selectIdx -= 1
        this.selectImg = this.resultList[this.selectIdx].imgData;
      }
      else {
        if (this.pageNo != 1 && this.dataLoading == false) this.getValidationResult(this.pageNo-1, true);
      }
    }
    // right
    else if (event.keyCode === 39) {
      console.log(Math.floor(this.pageInfo.totalCount / 10) +1);
      if (this.pageNo != Math.floor(this.pageInfo.totalCount / 10) +1 && this.dataLoading == false) this.getValidationResult(this.pageNo+1);
    }
    // down
    else if (event.keyCode === 40) {
      if (this.selectIdx != this.resultList.length -1) {
        this.selectIdx += 1
        this.selectImg = this.resultList[this.selectIdx].imgData;
      }
      else {
        if (this.pageNo != Math.floor(this.pageInfo.totalCount / 10) +1 && this.dataLoading == false) this.getValidationResult(this.pageNo+1);
      }
    }
  }
}
</script>
<style scoped></style>
