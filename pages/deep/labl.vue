<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top flex flex-btw">
          <h2 class="ti wid6p">
            {{ ((currentMenu || {}).subMenu || {}).MENU_NM }}
          </h2>

          <!-- <label for="sel002" class="sl-nm" style="width: 50px">유형</label>
            <select id="sel002" class="select" v-model="search.nmrecgCd">
              <option value="">전체</option>
              <template v-for="(item, index) in code.NMRECG_CD">
                <option :value="item.cmmnCd" :key="index">
                  {{ item.cmmnCdNm }}
                </option>
              </template>
            </select> -->
          <!-- 준공검사 주석 -->
          <!-- <template v-if="pageType === '차량번호'">
            <label for="sel002" class="sl-nm" style="width: 100px"
              >포함 숫자</label
            >
            <select id="sel002" class="select" v-model="search.withNum">
              <option value="">전체</option>
              <template v-for="(item, index) in code.CAR_NUM_BTN">
                <option
                  v-if="item.dataType === 'NUM'"
                  :value="item.cmmnCd"
                  :key="index"
                >
                  {{ item.cmmnCdNm }}
                </option>
              </template>
            </select>
            <label for="sel002" class="sl-nm" style="width: 100px"
              >포함 문자</label
            >
            <select id="sel002" class="select" v-model="search.withChar">
              <option value="">전체</option>
              <template v-for="(item, index) in code.CAR_NUM_BTN">
                <option
                  v-if="item.dataType === 'CHAR'"
                  :value="item.cmmnCd"
                  :key="index"
                >
                  {{ item.cmmnCdNm }}
                </option>
              </template>
            </select>
          </template> -->

          <div class="wid4p tx-r">
            <legend>검색영역</legend>
            <!-- 준공검사 주석 -->
            <!-- <template v-if="pageType === '번호판' || true">
              <label for="sel002" class="sl-nm">유형</label>
              <select id="sel002" class="select" v-model="search.nmrecgCd">
                <option value="">전체</option>
                <template v-for="(item, index) in code.NMRECG_CD">
                  <option :value="item.cmmnCd" :key="index">
                    {{ item.cmmnCd }}-{{ item.cmmnCdNm }}
                  </option>
                </template>
              </select>
            </template>
            <button
              type="button"
              class="btn btn-sz2 btn-gn fc1 mr25 ml30"
              @click="onSearch(1)"
            >
              조회
            </button> -->
          </div>
        </div>
      </div>

      <div class="clmFlex clmBox-col3 mt15">
        <!-- 영상학습 목록 [S] -->
        <div class="vod-l">
          <div class="view-mini mb25">
            <figure>
              <img
                v-if="pageType === '꺾임' && selImg != '' && selImg != null"
                alt="번호판 이미지"
                width="152"
                height="88"
                :src="`/v1/api/incn-img/data?workDate=${selDate}&workNo=${selImg}`"
              />
              <img
                v-else-if="
                  pageType === '차량번호' && selImg != '' && selImg != null
                "
                alt="번호판 이미지"
                width="152"
                height="88"
                :src="`/v1/api/plate-img/data?workDate=${selDate}&workNo=${selImg}`"
              />
              <img
                v-else-if="selImg != '' && selImg != null"
                alt="번호판 이미지"
                width="152"
                height="88"
                :src="`/v1/api/crgw-img/data?workDate=${selDate}&workNo=${selImg}`"
              />
            </figure>
          </div>

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
          <div class="labeling-viewBox">
            <div class="label-v-info">
              영상ID: <span>{{ selItem.workNo }}</span> 미·오인식 유형:
              <span>{{ codeNm(selItem.nmrecgCd) }}</span> 촬영일시:
              <span>{{ selItem.shootDttm }}</span> 촬영장소:
              <span>{{ selItem.tolofNm }}</span>
            </div>
            <div class="label-v-ctl">
              <div class="flex lb-btn">
                <button
                  type="button"
                  class="bt-lb-potin"
                  @click="setSelection()"
                  :style="selectPointBtn ? 'background-blend-mode: multiply;' : ''"
                >
                  선택
                </button>
                <button
                  v-if="pageType === '빛' || pageType === '꺾임'"
                  type="button"
                  title="폴리곤"
                  @click="setLabel('polygon')"
                  style="background-image: url(/images/bt_lb_area.jpeg)"
                  class="bt-lb-area"
                  :style="selectLabelBtn ? 'background-blend-mode: multiply;' : ''"
                >
                  폴리곤
                </button>
                <button
                  v-else
                  type="button"
                  title="사각형"
                  @click="setLabel('rect')"
                  class="bt-lb-area"
                  :style="selectLabelBtn ? 'background-blend-mode: multiply;' : ''"
                >
                  사각형
                </button>
                <!-- <button @click="add('rect', 'test1111')">add</button>
                <button @click="onRemoveLabel()">삭제</button>
                <button @click="fun1()">data</button> -->
              </div>
              <div class="lb-keyst" v-if="false">단축키: <span>역광</span></div>
            </div>

            <div class="label-view">
              <figure>
                <!-- <div id="img-view" style="width: 800px; height: 462px"></div> -->
                <!-- <img src="/images/vi_ex.jpg" width="800" height="462" alt="" /> -->
                <!-- <image-bright
                  id="img-view"
                  :url="url"
                  style="width: 800"
                ></image-bright> -->
                <input
                  style="display: none"
                  type="range"
                  max="255"
                  min="-255"
                  :value="lightValue"
                  id="brightI"
                  @mouseup="brightnessAdjustment()"
                />
                <div id="img-view" style="width: 800px">
                  <!-- <img
                    width="100%"
                    height="100%"
                    v-if="selImg != ''"
                    :src="`/v1/api/crgw-img/data?workNo=${selImg}`"
                  /> -->
                </div>
              </figure>
            </div>
            <div class="label-bntBox">
              <div class="label-bntBox-l">
                <!-- 준공검사 주석 -->
                <!-- <button type="button" class="bt-ctl-op">
                  <em class="bt-up"></em>
                </button>
                <span id="label-opt" class="label-opt">밝기B</span>
                <button type="button" class="bt-ctl-op">
                  <em class="bt-dw"></em>
                </button> -->
                <button
                  type="button"
                  class="bt-ctl-op"
                  @click="onUpDown('DOWN')"
                >
                  <em class="bt-up"></em>
                </button>
                <span id="label-opt" class="label-opt">밝기B</span>
                <button type="button" class="bt-ctl-op" @click="onUpDown('UP')">
                  <em class="bt-dw"></em>
                </button>
              </div>

              <div class="label-bntBox-r">
                <!-- 혹시 버튼식이 필요하면 아래꺼 주석 해제하여 사용하세요 -->
                <!-- <button type="button" class="btn btn-sz3 btn-gr1">밝게</button>
                                    <button type="button" class="btn btn-sz3 btn-gr1">어둡게</button> -->
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

                <!-- <button
                  v-if="selIndex >= 0"
                  type="button"
                  @click="updateDel('Y')"
                  class="btn btn-sz3 btn-gr1"
                >
                  삭제
                </button> -->
                <button
                  type="button"
                  class="btn btn-sz3 btn-l-b-gn"
                  @click="onSave()"
                >
                  {{ selItem.dtrmYn === "Y" ? "미확정" : "확정" }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- 영상학습 영상 [E] -->

        <!-- 영상학습 결과 [S] -->
        <!-- 필독 사이즈 변동있으면 연락주세요!! -->
        <div class="labeling-r">
          <template v-if="pageType === '차량번호'">
            <h2 class="ti-s mb10">라벨링 데이터</h2>
            <div class="as-area0">
              <span style="font-size: 12pt; color: #ff0000">{{
                selItem.labelDataText
              }}</span>
            </div>
            <br />
          </template>

          <h2 class="ti-s mb10">라벨링</h2>
          <!-- <div class="lb-chc-box as-area1"> -->
          <div
            :class="[
              pageType === '차량번호'
                ? 'lb-chc-box2 as-area1'
                : 'lb-chc-box as-area1',
            ]"
          >
            <template v-for="(item, index) in labelTypeList">
              <input
                @click="onCheckLabel(item.cmmnCd)"
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

          <p class="st1-class" v-if="pageType !== '차량번호'">
            <span class="cl-v" @click="onShowPop(true)">유형별 설명보기</span>
          </p>

          <h2 class="ti-s mb10">
            라벨링 목록 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button class="btn btn-gnc" @click="onDelAll()">전체삭제</button>
          </h2>
          <div
            class="as-area2"
            v-if="typeof labeler.getShapeList == 'function'"
          >
            <template v-for="(item, index) in labeler.getShapeList()">
              <div
                class="lb-as-l"
                :key="index"
                :class="sel2 === item.id ? 'active' : ''"
              >
                <button
                  type="button"
                  class="width70"
                  @click="onActiveLabel(index)"
                >
                  <span class="lb-l-nm">{{
                    item.data ? labelNm(item.data) : "-"
                  }}</span>
                </button>
                <button type="button" class="lb-l-del" @click="onRemove(index)">
                  삭제
                </button>
              </div>
            </template>

            <!-- 전체삭제버튼 -->
            <div class="as-area-all">
              <button type="button" class="bt-all-del">전체 삭제</button>
            </div>
          </div>
        </div>
        <!-- 영상학습 결과 [E] -->
      </div>
    </div>

    <!-- 준공검사 -->
    <!-- 라벨링 유형에 대한 설명 추가 -->
    <div class="popup pop1" v-if="showPop" :style="`display:block;left:30%`">
      <h1>라벨링 유형 설명</h1>

      <!-- <div class="thumList-l1 pop-body scl">
        <ul>
          <template v-for="(item, index) in code.NUM_BTN">
            <li :key="index" class="flex">
              <figure>
                <img v-if="pageType === '번호판'"
                  :src="`/v1/api/sample-info/data?grpCd=NUM_BTN&cmmnCd=${item.cmmnCd}`"
                  :alt="item.cmmnCdNm"
                  width="177"
                  height="132"
                />
                <img v-if="pageType === '꺾임'"
                  :src="`/v1/api/sample-info/data?grpCd=LABEL_CN_BTN&cmmnCd=${item.cmmnCd}`"
                  :alt="item.cmmnCdNm"
                  width="177"
                  height="132"
                />
                <img v-if="pageType === '빛'"
                  :src="`/v1/api/sample-info/data?grpCd=LABEL_BTN&cmmnCd=${item.cmmnCd}`"
                  :alt="item.cmmnCdNm"
                  width="177"
                  height="132"
                />
              </figure>
              <div class="thm-box">
                <strong class="thm-name">{{ item.cmmnCdNm }}</strong>
                <p class="thm-cp">{{ item.cmmnDesc }}</p>
              </div>
            </li>
          </template>
        </ul>
      </div> -->
      <div class="thumList-l1 pop-body scl" v-if="pageType === '번호판'">
        <ul>
          <template v-for="(item, index) in code.NUM_BTN">
            <li :key="index" class="flex">
              <figure>
                <img
                  :src="`/v1/api/sample-info/data?grpCd=NUM_BTN&cmmnCd=${item.cmmnCd}`"
                  :alt="item.cmmnCdNm"
                  width="120"
                  height="90"
                />
              </figure>
              <div class="thm-box">
                <strong class="thm-name">{{ item.cmmnCdNm }}</strong>
                <p class="thm-cp">{{ item.cmmnDesc }}</p>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div class="thumList-l1 pop-body scl" v-if="pageType === '꺾임'">
        <ul>
          <template v-for="(item, index) in code.LABEL_CN_BTN">
            <li :key="index" class="flex">
              <figure>
                <img
                  :src="`/v1/api/sample-info/data?grpCd=LABEL_CN_BTN&cmmnCd=${item.cmmnCd}`"
                  :alt="item.cmmnCdNm"
                  width="120"
                  height="90"
                />
              </figure>
              <div class="thm-box">
                <strong class="thm-name">{{ item.cmmnCdNm }}</strong>
                <p class="thm-cp">{{ item.cmmnDesc }}</p>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div class="thumList-l2 pop-body scl" v-if="pageType === '빛'">
        <ul class="flex">
          <template v-for="(item, index) in code.LABEL_BTN">
            <li :key="index">
              <figure>
                <img
                  :src="`/v1/api/sample-info/data?grpCd=LABEL_BTN&cmmnCd=${item.cmmnCd}`"
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

    <div
      v-if="showPop"
      @click="showPop = false"
      class="mask"
      style="display: block"
    ></div>
  </layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import LabelImg, { IShapeOptions, Points, Shape } from "label-img";
