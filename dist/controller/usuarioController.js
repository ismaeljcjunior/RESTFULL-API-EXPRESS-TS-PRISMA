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

// src/controller/usuarioController.ts
var usuarioController_exports = {};
__export(usuarioController_exports, {
  mainRoute: () => mainRoute,
  postUser: () => postUser,
  putUser: () => putUser
});
module.exports = __toCommonJS(usuarioController_exports);
var dotenv2 = __toESM(require("dotenv"));
var import_client = require("@prisma/client");
var import_axios2 = __toESM(require("axios"));

// src/utils/loggerAPISERVICE.ts
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

// src/controller/usuarioController.ts
dotenv2.config();
var prisma = new import_client.PrismaClient();
var mainRoute = async (req, res) => {
  const dataJson = await req.body;
  const userId = Number(dataJson.matricula);
  try {
    const user = await prisma.usuariosSESTSENAT.findFirst({
      where: {
        sobrenome: userId
      }
    });
    if (!user) {
      console.log("User not found");
      postUser(req, res, dataJson);
    } else {
      putUser(req, res, dataJson, user);
      console.log("User exists");
    }
  } catch (e) {
    console.log(e);
  }
};
var postUser = async (req, res, dataJson) => {
  const ApiService = await loggerApiService(req, res);
  if (ApiService == void 0 || ApiService == null) {
    return res.status(404).json({ response: "error" });
  }
  let jsonUsuario = {
    criarUsuario: true,
    nome: "",
    sobrenome: 0,
    dataNascimento: "",
    sociedade: "PESSOA_FISICA",
    documentosDTO: [],
    email: "",
    nomeTratamento: "",
    telefone: "",
    telefone2: "",
    profissao: "Aluno",
    grupoPessoa: "Aluno",
    fotoFacial: ""
  };
  jsonUsuario.criarUsuario = dataJson.criarUsuario;
  jsonUsuario.nome = dataJson.nome;
  jsonUsuario.sobrenome = Number(dataJson.matricula);
  jsonUsuario.dataNascimento = dataJson.dataNascimento;
  for (let doc of dataJson.documentosDTO) {
    jsonUsuario.documentosDTO.push(doc);
  }
  jsonUsuario.email = dataJson.email;
  jsonUsuario.nomeTratamento = dataJson.nomeTratamento;
  jsonUsuario.telefone = dataJson.telefone;
  jsonUsuario.telefone2 = dataJson.telefone2;
  jsonUsuario.fotoFacial = dataJson.fotoFacial;
  console.log("---------->post", jsonUsuario, ApiService);
  try {
    const resPost = await import_axios2.default.post(process.env.API_URL_POST, jsonUsuario, {
      headers: {
        "content-type": "application/json",
        "Authorization": `bearer ${ApiService.newAccess_token}`,
        "tenant": process.env.LOGIN_TENANT
      }
    });
    console.log("Post response:", resPost.data);
    res.status(200).json({ response: resPost.data });
  } catch (err) {
    if (import_axios2.default.isAxiosError(err)) {
      console.error("Error during API call:", err.message);
      return { status: 400, body: JSON.stringify({ response: String(err.message) }) };
    } else {
      console.error("Unknown error:", err);
      return { status: 400, body: JSON.stringify({ response: String(err) }) };
    }
  }
};
var putUser = async (req, res, dataJson, user) => {
  const ApiService = await loggerApiService(req, res);
  if (ApiService == void 0 || ApiService == null) {
    return res.status(404).json({ response: "error" });
  }
  try {
    const dataJson2 = await req.body;
    let jsonUsuario = {
      id: "",
      nome: "",
      sobrenome: 0,
      dataNascimento: "",
      sociedade: "PESSOA_FISICA",
      documentosDTO: [],
      email: "",
      nomeTratamento: "",
      telefone: "",
      telefone2: "",
      profissao: "Aluno",
      grupoPessoa: "Aluno",
      fotoFacial: ""
    };
    jsonUsuario.id = user.idUsuario_SCOND !== null ? user.idUsuario_SCOND.toString() : "";
    jsonUsuario.nome = dataJson2.nome;
    jsonUsuario.sobrenome = Number(dataJson2.matricula);
    jsonUsuario.dataNascimento = dataJson2.dataNascimento;
    for (let doc of dataJson2.documentosDTO) {
      jsonUsuario.documentosDTO.push(doc);
    }
    jsonUsuario.email = dataJson2.email;
    jsonUsuario.nomeTratamento = dataJson2.nomeTratamento;
    jsonUsuario.telefone = dataJson2.telefone;
    jsonUsuario.telefone2 = dataJson2.telefone2;
    jsonUsuario.fotoFacial = dataJson2.fotoFacial;
    console.log("---------->put", jsonUsuario);
  } catch (e) {
    console.log(e);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mainRoute,
  postUser,
  putUser
});
