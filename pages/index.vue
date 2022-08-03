<template>
  <layout>
    <div id="contents">
      <div id="dashboard">
        <div class="dashboard-cont">
          <h1 class="ti">차량번호 미, 오인식 유형분류 건수</h1>
          <div id="dsb-cont1"></div>
        </div>
        <div class="dashboard-cont">
          <h1 class="ti">차량번호 미, 오인식 유형분류 용량</h1>
          <div id="dsb-cont2"></div>
        </div>
        <div class="dashboard-cont">
          <h1 class="ti">학습 데이터 건수/용량</h1>
          <div id="dsb-cont3"></div>
          <div id="dsb-cont4" class="mt30"></div>
        </div>
        <div class="dashboard-cont">
          <h1 class="ti">학습결과 검증 현황</h1>
          <div class="dashboard-class-chart flex flex-btw">
            <div id="dsb-cont5"></div>
            <div id="dsb-cont6"></div>
            <div id="dsb-cont7"></div>
          </div>
        </div>
        <div class="dashboard-cont">
          <h1 class="ti">트레이닝 및 알고리즘 업데이트 현황(실시간 표시)</h1>
          <div id="dsb-cont8"></div>
          <div id="dsb-cont9" class="mt30"></div>
        </div>
        <div class="dashboard-cont">
          <h1 class="ti">차로 유형별 인식률 변화</h1>
          <div id="dsb-cont10"></div>
          <div id="dsb-cont11" class="mt30"></div>
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
@Component({ components: { Layout } })
export default class extends Vue {
  data: any = {};
  comma(num) {
    return comma(num);
  }
  async mounted() {
    this.init();
  }
  init() {
    var dom = document.getElementById("dsb-cont1");
    var myChart: any = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option;

    option = {
      title: {
        text: "미, 오인식 유형분류 건수(누적)",
        left: "20",
        top: "10",
        textStyle: {
          fontSize: 14,
        },
      },
      color: ["#B7B7B7"],
      tooltip: {
        show: false,
      },

      xAxis: [
        {
          type: "category",
          data: ["밝음", "어두움", "꺾임", "훼손", "가림", "기타"],
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
          max: 5000,
          interval: 500,
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
          data: [1000, 1009, 1500, 1100, 1300, 700],
        },
      ],
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);
    }

    window.addEventListener("resize", myChart.resize);

