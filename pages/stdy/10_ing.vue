<template>
  <div id="contents">
    <div class="tit-bar tit-NavType2" style="margin-top: 20px">
      <div class="tit-top flex flex-btw">
        <h2 class="ti wid2p">영상학습</h2>
        <div class="wid6p tx-c vc-locat">
          {{ dataset.learnDtstTypeNm }}<span>&gt;</span>{{ dataset.trainingId }}<span v-if="dataset.weightId !=''">&gt;</span>{{ dataset.weightId }}
        </div>
        <div class="wid2p tx-r">
          <button
            type="button"
            @click="onStop(0)"
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
          현재까지의 평균 loss: <span class="c-val">{{ this.mean_loss }}</span>
          현재 Iteration: <span class="c-val">{{ this.iteration }}</span> 
          남은 시간: <span class="c-val">{{ statusInfo.remainTime || ""}}</span>
        </div>
      </div>
    </div>

    <div class="clmFlex mt15" style="flex-wrap:wrap;">
      <!-- 왼쪽 차트 영역 [S] -->
      <div v-if="this.status >=2" class="vc-statis-l">
        <div class="vc-statis-top mb15">
          <div id="vsStatis1"></div>
        </div>

        <div class="vc-statis-bottom">
          <div id="vsStatis2"></div>
        </div>
      </div>

      <div v-if="this.status <=1" class='vod-c' style="display:flex; justify-content:center; align-items:center; align-content:center; flex-direction: column;">
        <h1 v-if="this.progressValue<100" style="margin-bottom:3rem">데이터셋 준비중</h1>
        <h1 v-else style="margin-bottom:3rem">데이터셋 준비완료</h1>
        <div class='datsetProgress'>
          <el-progress type="circle" :percentage="this.progressValue" :status="elStatus" :width="500" :stroke-width="40" />
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
      <div v-if="this.status==3"
        style="width: 100%;
        margin-top: inherit;
        padding: 3rem;
        display: flex;
        justify-content: space-between;
        background: white;"
      >
        <h1 style="margin:auto;">{{ dataset.learnDtstTypeNm }} 학습이 완료되었습니다.</h1>
        <button
          type="button"
          @click="onStop(2)"
          class="btn btn-bg-gn"
          style="width: 15%;
                height: 100%;
                padding-top: 20px;
                padding-bottom: 20px;
                font-size: x-large;"
        >
        완료
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import commonService from "~/service/common-service";
import { comma } from "~/utils/common";
import * as echarts from "echarts";
import ProgressBarCylinder from '~/components/ProgressBarCylinder.vue'

