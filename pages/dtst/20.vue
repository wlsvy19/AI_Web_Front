<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top">
          <h2 class="ti">단위데이터 셋 관리</h2>
        </div>
      </div>

      <div id="conts" class="conts-box2">
        <div class="clmFlex clmBox-col2 mt15">
          <div class="tab mb15">
            <ul class="tabList">
              <li class="active"><button type="button">번호판탐색</button></li>
              <li><button type="button">문자/숫자1</button></li>
              <li><button type="button">문자/숫자2</button></li>
              <li><button type="button">문자/숫자3</button></li>
              <li><button type="button">꺾임/훼손</button></li>
              <li><button type="button">스미어/비차량</button></li>
            </ul>
          </div>

          <div class="clmBox">
            <h1 class="ti-s">번호판 라벨링 데이터 현황</h1>
            <div class="clm-body4">
              <div class="local-dataSet flex flex-btw">
                <!-- chart Area [S]-->
                <div id="chart-localData"></div>
                <!-- chart Area [E]-->

                <!-- data input Area [S]-->
                <div class="lcal-dataSetBox">
                  <div class="lc-progress">
                    <!-- 진행률 progress bar -->
                    <div class="flex flex-btw">
                      <!-- progress value에 데이터 값 넣으면 됩니다. -->
                      <div class="car-labelNm">문자/숫자1</div>
                      <div class="tx-r">
                        <strong class="prgs-ing">3,210</strong>
                        <span class="prgs-val">/ 10,000</span>
                      </div>
                    </div>
                    <progress
                      class="prog-bar mt5"
                      value="30"
                      min="10"
                      max="100"
                    ></progress>
                  </div>

                  <div class="lc-dataset mt30">
                    자동 데이터 셋 생성 기준 :
                    <input type="text" class="inp2 wid50x" placeholder="200" />
                    <!-- 준공검사 -->
                    <!-- <button type="button" class="btn-bg-gn mt10 wid80x">
                      생성
                    </button> -->
                  </div>
                </div>
                <!-- data input Area [E]-->
              </div>

              <!-- <div class="table-l1 mt30">
                <table>
                  <thead>
                    <tr>
                      <th>생성 시간</th>
                      <th>단위데이터<br />셋 ID</th>
                      <th>번호판 유형</th>
                      <th>데이터 개수</th>
                      <th>상세보기</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c"><button type="button">보기</button></td>
                      <td class="tx-c"><button type="button">삭제</button></td>
                    </tr>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c"><button type="button">보기</button></td>
                      <td class="tx-c"><button type="button">삭제</button></td>
                    </tr>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c"><button type="button">보기</button></td>
                      <td class="tx-c"><button type="button">삭제</button></td>
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
              </div> -->
              <div class="table-l1 tb-op1 tb-ov1">
              <table class="tx-c">
                <thead>
                  <tr>
                    <th class="tx-c">생성일자</th>
                    <th class="tx-c">단위데이터셋ID</th>
                    <th class="tx-c">학습데이터 개수</th>
                    <!-- <th>삭제</th> -->
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in data">
                    <tr :key="index">
                      <td>{{ item.workDate }}</td>
                      <td>{{ item.unitDtstId }}</td>
                      <td>{{ item.totalCnt }}</td>
                      <!-- <td><button type="button">삭제</button></td> -->
                    </tr>
                  </template>
                </tbody>
              </table>
              </div>
              <pagination
                :pageInfo="pageInfo"
                @pagination="(p) => onSearch(p.pageNo)"
              />
            </div>
          </div>
          <div class="clmBox">
            <h1 class="ti-s">선택된 가중치</h1>
            <div class="clm-body4">
              <!-- chart Area [S]-->
              <div id="chart-localData2"></div>
              <!-- chart Area [E]-->
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
import { IPageInfoModel } from "~/models/common-model";
import commonService from "~/service/common-service";
import * as echarts from "echarts";
@Component({ components: { Layout } })
export default class extends Vue {
  data = {};
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
    search = {
    unitDtstType: "A",
    ordfield: "work_dttm",
    order: "ASC",
  }
  mounted() {
    this.init();
  }
  init() {
    var dom = document.getElementById("chart-localData");
    var colorPalette = [
      "#4a89dc",
      "#8cc152",
      "#f6bb42",
      "#ea2237",
      "#37bc9b",
      "#434a54",
    ];
    var myChart:any = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option;

    option = {
      title: {
        // text: "라벨링데이터 현황",
        subtext: "총 12,300개",
        left: "10",
        top: "20",
        // textStyle: {
        //     fontSize: 14
        // },
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
      width: "50%",
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
          center: ["100%", "60%"], //가로 세로 위치
          data: [
            { value: 1048, name: "P2" },
            { value: 735, name: "P1" },
            { value: 580, name: "P3" },
            { value: 484, name: "P0" },
            { value: 300, name: "P5" },
            { value: 200, name: "P9" },
          ],
        },
      ],
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);
    }

    window.addEventListener("resize", myChart.resize);

    var dom2 = document.getElementById("chart-localData2");
    var myChart2:any = echarts.init(dom2, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option2;

    option2 = {
      // title: {
      //     text: 'World Population'
      // },
      // tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //     type: 'shadow'
      //     }
      // },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: ["A", "B", "C", "D", "E", "F"],
      },
      series: [
        {
          // name: '2012',
          type: "bar",
          data: [19325, 32451, 31000, 2222, 134141, 12322],
        },
      ],
    };

    if (option2 && typeof option2 === "object") {
      myChart2.setOption(option2);
    }

    window.addEventListener("resize", myChart2.resize);
  }
  async onSearch(pageNo: number) {
    const newpage = { ...this.pageInfo, pageNo };
    const data = await commonService.request(
      { ...this.search, ...newpage, },
      "/api/unit-dtst/list"
    );
    newpage.totalCount = data.page.totalCount;
    this.data = data.list;
    this.pageInfo = { ...newpage };
  }
  created() {
    this.onSearch(1);
  }
}
</script>
<style scoped></style>
