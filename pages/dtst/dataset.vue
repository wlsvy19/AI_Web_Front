<template>
  <div class="clmFlex mt15">
    <!-- step1. [S] -->
    <div class="newEngin-l" style="padding: 0px">
      <fieldset>
        <legend>정렬영역</legend>
        <label for="sel002" class="sl-nm">데이터 셋:</label>
        <select
          id="sel002"
          class="select"
          v-model="hdqrNm"
          @change="onSearch(1)"
        >
          <option value="">전체</option>
          <option value="수도권">수도권</option>
        </select>
        <button
          style="margin-left: 250px"
          type="button"
          class="btn btn-sz1 btn-gnc"
          @click="onSelectDataSet()"
        >
          선택담기
        </button>
      </fieldset>

      <div class="table-l1 mt15">
        <table style="display: block; overflow-y: auto; height: 500px">
          <colgroup>
            <col width="50" />
            <col width="50" />
            <col width="90" />
            <col width="100" />
            <col width="*" />
            <col width="*" />
            <col width="60" />
          </colgroup>
          <thead>
            <tr>
              <th>
                <span class="chkbox2">
                  <input
                    type="checkbox"
                    id="th001"
                    v-model="checked"
                    @change="checkAll"
                  />
                  <label for="th001" class="th_chk"></label>
                </span>
              </th>
              <th>데이터셋 종류</th>
              <th>ID</th>
              <th>데이터셋 유형</th>
              <th>데이터셋 개수</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in serverList">
              <tr :key="index">
                <td class="tx-c">
                  <span class="chkbox2">
                    <input
                      type="checkbox"
                      :id="`ch00` + index"
                      v-model="item.chked"
                    />
                    <label :for="`ch00` + index"></label>
                  </span>
                </td>
                <td class="tx-c">{{ item.hdqrNm }}</td>
                <td class="tx-c">{{ item.exlprNum }}</td>
                <td class="tx-c">{{ item.vmIp }}</td>
                <td class="tx-c">{{ item.crntWeightVer }}</td>
              </tr>
            </template>
            <tr v-if="serverList.length === 0">
              <td class="tx-c" colspan="7">검색된 기록이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <pagination
        :pageInfo="pageInfo"
        @pagination="(p) => onSearch(p.pageNo)"
      />
    </div>
    <!-- step2. [E] -->

    <!-- step3. [S] -->
    <div class="newEngin-r" style="margin-top: 20px">
      <!-- <h1 class="ti-s">신규 가중치 셋</h1>

      <fieldset class="newWeight flex flex-btw">
        <legend>정렬영역</legend>
        <label for="sel002" class="sch-id">선택된 가중치 셋</label>
        <input type="text" class="inp ml5" v-model="selDataset" />
        <button
          type="button"
          class="btn btn-sz1 btn-gnc"
          @click="onShowPop(true)"
        >
          선택
        </button>
      </fieldset> -->

      <div class="table-l1 mt15">
        <table>
          <colgroup>
            <col width="50%" />
            <col width="50%" />
          </colgroup>
          <thead>
            <tr>
              <th>유형</th>
              <th>가중치ID</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in selDatasets">
              <tr :key="index">
                <td class="tx-c" :key="index">{{ item.hdqrNm }}</td>
                <td class="tx-c">{{ item.vmIp }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <!-- <div class="udt-btn">
        <button type="button" id="btn-update" class="btn-bg-gn">
          업데이트
        </button>
      </div> -->
    </div>
    <!-- step3. [E] -->
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import { IPageInfoModel } from "~/models/common-model";
import commonService from "~/service/common-service";
@Component({ components: { Layout } })
export default class extends Vue {
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  showPop = false;
  checked = false;
  serverList = [];
  hdqrNm = "";
  selDatasets = [
    { hdqrNm: "번호판 탐색3", vmIp: "WP-003" },
    { hdqrNm: "번호판 탐색4", vmIp: "WP-004" },
  ];
  dsList = [];
  selDataset = "";
  onShowPop(show) {
    this.showPop = show;
  }
  checkAll() {
    this.serverList = this.serverList.map((v) => {
      return { ...v, chked: this.checked };
    });
  }
  async datasetList() {
    const data = await commonService.request(
      { weightType: "ALL" },
      "/api/algo-info/list"
    );
    console.log(data);
    this.dsList = data;
  }
  created() {
    this.onSearch(1);
    this.datasetList();
  }
  onSelItem(item) {
    this.selDataset = item.algoVer;
    this.showPop = false;
  }
  async onSelectDataSet() {
    console.log("select dataset");
    console.log(this.serverList);
    const selDs = this.serverList.filter((v) => v.chked);
    if (selDs.length < 1) return await this.$alert("데이터 셋을 선택하세요.");
    const sds = this.selDatasets;
    for (const item of selDs) {
      const len = sds.filter((v) => v.vmIp === item.vmIp).length;
      console.log("len", len);
      if (len < 1) this.selDatasets = [...this.selDatasets, item];
    }
  }
  async onSearch(pageNo: number) {
    const newpage = { ...this.pageInfo, pageNo };
    const hdqrNm = this.hdqrNm;
    const data = await commonService.request(
      { startDate: "", endDate: "", ...newpage, hdqrNm },
      "/api/updt/list"
    );
    newpage.totalCount = data.page.totalCount;
    this.serverList = data.list;
    this.pageInfo = { ...newpage };
  }
}
</script>
<style scoped></style>