import commonService from "~/service/common-service";
import { IPageInfoModel } from "~/models/common-model";

// 2022.07.29. design.song
const COLORS = ["red", "blue", "mediumslateblue", "cyan", "lime", "orchid"];
const rectStyle = {
  normal: {
    dotColor: "aqua",
    dotRadius: 1,
    lineColor: "#c30",
    lineWidth: 1,
    fillColor: "transparent",
    opacity: 0.1,
  },
  active: {
    dotColor: "yellow",
    dotRadius: 3,
    lineColor: "yellow",
    lineWidth: 1,
    fillColor: "yellow",
    opacity: 0.2,
  },
};

const polygonStyle = {
  normal: {
    dotColor: "green",
    dotRadius: 1,
    lineColor: "#c30",
    lineWidth: 1,
    fillColor: "orange",
    opacity: 0.1,
  },
  active: {
    dotColor: "yellow",
    dotRadius: 3,
    lineColor: "yellow",
    lineWidth: 1,
    fillColor: "yellow",
    opacity: 0.2,
  },
};

@Component({ components: { Layout } })
export default class extends Vue {
  @Prop()
  pageType: string;
  search = { nmrecgCd: "", withNum: "", withChar: "" };
  labeler = {} as LabelImg;
  currentMenu: any = {};
  selDate = "";
  sel1 = "";
  sel2 = ""; // 2022.07.29. design.song
  selIndex = -1;
  selItem: any = {};
  selLabel = "";
  showPop = false;
  show1 = "";
  imgDataList = [];
  selImg = "";
  selImgUrl = "";
  code: any = {};
  dataset: any = { learnDtstType: "" };
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  labelTypeList: any = [];
  shapeID: 0;
  // labelWorkList: any = [];

