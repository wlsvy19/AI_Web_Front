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
              <template v-for="(item, index) in code.NGTP">
                <li
                  :class="`${
                    item.cmmnCd === search.unitDtstType ? 'active' : ''
                  }`"
                  :key="index"
                >
                  <button @click="onSearchTopMenu(item)" type="button">
                    {{ item.cmmnCdNm }}
                  </button>
                </li>
              </template>
            </ul>
          </div>
          <div class="clmBox" v-show="!isDtl">
            <h1 class="ti-s">{{ search.unitDtstNm }} 라벨링 데이터 현황</h1>
            <button
              type="button"
              class="ti-s btn-bg-gn mt20"
              style="width: 100px; padding: '5px 0'; margin-left: 450px"
              @click="onCreateDataset()"
            >
              데이터 셋 생성
            </button>

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
                      <div class="car-labelNm">{{ search.unitDtstNm }}</div>
                      <div class="tx-r">
                        <strong class="prgs-ing">{{
                          comma(data?.confirmDataset?.confirmDataCnt)
                        }}</strong>
                        <span class="prgs-val"
                          >/ {{ comma(data?.confirmDataset?.allDataCnt) }}</span
                        >
                      </div>
                    </div>
                    <progress
                      class="prog-bar mt5"
                      min="0"
                      :value="data?.confirmDataset?.confirmDataCnt"
                      :max="data?.confirmDataset?.allDataCnt"
                    ></progress>
                  </div>

                  <div class="lc-dataset mt30">
                    자동 데이터 셋 생성 기준 :
                    <input
                      type="text"
                      class="inp2 wid50x"
                      placeholder="200"
                      v-model="data.stdDtstCnt"
                    />
                    <!-- 준공검사 -->
                    <button
                      type="button"
                      class="btn-bg-gn mt20"
                      style="width: 40px; padding: '5px 0'"
                      @click="onSetStdDtst()"
                    >
                      설정
                    </button>
                  </div>
                </div>
                <!-- data input Area [E]-->
              </div>

              <div class="table-l1 tb-op1 tb-ov1">
                <table class="tx-c">
                  <thead>
                    <tr>
                      <th class="tx-c">생성일자</th>
                      <th class="tx-c">단위데이터셋ID</th>
                      <th class="tx-c">학습데이터 개수</th>
                      <th class="tx-c">상세 보기</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(item, index) in dataList">
                      <tr :key="index">
                        <td>{{ item.workDate }}</td>
                        <td>{{ item.unitDtstId }}</td>
                        <td>{{ item.totalCnt }}</td>
                        <td>
                          <button
                            type="button"
                            @click="onShowDatasetDetail(item)"
                          >
                            상세보기
                          </button>
                        </td>
                        <td>
                          <button type="button" @click="onDelDataset(item)">
                            삭제
                          </button>
                        </td>
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
          <div class="clmBox" v-show="!isDtl">
            <h1 class="ti-s">라벨링 클라스별 데이터 현황</h1>
            <div class="clm-body4">
              <!-- chart Area [S]-->
              <div id="chart-localData2"></div>
              <!-- chart Area [E]-->
            </div>
          </div>
          <div class="clmBox" v-show="isDtl">
            <div class="clm-body4">
              <div class="table-l1 tb-op1 tb-ov1">
                <table class="tx-c">
                  <thead>
                    <tr>
                      <th class="tx-c">생성일자</th>
                      <th class="tx-c">통합데이터셋ID</th>
                      <th class="tx-c">단위데이터셋 개수</th>
                      <th class="tx-c">학습데이터 개수</th>
                      <!-- <th class="tx-c">삭제</th> -->
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(item, index) in dataListDtl">
                      <tr :key="index" @click="onListClick(item)">
                        <td>{{ item.workDate }}</td>
                        <td>{{ item.combDtstId }}</td>
                        <td>{{ item.unitDtstCnt }}</td>
                        <td>{{ item.totalCnt }}</td>
                        <!-- <td><button type="button">삭제</button></td> -->
                      </tr>
                    </template>
                    <tr v-if="data.length == 0">
                      <td colspan="7">조회된 데이터가 없습니다.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <pagination
                :pageInfo="pageInfo"
                @pagination="(p) => onSearchDtl(p.pageNo)"
              />
            </div>
          </div>

          <!-- 우측 컨텐츠영역 -->
          <div class="clmBox" v-show="isDtl">
            <div class="clm-body4">
              <div class="table-l1 tb-op1 tb-ov1">
                <div
                  style="
                    position: relative;
                    overflow: hidden;
                    width: 536px;
                    height: 300px;
                  "
                >
                  <!-- <img
                    v-if="isDtl"
                    :src="`/v1/api/crgw-img/data?workDate=${clickItem.workDate}&workNo=${clickItem.workNo}`"
                    width="536px;"
                  /> -->
                  <!--조인해서 workNo를 가져오면 됩니다.-->

                  <!--왼쪽 테이블이 클릭시 DB붙히고 위에 방법으로 하시면 됩니다.-->
                  <img
                    v-if="isDtl"
                    src="/v1/api/crgw-img/data?workDate=2022-07-21&workNo=00000150"
                    width="536px;"
                  />
                </div>
              </div>
              <!-- 생성버튼 -->
              <button
                type="button"
                id="newConbBtn"
                class="btn btn-sz2 btn-gn newConbBtn"
                @click="isDtl = false"
              >
                뒤로가기
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
import { IPageInfoModel } from "~/models/common-model";
import commonService from "~/service/common-service";
import * as echarts from "echarts";
import { comma } from "~/utils/common";
import dtl from "./22.vue";
@Component({ components: { Layout, dtl } })
export default class extends Vue {
  dataList = {};
  dataListDtl = {};
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  pageInfoDtl: IPageInfoModel = commonService.getPageInitInfo();
  search = {
    unitDtstType: "A",
    unitDtstNm: "번호판",
    ordfield: "work_dttm",
    order: "ASC",
  };

  searchDtl = {
    unitDtstType: "A",
    unitDtstNm: "번호판",
    ordfield: "work_dttm",
    order: "ASC",
  }; //상세검색조건 수정하셔서 사용
  code: any = {};
  data: any = {};
  clickItem: any = {};
  isDtl = false;
  async codeInfo() {
    const codeList = await commonService.request(
      ["NGTP"],
      "/api/common/code/list"
    );
    console.log("===>code==>", codeList);
    this.code = codeList;
  }
  async dataInfo(code) {
    const data = await commonService.request({ code }, "/api/dtst/unit/info");
    console.log("data===", data);
    this.data = data;

    await this.onSearch(1);
  }
  async onSetStdDtst() {
    console.log("설정저장.");
    await commonService.request(
      { stdDtstCnt: this.data.stdDtstCnt },
      "/api/dtst/unit/save/stddtst"
    );
  }
  async onCreateDataset() {
    if (
      await this.$confirm(
        "현재까지 확정된 데이터로 단위데이터 셋을 생성하시겠습니까?"
      )
    ) {
      console.log("데이터 셋 생성");
      await commonService.request({}, "/api/dtst/unit/new/dataset");
      await this.onSearch(1);
    }
  }
  async onShowDatasetDetail(item) {
    console.log(item);
    // 서버에서 상세 데이터 가져오기
    this.searchDtl = { ...this.searchDtl, ...item };
    this.onSearchDtl(1);

    this.isDtl = true;
  }
  async onDelDataset(item) {
    console.log(item);
  }
  async onSearchTopMenu(item) {
    console.log("onSearchTopMenu...");
    const search = {
      ...this.search,
      unitDtstType: item.cmmnCd,
      unitDtstNm: item.cmmnCdNm,
    };
    this.dataInfo(item.cmmnCd);
    this.search = search;
  }
  comma(num) {
    return comma(num);
  }
  async mounted() {
    await this.codeInfo();
    await this.dataInfo(this.search.unitDtstType);
    await this.init();
  }
  init() {
    const labelList = this.data.labelList;
    const labelClassDataList = this.data.labelClassDataList;
    var dom = document.getElementById("chart-localData");
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
        // text: "라벨링데이터 현황",
        subtext: "총 " + comma(this.data.sum) + " 개",
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
          data: [...labelList.map((v) => ({ value: v.cnt, name: v.name }))],
        },
      ],
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);
    }

    window.addEventListener("resize", myChart.resize);

    var dom2 = document.getElementById("chart-localData2");
    var myChart2: any = echarts.init(dom2, null, {
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
        data: labelClassDataList.map((v) => v.code),
      },
      series: [
        {
          // name: '2012',
          type: "bar",
          data: labelClassDataList.map((v) => v.cnt),
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
      { ...this.search, ...newpage },
      "/api/unit-dtst/list"
    );
    newpage.totalCount = data.page.totalCount;
    this.dataList = data.list;
    this.pageInfo = { ...newpage };
  }
  async onSearchDtl(pageNo: number) {
    const newpage = { ...this.pageInfoDtl, pageNo };
    const data = await commonService.request(
      { ...this.searchDtl, ...newpage },
      "/api/unit-dtst/list/id"
    );
    newpage.totalCount = data.page.totalCount;
    if (data.list && data.list.length > 0) {
      this.clickItem = data.list[0];
    }
    this.dataListDtl = data.list;
    this.pageInfoDtl = { ...newpage };
  }
  onListClick(item: any) {
    this.clickItem = item;
  }
  created() {
    this.onSearch(1);
  }
}
</script>
<style scoped></style>
