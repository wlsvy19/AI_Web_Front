<template>
  <layout>
    <div id="contents">
      <div class="tit-bar tit-NavType1">
        <div class="tit-top">
          <h2 class="ti">사용자 관리</h2>
        </div>
      </div>

      <div id="conts" class="conts-box1">
        <h1 class="ti-s mb65">사용자 조회</h1>
        <div class="user-box">
          <div class="user-l">
            <div class="table-l1">
              <table class="tx-c">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>연락처</th>
                    <th>E-mail</th>
                    <th>관련등급</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in userList">
                    <tr :key="index" @click="onSelUser(item)">
                      <td>{{ item.userId }}</td>
                      <td>{{ item.userNm }}</td>
                      <td>{{ item.moblNo }}</td>
                      <td>{{ item.email }}</td>
                      <td>{{ item.gradCd }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <pagination
              :pageInfo="pageInfo"
              @pagination="(p) => onSearch(p.pageNo)"
            />
          </div>

          <!-- 선택시 active class add -->
          <div class="user-r">
            <fieldset class="user-inp">
              <legend>사용자 추가및 변경 폼</legend>
              <ul>
                <li>
                  <label for="unm">이름</label>
                  <input
                    :disabled="readonly()"
                    type="text"
                    v-model="user.userNm"
                    class="inp"
                    id="unm"
                  />
                </li>
                <li>
                  <label for="uid">ID</label>
                  <input
                    :disabled="readonly() || user.userNo != ''"
                    v-model="user.userId"
                    type="text"
                    class="inp"
                    id="uid"
                  />
                </li>
                <li>
                  <label for="upw"> PW </label>
                  <input
                    :disabled="readonly()"
                    v-model="user.userPswd"
                    type="password"
                    class="inp"
                    id="upw"
                    :placeholder="`${user.userNo ? 'pw 수정시 입력' : ''}`"
                  />
                </li>
                <li>
                  <label for="upw-r">PW 확인</label>
                  <input
                    :disabled="readonly()"
                    v-model="user.userPswd1"
                    type="password"
                    class="inp"
                    id="upw-r"
                    :placeholder="`${user.userNo ? 'pw 수정시 입력' : ''}`"
                  />
                </li>
                <li>
                  <label for="ucl">연락처</label>
                  <input
                    :disabled="readonly()"
                    v-model="user.moblNo"
                    type="text"
                    class="inp"
                    id="ucl"
                  />
                </li>
                <li>
                  <label for="uem">E-mail</label>
                  <input
                    :disabled="readonly()"
                    type="text"
                    class="inp"
                    v-model="user.email"
                    id="uem"
                  />
                </li>
                <li>
                  <label for="uat">권한등급</label>
                  <label for="sel001" class="hidden">선택해주세요</label>
                  <select
                    :disabled="readonly()"
                    id="sel001"
                    class="select2"
                    v-model="user.gradCd"
                  >
                    <option value="10">사용자</option>
                    <option value="90">관리자</option>
                  </select>
                </li>
              </ul>
            </fieldset>
            <div class="user-btn">
              <!-- <button type="button" class="btn btn-usr bt-u-sch">조회</button>-->
              <button
                v-if="type === 'update' || type === 'add'"
                type="button"
                :class="`btn btn-usr bt-u-chi ${type === 'save' ? 'red' : ''}`"
                @click="onSave()"
              >
                저장
              </button>
              <button
                v-if="user1.userId"
                type="button"
                :class="`btn btn-usr bt-u-mdf ${
                  type === 'update' ? 'red' : ''
                }`"
                @click="onChangeType('update')"
              >
                수정
              </button>
              <button
                type="button"
                v-if="user1.userId"
                :class="`btn btn-usr bt-u-del ${
                  type === 'delete' ? 'red' : ''
                }`"
                @click="onDelete()"
              >
                삭제
              </button>
              <button
                type="button"
                @click="onAdd()"
                :class="`btn btn-usr bt-u-add ${type === 'add' ? 'red' : ''}`"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Layout from "~/components/layout.vue";
import { IPageInfoModel } from "~/models/common-model";
import commonService from "~/service/common-service";
@Component({ components: { Layout } })
export default class extends Vue {
  user = {
    userId: "",
    userNo: "",
    userNm: "",
    userPswd: "",
    userPswd1: "",
    moblNo: "",
    gradCd: "",
    email: "",
  };
  user1 = {};
  userList = [];
  type = "read";
  pageInfo: IPageInfoModel = commonService.getPageInitInfo();
  async onSearch(pageNo: number) {
    const newpage = { ...this.pageInfo, pageNo };
    const data = await commonService.request(
      { startDate: "", endDate: "", ...newpage },
      "/api/user-info/list"
    );
    newpage.totalCount = data.page.totalCount;
    this.userList = data.list;
    this.pageInfo = { ...newpage };
  }
  onChangeType(type) {
    this.type = type;
  }
  onAdd() {
    this.type = "add";
    this.user = {
      userId: "",
      userNo: "",
      userNm: "",
      userPswd: "",
      userPswd1: "",
      moblNo: "",
      email: "",
      gradCd: "10",
    };
  }
  async onSave() {
    //this.type = "save";
    console.log("user==", this.user);
    const user = { ...this.user };
    if (!user.userNm) return await this.$alert("이름을 입력하세요");
    if (!user.userId) return await this.$alert("아이디를 입력하세요.");
    if (!user.userNo) {
      if (!user.userPswd) return await this.$alert("비밀번호를 입력하세요.");
      if (!user.userPswd1)
        return await this.$alert("비밀번호확인을 입력하세요.");
      if (user.userPswd !== user.userPswd1)
        return await this.$alert("비밀번호 확인이 일치하지 않습니다.");
    } else {
      if (user.userPswd) {
        if (!user.userPswd) return await this.$alert("비밀번호를 입력하세요.");
        if (!user.userPswd1)
          return await this.$alert("비밀번호확인을 입력하세요.");
        if (user.userPswd !== user.userPswd1)
          return await this.$alert("비밀번호 확인이 일치하지 않습니다.");
      }
    }
    if (!user.moblNo) return await this.$alert("연락처를 입력하세요.");
    console.log("저장 실시");
    const rt = await commonService.request(user, "/api/user-info/save");
    console.log(rt);
    if (rt && rt != null) await this.$alert(rt);
    else {
      await this.$alert("성공");
      this.init();
      this.onSearch(1);
    }
  }
  readonly() {
    return this.type === "read";
  }
  async onDelete() {
    if (this.user.userId === "admin") {
      await this.$alert("슈퍼 관리자는 삭제할수가 없습니다.");
      return;
    }
    if (await this.$confirm("삭제하시겠습니까?")) {
      const rt = await commonService.request(this.user, "/api/user-info/del");
      await this.$alert("성공");
      this.init();
      this.onSearch(1);
    }
  }
  onSelUser(info) {
    this.type = "read";
    console.log(info);
    this.user = info;
    this.user1 = info;
  }
  init() {
    this.user = {
      userId: "",
      userNo: "",
      userNm: "",
      userPswd: "",
      userPswd1: "",
      moblNo: "",
      gradCd: "",
      email: "",
    };
    this.type = "read";
  }
  created() {
    this.init();
    this.onSearch(1);
  }
}
</script>
<style scoped>
.red {
  color: red;
}
</style>