  url = ""; // 2022.08.21 fqj
  // 입력 캔버스 관련
  lightValue: any = 0;
  outCanvas: any = "";
  outCtx: any = "";
  inFile: any = "";
  // 캔버스에는 한점한점이 안찍힘. 대신 캔버스에 종이를 붙임.
  inPaper: any = "";
  outPaper: any = "";
  // 입력 파일 및 배열
  inImgArr: any = [];
  outImgArr: any = [];
  // 입력 이미지의 폭과 높이
  inWidth: any = "";
  inHeight: any = "";
  outWidth: any = "";
  outHeight: any = "";
  imgURL: any = "";

  selectPointBtn = true;
  selectLabelBtn = false;

  created() {
    console.log("====pageType====", this.pageType);
    this.shapeID = 0;
    this.currentMenu = this.$store.state.currentMenu;
    this.codeList();
  }
  async onSearch(pageNo) {
    if (pageNo < 1) pageNo = 1;
    const newpage = { ...this.pageInfo, pageNo };
    const search = this.search;
    console.log("====pageNo===", pageNo);
    const data = await commonService.request(
      {
        pageType: this.pageType,
        ...newpage,
        nmrecgCd: search.nmrecgCd,
      },
      "/api/crgw-img-data/list/page"
    );
    this.pageInfo = { ...data.page };
    const imgList = data.list;
    this.imgDataList = imgList.map((v) => ({
      ...v,
      newNmrecgCd: v.nmrecgCd,
    }));
    if (imgList.length === 0) {
      this.selIndex = -1;
      this.selItem = {};
    } else {
      await this.onNext(0);
    }
  }

