"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/server.ts
var import_express2 = __toESM(require("express"));
var import_dotenv = __toESM(require("dotenv"));

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
    import_winston.format.printf((info) => {
      if (info.stack) {
        return `[${info.timestamp}] ${info.level} ${info.stack}`;
      }
      return `[${info.timestamp}] ${info.level} ${info.message}`;
    }),
    import_winston.format.printf((error) => {
      if (error.stack) {
        return `[${error.timestamp}] ${error.level} ${error.stack}`;
      }
      return `[${error.timestamp}] ${error.level} ${error.message}`;
    })
  ),
  transports: new import_winston.transports.File({
    filename: "logger/server.log",
    format: import_winston.format.combine(
      import_winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
      import_winston.format.align(),
      import_winston.format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
    )
  })
});

// src/routes/routes.ts
var import_express = __toESM(require("express"));
var import_body_parser = __toESM(require("body-parser"));
var import_cors = __toESM(require("cors"));
var import_morgan_body = __toESM(require("morgan-body"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));

// src/controller/usuarioController.ts
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
        "Content-Type": "application/json",
        "Authorization": `bearer ${ApiService.newAccess_token}`,
        "tenant": process.env.LOGIN_TENANT,
        "Accept": "application/json"
        // Set the Accept header to request a JSON response
      }
    });
    console.log("Post response:", resPost.data);
    res.status(200).json({ response: resPost.data });
  } catch (err) {
    if (import_axios2.default.isAxiosError(err)) {
      console.error("Error during API call:", err.message);
      return res.status(404).json({ response: err.message });
    } else {
      console.error("Unknown error:", err);
      return res.status(404).json({ response: err });
    }
  }
};

// src/routes/routes.ts
var app = (0, import_express.default)();
var logFilePath = import_path.default.join("logger", "serverHTTP.log");
var log = import_fs.default.createWriteStream(logFilePath, { flags: "a" });
app.use(import_body_parser.default.json());
app.use((0, import_cors.default)({ origin: "*" }));
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
(0, import_morgan_body.default)(app, {
  noColors: true,
  stream: log
});
app.post("/usuarios", mainRoute);
app.get("/", (req, res) => {
  res.send("Server is running 1.0");
  logger.info("Server is running 1.0");
});
var appRoutes = app;

// src/server.ts
var import_body_parser2 = __toESM(require("body-parser"));
var import_cors2 = __toESM(require("cors"));
import_dotenv.default.config();
var app2 = (0, import_express2.default)();
var port = process.env.PORT;
app2.use(import_body_parser2.default.json({
  limit: "50mb"
}));
app2.use(import_body_parser2.default.urlencoded({
  limit: "50mb",
  parameterLimit: 1e5,
  extended: true
}));
app2.use(import_express2.default.json());
app2.use("/", appRoutes);
app2.use((0, import_cors2.default)());
app2.listen(port, () => {
  console.log(`\u26A1\uFE0F[${port}]: Server is running at http://localhost:${port}`);
  logger.info(`\u26A1\uFE0F[${port}]: Server is running at http://localhost:${port}`);
});
