<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top flex flex-btw">
          <h2 class="ti">
            {{ ((currentMenu || {}).subMenu || {}).MENU_NM }} 완료
          </h2>
        </div>
      </div>

      <div id="conts" class="conts-box1">
        <div class="class-ver-top">
          <div class="verifi-file-info">
            정확도 <strong>98.6%</strong
            ><span class="verifi-file-cnt">(일치 32,445장 / 33,245장)</span>
          </div>
          <div class="chkbox2">
            <input type="checkbox" id="th001" />
            <label for="th001" class="th_chk">확인 필요만 보기</label>
          </div>
        </div>

        <div class="class-ver-body">
          <div class="ver-file_list">
            <div class="file-item" @click="onShowPop(true)">
              <figure>
                <img src="/images/vi_ex.jpg" width="191" height="107" alt="" />
              </figure>
              <!-- 결과가 동일시 -->
              <span class="ver-chk ver-checked">동일함</span>
              <!-- <span class="ver-chk ver-exam">확인필요</span>
                                <span class="ver-chk ver-confm">확인완료</span> -->
            </div>
            <div class="file-item" @click="onShowPop(true)">
              <figure>
                <img src="/images/vi_ex.jpg" width="191" height="107" alt="" />
              </figure>
              <!-- 결과가 동일시 -->
              <span class="ver-chk ver-checked">동일함</span>
              <!-- <span class="ver-chk ver-exam">확인필요</span>
                                <span class="ver-chk ver-confm">확인완료</span> -->
            </div>
            <div class="file-item" @click="onShowPop(true)">
              <figure>
                <img src="/images/vi_ex.jpg" width="191" height="107" alt="" />
              </figure>
              <!-- 결과가 동일시 -->
              <span class="ver-chk ver-exam">확인필요</span>
              <!-- <span class="ver-chk ver-confm">확인완료</span> -->
            </div>
            <div class="file-item" @click="onShowPop(true)">
              <figure>
                <img src="/images/vi_ex.jpg" width="191" height="107" alt="" />
              </figure>
              <!-- 결과가 동일시 -->
              <!-- <span class="ver-chk ver-exam">확인필요</span> -->
              <span class="ver-chk ver-confm">확인완료</span>
            </div>
            <div class="file-item" @click="onShowPop(true)">
              <figure>
                <img src="/images/vi_ex.jpg" width="191" height="107" alt="" />
              </figure>
              <!-- 결과가 동일시 -->
              <!-- <span class="ver-chk ver-exam">확인필요</span> -->
              <span class="ver-chk ver-confm">확인완료</span>
            </div>
          </div>
          <button type="button" class="file-nav file-prev">이전</button>
          <button type="button" class="file-nav file-next">다음</button>

          <div class="tx-c mt45">
            <button
              type="button"
              class="btn-bg-gn wid220"
              @click="$emit('onRun', '')"
            >
              검증 완료
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="popup pop2" v-if="showPop" :style="`display:block;left:30%`">
      <div class="pop-body">
        <figure class="ver-m-img">
          <img src="/images/vi_ex.jpg" width="666" height="373" alt="" />
        </figure>
        <div class="ver-i-cont">
          <figure class="ver-s-img">
            <img src="/images/vi_ex.jpg" width="232" height="129" alt="" />
          </figure>
          <div class="table-v3 ver-s-cont">
            <table class="tx-c">
              <colgroup>
                <col width="137" />
                <col width="*" />
                <col width="120" />
              </colgroup>
              <tbody>
                <tr>
                  <th>라벨링 데이터</th>
                  <td>서울04가1234</td>
                  <td>
                    <button type="button" class="btn btn-sz2 btn-l-b-gn">
                      정답
                    </button>
                  </td>
                </tr>
                <tr>
                  <th>라벨링 데이터</th>
                  <td>서울04가1234</td>
                  <td>
                    <button type="button" class="btn btn-sz2 btn-l-b-gn">
                      정답
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
@Component({ components: { Layout } })
export default class extends Vue {
  showPop = false;
  currentMenu: any = {};
  created() {
    this.currentMenu = this.$store.state.currentMenu;
  }
  onShowPop(show) {
    this.showPop = show;
  }
}
</script>
<style scoped></style>
