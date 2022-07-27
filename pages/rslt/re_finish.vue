<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top flex flex-btw">
          <h2 class="ti wid6p">재인식 엔진 비교 검증</h2>
          <div class="wid4p tx-r pr25">
            <button type="button" class="btn wid138x btn-sz2 btn-bg-gn">
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
                OO본부OO본부OO본부 OO지사 OO영업소 TCS/HIPASS 전체차로
              </dd>
            </dl>
            <dl class="target-btm">
              <dt class="wid4p">검증시작 시간</dt>
              <dd class="wid6p">2022-04-22 10:00</dd>
              <dt class="wid4p">검증완료 시간</dt>
              <dd class="wid6p">2022-04-23 12:59</dd>
              <dt class="wid4p">재인식 버전</dt>
              <dd class="wid6p">vXXXX</dd>
              <dt class="wid4p">신규학습 버전</dt>
              <dd class="wid6p">vXXXX</dd>
            </dl>
          </div>
          <!-- 비교 검증 대상 [E] -->

          <div class="table-v4 mt20">
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
                <tr>
                  <td>1</td>
                  <td>1111</td>
                  <td>11111</td>
                  <td>11111</td>
                  <td>11111</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>222222</td>
                  <td>2222221</td>
                  <td>2222221</td>
                  <td>2222221</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="paging mt40">
            <a href="#">맨처음</a>
            <a href="#">이전</a>
            <a href="#">1</a>
            <a href="#">2</a>
            <strong>3</strong>
            <a href="#">4</a>
            <a href="#">다음</a>
            <a href="#">맨마지막</a>
          </div>
        </div>
        <div class="compare-r">
          <div class="cmp-statits-top">
            <div class="cmpNumstatis">
              <div id="chart-numStatis"></div>
              <span class="data-val-a">525,002</span>
              <span class="data-val-b">14,125</span>
            </div>
            <div class="cmpTypestatis">
              <div id="chart-typeStatis"></div>
              <span class="data-val-a">525,002</span>
              <span class="data-val-b">14,125</span>
            </div>
          </div>

          <div class="cmp-statits-btm">
            <div class="cmp-video">비디오 영상 들어갈 자리</div>
            <div class="tx-c">
              <button
                type="button"
                class="btn btn-sz5 btn-gnc"
                @click="$emit('onRun', '')"
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
import rslt from "./rslt.vue";
import dtling from "./rslt_ing.vue";
import dtlfinish from "./rslt_finish.vue";
import Rslt from "./rslt.vue";
import * as echarts from "echarts";
@Component({ components: { Layout, dtling, dtlfinish, Rslt } })
export default class extends Vue {
  isRun = "";
  onRun(run) {
    this.isRun = run;
  }
  mounted() {
    this.init();
  }
  init() {
    var colorPalette = ["#6CD9CE", "#4C87ED"];
    var dom = document.getElementById("chart-numStatis");
    var myChart = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option;

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
            { value: 1048, name: "일치" },
            { value: 735, name: "불일치" },
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

    var dom2 = document.getElementById("chart-typeStatis");
    var myChart2 = echarts.init(dom2, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option2;

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
            { value: 1048, name: "일치" },
            { value: 735, name: "불일치" },
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
