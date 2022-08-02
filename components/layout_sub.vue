<template>
  <div id="wrapper">
    <header id="header">
      <div id="header-in">
        <div id="header-t">
          <h1 id="ci"><nuxt-link to="/">한국도로공사</nuxt-link></h1>
          <nav id="gnb">
            <ol class="flex">
              <template v-for="(item, index) in menus">
                <li
                  :key="index"
                  @mouseenter="handleMenu(index, true)"
                  @mouseleave="handleMenu(index, false)"
                >
                  <a
                    :class="`${item.active ? 'active' : ''}`"
                    style="cursor: pointer"
                    >{{ item.MENU_NM }}</a
                  >
                  <div class="subMenu">
                    <ul>
                      <!-- <template v-for="item1 in item.list">
                        <li :key="item.MENU_NO + item1.MENU_NO">
                          <nuxt-link :to="item1.MENU_PATH">
                            {{ item1.MENU_NM }}</nuxt-link
                          >
                        </li>
                      </template> -->
                    </ul>
                  </div>
                </li>
              </template>
            </ol>
          </nav>

          <div id="user" class="tx-r">
            <span id="user-id" v-if="$store.state.userInfo.userNo">{{
              $store.state.userInfo.userNm
            }}</span>
            <a
              href=""
              @click="$store.dispatch('LogOut', false)"
              v-if="$store.state.userInfo.userNo"
              >로그아웃</a
            >
            <nuxt-link to="/login" class="cursor: pointer;" v-else
              >로그인</nuxt-link
            >
          </div>
        </div>
      </div>
      <div id="location">
        <div id="loc-in">
          <!-- <template v-if="Object.keys(currentMenu).length > 0">
            {{ (currentMenu || {}).MENU_NM }}<span class="loc-arr"> &gt; </span>
            {{ ((currentMenu || {}).subMenu || {}).MENU_NM }}
          </template>
          <template v-if="this.$route.path === '/'">상황판 </template> -->
        </div>
      </div>
    </header>

    <div id="ex-container">
      <slot></slot>
    </div>

    <!-- <footer id="footer">
      <div id="footer-in">
        <span id="copyright"
          >COPYRIGHT ⓒ 2022 Korea Expressway Corporation. All Rights
          reserved.</span
        >
      </div>
    </footer> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
@Component({
  components: {},
})
export default class extends Vue {
  currentMenu: any = {};
  showMyPage = false;
  showPw = false;
  menus: any[] = [];

  @Watch("$store.state.currentMenu", { deep: true })
  watchCurrentMenu(newVal: any, oldVal) {
    this.currentMenu = newVal;
  }
  @Watch("$store.state.menuList", { deep: true })
  watchMenuList(newVal: any, oldVal) {
    this.menus = newVal;
  }

  handleMenu(index, active) {
    const menus = this.menus.map((v, idx) => {
      if (index === idx) {
        const item = { ...this.menus[index], active };
        return item;
      }
      return v;
    });
    this.$store.dispatch("setMenus", menus);
  }

  async handleLogout() {
    await this.$store.dispatch("LogOut");
    this.$router.push("/login");
  }

  async created() {
    this.currentMenu = this.$store.state.currentMenu;
    this.menus = this.$store.state.menuList;
  }
}
</script>

<style scoped></style>
