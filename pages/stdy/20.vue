<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top flex flex-btw">
          <h2 class="ti wid2p">학습이력 조회</h2>
          <div class="wid8p tx-r">
            <fieldset class="s-fm">
              <legend>검색영역</legend>
              <!-- <span>학습 시작 시간</span>
              <el-date-picker v-model="search.startDate" type="date">
              </el-date-picker>
              <span class="ml5 mr5">~</span>
              <el-date-picker v-model="search.endDate" type="date">
              </el-date-picker> -->
              <label for="sel002" class="sl-nm">엔진 종류</label>
              <select
                id="sel002"
                class="select"
                @change="onSearch(1)"
                v-model="search.combDtstType"
              >
                <option value="">전체</option>
                <template v-for="(item, index) in code.NGTP">
                  <option :key="index" :value="item.cmmnCd">
                    {{ item.cmmnCdNm }}
                  </option>
                </template>
              </select>
              <button
                @click="onSearch(1)"
                type="button"
                class="btn btn-sz2 btn-gn fc1 mr25 ml30"
              >
                조회
              </button>
            </fieldset>
          </div>
        </div>
      </div>

      <div id="conts" class="conts-box1">
        <div class="mt15">
          <div class="">
            <div class="table-l1 tb-op1 tb-ov1">
              <table class="tx-c">
                <thead>
                  <tr>
                    <th>
                      <span class="sort" @click="onOrder('start_dttm')"
                        >학습 시작 시간</span
                      >
                    </th>
                    <th>
                      <span class="sort" @click="onOrder('end_dttm')"
                        >학습 종료 시간</span
                      >
                    </th>
                    <th>엔진 종류</th>
                    <th>학습데이터 셋</th>
                    <th>
                      <span class="sort" @click="onOrder('learn_dtst_cnt')"
                        >학습데이터 개수</span
                      >
                    </th>
                    <th>
                      <span class="sort" @click="onOrder('bset_weight')"
                        >Best 가중치</span
                      >
                    </th>
                    <th>
                      <span class="sort" @click="onOrder('map')">mAP</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in data">
                    <tr :key="index">
                      <td>{{ item.startDttm }}</td>
                      <td>{{ item.endDttm }}</td>
                      <td>{{ codeName(item.learnDtstType) }}</td>
                      <td>{{ item.learnDtstId }}</td>
                      <td>{{ comma(item.learnDtstCnt) }}</td>
                      <td>{{ item.bestWeight }}</td>
                      <td>{{ item.map }}</td>
                    </tr>
                  </template>
                  <tr v-if="data.length == 0">
                    <td colspan="7">조회된 데이터가 없습니다.</td>
                  </tr>
                </tbody>
              </table>
              <pagination
                :pageInfo="pageInfo"
                @pagination="(p) => onSearch(p.pageNo)"
              />
              <!-- sort layer popup open 
                                class open-lay-sort add -->
              <div class="lay-tb-sort">
                <ul>
                  <li><span>오름차순</span></li>
                  <li><span>내림차순</span></li>
                </ul>
              </div>
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
@Component({ components: { Layout } })
export default class extends Vue {
  data = {};
  code = {};
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  search = {
    combDtstType: "",
    startDate: "",
    endDate: "",
    ordfield: "start_dttm",
    order: "ASC",
  };
  async onSearch(pageNo: number) {
    const newpage = { ...this.pageInfo, pageNo };
    const data = await commonService.request(
      { ...this.search, ...newpage },
      "/api/learn-history/list"
    );
    newpage.totalCount = data.page.totalCount;
    this.data = data.list;
    this.pageInfo = { ...newpage };
  }

  onOrder(field) {
    const search = { ...this.search };
    if (search.ordfield === field) {
      search.order = search.order == "ASC" ? "DESC" : "ASC";
    } else {
      search.ordfield = field;
      search.order = "ASC";
    }
    this.search = search;
    this.onSearch(1);
  }
  codeName(cd) {
    const codes = (this.code as any).NGTP || [];
    if (codes.length === 0) return "";
    const ss = codes.filter((v) => v.cmmnCd === cd);
    if (ss.length > 0) return ss[0].cmmnCdNm;
    return "";
  }
  async codeList() {
    const codeList = await commonService.request(
      ["NGTP"],
      "/api/common/code/list"
    );
    this.code = codeList;
  }
  comma(num) {
    return comma(num);
  }
  created() {
    this.codeList();
    this.onSearch(1);
  }
}
</script>
<style scoped>
.input-class {
  width: 150px;
}
</style>
