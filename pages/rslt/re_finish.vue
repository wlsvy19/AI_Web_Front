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

          <div class="table-v4 mt20 tb-ov1">
            <table>
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
                    <td class="tx-c">{{ item.rpcsTypeRecgResult }}</td>
                    <td class="tx-c">{{ item.newTypeRecgResult }}</td>
                  </tr>
                </template>                
              </tbody>
            </table>
            <pagination
              :pageInfo="pageInfo"
              :layout="'total, prev, pager, next'"
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
                @click="onClickButton()"
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
import { formatBytes } from "~/utils/common";
@Component({ components: { Layout, dtling, dtlfinish, Rslt } })
export default class extends Vue {
  isRun = "";
  uiId = 40;
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

  onRun(run) {
    this.isRun = run;
  }
  mounted() {
    this.getValidationStatusInfo();
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
  async getValidationResult(pageNo: number) {
    this.selectIdx = -1;
    const newpage = { ...this.pageInfo, pageNo };
    const data = await commonService.request(
      {
        validatingId : this.validatingId,
        ...newpage,
      },
      "/api/rpcs-result/data"
    )
    newpage.totalCount = data.page.totalCount+1;
    this.pageInfo = { ...newpage };
    this.pageNo = pageNo;
    this.resultList = data.list;
    this.selectIdx = 0;
    this.selectImg = this.resultList[0].imgData;
    console.log('result====', data);
  }
  async onClickRow(item, index) {
    // this.selectWorkDate = item.imgWorkDate;
    // this.selectWorkNo = item.imgWorkNo;
    // console.log(this.selectWorkNo);
    // console.log(this.selectWorkDate);
    this.selectImg = item.imgData;
    this.selectIdx = index;
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
  onClickButton() {
    this.viewProcessing = !this.viewProcessing;
    if (this.viewProcessing) this.selectImg = this.resultList[this.selectIdx].reprocessingImgData;
    else this.selectImg = this.resultList[this.selectIdx].imgData;
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
}
</script>
<style scoped></style>
