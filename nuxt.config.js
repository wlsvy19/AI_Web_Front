export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "universal",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  pwa: { icon: { fileName: "favicon.ico?v1" } },
  head: {
    title: "인공지능(A.I) 영상학습시스템",
    meta: [
      { charset: "utf-8" },
      {
        name: "keyword",
        content: "ails",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
      {
        hid: "description",
        name: "description",
        content: "AILS",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: "/css/global.css" },
      { rel: "stylesheet", href: "/css/normalize.css" },
      { rel: "stylesheet", href: "/css/common.css" },
      { rel: "stylesheet", href: "/css/layout.css" },
    ],
    script: [
      // { src: "/js/common.js" },
      { src: "/js/echarts.min.js" },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 8080, // default: 3000
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#2169D0" },

  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    "~/plugins/disableLogs.js",
    "@/plugins/element-ui",
    "@/plugins/axios-accessor",
    { src: "@/plugins/global.proto.ts", ssr: false },
    "@/plugins/common",
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxt/typescript-build"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/proxy",
    "@nuxtjs/pwa",
    "@nuxtjs/style-resources",
    "cookie-universal-nuxt",
  ],
  // 请求代理配置
  proxy: {
    "/v1": {
      target: "http://127.0.0.1:7766",
      changeOrigin: true,
      pathRewrite: {
        "^/v1": "",
        changeOrigin: true,
      },
    },
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
    prefix: "/v1",
    credential: true,
  },
  styleResources: {
    // scss: ['@/assets/styles/base-variables.scss', '@/styles/index.scss'],
  },
  build: {
    transpile: [/^element-ui/],
  },
  router: {
    middleware: ["auth"],
    scrollBehavior() {
      return { x: 0, y: 0 };
    },
  },
};
