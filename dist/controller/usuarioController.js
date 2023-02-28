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
  createUserB64: () => createUserB64,
  deleteUserB64: () => deleteUserB64,
  getUsers: () => getUsers,
  sendUser: () => sendUser,
  updateUserB64: () => updateUserB64
});
module.exports = __toCommonJS(usuarioController_exports);
var dotenv = __toESM(require("dotenv"));
var import_client = require("@prisma/client");

// src/utils/logger.ts
var import_winston = require("winston");
var { combine, timestamp, json, errors } = import_winston.format;
var logger = (0, import_winston.createLogger)({
  format: combine(
    errors({ stack: true }),
    import_winston.format.splat(),
    import_winston.format.json(),
    import_winston.format.simple(),
    import_winston.format.timestamp({ format: "HH:mm:ss - DD-MM-YYYY" }),
    import_winston.format.printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`),
    import_winston.format.printf((error) => `[${error.timestamp}] ${error.level} ${error.message}`)
  ),
  transports: [
    new import_winston.transports.File({
      filename: `logger/error.log`,
      level: "error",
      maxsize: 5e7,
      // 50MB
      maxFiles: 5,
      tailable: true
      // Sobrescrever o primeiro arquivo
    }),
    new import_winston.transports.File({
      filename: `logger/info.log`,
      level: "info",
      maxsize: 5e7,
      // 50MB
      maxFiles: 5,
      tailable: true
      // Sobrescrever o primeiro arquivo
    })
  ]
});

// src/controller/usuarioController.ts
var z = __toESM(require("zod"));
var import_axios = __toESM(require("axios"));
dotenv.config();
var prisma = new import_client.PrismaClient();
var userSchema = z.object({
  criarUsuario: z.boolean(),
  nome: z.string().max(50).min(3),
  sobrenome: z.string().max(255),
  dataNascimento: z.string(),
  sociedade: z.string().optional(),
  tipoDocumento1: z.string(),
  documento1: z.string(),
  tipoDocumento2: z.string(),
  documento2: z.string(),
  email: z.string().email(),
  nomeTratamento: z.string().max(255),
  profissao: z.string(),
  telefone: z.string(),
  telefone2: z.string(),
  grupoPessoa: z.string(),
  fotoFacial: z.string()
}).required();
var createUserB64 = async (req, res) => {
  try {
    const { criarUsuario, nome, sobrenome, dataNascimento, sociedade, tipoDocumento1, documento1, tipoDocumento2, documento2, email, nomeTratamento, profissao, telefone, telefone2, grupoPessoa, fotoFacial } = userSchema.parse(req.body);
    const usuario = await prisma.usuariosSESTSENAT.create({
      data: {
        criarUsuario,
        nome,
        sobrenome,
        dataNascimento,
        sociedade,
        tipoDocumento1,
        documento1,
        tipoDocumento2,
        documento2,
        email,
        nomeTratamento,
        telefone,
        telefone2,
        profissao,
        grupoPessoa,
        fotoFacial
      }
    });
    console.log(usuario);
    res.status(200).json({ Message: "Usu\xE1rios salvos!", Error: "Falso", Status: "200 ok" });
    return;
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errorMessages = e.issues.map((issue) => issue.message);
      console.log(e.errors);
      return res.status(401).json({ Message: "Usu\xE1rios n\xE3o salvos!", Error: "Verdadeiro", Status: "400", error: errorMessages });
    } else if (e.code === "P2002") {
      return res.status(401).json({ error: "Erro interno do banco de dados", e });
    }
  }
};
var updateUserB64 = async (req, res) => {
  try {
    const { criarUsuario, nome, sobrenome, dataNascimento, sociedade, tipoDocumento1, documento1, tipoDocumento2, documento2, email, nomeTratamento, profissao, telefone, telefone2, grupoPessoa, fotoFacial } = userSchema.parse(req.body);
    const updateUser = await prisma.usuariosSESTSENAT.update({
      where: {
        documento1
      },
      data: {
        nome,
        email
      }
    });
    res.status(200).json({ message: "Atualizado", data: updateUser });
  } catch (e) {
    res.status(500).send(e);
  }
};
var deleteUserB64 = async (req, res) => {
  try {
    const { email } = req.body;
    const deleteUser = await prisma.usuariosSESTSENAT.delete({
      where: {
        email
      }
    });
    res.status(200).json({ message: "Usuario deletado", data: deleteUser });
  } catch (e) {
    res.status(500).send(e);
  }
};
var getUsers = async (req, res) => {
  try {
    const getAllUsers = await prisma.usuariosSESTSENAT.findMany();
    logger.info({ Message: "Get all users", Error: "false" });
    res.status(200).json({ getAllUsers });
  } catch (e) {
    logger.info(e);
    res.status(500).send(e);
  }
};
var sendUser = async (req, res) => {
  const optionsLogin = {
    headers: {
      "content-type": "multipart/form-data",
      // "Accept": "*/*",
      // "Accept-Encoding": "gzip, deflate, br",
      // "Connection": "keep-alive",
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
  let objData = {
    access_token: "",
    refresh_token: "",
    grant_type: "refresh_token",
    token_type: "",
    Authorization: "Basic Y2VudGVyLWFwaTphcGktc2VjcmV0",
    tenant: "newline_sistemas_de_seguranca_103147",
    newAccess_token: "",
    newRefresh_token: ""
  };
  let data = {
    "criarUsuario": true,
    "nome": "ISMAEL",
    "sobrenome": "JUNIOR",
    "dataNascimento": "09/02/2000",
    "sociedade": "PESSOA_FISICA",
    "documentosDTO": [
      {
        "tipoDocumento": "CPF",
        "documento": "674.780.260-87"
      },
      {
        "tipoDocumento": "RG",
        "documento": "5865857"
      }
    ],
    "email": "ismaeljunioar@email.com.br",
    "nomeTratamento": "String 255",
    "telefone": "+55 99 99999-9999",
    "telefone2": "+55 99 99999-9999",
    "profissao": "Aluno",
    "grupoPessoa": "Aluno"
  };
  let dataLogin = {
    username: process.env.USER_LOGIN,
    password: process.env.USER_PASSWORD,
    grant_type: "password"
  };
  let dataRefresh = {
    grant_type: process.env.LOGIN_GRANT_TYPE,
    refresh_token: ""
  };
  try {
    await import_axios.default.post(process.env.API_URL_LOGIN, dataLogin, optionsLogin).then(async function(res2) {
      objData.access_token = res2.data.access_token;
      objData.refresh_token = res2.data.refresh_token;
      objData.token_type = res2.data.token_type;
      dataRefresh.refresh_token = res2.data.refresh_token;
      await import_axios.default.post(process.env.API_URL_REFRESH, dataRefresh, optionsRefreshLogin).then(async function(res3) {
        objData.newAccess_token = res3.data.access_token;
        objData.newRefresh_token = res3.data.refresh_token;
        await import_axios.default.post(process.env.API_URL_GET, data, {
          headers: {
            "content-type": "application/json",
            "Authorization": `bearer ${objData.newAccess_token}`,
            "tenant": "newline_sistemas_de_seguranca_103147"
          }
        }).then(async function(res4) {
          console.log("debug axios 3 ", res4.data);
        });
      });
    });
  } catch (e) {
    console.log("Fail Login", e);
    res.status(400).json({ Error: e });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUserB64,
  deleteUserB64,
  getUsers,
  sendUser,
  updateUserB64
});