    var dom2 = document.getElementById("dsb-cont2");
    var myChart2: any = echarts.init(dom2, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option2;

    option2 = {
      title: {
        text: "미, 오인식 유형분류 용량(누적)",
        left: "20",
        top: "10",
        textStyle: {
          fontSize: 14,
        },
      },
      color: ["#B7B7B7"],
      tooltip: {
        show: false,
      },

      xAxis: [
        {
          type: "category",
          data: ["밝음", "어두움", "꺾임", "훼손", "가림", "기타"],
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
          max: 120,
          interval: 20,
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
            color: "#88BF3D",
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
          data: [10, 19, 15, 11, 13, 7],
        },
      ],
    };

    if (option2 && typeof option2 === "object") {
      myChart2.setOption(option2);
    }

    window.addEventListener("resize", myChart2.resize);

    var dom3 = document.getElementById("dsb-cont3");
    var myChart3: any = echarts.init(dom3, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option3;

    option3 = {
      title: {
        text: "학습데이터 건수",
        left: "20",
        top: "10",
        textStyle: {
          fontSize: 14,
        },
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 120000,
        interval: 20000,
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: ["건수"],
      },
      series: [
        {
          name: "최신(직전)",
          type: "bar",
          itemStyle: {
            color: "green",
          },
          data: [18203],
        },
        {
          name: "전체",
          type: "bar",
          itemStyle: {
            color: "blue",
          },
          data: [19325],
        },
      ],
    };

    if (option3 && typeof option3 === "object") {
      myChart3.setOption(option3);
    }

    window.addEventListener("resize", myChart3.resize);

    var dom4 = document.getElementById("dsb-cont4");
    var myChart4: any = echarts.init(dom4, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option4;

    option4 = {
      title: {
        text: "학습데이터 용량",
        left: "20",
        top: "10",
        textStyle: {
          fontSize: 14,
        },
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 300,
        interval: 50,
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: ["용량"],
      },
      series: [
        {
          name: "최신(직전)",
          type: "bar",
          itemStyle: {
            color: "green",
          },
          data: [100],
        },
        {
          name: "전체",
          itemStyle: {
            color: "blue",
          },
          type: "bar",
          data: [200],
        },
      ],
    };

    if (option4 && typeof option4 === "object") {
      myChart4.setOption(option4);
    }

    window.addEventListener("resize", myChart4.resize);

    var dom5 = document.getElementById("dsb-cont5");
    var colorPalette1 = [
      "#4a89dc",
      "#8cc152",
      "#f6bb42",
      "#ea2237",
      "#37bc9b",
      "#434a54",
    ];
    var myChart5: any = echarts.init(dom5, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option5;

    option5 = {
      title: {
        text: "문자 검증 결과(직전)",
        left: "10",
        top: "20",
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: true,
        bottom: 0,
      },
      width: "80%",
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["0", "100%"],

          itemStyle: {
            normal: {
              label: {
                show: true,
                position: "inner",
                color: "#ffffff",
                formatter: function (params) {
                  return params.value + "%";
                },
              },
              labelLine: {
                show: false,
              },
            },
          },

          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            alignTo: "labelLine",
          },
          color: colorPalette1,
          emphasis: {
            label: {
              show: true,
            },
          },
          // label: {
          //   alignTo: "labelLine",
          // },
          labelLine: {
            show: true,
            length: 1,
          },
          center: ["50%", "40%"], //가로 세로 위치
          data: [
            { value: 10, name: "문자/숫자2" },
            { value: 10, name: "번호판 탐색" },
            { value: 10, name: "문자/숫자3" },
            { value: 10, name: "스미어" },
            { value: 20, name: "꺽임/훼손" },
            { value: 30, name: "문자/숫자1" },
          ],
        },
      ],
    };

    if (option5 && typeof option5 === "object") {
      myChart5.setOption(option5);
    }
    window.addEventListener("resize", myChart5.resize);

    var dom6 = document.getElementById("dsb-cont6");
    var colorPalette2 = [
      "#4a89dc",
      "#8cc152",
      "#f6bb42",
      "#ea2237",
      "#37bc9b",
      "#434a54",
    ];
    var myChart6: any = echarts.init(dom6, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option6;

    option6 = {
      title: {
        text: "숫자 검증 결과(직전)",
        left: "10",
        top: "20",
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: true,
        bottom: 0,
      },
      width: "80%",
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["0", "100%"],

          itemStyle: {
            normal: {
              label: {
                show: true,
                position: "inner",
                color: "#ffffff",
                formatter: function (params) {
                  return params.value + "%";
                },
              },
              labelLine: {
                show: false,
              },
            },
          },

          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            alignTo: "labelLine",
          },
          color: colorPalette2,
          emphasis: {
            label: {
              show: true,
            },
          },
          // label: {
          //   alignTo: "labelLine",
          // },
          labelLine: {
            show: true,
            length: 1,
          },
          center: ["50%", "40%"], //가로 세로 위치
          data: [
            { value: 10, name: "문자/숫자2" },
            { value: 10, name: "번호판 탐색" },
            { value: 10, name: "문자/숫자3" },
            { value: 10, name: "스미어" },
            { value: 20, name: "꺽임/훼손" },
            { value: 30, name: "문자/숫자1" },
          ],
        },
      ],
    };

    if (option6 && typeof option6 === "object") {
      myChart6.setOption(option6);
    }
    window.addEventListener("resize", myChart6.resize);

    var dom7 = document.getElementById("dsb-cont7");
    var colorPalette3 = [
      "#4a89dc",
      "#8cc152",
      "#f6bb42",
      "#ea2237",
      "#37bc9b",
      "#434a54",
    ];
    var myChart7: any = echarts.init(dom7, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option7;

    option7 = {
      title: {
        text: "번호판 검증률(직전)",
        left: "10",
        top: "20",
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: true,
        bottom: 0,
      },
      width: "80%",
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["0", "100%"],

          itemStyle: {
            normal: {
              label: {
                show: true,
                position: "inner",
                color: "#ffffff",
                formatter: function (params) {
                  return params.value + "%";
                },
              },
              labelLine: {
                show: false,
              },
            },
          },

          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            alignTo: "labelLine",
          },
          color: colorPalette3,
          emphasis: {
            label: {
              show: true,
            },
          },
          // label: {
          //   alignTo: "labelLine",
          // },
          labelLine: {
            show: true,
            length: 1,
          },
          center: ["50%", "40%"], //가로 세로 위치
          data: [
            { value: 10, name: "문자/숫자2" },
            { value: 10, name: "번호판 탐색" },
            { value: 10, name: "문자/숫자3" },
            { value: 10, name: "스미어" },
            { value: 20, name: "꺽임/훼손" },
            { value: 30, name: "문자/숫자1" },
          ],
        },
      ],
    };

    if (option7 && typeof option7 === "object") {
      myChart7.setOption(option7);
    }
    window.addEventListener("resize", myChart7.resize);

    var dom8 = document.getElementById("dsb-cont8");
    var myChart8: any = echarts.init(dom8, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option8;

    option8 = {
      title: {
        text: "학습 데이터셋 트레이닝",
        left: "20",
        top: "10",
        textStyle: {
          fontSize: 14,
        },
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 600,
        interval: 50,
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: ["시간(초)"],
      },
      series: [
        {
          name: "잔여시간",
          type: "bar",
          itemStyle: {
            color: "#ff7f00",
          },
          data: [200],
        },
        {
          name: "소요시간",
          type: "bar",
          itemStyle: {
            color: "#8b00ff",
          },
          data: [100],
        },
      ],
    };

    if (option8 && typeof option8 === "object") {
      myChart8.setOption(option8);
    }

    window.addEventListener("resize", myChart8.resize);

    var dom9 = document.getElementById("dsb-cont9");
    var myChart9: any = echarts.init(dom9, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option9;

    option9 = {
      title: {
        text: "알고리즘 업데이트",
        left: "20",
        top: "10",
        textStyle: {
          fontSize: 14,
        },
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 600,
        interval: 50,
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: ["시간(초)"],
      },
      series: [
        {
          name: "잔여시간",
          type: "bar",
          itemStyle: {
            color: "#ff7f00",
          },
          data: [400],
        },
        {
          name: "소요시간",
          type: "bar",
          itemStyle: {
            color: "#8b00ff",
          },
          data: [100],
        },
      ],
    };

    if (option9 && typeof option9 === "object") {
      myChart9.setOption(option9);
    }

    window.addEventListener("resize", myChart9.resize);

    var dom10 = document.getElementById("dsb-cont10");
    var myChart10: any = echarts.init(dom10, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option10;

    option10 = {
      title: {
        text: "단차로/다차로",
        left: "20",
        top: "10",
        textStyle: {
          fontSize: 14,
        },
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        min: 90,
        max: 100,
        interval: 1,
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: ["인식률(%)"],
      },
      series: [
        {
          name: "업데이트 전",
          type: "bar",
          itemStyle: {
            color: "#fdd",
          },
          data: [99.5],
        },
        {
          name: "업데이트 후",
          type: "bar",
          itemStyle: {
            color: "#cfc",
          },
          data: [99.9],
        },
      ],
    };

    if (option10 && typeof option10 === "object") {
      myChart10.setOption(option10);
    }

    window.addEventListener("resize", myChart10.resize);

    var dom11 = document.getElementById("dsb-cont11");
    var myChart11: any = echarts.init(dom11, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option11;

    option11 = {
      title: {
        text: "전면/후면",
        left: "20",
        top: "10",
        textStyle: {
          fontSize: 14,
        },
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        min: 90,
        max: 100,
        interval: 1,
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: ["인식률(%)"],
      },
      series: [
        {
          name: "업데이트 전",
          type: "bar",
          itemStyle: {
            color: "#fdd",
          },
          data: [99.0],
        },
        {
          name: "업데이트 후",
          type: "bar",
          itemStyle: {
            color: "#cfc",
          },
          data: [99.9],
        },
      ],
    };

    if (option11 && typeof option11 === "object") {
      myChart11.setOption(option11);
    }

    window.addEventListener("resize", myChart11.resize);
  }
}
</script>
<style scoped></style>
