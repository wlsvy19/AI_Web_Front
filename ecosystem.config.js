module.exports = {
  apps: [
    {
      name: "ails-vue",
      exec_mode: "cluster",
      instances: "2", // max Or a number of instances
      script: "./node_modules/nuxt/bin/nuxt.js",
      args: "start",
    },
  ],
};
