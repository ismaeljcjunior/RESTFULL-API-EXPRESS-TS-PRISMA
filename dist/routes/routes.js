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

// src/routes/routes.ts
var routes_exports = {};
__export(routes_exports, {
  appRoutes: () => appRoutes
});
module.exports = __toCommonJS(routes_exports);
var import_express = __toESM(require("express"));

// src/controller/usuarioController.ts
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
var prisma = new import_client.PrismaClient();
var createUser = async (req, res) => {
  try {
    const { nome, email, fotoBase64 } = req.body;
    const usuario = await prisma.testUser.create({
      data: {
        nome,
        email,
        fotoBase64
      }
    });
    res.status(200).json({ Message: "User successfully saved", Error: "False" });
  } catch (e) {
    logger.error(e);
    res.status(500).send(e);
  }
};
var getUsers = async (req, res) => {
  try {
    const getAllUsers = await prisma.testUser.findMany();
    req.log.info({ Message: "Get all users", Error: "false" });
    res.status(200).json({ getAllUsers });
  } catch (e) {
    req.log.error(e);
    res.status(500).send(e);
  }
};

// src/routes/routes.ts
var import_body_parser = __toESM(require("body-parser"));
var import_cors = __toESM(require("cors"));
var port = process.env.PORT;
var app = (0, import_express.default)();
app.use(import_body_parser.default.json());
app.use((0, import_cors.default)({ origin: "*" }));
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.log = logger.child({
    requestId: Math.random().toString(36).substr(2, 9)
  });
  next();
});
app.post("/usuarios", createUser);
app.get("/usuarios", getUsers);
app.get("/", (req, res) => {
  res.send("Server is running 1.0");
  req.log.info("Server is running 1.0");
});
var appRoutes = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  appRoutes
});