  onUpDown(type) {
    if (type === "UP") {
      if (this.lightValue + 30 > 255) this.lightValue = 255;
      else this.lightValue += 30;
    } else {
      if (this.lightValue - 30 < -255) this.lightValue = -255;
      else this.lightValue -= 30;
    }
    this.brightnessAdjustment();
  }

  //이미지 열기
  openImage() {
    let inImg = new Image(); //이미지 객체 생성
    console.log("this.url==", this.url);
    inImg.src = this.url;
    const _this: any = this;
    inImg.onload = function () {
      console.log("======111111");
      _this.outCanvas = document.querySelector("#img-view canvas");
      _this.outCtx = _this.outCanvas.getContext("2d");
      _this.inWidth = 800;
      _this.inHeight = 450;

      //캔버스 크기
      _this.outCanvas.width = _this.inWidth;
      _this.outCanvas.height = _this.inHeight;
      _this.outCtx.drawImage(inImg, 0, 0, _this.inWidth, _this.inHeight);

      //3차원 배열 만들기
      _this.inImgArr = new Array(3);
      for (let i = 0; i < 3; i++) {
        _this.inImgArr[i] = new Array(_this.inHeight); // 2차원 배열 생성
        for (let k = 0; k < _this.inHeight; k++)
          _this.inImgArr[i][k] = new Array(_this.inWidth);
      }

      let imgData = _this.outCtx.getImageData(
        0,
        0,
        _this.inWidth,
        _this.inHeight
      );
      let pixelImg = imgData.data;
      let R, G, B;
      for (let h = 0; h < _this.inHeight; h++) {
        for (let j = 0; j < _this.inWidth; j++) {
          let px = (h * _this.inWidth + j) * 4; //1pixel = 4byte(r, g, b, alpha)
          R = pixelImg[px + 0];
          G = pixelImg[px + 1];
          B = pixelImg[px + 2];

          _this.inImgArr[0][h][j] = String.fromCharCode(R);
          _this.inImgArr[1][h][j] = String.fromCharCode(G);
          _this.inImgArr[2][h][j] = String.fromCharCode(B);
        }
      }
    };
  }

  // @Watch("labeler", { deep: true })
  // watchCurrentMenu(newVal: any, oldVal) {
  //   console.log(this.labeler.Image);
  //   // this.labeler.load()
  //   // console.log("newVal", JSON.stringify(newVal));
  //   // console.log("oldVal", JSON.stringify(oldVal));
  // }

