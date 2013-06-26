var config = module.exports;

config["default"] = {
  rootPath: "../",
  environment: "node",
  sources: [
    "lib/appnexus.js",
    "lib/**/*.js"
  ],
  tests: [
    "test/*-test.js"
  ]
};