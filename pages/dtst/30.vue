<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top">
          <h2 class="ti">통합데이터 셋 관리</h2>
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
              <li><button type="button">꺾임/회손</button></li>
              <li><button type="button">스미어/비차량</button></li>
            </ul>
          </div>

          <!-- 좌측 컨텐츠영역 -->
          <div class="clmBox">
            <div class="clm-body4">
              <!-- chart -->
              <div id="combine-chart"></div>

              <!-- <div class="table-l1">
                <table>
                  <thead>
                    <tr>
                      <th>생성 일자</th>
                      <th>통합데이터셋ID</th>
                      <th>단위데이터 셋 개수</th>
                      <th>데이터 개수</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c"><button type="button">삭제</button></td>
                    </tr>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c"><button type="button">삭제</button></td>
                    </tr>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c"><button type="button">삭제</button></td>
                    </tr>
                  </tbody>
                </table>
              </div> -->
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
                  <template v-for="(item, index) in data">
                    <tr :key="index">
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

              <!-- <div class="paging mt40">
                <a href="#">맨처음</a>
                <a href="#">이전</a>
                <a href="#">1</a>
                <a href="#">2</a>
                <strong>3</strong>
                <a href="#">4</a>
                <a href="#">다음</a>
                <a href="#">맨마지막</a>
              </div> -->
              <pagination
                :pageInfo="pageInfo"
                @pagination="(p) => onSearch(p.pageNo)"
              />
            </div>
          </div>

          <!-- 우측 컨텐츠영역 -->
          <div class="clmBox">
            <div class="clm-body4">
              <!-- <div class="table-l1 mt50">
                <table>
                  <thead>
                    <tr>
                      <th>생성 시간</th>
                      <th>단위데이터 셋 ID</th>
                      <th>유형</th>
                      <th>데이터 개수</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">P1</td>
                      <td class="tx-c">WP-004</td>
                    </tr>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">P1</td>
                      <td class="tx-c">WP-004</td>
                    </tr>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                      <td class="tx-c">P2</td>
                      <td class="tx-c">WP-004</td>
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
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in data2">
                    <tr :key="index">
                      <td>{{ item.workDate }}</td>
                      <td>{{ item.unitDtstId }}</td>
                      <td>{{ item.totalCnt }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
              </div>
              <pagination
                :pageInfo="pageInfo2"
                @pagination="(p) => onSubSearch(p.pageNo)"
              />

              <!-- 준공검사 -->
              <!-- 생성버튼 -->
              <button
                type="button"
                id="newConbBtn"
                class="btn btn-sz2 btn-gn newConbBtn"
              >
                생성하기
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
import { comma } from "~/utils/common";
import * as echarts from "echarts";
@Component({ components: { Layout } })
export default class extends Vue {
  data = {};
  data2 = {};
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
    search = {
    combDtstType: "A",
    ordfield: "work_dttm",
    order: "ASC",
  }
  pageInfo2: IPageInfoModel = commonService.getPageInitInfo();
    search2 = {
    combDtstId: "TD-20220720-001",
    ordfield: "work_dttm",
    order: "ASC",
  }
  mounted() {
    this.init();
  }
  init() {
    var el = document.querySelector(".newConbBtn");
    var dimmed = document.querySelector(".mask");
    var pop1 = document.querySelector(".pop1");

    var target_el;

    el.addEventListener("click", function () {
      openLayerPopup();
    });

    // chart area
    var dom = document.getElementById("combine-chart");
    var myChart: any = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });

    var option;

    option = {
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
  }
  async onSearch(pageNo: number) {
    const newpage = { ...this.pageInfo, pageNo };
    const data = await commonService.request(
      { ...this.search, ...newpage },
      "/api/comb-dtst/list"
    );
    newpage.totalCount = data.page.totalCount;
    this.data = data.list;
    this.pageInfo = { ...newpage };
  }
  async onSubSearch(pageNo: number) {
    const newpage2 = { ...this.pageInfo2, pageNo };
    const data2 = await commonService.request(
      { ...this.search2, ...newpage2, },
      "/api/unit-dtst/list/id"
    );
    newpage2.totalCount = data2.page.totalCount;
    this.data2 = data2.list;
    this.pageInfo2 = { ...newpage2 };
  }
  created() {
    this.onSearch(1);
    this.onSubSearch(1);
  }
}
</script>
<style scoped></style>
