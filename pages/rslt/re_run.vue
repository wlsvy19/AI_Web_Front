<template>
  <layout>
    <div id="contents">
      <div id="ing-content">
        <h1 class="ti">재인식 엔진 비교 검증 진행중</h1>

        <div class="table-v1 mb20">
          <table>
            <colgroup>
              <col width="15%" />
              <col width="35%" />
              <col width="15%" />
              <col width="35%" />
            </colgroup>
            <tbody>
              <tr>
                <th>대상 영업소</th>
                <td>OO본부 OO지사 OO영업소</td>
                <th>날짜</th>
                <td>2022-04-22</td>
              </tr>
              <tr>
                <th>TCS/HIPASS</th>
                <td>전체</td>
                <th>시간</th>
                <td>00:00~24:00</td>
              </tr>
              <tr>
                <th>자로 번호</th>
                <td colspan="3">전체</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-v2">
          <table>
            <tbody>
              <tr>
                <th>번호판 탐색</th>
                <th>문자/숫자1</th>
                <th>문자/숫자2</th>
              </tr>
              <tr>
                <td class="tx-c">WP-004</td>
                <td class="tx-c">WP-004</td>
                <td class="tx-c">WP-004</td>
              </tr>
              <tr>
                <th>문자/숫자3</th>
                <th>꺾임/훼손</th>
                <th>스미어/비차량</th>
              </tr>
              <tr>
                <td class="tx-c">WP-004</td>
                <td class="tx-c">WP-004</td>
                <td class="tx-c">WP-004</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 진행률 progress bar -->
        <div class="progressBox">
          <strong class="prgs-ing">150장</strong>
          <span class="prgs-val">/ 10000000장 진행중</span>
          <!-- progress value에 데이터 값 넣으면 됩니다. -->
          <progress
            class="prog-bar"
            id="ver-prgs"
            value="30"
            min="10"
            max="100"
          ></progress>
          <div class="prgs-ing-per"><span class="per">76%</span> 검증중</div>
        </div>

        <div class="tx-c mt50">
          <button
            type="button"
            class="btn btn-sz4 btn-gr1"
            @click="$emit('onRun', 'FINISH')"
          >
            학습중지
          </button>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import rslt from "./rslt.vue";
@Component({ components: { Layout, rslt } })
export default class extends Vue {
  isRun = "";
  onRun(run) {
    this.isRun = run;
  }
}
</script>
<style scoped></style>
