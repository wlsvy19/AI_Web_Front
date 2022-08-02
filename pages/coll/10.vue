<template>
  <layout>
    <div id="contents">
      <div class="card-box">
        <!-- Chart in -->
        <div class="chart-box">
          <div id="chart-container" class="collect-chart"></div>
          <fieldset class="chart-ctl-sel">
            <legend>검색영역</legend>
            <label for="sel001" class="hidden">선택해주세요</label>
            <!-- 준공검사 주석 -->
            <!-- <select id="sel001" class="select">
              <option value="">기간</option>
            </select> -->

            <label for="sel002" class="hidden">선택해주세요</label>
            <select
              id="sel002"
              class="select"
              v-model="selDate"
              @change="changeDate()"
            >
              <option value="3">최근 3일</option>
              <option value="7">최근 7일</option>
              <option value="15">최근 15일</option>
              <option value="30">최근 30일</option>
            </select>
          </fieldset>
        </div>
      </div>
      <div class="card-box">
        <div class="card-sub">
          <!-- select box -->
          <div class="fm-condType1">
            <fieldset class="tx-r">
              <legend>검색영역</legend>
              <label for="sel" class="hidden">선택해주세요</label>
              <select id="sel" class="select">
                <option value="">오랜된 순</option>
              </select>
            </fieldset>
          </div>
        </div>
        <div class="table-l1 wid774 div-c">
          <table>
            <thead>
              <tr>
                <th>일자</th>
                <th>총건수</th>
                <!-- <th>미인식 건수</th> -->
                <!-- <th>오인식 건수</th> -->
                <!-- <th>용량</th> -->
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in dataList">
                <tr :key="index">
                  <td class="tx-c">{{ item.WORK_DATE }}</td>
                  <td class="tx-c">{{ item.CNT }}</td>
                  <!-- <td class="tx-c">{{ item.COMB_DTST_TYPE }}</td> -->
                  <!-- <td class="tx-c">10</td> -->
                  <!-- <td class="tx-c">2GB</td> -->
                </tr>
              </template>
              <tr v-if="dataList.length === 0">
                <td colspan="5" class="tx-c">검색걸과 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import commonService from "~/service/common-service";
import { comma } from "~/utils/common";
import * as echarts from "echarts";
@Component({
  components: { Layout },
})
export default class extends Vue {
  selDate = "7";
  code = {};
  lineList = [];
  dataList = [];
  date = "";
  created() {
    this.codeList();
  }
  async mounted() {
    await this.changeDate();
  }
  chart() {
    const that = this;
    const dates = this.lineList.map((v) => v.WORK_DATE);
    const cnts = this.lineList.map((v) => v.CNT);
    var dom = document.getElementById("chart-container");
    var myChart: any = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });
    var app = {};

    var option;

    option = {
      color: ["#B7B7B7"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#B7B7B7",
          },
        },
      },

      xAxis: [
        {
          type: "category",
          data: [...dates],
          axisPointer: {
            type: "shadow",
          },
          nameTextStyle: {
            color: "#B7B7B7",
          },
          triggerEvent: true,
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "수집건수",
          min: 0,
          // max: Math.max(),
          interval: 5000,
          axisLabel: {
            formatter: "{value}",
          },
        },
        {
          type: "value",
          name: "",
          min: 0,
          // max: 2000,
          interval: 0,
          axisLabel: {
            // formatter: "{value}",
            formatter: "",
          },
        },
      ],

      /*
          필독!!  bar value값과 line value값 동일하게 삽입해야됨
      */

      series: [
        {
          name: "수집현황",
          type: "bar",
          itemStyle: {
            color: "#EAF5DA",
          },
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: [...cnts],
        },
        // {
        //   name: "수집현황",
        //   type: "line",
        //   yAxisIndex: 1,
        //   itemStyle: {
        //     color: "#88BF3D",
        //   },
        //   label: {
        //     show: true,
        //     position: "top",
        //     color: "#88BF3D",
        //   },
        //   lineStyle: {
        //     type: "dotted",
        //   },
        //   tooltip: {
        //     valueFormatter: function (value) {
        //       return value;
        //     },
        //   },
        //   data: [...cnts],
        // },
      ],
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);
    }
    myChart.on("click", function (params) {
      if (params.componentType === "markLine") {
        alert("markLine을 클릭하였습니다.");
      } else if (params.componentType === "series") {
        console.log(params);
        that.date = params.name;
        //that.onDataList();
      } else if (params.componentType === "xAxis") {
        // alert("xAxis 클릭하였습니다.");
      } else if (params.componentType === "yAxis") {
        // alert("yAxis 클릭하였습니다.");
      } else if (params.componentType === "title") {
        // alert("title 클릭하였습니다.");
      }
    });

    window.addEventListener("resize", myChart.resize);
  }
  comma(num) {
    return comma(num);
  }
  async changeDate() {
    const lineList = await commonService.request(
      { searchDate: this.selDate },
      "/api/crgw-img-data/list/count"
    );
    console.log(lineList);
    this.lineList = lineList;
    this.chart();
    this.dataList = lineList;
  }
  // async onDataList() {
  //   const dataList = await commonService.request(
  //     { date: this.date },
  //     "/api/comb-dtst/list"
  //   );
  //   console.log("===", dataList);
  //   this.dataList = dataList;
  // }
  async codeList() {
    const codeList = await commonService.request(
      ["NGTP"],
      "/api/common/code/list"
    );
    this.code = codeList;
  }
}
</script>
