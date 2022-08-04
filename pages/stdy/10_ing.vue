<template>
  <div id="contents">
    <div class="tit-bar tit-NavType2" style="margin-top: 20px">
      <div class="tit-top flex flex-btw">
        <h2 class="ti wid2p">영상학습</h2>
        <div class="wid6p tx-c vc-locat">
          {{ dataset.learnDtstTypeNm }}<span>&gt;</span>{{ dataset.learnDtstId
          }}<span>&gt;</span>{{ dataset.weightId }}
        </div>
        <div class="wid2p tx-r">
          <button
            type="button"
            @click="onStop()"
            class="btn btn-sz1 btn-gr1 mr25"
          >
            학습중지
          </button>
        </div>
      </div>
      <div class="tit-bottom">
        <div class="tit-bm-cont">
          대상 데이터 셋:
          <span class="c-val"
            >{{ datasetInfo.combDtstId }}({{
              comma(datasetInfo.totalCnt)
            }}개)</span
          >
          현재까지의 평균 loss: <span class="c-val">23</span> 현재 Iteration:
          <span class="c-val">12,123</span> 남은 시간:
          <span class="c-val">00:00:22</span>
        </div>
      </div>
    </div>

    <div class="clmFlex mt15">
      <!-- 왼쪽 차트 영역 [S] -->
      <div class="vc-statis-l">
        <div class="vc-statis-top mb15">
          <div id="vsStatis1"></div>
        </div>

        <div class="vc-statis-bottom">
          <div id="vsStatis2"></div>
        </div>
      </div>
      <!-- 왼쪽 차트 영역 [E] -->

      <!-- 오른쪽 차트 영역 [S] -->
      <div class="newEngin-r">
        <h1 class="ti-s">학습 서버 상태</h1>
        <div class="cpuChartBox">
          <div id="chart-cpu"></div>

          <div class="c-memory">
            <progress
              class="cpu-memory"
              id="cpu-memory"
              :value="serverInfo.memUsageRate"
              min="0"
              max="100"
            ></progress>
            <div class="txt-usage">{{ serverInfo.memUsage }}GB / {{ serverInfo.memSize }}GB</div>
            <div class="txt-memory">메모리 사용률</div>
          </div>
        </div>

        <div class="gpuChartBox">
          <div id="chart-gpu"></div>
          <div class="g-memory">
            <progress
              class="gpu-memory"
              id="gpu-memory"
              :value="serverInfo.gpuRamUsageRate"
              min="0"
              max="100"
            ></progress>
            <div class="txt-usage">{{ serverInfo.gpuRamUsage }}MB / {{ serverInfo.gpuRamSize }}MB</div>
            <div class="txt-memory">GPU 메모리 사용률</div>
          </div>
        </div>

        <div class="memChartBox">
          <div id="chart-mem"></div>
          <div class="g-memory">
            <progress
              class="disk-usage"
              id="disk-usage"
              :value="serverInfo.diskUsageRate"
              min="0"
              max="100"
            ></progress>
            <div class="txt-usage">{{ serverInfo.diskUsage }}GB / {{ serverInfo.diskSize }}GB</div>
            <div class="txt-memory">디스크 사용률</div>
          </div>
        </div>
      </div>
      <!-- 오른쪽 차트 영역 [E] -->
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import commonService from "~/service/common-service";
import { comma } from "~/utils/common";
import * as echarts from "echarts";
@Component({ components: { Layout } })
export default class extends Vue {
  serverInfo = {
    memUsageRate: 0,
    memSize: 0,
    memUsage: 0,
    gpuRamUsageRate: 0,
    gpuRamSize: 0,
    gpuRamUsage: 0,
    diskUsageRate: 0,
    diskSize: 0,
    diskUsage: 0,
  };
  datasetInfo: any = {};
  dataset: any = {};
  learnInfo: any = {};
  comma(num) {
    return comma(num);
  }
  async created() {
    this.dataset = commonService.getDataset();
  }
  async mounted() {
    await this.getServerStatusData();
    await this.getDatasetInfo();
    await this.getLeanInfo();
    this.init();
  }
  async getLeanInfo() {
    const dataset = this.dataset;
    const data = await commonService.request(
      {
        workDate: dataset.workDate,
        learnDtstId: dataset.learnDtstId,
        learnDtstType: dataset.learnDtstType,
        weightId: dataset.weightId,
      },
      "/api/learn-status/data"
    );
    if (data != null) this.learnInfo = data;
    console.log("==leanInfo==", data);
  }
  async getDatasetInfo() {
    console.log("====dataset", this.dataset);
    const dataset = this.dataset;
    const data = await commonService.request(
      {
        workDate: dataset.workDate,
        combDtstId: dataset.learnDtstId,
        combDtstType: dataset.learnDtstType,
      },
      "/api/comb-dtst/info"
    );
    this.datasetInfo = data;
    console.log("datasetInfo==", this.datasetInfo); 
  }
  async getServerStatusData() {
    const data = await commonService.request(
      { server: "Training" },
      "/api/server-status/data"
    );
    this.serverInfo = data || {
      memUsageRate: 0,
      memSize: 0,
      memUsage: 0,
      gpuRamUsageRate: 0,
      gpuRamSize: 0,
      gpuRamUsage: 0,
      diskUsageRate: 0,
      diskSize: 0,
      diskUsage: 0,
    };
    console.log("===serverInfo===", this.serverInfo);
  }
  async onStop() {
    const dataset = commonService.getDataset();
    console.log("dataset", dataset);
    const data = await commonService.request(
      dataset,
      "/api/learn-status/data/stop"
    );
    commonService.deleteDataset();
    this.$emit("onRun", "");
  }
  init() {
    const info = this.learnInfo;
    const lossArr = [];
    const iterArr = [];
    for (let i = 0; i <= 10; i++) {
      lossArr[i] = info["lossRate" + i] || 0;
      iterArr[i] = info["mapValue" + i] || 0;
    }
    const loss0 = info.lossRate0 || 0;
    const loss1 = info.lossRate1 || 0;
    const loss2 = info.lossRate2 || 0;
    var dom = document.getElementById("vsStatis1");
    var myChart = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });
    var app = {};

    var option;

    option = {
      title: {
        text: "Iteration",
        subtext: "loss",
        left: "20",
        top: "23",
        textStyle: {
          fontSize: 14,
        },
        subtextStyle: {
          fontSize: 12,
        },
      },
      color: ["#B7B7B7"],
      tooltip: {
        show: false,
      },

      xAxis: [
        {
          type: "category",
          data: [
            "0",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
          ],
          axisPointer: {
            type: "shadow",
          },
          nameTextStyle: {
            color: "#B7B7B7",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "",
          min: 0,
          max: 20,
          interval: 5,
          axisLabel: {
            formatter: "{value}",
          },
        },
        {
          type: "value",
          name: "",
          min: 0,
          max: 20,
          interval: 5,
          axisLabel: {
            formatter: "{value}",
          },
        },
      ],

      /*
                필독!!  bar value값과 line value값 동일하게 삽입해야됨
            */

      series: [
        {
          name: "loss",
          type: "bar",
          itemStyle: {
            color: "#EAF5DA",
          },
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: lossArr,
        },
        {
          name: "Iteration",
          type: "line",
          yAxisIndex: 1,
          itemStyle: {
            color: "#88BF3D",
          },
          label: {
            show: true,
            position: "top",
            color: "#88BF3D",
          },
          lineStyle: {
            type: "dotted",
          },
          tooltip: {
            valueFormatter: function (value) {
              // return value;
              return "";
            },
          },
          data: lossArr,
        },
      ],
    };

    var dom2 = document.getElementById("vsStatis2");
    var myChart2 = echarts.init(dom2, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option2;

    option2 = {
      title: {
        text: "Iteration",
        subtext: "mAP",
        left: "20",
        top: "23",
        textStyle: {
          fontSize: 14,
        },
        subtextStyle: {
          fontSize: 12,
        },
      },
      color: ["#B7B7B7"],
      tooltip: {
        show: false,
      },

      xAxis: [
        {
          type: "category",
          data: [
            "0",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
          ],
          axisPointer: {
            type: "shadow",
          },
          nameTextStyle: {
            color: "#B7B7B7",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "",
          min: 0,
          max: 20,
          interval: 5,
          axisLabel: {
            formatter: "{value}",
          },
        },
        {
          type: "value",
          name: "",
          min: 0,
          max: 20,
          interval: 5,
          axisLabel: {
            formatter: "{value}",
          },
        },
      ],

      /*
                필독!!  bar value값과 line value값 동일하게 삽입해야됨
            */

      series: [
        {
          name: "loss",
          type: "bar",
          itemStyle: {
            color: "#81DAD5",
          },
          label: {
            show: true,
            position: "top",
          },
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: iterArr,
        },
      ],
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);
    }

    if (option2 && typeof option2 === "object") {
      myChart2.setOption(option2);
    }

    window.addEventListener("resize", (myChart as any).resize);
    window.addEventListener("resize", (myChart2 as any).resize);

    // Gauge
    var cpu = document.getElementById("chart-cpu");
    var myChart3 = echarts.init(cpu, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option3;

    option3 = {
      title: {
        text: "· CPU",
        left: "0%",
        top: "0%",
        textStyle: {
          fontSize: 14,
        },
      },
      series: [
        {
          type: "gauge",
          progress: {
            show: true,
            width: 15, // 원(라인) 두께
          },
          itemStyle: {
            color: "#F0C943",
          },
          axisLine: {
            lineStyle: {
              width: 15, // 원(라인) 두께
              color: [[1, "#F1F1F1"]],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 0,
              color: "red",
            },
          },
          axisLabel: {
            distance: 25,
            fontSize: 0,
          },
          pointer: {
            show: false,
          },
          anchor: {
            show: false,
            showAbove: false,
          },
          title: {
            // 게이지 하단 텍스트
            show: true,
            fontSize: 12,
            offsetCenter: [0, "90%"], //텍스트 위치
          },
          detail: {
            // 게이지 중앙 데이터
            valueAnimation: false,
            fontSize: 18,
            color: "#F0C943", //색상
            formatter: "{value}%", //값
            offsetCenter: ["0", "5%"], // 위치
          },
          center: ["30%", "50%"],
          data: [
            {
              value: this.serverInfo.cpuUsageRate, // DB 데이터 값
              name: "사용률",
            },
          ],
        },
      ],
    };
    if (option3 && typeof option3 === "object") {
      myChart3.setOption(option3);
    }

    window.addEventListener("resize", (myChart3 as any).resize);

    var gpu = document.getElementById("chart-gpu");
    var myChart4 = echarts.init(gpu, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option4;

    option4 = {
      title: {
        text: "· GPU",
        left: "0%",
        top: "0%",
        textStyle: {
          fontSize: 14,
        },
      },
      series: [
        {
          type: "gauge",
          progress: {
            show: true,
            width: 15, // 원(라인) 두께
          },
          itemStyle: {
            color: "#6685F2",
          },
          axisLine: {
            lineStyle: {
              width: 15,
              color: [[1, "#F1F1F1"]],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 0,
              color: "red",
            },
          },
          axisLabel: {
            distance: 25,
            fontSize: 0,
          },
          pointer: {
            show: false,
          },
          anchor: {
            show: false,
            showAbove: false,
          },
          title: {
            show: true,
            fontSize: 12,
            offsetCenter: [0, "90%"], //텍스트 위치
          },
          detail: {
            valueAnimation: false,
            fontSize: 18,
            color: "#6685F2",
            formatter: "{value}%",
            offsetCenter: ["0", "5%"], // 위치
          },
          center: ["30%", "50%"],
          data: [
            {
              value: this.serverInfo.gpuUsageRate,
              name: "사용률",
            },
          ],
        },
      ],
    };
    if (option4 && typeof option4 === "object") {
      myChart4.setOption(option4);
    }

    window.addEventListener("resize", (myChart4 as any).resize);

    var gpu = document.getElementById("chart-mem");
    var myChart5 = echarts.init(gpu, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option5;

    option5 = {
      title: {
        text: "· GPU Temp",
        left: "0%",
        top: "0%",
        textStyle: {
          fontSize: 14,
        },
      },
      series: [
        {
          type: "gauge",
          progress: {
            show: true,
            width: 15,
          },
          itemStyle: {
            color: "#EC5353",
          },
          axisLine: {
            lineStyle: {
              width: 15,
              color: [[1, "#F1F1F1"]],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 0,
              color: "red",
            },
          },
          pointer: {
            show: false,
          },
          axisLabel: {
            distance: 25,
            fontSize: 0,
          },
          anchor: {
            show: false,
            showAbove: false,
          },
          title: {
            show: true,
            fontSize: 12,
            offsetCenter: [0, "90%"], //텍스트 위치
          },
          detail: {
            valueAnimation: false,
            fontSize: 18,
            color: "#EC5353",
            formatter: "{value}C",
            offsetCenter: ["0", "5%"], // 위치
          },
          center: ["30%", "50%"],
          data: [
            {
              value: this.serverInfo.gpuTemperature,
              name: "현재온도",
            },
          ],
        },
      ],
    };
    console.log("aaaa====", this.serverInfo);
    if (option5 && typeof option5 === "object") {
      myChart5.setOption(option5);
    }

    window.addEventListener("resize", (myChart5 as any).resize);

    setInterval(this.getServerStatusData, 5000);
  }
}
</script>
<style scoped></style>
