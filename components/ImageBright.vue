<template>
  <div>
    <!-- <input type="file" ref="image" id="selectFile" @change="openImage()" /> -->
    <!-- <img :src="url" width="100%" id="myimg" /> -->
    <!-- <button @click="returnToFirstImg()">원래이미지</button> -->
    <!-- <label> 밝기 조절</label> -->
    <input
      style="display: none"
      type="range"
      max="255"
      min="-255"
      :value="lightValue"
      id="brightI"
      @mouseup="brightnessAdjustment()"
    />
    <div>
      <Canvas id="outCanvas"></Canvas>
    </div>
    <div class="label-bntBox">
      <div class="label-bntBox-l">
        <button type="button" class="bt-ctl-op" @click="onUpDown('DOWN')">
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

        <!-- <button type="button" class="btn btn-sz3 btn-gr1">삭제</button> -->
        <!-- <button type="button" class="btn btn-sz3 btn-l-b-gn">확정</button> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import Vue from "vue";
// import LabelImg, { IShapeOptions, Points, Shape } from "label-img";
export default {
  name: "HelloWorld",
  props: {
    url: String,
  },
  data() {
    return {
      // 입력 캔버스 관련
      lightValue: 0,
      outCanvas: "",
      outCtx: "",
      inFile: "",
      // 캔버스에는 한점한점이 안찍힘. 대신 캔버스에 종이를 붙임.
      inPaper: "",
      outPaper: "",
      // 입력 파일 및 배열
      inImgArr: [],
      outImgArr: [],
      // 입력 이미지의 폭과 높이
      inWidth: "",
      inHeight: "",
      outWidth: "",
      outHeight: "",

      imgURL: "",
    };
  },
  watch: {
    url: function (newVal, oldVal) {
      this.imgURL = newVal;
      this.lightValue = 0;
      this.openImage();
    },
  },
  methods: {
    onUpDown: function (type) {
      if (type === "UP") {
        if (this.lightValue + 30 > 255) this.lightValue = 255;
        else this.lightValue += 30;
      } else {
        if (this.lightValue - 30 < -255) this.lightValue = -255;
        else this.lightValue -= 30;
      }
      this.brightnessAdjustment();
    },
    //이미지 열기
    openImage: function () {
      //url 지우기(누수 막기)
      // this.imgURL = URL.revokeObjectURL(this.imgURL);
      // console.log(this.imgURL);

      // this.inFile = this.$refs["image"].files[0];
      // //그림 파일을 이미지 객체로 불러오기
      let inImg = new Image(); //이미지 객체 생성
      // //src로 넣을 url 만들기
      // this.imgURL = URL.createObjectURL(this.inFile);
      // //src에 url 넣기
      // inImg.src = this.imgURL;
      // let myimg = document.getElementById("myimg");
      console.log("this.url==", this.url);
      inImg.src = this.url;

      const _this = this;
      inImg.onload = function () {
        _this.outCanvas = document.getElementById("outCanvas");
        _this.outCtx = _this.outCanvas.getContext("2d");

        //입력 파일의 크기 알아내기
        //_this.inWidth = inImg.width;
        //_this.inHeight = inImg.height;
        _this.inWidth = 800; //myimg.clientWidth;
        _this.inHeight = 462; //myimg.clientHeight;

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
    },

    //3차원 배열 만들 때 쓰기 위한 함수
    threeDimensionArr: function () {
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
    },
    //이미지 화면 출력
    displayImg: function () {
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
    },
    //본래 이미지 보기
    returnToFirstImg: function () {
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
    },
    brightnessAdjustment: function () {
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
    },
  },
  created() {
    console.log("aaa");
    console.log("222");
  },
  mounted() {
    this.openImage();
  },
};
</script>

<style scoped></style>
