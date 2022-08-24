<template>
  <div id="contents">
    <div class="tit-bar tit-NavType2" style="margin-top: 20px;">
      <div class="tit-top flex flex-btw" style="padding-bottom:20px">
        <h2 class="ti wid2p">학습이력</h2>
        <button
          type="button"
          @click="moveBefore()"
          class="btn btn-bg-gn"
          style="width: 15%;
                height: 100%;
                font-size: 15px;
                margin-right: 1rem;
                padding-bottom:2rem;
                background-color: #909399;"
        >
        돌아가기
        </button>
      </div>
      <div class="tit-bottom" style="display:flex">
        <div class="tit-bm-cont">
          <div>
            트레이닝ID: <span class="c-val">{{ history.trainingId }}</span>
            학습시작시간: <span class="c-val">{{ history.startDttm }}</span>
            학습종료시간: <span class="c-val">{{ history.endDttm }}</span>
            대상 데이터 셋:
            <span class="c-val"
              >{{ history.learnDtstId }}({{
                comma(history.learnDtstCnt)
              }}개)</span
            >
            타입: <span class="c-val">{{ learnDtstType }}</span> 
            base 가중치: <span class="c-val">{{ baseWeight }}</span>
          </div>
          <div style="margin-top:1rem;">
            최적 가중치: <span class="c-val">{{ history.bestWeight }}</span>
            mAP <span class="c-val">{{ history.map }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="clmFlex mt15" style="flex-wrap:wrap;">
      <!-- 왼쪽 차트 영역 [S] -->
      <div v-if="this.noData==true" style="width:100%;height:655px;">
        <div class="del-his">
          <div id="nf404" style="margin: 0 auto 0 auto;">
            <p>학습 이력이 삭제 되었습니다.</p>            
          </div>
        </div>
      </div>

      <div v-else class="vc-statis-l" style="width:100%">
        <div v-if="this.isInitChart==false" style="position:relative;top:45%">
          <div class="spinner"></div>  
        </div>        
        <div class="vc-statis-top mb15" style="width:100%">          
          <div id="vsStatis1" style="width:100%">            
          </div>
        </div>

        <div class="vc-statis-bottom" style="width:100%">
          <div id="vsStatis2" style="width:100%"></div>
        </div>        
      </div>
      <!-- 왼쪽 차트 영역 [E] -->
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
    gpuTemperature: 0,
    cpuUsageRate: 0,
    gpuUsageRate: 0,
  };
  learnInfo: any = {"lossRate": [], "mapValue":[], "iteration":[]};
  LossChart = null;
  LossChartOptions = null;
  mAPChart = null;
  mAPChartOptions = null;

isInitChart = false;  
  baseWeight = "";
  learnDtstType = "";
  noData = false;

  // localStorage
  history:any = {
    "trainingId":"",
    "startDttm":"",
    "endDttm":"",
    "learnDtstId":"",
    "learnDtstType":"",
    "learnDtstCnt":"",
    "baseWeight":"",
    "map":"",
    "bestWeight":"",
  }

  comma(num: any) {
    return comma(num);
  }
  async mounted() {
    for(let key in this.history) {
      this.history[key] = localStorage.getItem(key);
    }
    // base 가중치 표시용
    if (this.history['baseWeight'] == "") this.baseWeight = "base 가중치 없음";
    else this.baseWeight = this.history['baseWeight'];

    await this.getNgtpCode();
    await this.getLeanInfo();
  }

  async destroyed() {
    for(let key in this.history) {
      localStorage.removeItem(key);
    }
    this.$emit("onGrpah", "");
  }

  async moveBefore() {
    for(let key in this.history) {
      localStorage.removeItem(key);
    }
    this.$emit("onGrpah", "");
  }

  async getNgtpCode() {
    const ngtpCode = await commonService.request(
      {},
      "/api/cmmn-cd-info/ngtp"
    );
    this.learnDtstType = ngtpCode[this.history['learnDtstType']];
  }

  async getLeanInfo() {
    // ======== status 테이블  ====== 
    const data = await commonService.request(
      {
        trainingId:this.history['trainingId']
      },
      "/api/learn-status/data"
    );
    console.log("==leanInfo==", data);
    
    if (data != null && data.length != 0) {
      let i=0;
      let temp = {"lossRate": [], "mapValue":[], "iteration":[]}
      let lossRate = 0;
      let mapValue = 0;
      let iter = 0;
      
      for (i=0;i<data.length;i++){
        lossRate = parseFloat(data[i].lossRate);
        mapValue = parseFloat(data[i].mapValue);
        iter = parseInt(data[i].iteration);
        temp['lossRate'][i] = lossRate;
        temp['mapValue'][i] = mapValue;
        temp['iteration'][i] = iter;
      }
      this.learnInfo = temp; 
      if (!this.isInitChart) {
        this.initLearningChart();
      }     
    }
    else {
      this.noData = true;
    }
  }

  async initLearningChart() {
    console.log('initChart@@@@')
    this.isInitChart = true;
    const info = this.learnInfo;
    const lossArr = info['lossRate'];
    const mapArr = info['mapValue'];
    let iterArr = [];
        
    if (info['iteration'].length == 0){
      for(let i=1;i<=100; i++) iterArr.push(i);
    }
    else {
      let range = (Math.floor((info['iteration'].length-1) / 100) + 1) * 100;
      for(let i=1;i<=range; i++) iterArr.push(i);
    }
    var dom = document.getElementById("vsStatis1");
    this.LossChart = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    this.LossChartOptions = {
      title: {
        text: "Iteration",
        subtext: "Loss",
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
        trigger: 'axis',
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
          name: "Loss",
          type: "bar",
          itemStyle: {
            color: "#EAF5DA",
          },
          tooltip: {
            valueFormatter: function (value: any) {
              return value;
            },
          },
          data: lossArr,
        },
        {
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
            show: false,
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
        trigger: 'axis'
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
            valueFormatter: function (value: any) {
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
}
</script>
<style scoped></style>