@Component({ components: { Layout, ProgressBarCylinder } })
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
    gpuTemperature: 0,
    cpuUsageRate: 0,
    gpuUsageRate: 0,
  };
  datasetInfo: any = {};
  dataset: any = {};
  statusInfo: any = {};
  learnInfo: any = {};
  combDtstId = "";
  combDtstType = "";
  iteration = 0;
  mean_loss = 0;
  LossChart = null;
  LossChartOptions = null;
  mAPChart = null;
  mAPChartOptions = null;
  CpuGaugeChart = null;
  CpuGaugeChartOptions = null;
  GpuGaugeChart = null;
  GpuGaugeChartOptions = null;
  GpuTempGaugeChart = null;
  GpuTempGaugeChartOptions = null;
  serverTimer = null;
  learningTimer = null;

  elStatus = null;
  status = 0;
  isInitChart = false;  
  progressValue = 0;
  progressBarOptions= {
    progress: {
      color: '#88bf3d',
      backgroundColor: '#DBDBDB',
      inverted: false
    },
    layout: {
      height: 35,
      width: 140,
      verticalTextAlign: 43,
      horizontalTextAlign: 45,
      zeroOffset: 0,
      strokeWidth: 30,
      type: 'cylinder'
    }
  };

  comma(num) {
    return comma(num);
  }
  async created() {
    this.dataset = commonService.getDataset();
  }
  async mounted() {
    await this.getServerStatusData();
    await this.getLeanInfo();
    await this.getDatasetInfo();
    this.init();

    this.serverTimer= setInterval(this.getServerStatusData, 5000);
    this.learningTimer= setInterval(this.getLeanInfo, 5000);
  }

  async destroyed() {
    clearInterval(this.serverTimer);
    clearInterval(this.learningTimer);
  }


  async getLeanInfo() {
    // ====== status_info 테이블 ======
    const infoData = await commonService.request(
      {},
      "/api/learn-status/data/ing"
    );
    this.statusInfo = infoData;
    console.log("==statusInfo==", infoData);

    this.combDtstId = infoData['combDtstId'];
    this.combDtstType = infoData['engineType'];

    this.status = parseInt(infoData['trainingStep']);
    this.progressValue = parseInt(infoData['progress']);
    if (infoData["errorMsg"] != "") this.elStatus="exception";
    else {
      if (this.progressValue == 100) this.elStatus='success';
      else this.elStatus=null;
    }

    if (this.status <= 1)  this.isInitChart = false;

    // ======== status 테이블  ====== 
    // 학습 중일 때만 조회
    if (this.status >= 2) {
      const data = await commonService.request(
        {
          trainingId:infoData['trainingId']
          // trainingId:"20220802094023"
        },
        "/api/learn-status/data"
      );
      
      if (data != null) {
        let i=0;
        let sum = 0;
        let temp = {"lossRate": [], "mapValue":[], "iteration":[]}
        for (i=0;i<data.length;i++){
          temp['lossRate'][i] = parseFloat(data[i].lossRate);
          sum += data[i].lossRate
          temp['mapValue'][i] = parseFloat(data[i].mapValue);
          temp['iteration'][i] = parseInt(data[i].iteration);
        }
        
        this.learnInfo = temp; 
        this.iteration = temp['iteration'].slice(-1)[0];
        this.mean_loss = sum / data.length;

        
        if (this.isInitChart){
          // refresh chart
          if (this.LossChart && this.LossChartOptions && typeof this.LossChartOptions === "object") {
            this.LossChartOptions.series[0].data = this.learnInfo['lossRate'];
            this.LossChartOptions.series[1].data = this.learnInfo['lossRate'];
            this.LossChart.setOption(this.LossChartOptions);
          }

          if (this.mAPChart && this.mAPChartOptions && typeof this.mAPChartOptions === "object") {
            this.mAPChartOptions.series[0].data = this.learnInfo['mapValue'];
            this.mAPChart.setOption(this.mAPChartOptions);
          }
        }

        if (!this.isInitChart && this.status >= 2) {
          this.initLearningChart();
        }     
      }
      console.log("==leanInfo==", data);
    }    
  }

  async getDatasetInfo() {
    console.log("====dataset", this.dataset);
    const data = await commonService.request(
      {
        combDtstId: this.combDtstId,
        combDtstType: this.combDtstType,
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

    if (this.CpuGaugeChart && this.CpuGaugeChartOptions && typeof this.CpuGaugeChartOptions === "object") {
      this.CpuGaugeChartOptions.series[0].data[0].value = this.serverInfo.cpuUsageRate;
      this.CpuGaugeChart.setOption(this.CpuGaugeChartOptions);
    }

    if (this.GpuGaugeChart && this.GpuGaugeChartOptions && typeof this.GpuGaugeChartOptions === "object") {
      this.GpuGaugeChartOptions.series[0].data[0].value = this.serverInfo.gpuUsageRate;
      this.GpuGaugeChart.setOption(this.GpuGaugeChartOptions);
    }

    if (this.GpuTempGaugeChart && this.GpuTempGaugeChartOptions && typeof this.GpuTempGaugeChartOptions === "object") {
      this.GpuTempGaugeChartOptions.series[0].data[0].value = this.serverInfo.gpuTemperature;
      this.GpuTempGaugeChart.setOption(this.GpuTempGaugeChartOptions);
    }
  }
  async onStop(flag: number) {
    const dataset = commonService.getDataset();
    console.log("dataset", dataset);
    let param: any = {}
    if (flag == 0) {
      const data = await commonService.request(
        param,
        "/api/learn-status/data/stop"
      );
    }
    else {
      const data = await commonService.request(
        dataset,
        "/api/learn-status/data/complete"
      );
    }
    commonService.deleteDataset();
    this.$emit("onRun", "");
  }

  async initLearningChart() {
    this.isInitChart = true;
    const info = this.learnInfo;
    const lossArr = info['lossRate'];
    const mapArr = info['mapValue'];
    // const iterArr = info['iteration'];
    let iterArr = [];
    for(let i=1;i<=50; i++) iterArr.push(i);
    
    var dom = document.getElementById("vsStatis1");
    this.LossChart = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    this.LossChartOptions = {
      title: {
        text: "Iteration",
        subtext: "loss",
        left: "0",
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
        show: true,
      },

      xAxis: [
        {
          type: "category",
          data: iterArr,
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
        },
        {
        },
      ],

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
            show: false,
            position: "top",
            color: "#88BF3D",
          },
          lineStyle: {
            type: "line",
          },
          tooltip: {
            valueFormatter: function (value) {
              return "";
            },
          },
          data: lossArr,
        },
      ],
    };

    var dom2 = document.getElementById("vsStatis2");
    this.mAPChart = echarts.init(dom2, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    this.mAPChartOptions = {
      title: {
        text: "Iteration",
        subtext: "mAP",
        left: "0",
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
        show: true,
      },

      xAxis: [
        {
          type: "category",
          data: iterArr,
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
        },
        {
        },
      ],
      series: [
        {
          name: "map",
          type: "bar",
          itemStyle: {
            color: "#81DAD5",
          },
          label: {
            show: false,
            position: "top",
          },
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: mapArr,
        },
      ],
    };

    if (this.LossChart && this.LossChartOptions && typeof this.LossChartOptions === "object") {
      this.LossChart.setOption(this.LossChartOptions);
    }

    if (this.mAPChart && this.mAPChartOptions && typeof this.mAPChartOptions === "object") {
      this.mAPChart.setOption(this.mAPChartOptions);
    }

    window.addEventListener("resize", (this.LossChart as any).resize);
    window.addEventListener("resize", (this.mAPChart as any).resize);
  }


  init() {

    // Gauge
    var cpu = document.getElementById("chart-cpu");
    this.CpuGaugeChart = echarts.init(cpu, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    this.CpuGaugeChartOptions = {
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
    if (this.CpuGaugeChart && this.CpuGaugeChartOptions && typeof this.CpuGaugeChartOptions === "object") {
      this.CpuGaugeChart.setOption(this.CpuGaugeChartOptions);
    }

    window.addEventListener("resize", (this.CpuGaugeChart as any).resize);

    var gpu = document.getElementById("chart-gpu");
    this.GpuGaugeChart = echarts.init(gpu, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    this.GpuGaugeChartOptions = {
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
    if (this.GpuGaugeChart && this.GpuGaugeChartOptions && typeof this.GpuGaugeChartOptions === "object") {
      this.GpuGaugeChart.setOption(this.GpuGaugeChartOptions);
    }

    window.addEventListener("resize", (this.GpuGaugeChart as any).resize);

    var gpu = document.getElementById("chart-mem");
    this.GpuTempGaugeChart = echarts.init(gpu, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    this.GpuTempGaugeChartOptions = {
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
    if (this.GpuTempGaugeChart && this.GpuTempGaugeChartOptions && typeof this.GpuTempGaugeChartOptions === "object") {
      this.GpuTempGaugeChart.setOption(this.GpuTempGaugeChartOptions);
    }

    window.addEventListener("resize", (this.GpuTempGaugeChart as any).resize);

    // setInterval(this.getServerStatusData, 5000);
    // setInterval(this.getLeanInfo, 5000);
  }
}
</script>
<style scoped></style>
