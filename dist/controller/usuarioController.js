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
  updateUserB64: () => updateUserB64
});
module.exports = __toCommonJS(usuarioController_exports);
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
var prisma = new import_client.PrismaClient();
var userSchema = z.object({
  nome: z.string().min(1),
  fotoBase64: z.string().min(1),
  cpf: z.string().length(11),
  email: z.string().min(1),
  fotoUrl: z.string().min(1)
}).required();
var createUserB64 = async (req, res) => {
  try {
    const users = userSchema.array().parse(req.body);
    for (const { nome, email, cpf, fotoUrl, fotoBase64 } of users) {
      console.log("--->", users);
      const usuario = await prisma.testUser.create({
        data: {
          nome,
          email,
          cpf,
          fotoUrl,
          fotoBase64
        }
      });
    }
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
    const { nome, email, cpf, fotoUrl, fotoBase64 } = userSchema.parse(req.body);
    const updateUser = await prisma.testUser.update({
      where: {
        cpf
      },
      data: {
        nome,
        email,
        fotoUrl,
        fotoBase64
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
    const { cpf } = req.body;
    const deleteUser = await prisma.testUser.delete({
      where: {
        cpf
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
    const getAllUsers = await prisma.testUser.findMany();
    req.log.info({ Message: "Listar todos usu\xE1rios", Error: "falso" });
    res.status(200).json({ getAllUsers });
  } catch (e) {
    req.log.error(e);
    res.status(500).send(e);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUserB64,
  deleteUserB64,
  getUsers,
  updateUserB64
});
