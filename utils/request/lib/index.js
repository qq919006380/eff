"use strict";

const axios = require("axios");
const BASE_URL = process.env.EFF_CLI_BASE_URL
  ? process.env.EFF_CLI_BASE_URL
  : "http://test.com:7001";

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});
module.exports = request;
