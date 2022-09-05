<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top">
          <h2 class="ti">재인식 엔진 비교 검증</h2>
        </div>
      </div>

      <div id="conts" class="conts-box1">
        <fieldset>
          <legend>검색영역</legend>
          <div class="engineSchBar">
            <label for="sel002" class="sl-nm">본부</label>
            <select id="sel002" class="select">
              <option value="">전체</option>
              <option :key="index" :value='item' v-for="(item, index) in hdqrList">{{ item }}</option>
            </select>

            <label for="sel002" class="sl-nm">지사</label>
            <select id="sel002" class="select">
              <option value="">수원</option>
            </select>

            <label for="sel002" class="sl-nm">영업소</label>
            <select id="sel002" class="select">
              <option value="">서울</option>
            </select>

            <label for="sel002" class="sl-nm">TCS/HIPASS</label>
            <select id="sel002" class="select">
              <option value="">전체</option>
              <option value="T">TCS</option>
              <option value="H">HIPASS</option>
            </select>

            <label for="sel002" class="sl-nm">차로</label>
            <select id="sel002" class="select">
              <option value="">전체</option>
            </select>
            <br /><br />
            <label for="sel002" class="sl-nm">일시</label>
            <select id="sel002" class="select sel-calendar">              
              <option value="">2022-07-22</option>
            </select>
            <label for="sel001" class="hidden">선택해주세요</label>
            <select id="sel001" class="select sel-time">
              <option value="">10:00</option>
            </select>
            <em>~</em>
            <label for="sel001" class="hidden">선택해주세요</label>
            <select id="sel001" class="select sel-time">
              <option value="">12:00</option>
            </select>
          </div>
        </fieldset>

        <div class="clmFlex clmBox-col2 mt15">
          <div class="clmBox">
            <h1 class="ti-s">가중치 선택</h1>
            <div class="clm-body3">
              <div class="tab2 mb15">
                <ul class="tabList">
                  <li class="active">
                    <button type="button">번호판탐색</button>
                  </li>
                  <li><button type="button">문자/숫자1</button></li>
                  <li><button type="button">문자/숫자2</button></li>
                  <li><button type="button">문자/숫자3</button></li>
                  <li><button type="button">꺾임/훼손</button></li>
                  <li><button type="button">스미어/비차량</button></li>
                </ul>
              </div>

              <div id="" class="table-l1 tb-op1 tb-ov1 tabBox">
                <table>
                  <thead>
                    <tr>
                      <th>가중치 ID</th>
                      <th>학습일자</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="st3tr" data-val="TD-20220305-0001">
                      <td class="tx-c">TD-20220305-0001</td>
                      <td class="tx-c">2022-07-02</td>
                    </tr>
                    <tr class="st3tr" data-val="TD-20220305-0002">
                      <td class="tx-c">TD-20220305-0002</td>
                      <td class="tx-c">2022-07-26</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                id=""
                class="table-l1 tb-op1 tb-ov1 tabBox"
                style="display: none"
              >
                <table>
                  <thead>
                    <tr>
                      <th>가중치 ID</th>
                      <th>학습일자</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="st3tr" data-val="TD-20220305-0001">
                      <td class="tx-c">TD-20220305-0005</td>
                      <td class="tx-c">344,023</td>
                    </tr>
                    <tr class="st3tr" data-val="TD-20220305-0002">
                      <td class="tx-c">TD-20220305-0006</td>
                      <td class="tx-c">344,023</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="clmBox">
            <h1 class="ti-s">선택된 가중치</h1>
            <div class="clm-body3">
              <div class="table-l1">
                <table>
                  <thead>
                    <tr>
                      <th>유형</th>
                      <th>가중치ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="tx-c">번호판 탐색</td>
                      <td class="tx-c">WP-004</td>
                    </tr>
                    <tr>
                      <td class="tx-c">문자/숫자1</td>
                      <td class="tx-c">WC1-042</td>
                    </tr>
                    <tr v-if="false">
                      <td class="tx-c" colspan="2">
                        선택된 가중치가 없습니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- button -->
        <div class="mt50 tx-c">
          <button
            type="button"
            class="btn-bg-gn wid220"
            @click="$emit('onRun', 'RUN')"
          >
            검증 시작
          </button>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import commonService from "~/service/common-service";
import rslt from "./rslt.vue";
@Component({ components: { Layout, rslt } })
export default class extends Vue {
  isRun = "";
  hdqrList = [];
  onRun(run) {
    this.isRun = run;
  }
  created() {
    this.getHdqrList();
  }
  async getHdqrList() {
    this.hdqrList = [];
    const data = await commonService.request(
      {},
      "/api/updt/hdqr/list"
    );
    data.forEach((value) => {
      this.hdqrList.push(value.hdqr_nm);
    });
    console.log("hdqrList ===",this.hdqrList);
  }
}
</script>
<style scoped></style>
