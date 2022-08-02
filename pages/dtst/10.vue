<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top">
          <h2 class="ti">학습데이터 셋 현황</h2>
        </div>
      </div>

      <div class="clmFlex mt15">
        <div class="clmBox-416 bg-wht">
          <h1 class="ti-s">라벨링 확정 데이터 현황</h1>
          <div class="total-label-data">총 345,234,000</div>

          <div class="label-decide">
            <!-- 각 라벨링 확정 데이터 [S]-->
            <div class="label-de lb-red">
              <!-- 진행률 progress bar -->
              <div class="flex flex-btw">
                <!-- progress value에 데이터 값 넣으면 됩니다. -->
                <div class="car-labelNm">번호판 탐색</div>
                <div class="tx-r">
                  <strong class="prgs-ing">3,000</strong>
                  <span class="prgs-val">/ 10,000</span>
                </div>
              </div>
              <progress
                class="prog-bar"
                value="30"
                min="10"
                max="100"
              ></progress>
            </div>
            <!-- 각 라벨링 확정 데이터 [E]-->

            <!-- 각 라벨링 확정 데이터 [S]-->
            <div class="label-de lb-blue">
              <!-- 진행률 progress bar -->
              <div class="flex flex-btw">
                <!-- progress value에 데이터 값 넣으면 됩니다. -->
                <div class="car-labelNm">문자/숫자2</div>
                <div class="tx-r">
                  <strong class="prgs-ing">4,000</strong>
                  <span class="prgs-val">/ 10,000</span>
                </div>
              </div>
              <progress
                class="prog-bar"
                value="40"
                min="10"
                max="100"
              ></progress>
            </div>
            <!-- 각 라벨링 확정 데이터 [E]-->

            <div class="label-de lb-yellow">
              <!-- 진행률 progress bar -->
              <div class="flex flex-btw">
                <!-- progress value에 데이터 값 넣으면 됩니다. -->
                <div class="car-labelNm">문자/숫자1</div>
                <div class="tx-r">
                  <strong class="prgs-ing">5,000</strong>
                  <span class="prgs-val">/ 10,000</span>
                </div>
              </div>
              <progress
                class="prog-bar"
                value="50"
                min="10"
                max="100"
              ></progress>
            </div>

            <div class="label-de lb-mint">
              <!-- 진행률 progress bar -->
              <div class="flex flex-btw">
                <!-- progress value에 데이터 값 넣으면 됩니다. -->
                <div class="car-labelNm">문자/숫자3</div>
                <div class="tx-r">
                  <strong class="prgs-ing">1,000</strong>
                  <span class="prgs-val">/ 10,000</span>
                </div>
              </div>
              <progress
                class="prog-bar"
                value="10"
                min="10"
                max="100"
              ></progress>
            </div>

            <div class="label-de lb-green">
              <!-- 진행률 progress bar -->
              <div class="flex flex-btw">
                <!-- progress value에 데이터 값 넣으면 됩니다. -->
                <div class="car-labelNm">꺾임/훼손</div>
                <div class="tx-r">
                  <strong class="prgs-ing">2,000</strong>
                  <span class="prgs-val">/ 10,000</span>
                </div>
              </div>
              <progress
                class="prog-bar"
                value="20"
                min="10"
                max="100"
              ></progress>
            </div>

            <div class="label-de lb-dark">
              <!-- 진행률 progress bar -->
              <div class="flex flex-btw">
                <!-- progress value에 데이터 값 넣으면 됩니다. -->
                <div class="car-labelNm">스미어</div>
                <div class="tx-r">
                  <strong class="prgs-ing">3,000</strong>
                  <span class="prgs-val">/ 10,000</span>
                </div>
              </div>
              <progress
                class="prog-bar"
                value="30"
                min="10"
                max="100"
              ></progress>
            </div>
          </div>
        </div>

        <div class="clmBox-848">
          <div class="label-data-top flex flex-btw">
            <div id="chart-lbData1"></div>
            <div id="chart-lbData2"></div>
            <div id="chart-lbData3"></div>
          </div>

          <div class="label-data-btm">
            <div id="chart-lbData4"></div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import * as echarts from "echarts";
@Component({ components: { Layout } })
export default class extends Vue {
  mounted() {
    this.init();
  }
  init() {
    var dom = document.getElementById("chart-lbData1");
    var colorPalette = [
      "#4a89dc",
      "#8cc152",
      "#f6bb42",
      "#ea2237",
      "#37bc9b",
      "#434a54",
    ];
    var myChart: any = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option;

    option = {
      title: {
        text: "라벨링데이터 현황",
        subtext: "총 234,000",
        left: "10",
        top: "20",
        textStyle: {
          fontSize: 14,
        },
        subtextStyle: {
          fontSize: 16,
          color: "#333333",
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: false,
      },
      width: "30%",
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["77%", "100%"],
          avoidLabelOverlap: false,
          // label: {
          //   show: true,
          //   position: "center",
          //   // alignTo: "labelLine"
          // },
          color: colorPalette,
          emphasis: {
            label: {
              show: true,
            },
          },
          label: {
            alignTo: "labelLine",
          },
          labelLine: {
            show: true,
            length: 1,
          },
          center: ["160%", "60%"], //가로 세로 위치
          data: [
            { value: 1048, name: "문자/숫자2" },
            { value: 735, name: "꺽임/훼손" },
            { value: 580, name: "문자/숫자1" },
            { value: 484, name: "번호판 탐색" },
            { value: 300, name: "문자/숫자3" },
            { value: 200, name: "스미어" },
          ],
        },
      ],
    };

