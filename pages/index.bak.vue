<template>
  <layout>
    <div id="contents">
      <div id="introBox">
        <div class="int-menu">
          <div class="i-item">
            <a>
              <h1>01</h1>
              <p class="i-c">
                미오인식 유형분류<br />{{ comma(data.nmrecgCnt) }}건/{{
                  comma(data.nmrecgSize)
                }}KB
              </p>
            </a>
          </div>
          <div class="i-item">
            <a>
              <h1>02</h1>
              <p class="i-c">
                미오인식 유형분류<br />{{ comma(data.learnCnt) }}건/{{
                  comma(data.learnSize)
                }}KB
              </p>
            </a>
          </div>
          <div class="i-item">
            <a>
              <h1>03</h1>
              <p class="i-c">
                학습결과<br />{{ comma(data.learnRsltCnt) }}건/{{
                  data.learnRsltRate
                }}%
              </p>
            </a>
          </div>
          <div class="i-item">
            <a>
              <h1>04</h1>
              <p class="i-c">트레이닝<br />소요/잔여시간</p>
            </a>
          </div>
          <div class="i-item">
            <a>
              <h1>05</h1>
              <p class="i-c">알고리즘 버전/<br />업데이트 일자</p>
            </a>
          </div>
          <div class="i-item">
            <a>
              <h1>06</h1>
              <p class="i-c">
                업데이트 후<br />
                단차로/다차로 및<br />
                전면/후면별 인식률 변화
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import commonService from "~/service/common-service";
import { comma } from "~/utils/common";
@Component({ components: { Layout } })
export default class extends Vue {
  data: any = {};
  comma(num) {
    return comma(num);
  }
  async created() {
    const data = await commonService.request({}, "/api/dashboard/data");
    console.log(data);
    this.data = data;
  }
}
</script>
<style scoped></style>
