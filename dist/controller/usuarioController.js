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

// src/logger/logger.ts
var import_pino = __toESM(require("pino"));
var import_pino_pretty = __toESM(require("pino-pretty"));
var logger = (0, import_pino.default)({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
}, (0, import_pino_pretty.default)());

// src/controller/usuarioController.ts
var z = __toESM(require("zod"));
var import_axios = __toESM(require("axios"));
var import_form_data = __toESM(require("form-data"));
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
    logger.error(e);
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
    logger.error(e);
    res.status(500).send(e);
  }
};
var getUsers = async (req, res) => {
  try {
    const getAllUsers = await prisma.usuariosSESTSENAT.findMany();
    req.log.info({ Message: "Listar todos usu\xE1rios", Error: "falso" });
    res.status(200).json({ getAllUsers });
  } catch (e) {
    req.log.error(e);
    res.status(500).send(e);
  }
};
var sendUser = async (req, res) => {
  const options = {
    headers: {
      // "content-type": "multipart/form-data",
      // "Accept": "*/*",
      // "Accept-Encoding": "gzip, deflate, br",
      // "Connection": "keep-alive",
      "Authorization": "Basic Y2VudGVyLWFwaTphcGktc2VjcmV0"
    }
  };
  const formData = new import_form_data.default();
  let access_token;
  let refresh_token;
  let token_type;
  formData.append("username", process.env.USER_LOGIN);
  formData.append("password", process.env.USER_PASSWORD);
  formData.append("grant_type", process.env.USER_GRANT_TYPE);
  const loginApi = async () => {
    const data = import_axios.default.post(process.env.API_URL_LOGIN, formData, options).then(function(res2) {
      access_token = res2.data.access_token;
      refresh_token = res2.data.refresh_token;
      return console.log(access_token, refresh_token);
    }).catch(function(res2) {
      console.log("fail login", res2.data);
    });
  };
  loginApi();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUserB64,
  deleteUserB64,
  getUsers,
  sendUser,
  updateUserB64
});
