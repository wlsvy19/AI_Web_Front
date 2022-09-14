<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top flex flex-btw">
          <h2 class="ti wid6p">
            {{ ((currentMenu || {}).subMenu || {}).MENU_NM }}
          </h2>
          <!-- 준공검사 주석 -->
          <el-date-picker
            v-model="search.workDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="검색날짜"
          >
          </el-date-picker>
          <div class="wid4p tx-r">
            <label for="sel002" class="sl-nm">유형</label>
            <select id="sel002" class="select" v-model="search.learnDtstType">
              <option value="">선택</option>
              <template v-for="(item, index) in code.NMRECG_CD">
                <option :value="item.cmmnCd" :key="index">
                  {{ item.cmmnCdNm }}
                </option>
              </template>
            </select>
            <!-- <label for="sel002" class="sl-nm">엔진 종류</label>
            <select id="sel002" class="select" v-model="search.learnDtstType">
              <option value="">선택</option>
              <template v-for="(item, index) in code.NGTP">
                <option :value="item.cmmnCd" :key="index">
                  {{ item.cmmnCdNm }}
                </option>
              </template>
            </select> -->
            <button
              type="button"
              class="btn btn-sz2 btn-gn fc1 mr25"
              @click="onSearch(1)"
            >
              조회
            </button>
          </div>
        </div>
      </div>

      <div class="clmFlex clmBox-col3 mt15">
        <!-- 영상학습 목록 [S] -->
        <div class="vod-l">
          <h1 class="ti-s">
            목록
            <span>
              <button class="btn btn-gn" @click="onSearch(pageInfo.pageNo - 1)">
                이전
              </button>
              <button class="btn btn-gn" @click="onSearch(pageInfo.pageNo + 1)">
                다음
              </button>
            </span>
          </h1>
          <div class="table-l1 tb-op1 tb-ov1">
            <table>
              <colgroup>
                <col width="50%" />
                <col width="50%" />
              </colgroup>
              <thead>
                <tr>
                  <th>영상 ID</th>
                  <th>확정여부</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in imgDataList">
                  <tr
                    :key="index"
                    @click="onSelImg(item.workDate, item.workNo, item, index)"
                    :class="sel1 === item.workNo ? 'active' : ''"
                  >
                    <td
                      class="tx-c"
                      :style="`background-color: ${
                        item.delYn === 'Y' ? '#aaa' : ''
                      }`"
                    >
                      {{ item.workNo }}
                    </td>
                    <td
                      class="tx-c"
                      :style="`background-color: ${
                        item.delYn === 'Y' ? '#aaa' : ''
                      }`"
                    >
                      <span class="chkbox">
                        <input
                          type="checkbox"
                          :id="'ch00' + index"
                          name=""
                          disabled
                          :checked="item.dtrmYn === 'Y'"
                        />
                        <label for="ch001"></label>
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 영상학습 목록 [E] -->

        <!-- 영상학습 영상 [S] -->
        <div class="vod-c">
          <!-- <div class="vod-ctlBox"> -->
          <!-- 엔진종류 콤보박스 -->
          <!-- <label for="sel002" class="sl-nm">엔진 종류</label>
            <select id="sel002" class="select" v-model="search.learnDtstType">
              <option value="">선택</option>
              <template v-for="(item, index) in code.NGTP">
                <option :value="item.cmmnCd" :key="index">
                  {{ item.cmmnCdNm }}
                </option>
              </template>
            </select>
          </div> -->
          <div class="vod-box">
            <!-- <img
              width="100%"
              height="100%"
              v-if="selImg != ''"
              :src="`/v1/api/crgw-img/data?workDate=${selDate}&workNo=${selImg}`"
            /> -->
            <image-bright
              :url="`/v1/api/crgw-img/data?workDate=${selDate}&workNo=${selImg}`"
            />
          </div>

          <div class="vod-btn tx-c">
            <template v-if="selIndex >= 0">
              <button
                type="button"
                class="btn btn-sz3 btn-gnc"
                @click="updateDel('Y')"
                v-if="selItem.delYn !== 'Y'"
              >
                삭제
              </button>
              <button
                type="button"
                @click="updateDel('N')"
                class="btn btn-sz3 btn-bg-gw"
                v-else
              >
                삭제 취소
              </button>
            </template>
          </div>
        </div>
        <!-- 영상학습 영상 [E] -->

        <!-- 영상학습 결과 [S] -->
        <!-- 필독 사이즈 변동있으면 연락주세요!! -->
        <div class="vod-r">
          <h2 class="ti-s mb10">엔진 분류 결과</h2>
          <div class="vod-result">
            {{ codeNm(selItem.nmrecgCd) }}
          </div>

          <div class="tx-c" @click="onShowPop(true)" style="cursor: pointer">
            <span class="cl-v">유형별 설명보기</span>
          </div>

          <h2 class="ti-s mb10">사용자 확정유형</h2>
          <fieldset class="s-fm">
            <legend>분류 결과 콤보박스</legend>
            <label for="sel001" class="hidden">분류 결과</label>
            <!-- <div class="lb-chc-box as-area1"> -->
            <div class="lb-chc-box as-area">
              <template v-for="(item, index) in code.NMRECG_CD">
                <input
                  @click="onClickBtn(item.cmmnCd)"
                  :key="index"
                  type="radio"
                  name=""
                  :id="'c0' + index"
                  class="lb-chc"
                  :checked="item.checked"
                />
                <label :key="'aa' + index" :for="'c0' + index">{{
                  item.cmmnCdNm
                }}</label>
              </template>
            </div>
            <!-- <select id="sel001" class="select2" v-model="selItem.newNmrecgCd">
              <option value="">선택</option>
              <template v-for="(item, index) in code.NMRECG_CD">
                <option :value="item.cmmnCd" :key="index">
                  {{ item.cmmnCdNm }}
                </option>
              </template>
            </select> -->
          </fieldset>

          <!-- 팝업오픈 이벤트 걸려 있음 -->
          <div class="confm-btn">
            <button
              v-if="selIndex >= 0"
              type="button"
              id="btn-classClose"
              class="btn-bg-gn"
              @click="onOk(selItem.dtrmYn === 'Y' ? 'N' : 'Y')"
            >
              {{ selItem.dtrmYn === "Y" ? "미확정" : "확정" }}
            </button>
          </div>
        </div>
        <!-- 영상학습 결과 [E] -->
      </div>
    </div>
    <!-- 팝업 [S] -->
    <div
      v-if="showPop"
      id="pop1"
      ref="pop"
      class="popup pop1"
      :style="`display:block;left:30%`"
    >
      <h1>미·오인식 유형별 샘플</h1>

      <div class="thumList-l2 pop-body scl">
        <ul class="flex">
          <template v-for="(item, index) in code.NMRECG_CD">
            <li :key="index">
              <figure>
                <img
                  :src="`/v1/api/sample-info/data?grpCd=NMRECG_CD&cmmnCd=${item.cmmnCd}`"
                  :alt="item.cmmnCdNm"
                  width="177"
                  height="132"
                />
              </figure>
              <strong class="thm-name">{{ item.cmmnCdNm }}</strong>
            </li>
          </template>
        </ul>
      </div>

      <button type="button" class="pop-close" @click="onShowPop(false)">
        닫기
      </button>
    </div>
    <!-- 팝업 [E] -->

    <div
      v-if="showPop"
      class="mask"
      @click="showPop = false"
      style="display: block"
    ></div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import { IPageInfoModel } from "~/models/common-model";
import commonService from "~/service/common-service";
import { notification } from "~/utils/common";
import ImageBright from "~/components/ImageBright.vue";
@Component({ components: { Layout, ImageBright } })
export default class extends Vue {
  selDate = "";
  sel1 = "";
  selIndex = -1;
  selItem: any = {};
  showPop = false;
  show1 = "";
  imgDataList = [];
  selImg = "";
  currentMenu: any = {};
  code: any = {};
  dataset: any = { learnDtstType: "" };
  search: any = { workDate: "", learnDtstType: "" };
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  async created() {
    this.currentMenu = this.$store.state.currentMenu;
    await this.codeList();
    await this.onSearch(1);
    await this.onNext(0);
  }
  mounted() {
    const dataset = commonService.getDataset();
    if (dataset) this.dataset = dataset;
    console.log("dataset", this.dataset);
    document.addEventListener("keyup", this.onKeyup);
  }
  destroyed() {
    document.removeEventListener('keyup', this.onKeyup);
  }
  onSelImg(workDate, workNo, item, index) {
    this.selDate = workDate;
    this.sel1 = workNo;
    this.selImg = workNo;
    this.selItem = item;
    this.selIndex = index;
    this.code.NMRECG_CD = this.code.NMRECG_CD.map((v) => ({
      ...v,
      // checked: v.cmmnCd === item.nmrecgCd,
      checked:
        v.cmmnCd ===
        (item.dtrmNmrecgCd === "" || item.dtrmNmrecgCd === null
          ? item.nmrecgCd
          : item.dtrmNmrecgCd),
    }));
  }
  onShowPop(show) {
    this.showPop = show;
  }
  async onSearch(pageNo) {
    if (pageNo < 1) pageNo = 1;
    const newpage = { ...this.pageInfo, pageNo };
    const data = await commonService.request(
      {
        searchDate: this.search.workDate,
        ...this.search,
        ...newpage,
      },
      "/api/crgw-img-data/list"
    );
    console.log(data);
    const imgList = data.list;
    this.pageInfo = { ...data.page };
    this.imgDataList = imgList.map((v) => ({ ...v, newNmrecgCd: v.nmrecgCd }));
    if (imgList.length === 0) {
      this.selIndex = -1;
      this.selItem = {};
      this.initCode();
    } else {
      await this.onNext(0);
    }
  }
  initCode() {
    this.code.NMRECG_CD = this.code.NMRECG_CD.map((v) => ({
      ...v,
      checked: false,
    }));
  }
  async codeList() {
    const codeList = await commonService.request(
      ["NMRECG_CD", "NGTP"],
      "/api/common/code/list"
    );
    this.code = codeList;
  }
  onClickBtn(cd) {
    console.log(cd);
    this.selItem.newNmrecgCd = cd;
    this.code.NMRECG_CD = this.code.NMRECG_CD.map((v) => ({
      ...v,
      checked: v.cmmnCd === cd,
    }));
  }
  async onNext(index) {
    if (index < this.imgDataList.length) {
      console.log(index);
      const selItem = this.imgDataList[index];
      console.log(selItem);
      this.onSelImg(selItem.workDate, selItem.workNo || "", selItem, index);
    } else {
    }
  }
  onKeyup(event) {
    console.log(event);
    if (event.key === "Enter") {
      this.onOk(this.selItem.dtrmYn === "Y" ? "N" : "Y");
    } else if (event.key === "PageDown") {
      this.onNextImage();
    } else if (event.key === "PageUp") {
      this.onBeforeImage();
    } else if (event.key === "Delete") {
      if (this.selItem.delYn !== "Y") {
        this.updateDel("Y");
      } else {
        this.updateDel("N");
      }
    }
  }
  async onOk(dtrmYn) {
    const item = this.selItem;
    if (!item.newNmrecgCd) {
      notification("확정유형을 선택하세요.");
      return;
    } else {
      item.dtrmYn = dtrmYn;
      await commonService.request(
        {
          workDate: item.workDate,
          workNo: item.workNo,
          nmrecgCd: dtrmYn === "N" ? "" : item.newNmrecgCd,
          dtrmYn,
        },
        "/api/crgw-img-data/save"
      );
      this.$util.notification("처리완료");
      this.selItem.nmrecgCd = item.newNmrecgCd;
      if (dtrmYn === "Y") {
        this.onNextImage();
      }
    }
  }
  async onBeforeImage() {
    if (this.selIndex - 1 > 0) {
      this.onNext(this.selIndex - 1);
    } else {
      const pageNo = this.pageInfo.pageNo;
      this.selIndex = 0;
      await this.onSearch(pageNo - 1);
      this.onNext(9);
    }
  }
  async onNextImage() {
    if (this.selIndex + 1 < this.imgDataList.length) {
      this.onNext(this.selIndex + 1);
    } else {
      const pageNo = this.pageInfo.pageNo;
      this.selIndex = 0;
      await this.onSearch(pageNo + 1);
      this.onNext(0);
    }
  }
  async updateDel(delYn) {
    if (this.selIndex < 0) return alert("선택하세요.");
    const item = this.selItem;
    await commonService.request(
      {
        workDate: item.workDate,
        workNo: item.workNo,
        delYn: delYn,
      },
      "/api/crgw-img-data/del"
    );
    item.delYn = delYn;
    // alert("완료");
    this.onNext(this.selIndex + 1);
  }
  codeNm(cd) {
    const cds = this.code.NMRECG_CD || [];
    if (cds.lenght === 0) return "";
    const cds1 = cds.filter((v) => v.cmmnCd === cd);
    if (cds1.length === 0) return "";
    return cds1[0].cmmnCdNm;
  }
}
</script>
<style scoped></style>
