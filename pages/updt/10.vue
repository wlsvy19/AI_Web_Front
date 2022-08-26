<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top">
          <h2 class="ti">신규엔진 배포</h2>
        </div>
      </div>

      <div class="clmFlex mt15">
        <!-- step1. [S] -->
        <div class="newEngin-l">
          <h1 class="ti-s">현재 재인식 서버 정보</h1>
          <fieldset>
            <legend>정렬영역</legend>
            <label for="sel002" class="sl-nm">본부</label>
            <select id="sel002" class="select" @change="onChange($event)">
              <option value="">전체</option>
              <option :key="index" :value='item' v-for="(item, index) in hdqrList">{{ item }}</option>
            </select>
          </fieldset>

          <div class="table-l1 mt15">
            <table>
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
                      <label for="th001" class="th_chk">전체</label>
                    </span>
                  </th>
                  <th>본부</th>
                  <th>번호</th>
                  <th>IP주소</th>
                  <th>현재 가중치 버전</th>
                  <th>최종 업데이트 시작</th>
                  <th>업데이트<br />상태</th>
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
                          @click="onClickCheckbox(item)"
                        />
                        <label :for="`ch00` + index"></label>
                      </span>
                    </td>
                    <td class="tx-c">{{ item.hdqrNm }}</td>
                    <td class="tx-c">{{ item.exlprNum }}</td>
                    <td class="tx-c">{{ item.vmIp }}</td>
                    <td class="tx-c">{{ item.crntWeightVer }}</td>
                    <td class="tx-c">{{ item.updateDttm }}</td>
                    <td v-if="item.updateYn=='Y'" class="tx-c fc1" style="">완료</td>
                    <td v-else-if="item.updateYn=='E'" class="tx-c fc2">에러</td>
                    <td v-else class="tx-c fc3">진행중</td>
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
            @pagination="(p) => onSearch(p.pageNo, hdqrSelect)"
          />
        </div>
        <!-- step2. [E] -->

        <!-- step3. [S] -->
        <div class="newEngin-r">
          <h1 class="ti-s">신규 가중치 셋</h1>

          <fieldset class="newWeight flex flex-btw">
            <legend>정렬영역</legend>
            <label for="sel002" class="sch-id">선택된 가중치 셋</label>
            <input type="text" class="inp ml5" v-model="selDataset" readonly/>
            <button
              type="button"
              class="btn btn-sz1 btn-gnc"
              @click="onShowPop(true)"
            >
              선택
            </button>
          </fieldset>

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
                <tr>
                  <td class="tx-c">번호판 탐색</td>
                  <td class="tx-c">{{ plateWeightId }}</td>
                </tr>
                <tr>
                  <td class="tx-c">문자/숫자1</td>
                  <td class="tx-c">{{ word1WeightId }}</td>
                </tr>
                <tr>
                  <td class="tx-c">문자/숫자2</td>
                  <td class="tx-c">{{ word2WeightId }}</td>
                </tr>
                <tr>
                  <td class="tx-c">문자/숫자3</td>
                  <td class="tx-c">{{ word3WeightId }}</td>
                </tr>
                <tr>
                  <td class="tx-c">꺾임/훼손</td>
                  <td class="tx-c">{{ incnWeightId }}</td>
                </tr>
                <tr>
                  <td class="tx-c">스미어/빛반사</td>
                  <td class="tx-c">{{ smbrWeightId }}</td>
                </tr>

              </tbody>
            </table>
          </div>
          <div class="udt-btn">
            <button type="button" id="btn-update"
              :class="{'btn-bg-gn btn-gray':weightSetSelect==false || isUpdating==true, 'btn-bg-gn':weightSetSelect==true}"
              @click="onClickUpdate()" :disabled="!weightSetSelect || isUpdating"
            >
              {{ isUpdating ? "업데이트 진행중" : "업데이트" }} 
            </button>
          </div>
        </div>
        <!-- step3. [E] -->
      </div>
    </div>

    <!-- 팝업 [S] -->
    <div v-if="showPop" class="popup pop1" :style="`display:block;left:30%`">
      <h1>가중치 셋 목록</h1>

      <div class="table-l1 mt15 pop-body scl tb-ov1">
        <table>
          <colgroup>
            <col width="*" />
            <col width="100" />
            <col width="100" />
            <col width="100" />
            <col width="100" />
            <col width="100" />
            <col width="100" />
          </colgroup>
          <thead>
            <tr>
              <th>현재 가중치 버전</th>
              <th>번호판 탐색</th>
              <th>문자/숫자1</th>
              <th>문자/숫자2</th>
              <th>문자/숫자3</th>
              <th>꺾임/훼손</th>
              <th>스미어/빛반사</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in dsList">
              <tr :key="index" @click="onSelItem(item)">
                <td class="tx-c">{{ item.algoVer }}</td>
                <td class="tx-c">{{ item.plateWeightId }}</td>
                <td class="tx-c">{{ item.word1WeightId }}</td>
                <td class="tx-c">{{ item.word2WeightId }}</td>
                <td class="tx-c">{{ item.word3WeightId }}</td>
                <td class="tx-c">{{ item.incnWeightId }}</td>
                <td class="tx-c">{{ item.smbrWeightId }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <button type="button" class="pop-close" @click="onShowPop(false)">
        닫기
      </button>
    </div>
    <!-- 팝업 [E] -->

    <div
      v-if="showPop"
      @click="showPop = false"
      class="mask"
      style="display: block"
    ></div>
  </layout>
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
  dsList = [];
  selDataset = "";
  hdqrList = [];
  hdqrSelect = "";
  weightSetSelect = false;
  checkList: any = {};
  isUpdating = false;

  plateWeightId = "";
  word1WeightId = "";
  word2WeightId = "";
  word3WeightId = "";
  incnWeightId = "";
  smbrWeightId = "";

  onShowPop(show) {
    this.showPop = show;
  }
  checkAll() {
    this.serverList = this.serverList.map((v) => {
      this.checkList[v.vmIp] = this.checked
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
    this.getHdqrList();
    this.onSearch(1);
    this.datasetList();
  }
  onSelItem(item) {
    this.selDataset = item.algoVer;
    
    this.plateWeightId = item.plateWeightId == "" ? '기존버전사용' : item.plateWeightId;
    this.word1WeightId = item.word1WeightId == "" ? '기존버전사용' : item.word1WeightId;
    this.word2WeightId = item.word2WeightId == "" ? '기존버전사용' : item.word2WeightId;
    this.word3WeightId = item.word3WeightId == "" ? '기존버전사용' : item.word3WeightId;
    this.incnWeightId = item.incnWeightId == "" ? '기존버전사용' : item.incnWeightId;
    this.smbrWeightId = item.smbrWeightId == "" ? '기존버전사용' : item.smbrWeightId;
    this.showPop = false;
    this.weightSetSelect = true;
  }
  onClickCheckbox(item) {
    if (!item.chked) this.checkList[item.vmIp] = !item.chked;
    else delete this.checkList[item.vmIp];
  }

  async onChange(event) {
    this.hdqrSelect = event.target.value;
    this.onSearch(1, this.hdqrSelect);
  }
  async onSearch(pageNo: number, hdqrNm: string="") {
    this.checked = false;
    const newpage = { ...this.pageInfo, pageNo };
    const data = await commonService.request(
      { hdqrNm, ...newpage },
      "/api/updt/list"
    );
    newpage.totalCount = data.page.totalCount;
    this.serverList = data.list;
    this.pageInfo = { ...newpage };
    this.serverList = this.serverList.map((v) => {
      if (v.vmIp in this.checkList) return { ...v, chked: this.checkList[v.vmIp] };
      else return { ...v, chked: false };
    });
  }
  async getHdqrList() {
    const data = await commonService.request(
      {},
      "/api/updt/hdqr/list"
    );
    data.forEach((value) => {
      this.hdqrList.push(value.hdqr_nm);
    });
    console.log(this.hdqrList);
  }
  async onClickUpdate() {
    if (Object.keys(this.checkList).length == 0) {
      this.$alert('배포할 본부를 선택해주세요.')
    }
    else {
      console.log(this.checkList);
      this.isUpdating = true;
      // TODO: 업데이트 진행중 프로세스
    }
  }
}
</script>
<style scoped></style>
