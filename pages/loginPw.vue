<template>
  <el-dialog
    :close-on-click-modal="false"
    title="비밀번호 찾기"
    :visible="true"
    width="300"
    :before-close="onClose"
  >
    <section class="right_wing_contents" id="right_wing_contents">
      <section class="box_wrap">
        <form
          name="frm"
          onsubmit="return frmVerify(this);"
          style="position: relative"
        >
          <fieldset class="box_wrap">
            <h5>비밀번호 찾기</h5>
            <table class="tbl_update">
              <colgroup>
                <col width="90" />
                <col />
                <!-- <col width="90"/><col/> -->
              </colgroup>
              <tbody>
                <tr class="blr0">
                  <th scope="row" style="font-weight: 600">이름</th>
                  <td>
                    <input
                      type="text"
                      placeholder="이름"
                      v-model="searchPw.userNm"
                      maxlength="100"
                      style="width: 200px"
                    />
                  </td>
                </tr>
                <tr class="blr0">
                  <th scope="row" style="font-weight: 600">아이디</th>
                  <td>
                    <input
                      type="text"
                      placeholder="아이디"
                      v-model="searchPw.loginId"
                      class="istel"
                      maxlength="100"
                      style="width: 200px"
                    />
                  </td>
                </tr>
                <tr class="blr0">
                  <th scope="row" style="font-weight: 600">이메일</th>
                  <td>
                    <input
                      type="text"
                      placeholder="이메일"
                      v-model="searchPw.email"
                      class="istel"
                      maxlength="100"
                      style="width: 200px"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
          <div
            class="btn_pop_wrap pt0"
            style="display: inline-block; margin-top: 10px"
          >
            <div class="a_c">
              <button
                @click="onFindPw()"
                type="button"
                class="btns darkgray"
                style="margin-right: 7px"
              >
                비밀번호 찾기
              </button>
              <button type="button" @click="onClose()" class="btns darkgray">
                닫기
              </button>
            </div>
          </div>
        </form>
      </section>
      <!-- MYPAGE// -->
    </section>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { IFindIdModel, IFindPwModel } from "~/models/login-model";
import loginService from "~/service/login-service";

@Component({
  components: {},
  data: () => {
    return {};
  },
})
export default class extends Vue {
  searchId: IFindIdModel = {
    email: "",
    userNm: "",
  };
  searchPw: IFindPwModel = {
    email: "",
    loginId: "",
    userNm: "",
  };
  message = "";
  loginPwd = "";
  loginPwd1 = "";
  loginPwd2 = "";
  info: any = {};
  onInit() {
    console.log("init");
  }
  async onSave() {
    if (!this.loginPwd)
      return await this.$util.alert("기존 비밀번호를 입력하세요.");
    if (!this.loginPwd1)
      return await this.$util.alert("새 비밀번호를 입력하세요.");
    if (this.$util.pwPolicy(this.loginPwd1))
      return await this.$util.alert(
        "비밀번호는 숫자와 영문(소문자) 특수문자 조합으로 입력 하세요."
      );
    if (this.loginPwd1 !== this.loginPwd2)
      return await this.$util.alert("비밀번호가 다릅니다.");
    const param = {
      userNo: this.$store.state.userInfo.userNo,
      loginPwd: this.loginPwd,
      newLoginPwd: this.loginPwd1,
    };
  }
  async onFindPw() {
    if (!this.searchPw.userNm) return await this.$alert("이름을 입력하세요.");
    if (!this.searchPw.loginId)
      return await this.$alert("아이디를 입력하세요.");
    if (!this.searchPw.email) return await this.$alert("이메일을 입력하세요.");
    const result = await loginService.findPw(this.searchPw);
    if (result.message) return await this.$alert(result.message + "");
    return await this.$alert("메일 발송하였습니다.");
  }
  onClose() {
    this.$emit("closeBtn");
  }
}
</script>

<style scoped></style>
