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
            <figure v-if="isNoImg == true">
              <div id="no-img-small">
                <img
                  src="/images/file-earmark-x.svg"
                  width="30%"
                  />
              </div>
            </figure>
            <figure v-else>
              <img
                v-if="pageType === '꺾임'"
                alt="작은 이미지"
                width="152"
                height="88"
                :src="`/v1/api/incn-img/data?workDate=${selItem.workDate}&workNo=${this.selItem.workNo}`"
              />
              <img
                v-else-if="
                  pageType === '차량번호'
                "
                alt="작은 이미지"
                width="152"
                height="88"
                :src="`/v1/api/plate-img/data?workDate=${selItem.workDate}&workNo=${this.selItem.workNo}`"
              />
              <img
                v-else-if="this.selItem.workNo != ''"
                alt="작은 이미지"
                width="152"
                height="88"
                :src="`/v1/api/crgw-img/data?workDate=${selItem.workDate}&workNo=${this.selItem.workNo}`"
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
                    @click="onSelImg(item, index)"
                    :class="selItem.workNo === item.workNo ? 'active' : ''"
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
            <div class="label-v-info" v-if="pageType!='차량번호' && pageType!='꺾임'">
              영상ID: <span>{{ selItem.workNo }}</span> 
              미·오인식 유형: <span >{{ codeNm(selItem.nmrecgCd) }}</span>
              촬영일시: <span>{{ selItem.shootDttm }}</span> 
              촬영장소: <span>{{ selItem.tolofNm }}</span>
            </div>
            <div class="label-v-info" v-else>
              영상 번호: <span>{{ selItem.workNo }}</span> 
              영상 날짜: <span>{{ selItem.workDate }}</span> 
              <!-- 영상 타입: <span>{{ selItem.labelType }}</span>  -->
            </div>
            <div class="label-v-ctl">
              <div class="flex lb-btn">
                <button
                  type="button"
                  class="bt-lb-potin"
                  @click="setSelection()"
                  :style="
                    selectPointBtn ? 'background-blend-mode: multiply;' : ''
                  "
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
                  :style="
                    selectLabelBtn ? 'background-blend-mode: multiply;' : ''
                  "
                >
                  폴리곤
                </button>
                <button
                  v-else
                  type="button"
                  title="사각형"
                  @click="setLabel('rect')"
                  class="bt-lb-area"
                  :style="
                    selectLabelBtn ? 'background-blend-mode: multiply;' : ''
                  "
                >
                  사각형
                </button>                
              </div>
              <div class="lb-keyst" v-if="quickClassObj?.nm">
                단축키: <span>{{ quickClassObj.nm }}</span>
              </div>
            </div>

            <div class="label-view">              
              <figure>                
                <input
                  style="display: none"
                  type="range"
                  max="255"
                  min="-255"
                  :value="lightValue"
                  id="brightI"
                  @mouseup="brightnessAdjustment()"
                />                
                <div id="img-view" :style="(isNoImg==true? 'display:none;' : '')  + 'width: 800px; height:450px;'">
                <!-- 영상 Canvas 들어올 자리 -->
                </div>
                <div id="no-img" :style="(isNoImg==false? 'display:none;' : '')  + 'width: 800px; height:450px;'">
                  <img src="/images/no-img.png" />
                </div>
              </figure>
            </div>
            <div class="label-bntBox">
              <div class="label-bntBox-l">
                <button
                  type="button"
                  class="bt-ctl-op"
                  @click="onUpDown('DOWN')"
                >
                <em class="bt-up"></em>
                </button>
                <span id="label-opt" class="label-opt">밝기</span>
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
                :checked="selLabel == item.cmmnCd"
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
            <template v-for="(item, index) in shapeList">
              <div
                class="lb-as-l"
                :key="index"
                :class="item.isActive() ? 'active' : ''"
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
// import LabelImg, { IShapeOptions, Points, Shape } from "label-img";
import LabelImg, { IShapeOptions, Points, Shape } from "~/static/js/label-img";
import commonService from "~/service/common-service";
import { $cookies } from "~/utils/api";
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

  // 선택한 이미지 정보, 박스 정보
  selItem: any = {
    workDate:"",
    workNo:"",
  };
  selIndex = -1;
  selLabel = "";
  selImg: any = null;
  selBoxId = "";
  
  showPop = false;
  
  imgDataList = [];
  labelTypeList: any = [];
  shapeList: any = [];

  code: any = {};
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  shapeID: 0;
  // dataset: any = { learnDtstType: "" };
  // labelWorkList: any = [];
  // url = ""; // 2022.08.21 fqj

  isNoImg = false;

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

  selectPointBtn = true;
  selectLabelBtn = false;

  quickClassObj = {};

  created() {
    console.log("====pageType====", this.pageType);
    $cookies.remove("selLabel");
    $cookies.remove("selLabelNm");
    this.shapeID = 0;
    this.currentMenu = this.$store.state.currentMenu;
    this.codeList();
    this.setQuickClass();
  }
  mounted() {
    this.onSearch(1);
    this.init();
    document.addEventListener("keyup", this.onKeyup);
  }
  destroyed() {
    document.removeEventListener("keyup", this.onKeyup);
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
    console.log('imgDataList ===== ',this.imgDataList);

    if (imgList.length === 0) {
      this.selIndex = -1;
      this.selItem = {};
    } else {
      await this.onNext(0);
    }
  }

  // 이미지 밝기 조절 관련 
  onUpDown(type) {
    if (type === "UP") {
      if (this.lightValue + 30 > 255) this.lightValue = 255;
      else this.lightValue += 30;
      // this.lightValue = 30;
    } else {
      if (this.lightValue - 30 < -255) this.lightValue = -255;
      else this.lightValue -= 30;
      // this.lightValue = -30;
    }
    this.brightnessAdjustment();
  }
  brightnessFilter(pixels, value) {
    var d = pixels.data;    
    for(var i =0; i< d.length; i+=4) {        
      d[i] += value/3;        
      d[i+1] += value/3;        
      d[i+2] += value/3;    
    }    
    return pixels;
  }
  async brightnessAdjustment() {
    
    this.shapeList = this.labeler.getShapeList();
    let saveList = this.shapeList.slice(0,this.shapeList.length);
    this.onDelAll();

    let image = new Image();
    image.src = 'data:image/jpeg;base64,' + this.selImg.imgData;
    image.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = this.selImg.width;
      canvas.height = this.selImg.height;
      let context = canvas.getContext('2d');
      context.drawImage(image,0,0);      
      let pixels= context.getImageData(0,0, canvas.width, canvas.height);
      let filteredData = this.brightnessFilter(pixels, this.lightValue);
      context.putImageData(filteredData, 0, 0);
      let dataURL = canvas.toDataURL();
      
      this.labeler.load(dataURL);
      // this.labeler.render();
      saveList.forEach((value) => {
        this.labeler.addShape(value);
      })
      this.shapeList = this.labeler.getShapeList();
    }
  }
  async onSelImg(item, index) {
    console.log("item====", item);
    this.lightValue = 0;
    this.selItem = item;
    this.selBoxId = "";
    this.selIndex = index;
    this.shapeID = 0;

    let data = null;

    if (this.pageType === "꺾임") {
      data = await commonService.request(
        {
          workDate:this.selItem.workDate,
          workNo:this.selItem.workNo,
        },
        "/api/incn-img/data"
      )
      console.log('img-data',data);
      this.selImg = data;
      if(this.selImg == null) {
        this.isNoImg = true;
      }
      else {
        this.isNoImg = false;
        
        polygonStyle.normal.dotRadius = data.width/ 100;
        polygonStyle.active.dotRadius = data.width/ 100;
        polygonStyle.normal.lineWidth = data.width/ 100 -2;
        polygonStyle.active.lineWidth = data.width/ 100 -1;
      }
    } 
    else if (this.pageType === "차량번호") {
      data = await commonService.request(
        {
          workDate:this.selItem.workDate,
          workNo:this.selItem.workNo,
        },
        "/api/plate-img/data"
      )
      console.log('img-data',data);
      this.selImg = data;
      if(this.selImg == null) {
        this.isNoImg = true;
      }
      else {
        this.isNoImg = false;
        
        rectStyle.normal.dotRadius = data.width/ 100;
        rectStyle.active.dotRadius = data.width/ 100;
        rectStyle.normal.lineWidth = data.width/ 100 -2;
        rectStyle.active.lineWidth = data.width/ 100 -1;
      }
    } 
    else {
      data = await commonService.request(
        {
          workDate:this.selItem.workDate,
          workNo:this.selItem.workNo,
        },
        "/api/crgw-img/data"
      )
      console.log('img-data',data);
      this.selImg = data;
      if(this.selImg == null) {
        this.isNoImg = true;
      }
      else {
        this.isNoImg = false;
        
        polygonStyle.normal.dotRadius = data.width/ 100;
        polygonStyle.active.dotRadius = data.width/ 100;
        polygonStyle.normal.lineWidth = data.width/ 100 -2;
        polygonStyle.active.lineWidth = data.width/ 100 -1;
        rectStyle.normal.dotRadius = data.width/ 100;
        rectStyle.active.dotRadius = data.width/ 100;
        rectStyle.normal.lineWidth = data.width/ 100 -2;
        rectStyle.active.lineWidth = data.width/ 100 -1;
      }
    }      
    
    if (this.isNoImg == true) {
      this.labeler.load('/images/no-img.png');
      return;
    }
    else {
      this.labeler.load('data:image/jpeg;base64,' + data.imgData);
    }

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
      for (let value of labelArr) {
        this.shapeID++;
        let colorIndex = this.shapeID % COLORS.length;
        let itemID = String(this.shapeID);
        const shape = new Shape({
          type: typeName,
          registerID: itemID,
          name: itemID,
          ...value,
          style: typeName == "Rect" ? rectStyle : polygonStyle,
          visible2: true,
          visible: true,
          showTag: true,
          tag: this.labelNm(value.data),          
        } as IShapeOptions);

        // apply different color
        shape.style.normal.dotColor = COLORS[colorIndex];
        shape.style.normal.lineColor = COLORS[colorIndex];
        shape.style.normal.fillColor = COLORS[colorIndex];
        // console.log('1111111111',shape);
        this.labeler.addShape(shape);
        // this.labeler.render();
      }
    }

    this.shapeList = this.labeler.getShapeList();
    this.nonActive();
    // console.log("shapList====123>", shapList);
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
      
      // 2022.09.20 wook
      // class_n, class_n_crdnt 사용안함
      // const idx = index + 1;
      // saveData["class" + idx] = data;
      // saveData["class" + idx + "Crdnt"] = JSON.stringify(positions);

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
    const result = await commonService.request(saveData, "/api/label-rslt/data/save");
    console.log("saveResult ====== ", result);
    if(result == 1) {
      this.selItem.labelDataText = labelDataText;
    }
    this.selItem.dtrmYn = dtrmYn;
    this.$util.notification("처리완료");
    const newIndex = this.selIndex + 1;
    if (dtrmYn === "Y") {
      this.onNext(newIndex);
    }
  }

  async onNext(newIndex) {
    if (newIndex < this.imgDataList.length) {
      const newItem = this.imgDataList[newIndex];
      this.onSelImg(newItem, newIndex);
    } 
  }
  async init() {
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
    
    // 2022.09.22 wook 수정
    // 좌클릭만 적용됨
    labeler.on("click", 'top', (obj) => {
      console.log("obj===>11", obj);
      if(!obj.ante.isOnImage) return;
      const data = obj.ante.currentTarget.data;
      console.log('data===', data);
      if (data == null) {
        // 박스가 없는 공간 클릭
        if (this.selectPointBtn == true) {
          console.log('빈공간');
          this.nonActive();
        }
        // 라벨링 끝마치는 클릭
        else{
          // 폴리곤은 도형이 완전히 그려져야 라벨링 끝마침
          if(this.pageType == '빛' || this.pageType == '꺾임') {
            if (! obj.ante.isOnShape) return;
          }
          // console.log(this.labelTypeList);
          let newBoxId = obj.ante.currentTarget.id;
          console.log(this.selLabel);
          let labelDataText = '';
          this.shapeList = this.labeler.getShapeList();
          this.shapeList = this.shapeList.map((v) => {
            labelDataText += this.labelNm(v.data);
            if (newBoxId == v.id) {
              v.data = this.selLabel;
              let temp = this.labelTypeList.find((v) => {
                if(v.cmmnCd == this.selLabel) return true;
              });
              v.tagContent = temp.cmmnCdNm;
              v.tagger.content = v.tagContent;
              v.tagShow(true);
              console.log(v);
            }
            return v;
          })
          this.selItem.labelDataText = labelDataText;
          console.log('라벨링 완료');
          labeler.render();
        }
      }
      // 박스 선택
      else {
        console.log('data===', data);
        this.selBoxId = obj.ante.currentTarget.id;
        console.log('boxid',this.selBoxId);
        if (obj.ante.isOnShape) this.onSelLabel(data);
        console.log('박스 선택');
        console.log("shapeList",this.shapeList);
      }
    });
    
    
    // 우클릭 적용
    labeler.on('mousedown','top', (event) => {
      console.log('event ===',event);
      if(!event.ante.isOnImage) return;
      const is_right_click = (event.which == 3) || (event.button == 2)
      if (! is_right_click) return;
      const data = event.ante.currentTarget.data;
      // 박스 선택(우클릭)
      this.setSelection();
      if(data != null){
        this.selBoxId = event.ante.currentTarget.id;
        console.log('boxid',this.selBoxId);
        if (event.ante.isOnShape) this.onSelLabel(data);
        console.log('우클릭 박스 선택');
      }
      else {
        // 박스가 없는 공간 클릭
        console.log('우클릭 빈공간');
        this.nonActive();
      } 
    });
    
    labeler.setContinuity(true);
    this.labeler = labeler;
    console.log('init');
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
    if (cds.length === 0) return "";
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
  onSelLabel(cd) {
    this.selLabel = cd;

    console.log("onSelLabel: " + cd);
    console.log('shaplist ---- ',this.shapeList);
    this.shapeList = this.shapeList.map((v, idx) => {
      if(this.selBoxId == v.id) {
        v.setActive(true);
        console.log('aaaa',v.isActive());
      }
      return v;
    });

    this.labeler.render();
  }
  onCheckLabel(cd) {    
    console.log("code", cd);
    this.onSelLabel(cd);
    if(this.pageType === '빛' || this.pageType === '꺾임') {
        this.setLabel('polygon')
    }
    else {
      this.setLabel('rect')
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
  onKeyup(event) {
    event.preventDefault();
    console.log(event);
    if (event.key === "Enter") {
      this.onSave();
    } else if (event.key === "PageDown") {
      this.onNextImage();
    } else if (event.key === "PageUp") {
      this.onBeforeImage();
    } else if (event.key === "Escape") {
      this.setSelection();
    } else if (event.key === "X") {
      if (this.selItem.delYn !== "Y") {
        this.updateDel("Y");
      } else {
        this.updateDel("N");
      }
    } else if (event.key === "Delete") {
      if (this.selBoxId != '') {
        this.onRemove(this.selBoxId)
      }
    } else {
      if (this.pageType === "차량번호" || this.pageType === "번호판") {
        // 0~9 클릭시
        if (event.key in ["0", "1", "2" , "3", "4", "5", "6", "7", "8", "9"]) {
          this.onCheckLabel(event.key);
        }
      }
      if (event.key === "S" || event.key === "s" || event.key === "ㄴ") {
        const selLabel = $cookies.get("selLabel");
        console.log(selLabel);
        if (!selLabel) return alert("설정된 퀵 클래스가 없습니다.");
        this.onCheckLabel(selLabel);
      }
      if (
        event.key === "Q" ||
        event.key === "q" ||
        event.key === "ㅂ" ||
        event.key === "ㅃ"
      ) {
        const chk = this.labelTypeList.filter((v) => v.cmmnCd == this.selLabel);
        if (chk.length < 1) return alert("선택된 라벨이 없습니다.");
        $cookies.set("selLabel", chk[0].cmmnCd);
        $cookies.set("selLabelNm", chk[0].cmmnCdNm);
        this.setQuickClass();
      }
    }
  }
  setQuickClass() {
    const cd = $cookies.get("selLabel");
    const nm = $cookies.get("selLabelNm");
    this.quickClassObj = { cd, nm };
    console.log(this.quickClassObj);
  }

  // 2022.09.21 wook 수정
  nonActive() {
    console.log('nonActive');
    this.shapeList = this.labeler.getShapeList();
    let labelDataText = '';
    this.shapeList.map((v) => {
      if (this.selBoxId == v.id) v.setActive(false);
      labelDataText += this.labelNm(v.data);
      return v;
    });
    this.selItem.labelDataText = labelDataText;
    this.selBoxId = '';
    this.labelTypeList = this.labelTypeList.map((v) => ({
      ...v,
      checked: false
    }));

    this.labeler.render();
  }
  onRemove(index) {
    if (index== -1) return;
    this.labeler.remove(this.selBoxId);
    this.selBoxId = '';
    this.shapeList = this.labeler.getShapeList();
    this.nonActive();
  }
  onDelAll() {
    let idList = [];
    this.shapeList.map((v) => {
      idList.push(v.id);
    })
    idList.forEach((v) => {
      this.labeler.remove(v);
    })
    this.shapeList = this.labeler.getShapeList();
    this.nonActive();
  }
  onActiveLabel(index) {
    this.shapeList.map((v, idx) => {
      console.log("===111", v.data);
      if (idx === index) {
        this.selBoxId = v.id;
        console.log(v);
        this.onSelLabel(v.data);
        v.setActive(true);
      } else v.setActive(false);
      return v;
    });
    console.log("onActiveLabel: " + index);
    this.labeler.render();
  }
  onShowPop(show) {
    this.showPop = show;
  }  
}
</script>

<style scoped></style>
