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
          <div class="total-label-data">
            총 {{ comma(dataset.labelConfirmSum) }} 개
          </div>

          <div class="label-decide">
            <template v-for="(item, index) in dataset.labelConfirmList">
              <!-- 각 라벨링 확정 데이터 [S]-->
              <div
                :key="index"
                class="label-de lb-red"
                v-if="item.name === '번호판'"
              >
                <!-- 진행률 progress bar -->
                <div class="flex flex-btw">
                  <!-- progress value에 데이터 값 넣으면 됩니다. -->
                  <div class="car-labelNm">번호판</div>
                  <div class="tx-r">
                    <strong class="prgs-ing">{{
                      comma(item.confirmDataCnt)
                    }}</strong>
                    <span class="prgs-val">/ {{ comma(item.stdDatasetCnt) }}</span>
                  </div>
                </div>
                <progress
                  class="prog-bar"
                  min="0"
                  :value="item.confirmDataCnt"
                  :max="item.stdDatasetCnt"
                ></progress>
              </div>
              <!-- 각 라벨링 확정 데이터 [E]-->

              <!-- 각 라벨링 확정 데이터 [S]-->
              <div
                class="label-de lb-blue"
                :key="index"
                v-if="item.name === '문자/숫자1'"
              >
                <!-- 진행률 progress bar -->
                <div class="flex flex-btw">
                  <!-- progress value에 데이터 값 넣으면 됩니다. -->
                  <div class="car-labelNm">문자/숫자1</div>
                  <div class="tx-r">
                    <strong class="prgs-ing">{{
                      comma(item.confirmDataCnt)
                    }}</strong>
                    <span class="prgs-val">/ {{ comma(item.stdDatasetCnt) }}</span>
                  </div>
                </div>
                <progress
                  class="prog-bar"
                  min="0"
                  :value="item.confirmDataCnt"
                  :max="item.stdDatasetCnt"
                ></progress>
              </div>
              <!-- 각 라벨링 확정 데이터 [E]-->

              <div
                class="label-de lb-yellow"
                :key="index"
                v-if="item.name === '문자/숫자2'"
              >
                <!-- 진행률 progress bar -->
                <div class="flex flex-btw">
                  <!-- progress value에 데이터 값 넣으면 됩니다. -->
                  <div class="car-labelNm">문자/숫자2</div>
                  <div class="tx-r">
                    <strong class="prgs-ing">{{
                      comma(item.confirmDataCnt)
                    }}</strong>
                    <span class="prgs-val">/ {{ comma(item.stdDatasetCnt) }}</span>
                  </div>
                </div>
                <progress
                  class="prog-bar"
                  min="0"
                  :value="item.confirmDataCnt"
                  :max="item.stdDatasetCnt"
                ></progress>
              </div>

              <div
                class="label-de lb-mint"
                :key="index"
                v-if="item.name === '문자/숫자3'"
              >
                <!-- 진행률 progress bar -->
                <div class="flex flex-btw">
                  <!-- progress value에 데이터 값 넣으면 됩니다. -->
                  <div class="car-labelNm">문자/숫자3</div>
                  <div class="tx-r">
                    <strong class="prgs-ing">{{
                      comma(item.confirmDataCnt)
                    }}</strong>
                    <span class="prgs-val">/ {{ comma(item.stdDatasetCnt) }}</span>
                  </div>
                </div>
                <progress
                  class="prog-bar"
                  min="0"
                  :value="item.confirmDataCnt"
                  :max="item.stdDatasetCnt"
                ></progress>
              </div>

              <div
                class="label-de lb-green"
                :key="index"
                v-if="item.name === '꺾임/훼손'"
              >
                <!-- 진행률 progress bar -->
                <div class="flex flex-btw">
                  <!-- progress value에 데이터 값 넣으면 됩니다. -->
                  <div class="car-labelNm">꺾임/훼손</div>
                  <div class="tx-r">
                    <strong class="prgs-ing">{{
                      comma(item.confirmDataCnt)
                    }}</strong>
                    <span class="prgs-val">/ {{ comma(item.stdDatasetCnt) }}</span>
                  </div>
                </div>
                <progress
                  class="prog-bar"
                  min="0"
                  :value="item.confirmDataCnt"
                  :max="item.stdDatasetCnt"
                ></progress>
              </div>

              <div
                class="label-de lb-dark"
                :key="index"
                v-if="item.name === '빛반사/비차량'"
              >
                <!-- 진행률 progress bar -->
                <div class="flex flex-btw">
                  <!-- progress value에 데이터 값 넣으면 됩니다. -->
                  <div class="car-labelNm">빛반사/비차량</div>
                  <div class="tx-r">
                    <strong class="prgs-ing">{{
                      comma(item.confirmDataCnt)
                    }}</strong>
                    <span class="prgs-val">/ {{ comma(item.stdDatasetCnt) }}</span>
                  </div>
                </div>
                <progress
                  class="prog-bar"
                  min="0"
                  :value="item.confirmDataCnt"
                  :max="item.stdDatasetCnt"
                ></progress>
              </div>
            </template>
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
import commonService from "~/service/common-service";
import { comma } from "~/utils/common";
@Component({ components: { Layout } })
export default class extends Vue {
  dataset: any = {};
  created() {}
  async dataInfo() {
    const data = await commonService.request({}, "/api/dtst/study/info");
    console.log("data===", data);
    this.dataset = data;
  }
  comma(num) {
    return comma(num);
  }
  async mounted() {
    //this.$nextTick(() => this.init());
    await this.dataInfo();
    this.init();
  }
  init() {
    const dataset = this.dataset;
    console.log("=======>11111l", dataset);
    var dom = document.getElementById("chart-lbData1");
    var colorPalette = [
      "#ea2237",
      "#4a89dc",
      "#f6bb42",
      "#37bc9b",
      "#8cc152",
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
        //subtext: "총 " + comma(dataset.labelAllSum),
        subtext: "총 " + comma(dataset.labelConfirmSum) + " 개",
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
          data: dataset.labelConfirmList.map((v) => ({
            value: v.confirmDataCnt,
            name: v.name,
          })),
        },
      ],
    };

    var dom2 = document.getElementById("chart-lbData2");
    var colorPalette2 = [
      "#ea2237",
      "#4a89dc",
      "#f6bb42",
      "#37bc9b",
      "#8cc152",
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
        subtext: "총 " + comma(dataset.datasetUnitSum) + " 개",
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
          data: dataset.datasetList.map((v) => ({
            value: v.unitDatasetCnt,
            name: v.name,
          })),
        },
      ],
    };

    var dom3 = document.getElementById("chart-lbData3");
    var colorPalette3 = [
      "#ea2237",
      "#4a89dc",
      "#f6bb42",
      "#37bc9b",
      "#8cc152",
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
        subtext: "총 " + comma(dataset.datasetAllSum) + " 개",
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
          data: dataset.datasetList.map((v) => ({
            value: v.combDatasetCnt,
            name: v.name,
          })),
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

    const barInfo = (name) =>
      this.dataset.datasetList.filter((v) => v.name === name);

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
          ["product", "단위데이터 셋", "통합데이터 셋"],
          ...this.dataset.datasetList.map((v) => {
            return [v.name, v.unitDatasetCnt, v.combDatasetCnt];
          }),
        ],
      },
      xAxis: { type: "category", axisLabel: {interval: 0,} },
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
