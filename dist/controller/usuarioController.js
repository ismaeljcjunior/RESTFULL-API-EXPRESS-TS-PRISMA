"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controller/usuarioController.ts
var usuarioController_exports = {};
__export(usuarioController_exports, {
  createUser: () => createUser,
  getUsers: () => getUsers
});
module.exports = __toCommonJS(usuarioController_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var createUser = async (req, res) => {
  try {
    const { nome, email, photoUrl } = req.body;
    const usuario = await prisma.testUser.create({
      data: {
        nome,
        email,
        photoUrl
      }
    });
    res.send(usuario);
  } catch (e) {
    req.log.error(e);
    res.status(500).send(e);
  }
};
var getUsers = async (req, res) => {
  try {
    const usuarios = await prisma.testUser.findMany();
    console.log(usuarios);
    req.log.info(usuarios);
    res.status(200).json({ usuarios });
  } catch (e) {
    req.log.error(e);
    res.status(500).send(e);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser,
  getUsers
});
