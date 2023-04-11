"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/loggerAPISERVICE copy.ts
var loggerAPISERVICE_copy_exports = {};
__export(loggerAPISERVICE_copy_exports, {
  loggerApiService: () => loggerApiService
});
module.exports = __toCommonJS(loggerAPISERVICE_copy_exports);
var dotenv = __toESM(require("dotenv"));
var import_axios = __toESM(require("axios"));
dotenv.config();
var loggerApiService = async (req, res) => {
  const optionsLogin = {
    headers: {
      "content-type": "multipart/form-data",
      "Authorization": process.env.LOGIN_AUTHORIZATION
    }
  };
  const optionsRefreshLogin = {
    headers: {
      "content-type": "multipart/form-data",
      "Authorization": process.env.LOGIN_AUTHORIZATION,
      "tenant": process.env.LOGIN_TENANT
    }
  };
  let objDataLogin = {
    access_token: "",
    refresh_token: "",
    grant_type: "refresh_token",
    token_type: "",
    Authorization: process.env.LOGIN_AUTHORIZATION,
    tenant: process.env.LOGIN_TENANT,
    newAccess_token: "",
    newRefresh_token: ""
  };
  let dataLogin = {
    username: process.env.USER_LOGIN,
    password: process.env.USER_PASSWORD,
    grant_type: process.env.USER_GRANT_TYPE
  };
  let dataRefresh = {
    grant_type: process.env.LOGIN_GRANT_TYPE,
    refresh_token: ""
  };
  try {
    const resLogin = await import_axios.default.post(process.env.API_URL_LOGIN, dataLogin, optionsLogin);
    objDataLogin.access_token = resLogin.data.access_token;
    objDataLogin.refresh_token = resLogin.data.refresh_token;
    objDataLogin.token_type = resLogin.data.token_type;
    dataRefresh.refresh_token = resLogin.data.refresh_token;
    const resRefresh = await import_axios.default.post(process.env.API_URL_REFRESH, dataRefresh, optionsRefreshLogin);
    objDataLogin.newAccess_token = resRefresh.data.access_token;
    objDataLogin.newRefresh_token = resRefresh.data.refresh_token;
    return objDataLogin;
  } catch (e) {
    console.log(e);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loggerApiService
});