  //3차원 배열 만들 때 쓰기 위한 함수
  threeDimensionArr() {
    //이미지 크기
    this.outHeight = this.inHeight;
    this.outWidth = this.inWidth;

    //배열 준비
    this.outImgArr = new Array(3); //1차원 배열 3개

    for (let i = 0; i < 3; i++) {
      this.outImgArr[i] = new Array(this.outHeight); //1차원 배열
      for (let k = 0; k < this.outHeight; k++) {
        this.outImgArr[i][k] = new Array(this.outWidth);
      }
    }
  }
  //이미지 화면 출력
  displayImg() {
    //크기 지정
    this.outCanvas.height = this.inHeight;
    this.outCanvas.width = this.inWidth;

    let R, G, B;
    let outPaper = this.outCtx.createImageData(this.outWidth, this.outHeight);

    for (let i = 0; i < this.outHeight; i++) {
      for (let k = 0; k < this.outWidth; k++) {
        //byte 문자를 숫자로 변경
        R = this.outImgArr[0][i][k].charCodeAt(0);
        G = this.outImgArr[1][i][k].charCodeAt(0);
        B = this.outImgArr[2][i][k].charCodeAt(0);

        outPaper.data[(i * this.outWidth + k) * 4 + 0] = R;
        outPaper.data[(i * this.outWidth + k) * 4 + 1] = G;
        outPaper.data[(i * this.outWidth + k) * 4 + 2] = B;
        outPaper.data[(i * this.outWidth + k) * 4 + 3] = 255;
      }
    }
    this.outCtx.putImageData(outPaper, 0, 0);
    // this.labeler.render();
  }
  //본래 이미지 보기
  returnToFirstImg() {
    if (this.inFile == null || this.inFile == "") {
      alert("이미지 파일을 선택해주세요.");
    } else {
      this.threeDimensionArr();
      for (let rgb = 0; rgb < 3; rgb++) {
        for (let i = 0; i < this.inHeight; i++) {
          for (let k = 0; k < this.inWidth; k++) {
            this.outImgArr[rgb][i][k] = this.inImgArr[rgb][i][k];
          }
        }
      }
      this.displayImg();
      console.log("본래 이미지임");
    }
  }
  async brightnessAdjustment() {
    console.log(this.labeler);
    let value = parseInt((document.getElementById("brightI") as any).value);
    console.log(value);

    this.threeDimensionArr();
    for (let rgb = 0; rgb < 3; rgb++) {
      for (let i = 0; i < this.inHeight; i++) {
        for (let k = 0; k < this.inWidth; k++) {
          let pixel = this.inImgArr[rgb][i][k].charCodeAt(0); //문자에서 숫자로 변경
          //예외처리
          if (pixel + value > 255) {
            pixel = 255;
          } else if (pixel + value < 0) {
            pixel = 0;
          } else {
            pixel += value;
          }
          this.outImgArr[rgb][i][k] = String.fromCharCode(pixel); //숫자에서 문자로 변경
        }
      }
    }
    this.displayImg();
    console.log("변경 완료");
    const imgDataUrl = (
      document.querySelector("#img-view canvas") as any
    ).toDataURL();
    (this.labeler as any).loadImg(imgDataUrl, false);
    // this.onSelImg(
    //   this.selDate,
    //   this.sel1,
    //   this.selItem,
    //   this.selIndex,
    //   imgDataUrl
    // );
    // this.labeler.render();
    // console.log("shape==>", JSON.stringify(this.labeler.getShapeList()));
    // console.log("#new===>", JSON.stringify(this.labeler));
    // const shapList = this.labeler.getShapeList();
    // const newShapList = shapList.map((v) => {
    //   (v.tagger as any).center = [323.33333333333337, 260.4166666666667];
    //   return v;
    // });

    // // console.log("==new shap===>", JSON.stringify(newShapList));
    // (this.labeler as any).setShapeList(newShapList);
    console.log("#newXXXXX===>", JSON.stringify(this.labeler));

    // this.labeler.addShape(shape);
    // this.labeler.render();
    // }
    // }
  }
  async onSelImg(workDate, workNo, item, index) {
    console.log("item====", item);
    this.selectPointBtn = true;
    this.selectLabelBtn = false;
    this.selDate = workDate;
    this.sel1 = workNo;
    this.sel2 = "";
    this.selImg = workNo;
    this.selItem = item;
    this.selIndex = index;
    this.labelTypeList = this.labelTypeList.map((v) => ({
      ...v,
      checked: false,
    }));
    if (this.selImg) {
      if (this.pageType === "꺾임") {
        console.log(
          "onSelImg: " +
            `/v1/api/incn-img/data?workDate=${this.selDate}&workNo=${this.selImg}`
        );
        polygonStyle.normal.dotRadius = 2;
        polygonStyle.active.dotRadius = 2;
        polygonStyle.normal.lineWidth = 1;
        polygonStyle.active.lineWidth = 2;
        this.labeler.load(
          `/v1/api/incn-img/data?workDate=${this.selDate}&workNo=${this.selImg}`
        );
        this.url = `/v1/api/incn-img/data?workDate=${this.selDate}&workNo=${this.selImg}`;
      } else if (this.pageType === "차량번호") {
        console.log(
          "onSelImg: " +
            `/v1/api/plate-img/data?workDate=${this.selDate}&workNo=${this.selImg}`
        );
        rectStyle.normal.dotRadius = 2;
        rectStyle.active.dotRadius = 2;
        rectStyle.normal.lineWidth = 1;
        rectStyle.active.lineWidth = 2;
        this.labeler.load(
          `/v1/api/plate-img/data?workDate=${this.selDate}&workNo=${this.selImg}`
        );
        this.url = `/v1/api/plate-img/data?workDate=${this.selDate}&workNo=${this.selImg}`;
      } else {
        console.log(
          "onSelImg: " +
            `/v1/api/crgw-img/data?workDate=${this.selDate}&workNo=${this.selImg}`
        );
        this.labeler.load(
          `/v1/api/crgw-img/data?workDate=${this.selDate}&workNo=${this.selImg}`
        );
        this.url = `/v1/api/crgw-img/data?workDate=${this.selDate}&workNo=${this.selImg}`;
        this.openImage();
        polygonStyle.normal.dotRadius = 5;
        polygonStyle.active.dotRadius = 5;
        polygonStyle.normal.lineWidth = 2;
        polygonStyle.active.lineWidth = 3;
        rectStyle.normal.dotRadius = 5;
        rectStyle.active.dotRadius = 5;
        rectStyle.normal.lineWidth = 2;
        rectStyle.active.lineWidth = 3;
      }
    }
    console.log("labelr1===========", this.labeler.Image.getSize());
    
    const label = await commonService.request(
      {
        workDate: item.workDate,
        workNo: item.workNo,
        labelType: item.labelType,
        pageType: this.pageType,
      },
      "/api/label-rslt/data"
    );
    if (label && label.labelJson) {
      const labelArr = JSON.parse(label.labelJson);

      // 2022.07.29. design.song
      let typeName = "";
      switch (this.pageType) {
        case "꺾임":
        case "빛":
          typeName = "Polygon";
          break;

        case "번호판":
        case "차량번호":
          typeName = "Rect";
          break;
      }
      for (item of labelArr) {
        this.shapeID++;
        let colorIndex = this.shapeID % COLORS.length;
        let itemID = String(this.shapeID);
        const shape = new Shape({
          type: typeName,
          registerID: itemID,
          name: itemID,
          ...item,
          style: typeName == "Rect" ? rectStyle : polygonStyle,
          visible2: true,
          visible: true,
          showTag: true,
          tag: item.data,
        } as IShapeOptions);

        // apply different color
        shape.style.normal.dotColor = COLORS[colorIndex];
        shape.style.normal.lineColor = COLORS[colorIndex];
        shape.style.normal.fillColor = COLORS[colorIndex];
        this.labeler.addShape(shape);
        this.labeler.render();
      }
    }

    console.log("aa", this.labeler.Image);
    console.log("labeler.stringify===>>", JSON.stringify(this.labeler));

    const shapList = this.labeler.getShapeList();
    console.log("shapList====123>", shapList);
  }
  async onSave() {
    console.log("=====");
    const selItem = this.selItem;
    const list = this.labeler.getShapeList();
    // if (list.length < 1) return alert("저장할 라벨이 없습니다.");
    const nd = list.filter((v) => !v.data);
    // if (nd.length > 0) return alert("라벨링을 선택하세요.");
    // if (!selItem.nmrecgCd) return alert("분류를 먼저 하셔야 합니다.");
    let dataText = "";
    let labelDataText = "";
    let positionText = "";
    const saveData: any = {};
    const dtrmYn = this.selItem.dtrmYn === "Y" ? "N" : "Y";
    saveData.dtrmYn = dtrmYn;
    const lis = list.map(({ id, tagContent, positions, data }, index) => {
      dataText += data;
      labelDataText += this.labelNm(data);
      const idx = index + 1;
      saveData["class" + idx] = data;
      saveData["class" + idx + "Crdnt"] = JSON.stringify(positions);
      return {
        id,
        tagContent,
        data,
        positions,
      };
    });
    saveData.pageType = this.pageType;
    saveData.workDate = selItem.workDate;
    saveData.workNo = selItem.workNo;
    saveData.labelType = selItem.nmrecgCd;
    saveData.nmrecgCd = selItem.nmrecgCd;
    //saveData.labelDataText = dataText;
    saveData.labelDataText = labelDataText;
    saveData.labelJson = JSON.stringify(lis);
    // const saveData = {
    //   pageType: this.pageType,
    //   workDate: selItem.workDate,
    //   workNo: selItem.workNo,
    //   labelType: selItem.nmrecgCd,
    //   nmrecgCd: selItem.nmrecgCd,
    //   labelDataText: dataText,
    //   labelJson: JSON.stringify(lis),
    // };
    console.log(saveData);
    //await commonService.request(saveData, "/api/crgw-img-data/save");
    const data = await commonService.request(saveData, "/api/label-rslt/data/save");
    console.log(data);
    this.selItem.dtrmYn = dtrmYn;
    this.$util.notification("처리완료");
    const newIndex = this.selIndex + 1;
    if (dtrmYn === "Y") {
      this.onNext(newIndex);
    }
  }
  async onNext(newIndex) {
    let imgDataList = this.imgDataList;
    if (newIndex < imgDataList.length) {
      const newItem = imgDataList[newIndex];
      this.onSelImg(newItem.workDate, newItem.workNo, newItem, newIndex);
    } else {
      this.selIndex = 0;
      await this.onSearch(this.pageInfo.pageNo + 1);
      imgDataList = this.imgDataList;
      const newItem = imgDataList[0];
      this.onSelImg(newItem.workDate, newItem.workNo, newItem, newIndex);
    }
  }
  mounted() {
    this.onSearch(1);
    this.init();
    document.addEventListener("keyup", this.onKeyup);
  }
  destroyed() {
    document.removeEventListener('keyup', this.onKeyup);
  }
  async init() {
    const dataset = commonService.getDataset();
    if (dataset) this.dataset = dataset;
    console.log("dataset", this.dataset);
    const element: HTMLDivElement = document.getElementById("img-view") as any;

    const labeler = new LabelImg(element, {
      width: 800,
      height: 450,
      bgColor: `#000`, // black
    });

    // 2022.07.29. design.song
    // 웹에서 신규 박스 그릴 시 아래 등록된 정보로 그려진다.
    labeler.register("polygon", {
      name: "insert polygon",
      type: "Polygon",
      tag: "폴리곤",
      showTag: false,
      style: polygonStyle,
    });

    labeler.register("rect", {
      name: "insert rect",
      type: "Rect",
      tag: "사각형",
      showTag: false,
      style: rectStyle,
    });

    labeler.on("click", (obj) => {
      if (obj.ante.currentTarget == null) return; // design.song
      const data = obj.ante.currentTarget.data;
      console.log("data===>11", data);
      this.sel2 = obj.ante.currentTarget.id;
      if (obj.ante.isOnShape) this.onSelLabel(data);
    });

    //labeler.getEventList("dblclick")[0];

    // labeler.load("/images/vi_ex.jpg");
    // 选择标注多边形
    //labeler.label("polygon");
    this.labeler = labeler;
  }
  async codeList() {
    const codeList = await commonService.request(
      [
        "NMRECG_CD",
        "NGTP",
        "NUM_BTN",
        "CAR_NUM_BTN",
        "LABEL_BTN",
        "LABEL_CN_BTN",
      ],
      "/api/common/code/list"
    );
    console.log("====pageType===", this.pageType);
    this.code = codeList;
    if (this.pageType === "번호판") {
      const labelTypeList = codeList.NUM_BTN.map((v) => ({
        ...v,
        checked: false,
      }));
      this.labelTypeList = labelTypeList;
    }
    if (this.pageType === "차량번호") {
      const labelTypeList = codeList.CAR_NUM_BTN.map((v) => ({
        ...v,
        checked: false,
      }));
      console.log("=====", 1111);
      this.labelTypeList = labelTypeList;
    }
    if (this.pageType === "꺾임") {
      const labelTypeList = codeList.LABEL_CN_BTN.map((v) => ({
        ...v,
        checked: false,
      }));
      this.labelTypeList = labelTypeList;
      this.labelTypeList.sort((a, b) => {
        const A = a.cmmnCdNm;
        const B = b.cmmnCdNm;

        if (A > B) return 1;
        if (A < B) return -1;
        if (A === B) return 0;
      });
    }
    if (this.pageType === "빛") {
      const labelTypeList = codeList.LABEL_BTN.map((v) => ({
        ...v,
        checked: false,
      }));
      this.labelTypeList = labelTypeList;
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
        pageType: this.pageType,
      },
      "/api/label-rslt/data/del"
    );
    item.delYn = delYn;
    // alert("완료");
  }
  labelNm(cd) {
    const cds = this.labelTypeList || [];
    if (cds.lenght === 0) return "";
    const cds1 = cds.filter((v) => v.cmmnCd === cd);
    if (cds1.length === 0) return "";
    return cds1[0].cmmnCdNm;
  }
  codeNm(cd) {
    const cds = this.code.NMRECG_CD || [];
    if (cds.lenght === 0) return "";
    const cds1 = cds.filter((v) => v.cmmnCd === cd);
    if (cds1.length === 0) return "";
    return cds1[0].cmmnCdNm;
  }
  fun1() {
    const list = this.labeler.getShapeList();
    console.log(JSON.stringify(list));
    const lis = list.map(({ id, tagContent, positions }) => {
      return {
        id,
        tag: tagContent,
        positions,
      };
    });
    console.log(lis);
    alert(JSON.stringify(lis));
  }
  setSelection() {
    console.log("setSelection");
    this.selectPointBtn = true;
    this.selectLabelBtn = false;
    this.labeler.labelOff();
    this.nonActive();
  }
  setLabel(type: string) {
    this.selectPointBtn = false;
    this.selectLabelBtn = true;
    console.log("setLabel: " + type);
    this.nonActive();
    this.labeler.label(type);
  }
  reDraw() {
    console.log("reDraw");
    this.labeler.labelOff();
  }
  onSelLabel(val) {
    console.log("onSelLabel: " + val);
    this.labelTypeList = this.labelTypeList.map((v) => ({
      ...v,
      checked: v.cmmnCd === val,
    }));
    this.selectPointBtn = true;
    this.selectLabelBtn = false;
  }
  onCheckLabel(cd) {
    console.log("code", cd);
    const list = this.labeler.getShapeList();
    const labelArr = list.filter((v) => v.isActive());
    console.log("labelArr===", labelArr);
    this.onSelLabel(cd);
    if (labelArr.length < 1) return; //alert("이미지 라벨링을 선택하세요.");
    const label = labelArr[0];
    label.data = cd;
    this.selLabel = cd;

    // this.onSelLabel(cd);
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
  onKeyup(event) {
    console.log(event);
    if (event.key === "Enter") {
      this.onSave();
    } else if (event.key === "ArrowDown") {
      this.onNextImage();
    } else if (event.key === "ArrowUp") {
      this.onBeforeImage();
    } else if (event.key === "Escape") {
      this.setSelection();
    } else if (event.key === "Delete") {
      if (this.selItem.delYn !== "Y") {
        this.updateDel("Y");
      } else {
        this.updateDel("N");
      }
    }
  }
  nonActive() {
    const list = this.labeler.getShapeList();
    list.map((v) => {
      v.setActive(false);
    });
    this.labeler.render();
  }

  add(type: string, tag) {
    this.shapeID++;
    let Shape = LabelImg.Shape;

    if (type === "rect") {
      const shape = new Shape({
        type: "Rect",
        registerID: String(this.shapeID),
        name: "rect",
        positions: [
          [533, 229],
          [712, 229],
          [712, 426],
          [533, 426],
        ],
        style: rectStyle,
      } as IShapeOptions);
      this.labeler.addShape(shape);
    } else {
      const shape = new Shape({
        type: "Polygon",
        registerID: String(this.shapeID),
        name: "polygon",
        positions: [
          [214.37, 69.615],
          [194.48, 117.13],
          [246.415, 163.54],
          [377.91, 201.10999999999999],
          [498.355, 149.175],
          [427.635, 64.09],
          [236.47, 51.935],
        ],
        style: polygonStyle,
      } as IShapeOptions);
      this.labeler.addShape(shape);
    }
  }
  onRemove(index) {
    const list = this.labeler.getShapeList();
    list.splice(index, 1);
    // const activeLen = list.filter((v, idx) => index === idx)[0];
    // this.labeler.remove(id);
    this.labeler.render();
  }
  onDelAll() {
    const list = this.labeler.getShapeList();
    list.splice(0, list.length);
    // const activeLen = list.filter((v, idx) => index === idx)[0];
    // this.labeler.remove(id);
    this.labeler.render();
  }
  onActiveLabel(index) {
    this.labeler.getShapeList().map((v, idx) => {
      console.log("===111", v.data);
      if (idx === index) {
        this.sel2 = v.id;
        console.log(v);
        this.onSelLabel(v.data);
        v.setActive(true);
      } else v.setActive(false);
      return v;
    });
    console.log("onActiveLabel: " + index);
    this.labeler.render();
  }
  onRemoveLabel() {
    const list = this.labeler.getShapeList();
    const activeLen = list.filter((v) => v.isActive()).length;
    if (activeLen < 1) return alert("삭제할 라벨을 선택하세요.");
    list.map((v) => {
      if (v.isActive()) {
        this.labeler.remove(v.id);
      }
    });
  }
  onShowPop(show) {
    this.showPop = show;
  }
}
</script>

<style scoped></style>
