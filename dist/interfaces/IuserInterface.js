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

// src/interfaces/IuserInterface.ts
var IuserInterface_exports = {};
__export(IuserInterface_exports, {
  documentoSchema: () => documentoSchema,
  userSchema: () => userSchema
});
module.exports = __toCommonJS(IuserInterface_exports);
var z = __toESM(require("zod"));
var documentoSchema = z.object({
  tipoDocumento: z.string(),
  documento: z.string()
}).required();
var userSchema = z.object({
  criarUsuario: z.boolean(),
  nome: z.string(),
  sobrenome: z.string(),
  dataNascimento: z.string(),
  sociedade: z.string().optional(),
  email: z.string().email(),
  nomeTratamento: z.string(),
  profissao: z.string(),
  documentosDTO: z.array(documentoSchema).min(1),
  telefone: z.string(),
  telefone2: z.string(),
  grupoPessoa: z.string(),
  fotoFacial: z.string()
}).required();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  documentoSchema,
  userSchema
});