    var dom2 = document.getElementById("chart-lbData2");
    var colorPalette2 = [
      "#4a89dc",
      "#8cc152",
      "#f6bb42",
      "#ea2237",
      "#37bc9b",
      "#434a54",
    ];
    var myChart2: any = echarts.init(dom2, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option2;

    option2 = {
      title: {
        text: "단위데이터 셋 현황",
        subtext: "총 12,300",
        left: "10",
        top: "20",
        textStyle: {
          fontSize: 14,
        },
        subtextStyle: {
          fontSize: 16,
          color: "#333333",
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: false,
      },
      width: "30%",
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["77%", "100%"],
          avoidLabelOverlap: false,
          // label: {
          //   show: true,
          //   position: "center",
          //   // alignTo: "labelLine"
          // },
          color: colorPalette,
          emphasis: {
            label: {
              show: true,
            },
          },
          label: {
            alignTo: "labelLine",
          },
          labelLine: {
            show: true,
            length: 1,
          },
          center: ["160%", "60%"], //가로 세로 위치
          data: [
            { value: 1048, name: "문자/숫자2" },
            { value: 735, name: "꺽임/훼손" },
            { value: 580, name: "문자/숫자1" },
            { value: 484, name: "번호판 탐색" },
            { value: 300, name: "문자/숫자3" },
            { value: 200, name: "스미어" },
          ],
        },
      ],
    };

    var dom3 = document.getElementById("chart-lbData3");
    var colorPalette3 = [
      "#4a89dc",
      "#8cc152",
      "#f6bb42",
      "#ea2237",
      "#37bc9b",
      "#434a54",
    ];
    var myChart3: any = echarts.init(dom3, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option3;

    option3 = {
      title: {
        text: "통합데이터 셋 현황",
        subtext: "총 104",
        left: "10",
        top: "20",
        textStyle: {
          fontSize: 14,
        },
        subtextStyle: {
          fontSize: 16,
          color: "#333333",
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: false,
      },
      width: "30%",
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["77%", "100%"],
          avoidLabelOverlap: false,
          // label: {
          //   show: true,
          // },
          color: colorPalette,
          emphasis: {
            label: {
              show: true,
            },
          },
          label: {
            alignTo: "labelLine",
          },
          labelLine: {
            show: true,
            length: 1,
          },
          center: ["160%", "60%"], //가로 세로 위치
          data: [
            { value: 1048, name: "문자/숫자2" },
            { value: 735, name: "꺽임/훼손" },
            { value: 580, name: "문자/숫자1" },
            { value: 484, name: "번호판 탐색" },
            { value: 300, name: "문자/숫자3" },
            { value: 200, name: "스미어" },
          ],
        },
      ],
    };

    // chart bar [S] ---------------------------------------
    var dom4 = document.getElementById("chart-lbData4");
    var myChart4: any = echarts.init(dom4, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option4;

    option4 = {
      title: {
        text: "라벨링 데이터 세부 현황",
        left: "20",
        top: "0",
        textStyle: {
          fontSize: 14,
        },
      },
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          ["product", "단위데이터 셋 포함", "단위데이터 셋 미포함"],
          ["번호판 탐색", 43.3, 85.8],
          ["문자/숫자1", 83.1, 73.4, 55.1],
          ["문자/숫자2", 86.4, 65.2, 82.5],
          ["문자/숫자3", 72.4, 53.9, 39.1],
          ["꺽임/훼손", 72.4, 53.9, 39.1],
          ["스미어", 72.4, 53.9, 39.1],
        ],
      },
      xAxis: { type: "category" },
      yAxis: {},
      series: [{ type: "bar" }, { type: "bar" }],
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);
    }

    if (option2 && typeof option2 === "object") {
      myChart2.setOption(option2);
    }

    if (option3 && typeof option3 === "object") {
      myChart3.setOption(option3);
    }

    if (option4 && typeof option4 === "object") {
      myChart4.setOption(option4);
    }

    window.addEventListener("resize", myChart.resize);
    window.addEventListener("resize", myChart2.resize);
    window.addEventListener("resize", myChart3.resize);
    window.addEventListener("resize", myChart4.resize);
  }
}
</script>
<style scoped></style>
