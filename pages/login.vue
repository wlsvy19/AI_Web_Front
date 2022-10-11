<template>
  <layout>
    <div id="contents">
      <div id="loginBox">
        <div id="loginForm">
          <h1>로그인</h1>
          <fieldset class="fm">
            <legend>로그인폼 영역</legend>
            <label for="log-uid" class="loginInpBox">
              <!-- user id -->
              <input
                type="text"
                ref="loginid"
                class="loginInp"
                v-model="search.loginId"
                id="log-uid"
                placeholder="아이디"
              />
            </label>
            <label for="log-upw" class="loginInpBox mt5">
              <!-- password -->
              <input
                v-model="search.loginPwd"
                type="password"
                class="loginInp"
                id="log-upw"
                placeholder="비밀번호"
                @keyup.enter="handleLogin"
              />
            </label>
            <!-- error message box -->
            <div id="login-err" class="errBox"></div>

            <!-- login button -->
            <button
              type="button"
              id="goLogin"
              @click="handleLogin"
              class="btn-bg-gn"
            >
              로그인
            </button>

            <div class="user-find" v-if="false">
              <a href="#">아이디</a>/<a href="#" @click="showPw = true"
                >비밀번호 찾기</a
              >
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    <loginPw v-if="showPw === true" @closeBtn="() => (showPw = false)" />
  </layout>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ILoginSearchModel } from "~/models/login-model";
import commonService from "~/service/common-service";
import * as cookie from "@/utils/cookies";
import loginPw from "./loginPw.vue";
import loginService from "~/service/login-service";
import { IBaseResponseModel } from "~/models/common-model";
@Component({
  components: { loginPw },
})
export default class extends Vue {
  showPw = false;
  readonly = true;
  chked = false;
  search: ILoginSearchModel = {
    loginId: "",
    loginPwd: "",
  };
  async handleLogin() {
    if (!this.search.loginId)
      return await this.$util.alert("아이디 입력하세요.");
    if (!this.search.loginPwd)
      return await this.$util.alert("비밀번호를 입력하세요.");
    const result = await loginService.login(this.search);
    if (result.isok) {
      const data = result.data;
      await this.$store.dispatch("setUserInfo", data);
      console.log("result", result);
      if (this.chked) {
        cookie.setCookie("loginid", this.search.loginId);
      } else {
        cookie.setCookie("loginid", "");
      }
      if (result) {
        this.$router.push("/");
      }
    } else {
      if (result.data === "PW_TIME_ERR")
        this.$alert(
          "비밀번호 유효기간이 \n 만료되었습니다. 비밀번호를 재설정 해 주세요.\n"
        );
      else if (result.data === "STOP_USER")
        this.$alert(
          "관리자에 의해 이용 정지된 계정입니다. \n 로그인을 원하시면 운영팀으로 문의 바랍니다.\n"
        );
      else this.$alert("입력하신 로그인 정보가 일치하지 않습니다.");
    }
  }
  mounted() {
    // (this.$refs.loginid as HTMLInputElement).focus();
  }
  created() {
    const loginId = cookie.getCookie("loginid");
    if (loginId) {
      this.chked = true;
      this.search.loginId = loginId;
    }
  }
}
</script>

<style scoped></style>
