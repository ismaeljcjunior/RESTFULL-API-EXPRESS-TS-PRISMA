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

// src/controller/usuarioController.ts
var import_axios = __toESM(require("axios"));
dotenv.config();
var prisma = new import_client.PrismaClient();
var createUser = async (req, res) => {
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
    Authorization: process.env.LOGIN_AUTHORIZATION,
    tenant: process.env.LOGIN_TENANT,
    newAccess_token: "",
    newRefresh_token: ""
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
    const dataJson = await req.body;
    let jsonUsuario2 = {
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
    jsonUsuario2.nome = dataJson.nome;
    jsonUsuario2.sobrenome = Number(dataJson.matricula);
    jsonUsuario2.dataNascimento = dataJson.dataNascimento;
    for (let doc of dataJson.documentosDTO) {
      jsonUsuario2.documentosDTO.push(doc);
    }
    jsonUsuario2.email = dataJson.email;
    jsonUsuario2.nomeTratamento = dataJson.nomeTratamento;
    jsonUsuario2.telefone = dataJson.telefone;
    jsonUsuario2.telefone2 = dataJson.telefone2;
    jsonUsuario2.fotoFacial = dataJson.fotoFacial;
    try {
      const resLogin = await import_axios.default.post(process.env.API_URL_LOGIN, dataLogin, optionsLogin);
      objData.access_token = resLogin.data.access_token;
      objData.refresh_token = resLogin.data.refresh_token;
      objData.token_type = resLogin.data.token_type;
      dataRefresh.refresh_token = resLogin.data.refresh_token;
      const resRefresh = await import_axios.default.post(process.env.API_URL_REFRESH, dataRefresh, optionsRefreshLogin);
      objData.newAccess_token = resRefresh.data.access_token;
      objData.newRefresh_token = resRefresh.data.refresh_token;
      const resGet = await import_axios.default.post(process.env.API_URL_POST, jsonUsuario2, {
        headers: {
          "content-type": "application/json",
          "Authorization": `bearer ${objData.newAccess_token}`,
          "tenant": process.env.LOGIN_TENANT
        }
      });
      const user = await prisma.usuariosSESTSENAT.create({
        data: {
          criarUsuario: jsonUsuario2.criarUsuario,
          nome: jsonUsuario2.nome,
          sobrenome: Number(jsonUsuario2.sobrenome),
          dataNascimento: jsonUsuario2.dataNascimento,
          documentosDTO: {
            createMany: {
              data: jsonUsuario2.documentosDTO
            }
          },
          sociedade: jsonUsuario2.sociedade,
          email: jsonUsuario2.email,
          nomeTratamento: jsonUsuario2.nomeTratamento,
          telefone: jsonUsuario2.telefone,
          telefone2: jsonUsuario2.telefone2,
          fotoFacial: jsonUsuario2.fotoFacial
        },
        include: { documentosDTO: true }
      });
      const result = await prisma.$queryRawUnsafe(`UPDATE usuariossestsenat SET idUsuario_SCOND = '${resGet.data.id}' WHERE (sobrenome = '${jsonUsuario2.sobrenome}');`);
      logger.info("Success", JSON.stringify(resGet.data), null, 2);
      res.status(200).json({ response: resGet.data });
    } catch (e) {
      console.log("Error:", e);
      res.status(400).json({ e });
    }
  } catch (e) {
    console.log("Fail Login", e);
    logger.error(JSON.stringify({ Error: e, Status: "404" }));
    res.status(400).json({ Error: e });
  }
};
var updateUser = async (req, res) => {
  const matricula = Number(req.params.id);
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
    Authorization: process.env.LOGIN_AUTHORIZATION,
    tenant: process.env.LOGIN_TENANT,
    newAccess_token: "",
    newRefresh_token: ""
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
  const user = await prisma.usuariosSESTSENAT.findFirst({
    where: {
      sobrenome: matricula
    }
  });
  try {
    const dataJson = await req.body;
    let jsonUsuario2 = {
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
    jsonUsuario2.id = user.idUsuario_SCONSD !== null ? user.idUsuario_SCONSD.toString() : "";
    jsonUsuario2.nome = dataJson.nome;
    jsonUsuario2.sobrenome = Number(dataJson.matricula);
    jsonUsuario2.dataNascimento = dataJson.dataNascimento;
    for (let doc of dataJson.documentosDTO) {
      jsonUsuario2.documentosDTO.push(doc);
    }
    jsonUsuario2.email = dataJson.email;
    jsonUsuario2.nomeTratamento = dataJson.nomeTratamento;
    jsonUsuario2.telefone = dataJson.telefone;
    jsonUsuario2.telefone2 = dataJson.telefone2;
    jsonUsuario2.fotoFacial = dataJson.fotoFacial;
    try {
      const resLogin = await import_axios.default.post(process.env.API_URL_LOGIN, dataLogin, optionsLogin);
      objData.access_token = resLogin.data.access_token;
      objData.refresh_token = resLogin.data.refresh_token;
      objData.token_type = resLogin.data.token_type;
      dataRefresh.refresh_token = resLogin.data.refresh_token;
      const resRefresh = await import_axios.default.post(process.env.API_URL_REFRESH, dataRefresh, optionsRefreshLogin);
      objData.newAccess_token = resRefresh.data.access_token;
      objData.newRefresh_token = resRefresh.data.refresh_token;
      const resGet = await import_axios.default.put(`${process.env.API_URL_PUT}${user.idUsuario_SCONSD}`, jsonUsuario2, {
        headers: {
          "content-type": "application/json",
          "Authorization": `bearer ${objData.newAccess_token}`,
          "tenant": process.env.LOGIN_TENANT
        }
      });
      await prisma.usuariosSESTSENAT.update({
        where: {
          sobrenome: Number(jsonUsuario2.sobrenome)
        },
        data: {
          nome: jsonUsuario2.nome,
          sobrenome: Number(jsonUsuario2.sobrenome),
          dataNascimento: jsonUsuario2.dataNascimento,
          documentosDTO: {
            createMany: {
              data: jsonUsuario2.documentosDTO
            }
          },
          sociedade: jsonUsuario2.sociedade,
          email: jsonUsuario2.email,
          nomeTratamento: jsonUsuario2.nomeTratamento,
          telefone: jsonUsuario2.telefone,
          telefone2: jsonUsuario2.telefone2,
          fotoFacial: jsonUsuario2.fotoFacial
        },
        include: { documentosDTO: true }
      });
      const result = await prisma.$queryRawUnsafe(`UPDATE usuariossestsenat SET situacao = 'Alterado' WHERE (sobrenome = '${matricula}');`);
      logger.info("Success", JSON.stringify(resGet.data), null, 2);
      res.status(200).json({ response: resGet.data });
    } catch (e) {
      console.log("catch", e);
      console.error("Error:", e.response.data);
      res.status(500).json({ error: e.response.data });
    }
  } catch (e) {
    console.log("Fail Login", e);
    logger.error(JSON.stringify({ Error: e, Status: "404" }));
    res.status(400).json({ Error: e });
  }
};
var deleteUser = async (req, res) => {
  const id = req.params.id;
  let matricula;
  const optionsLogin = {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: process.env.LOGIN_AUTHORIZATION
    }
  };
  const optionsRefreshLogin = {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: process.env.LOGIN_AUTHORIZATION,
      tenant: process.env.LOGIN_TENANT
    }
  };
  let objData = {
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
    grant_type: "password"
  };
  let dataRefresh = {
    grant_type: process.env.LOGIN_GRANT_TYPE,
    refresh_token: ""
  };
  try {
    const resLogin = await import_axios.default.post(process.env.API_URL_LOGIN, dataLogin, optionsLogin);
    objData.access_token = resLogin.data.access_token;
    objData.refresh_token = resLogin.data.refresh_token;
    objData.token_type = resLogin.data.token_type;
    dataRefresh.refresh_token = resLogin.data.refresh_token;
    const resRefresh = await import_axios.default.post(process.env.API_URL_REFRESH, dataRefresh, optionsRefreshLogin);
    objData.newAccess_token = resRefresh.data.access_token;
    objData.newRefresh_token = resRefresh.data.refresh_token;
    try {
      const user = await prisma.usuariosSESTSENAT.findFirst({
        where: {
          sobrenome: Number(id)
        }
      });
      matricula = user.idUsuario_SCONSD;
    } catch (e) {
      console.log(e);
      res.status(400).json({ errors: "usuario nao encontrado", e });
      return;
    }
    const resGet = await import_axios.default.delete(`${process.env.API_URL_DEL}${matricula}`, {
      headers: {
        "content-type": "application/json",
        Authorization: `bearer ${objData.newAccess_token}`,
        tenant: process.env.LOGIN_TENANT
      }
    });
    const result = await prisma.$queryRawUnsafe(`UPDATE usuariossestsenat SET situacao = 'DESABILITADO' WHERE (sobrenome = '${id}');`);
    logger.info("Success", JSON.stringify(resGet.data), null, 2);
    res.status(200).json({ response: resGet.data });
  } catch (e) {
    console.log("catch", e);
    console.error("Error:", e.response.data);
    res.status(500).json({ error: e.response.data });
  }
};
var getUsers = async (req, res) => {
  try {
    const getAllUsers = await prisma.usuariosSESTSENAT.findMany();
    logger.info(JSON.stringify({ Message: "Get all users", Error: "false" }));
    res.status(200).json({ getAllUsers });
  } catch (e) {
    logger.error(JSON.stringify({ Error: e, Status: "404" }));
    res.status(404).send(e);
  }
};

// src/routes/routes.ts
var import_body_parser = __toESM(require("body-parser"));
var import_cors = __toESM(require("cors"));
var import_morgan_body = __toESM(require("morgan-body"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
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
app.post("/usuariosB64", createUser);
app.put("/usuariosB64/:id", updateUser);
app.delete("/usuariosB64/:id", deleteUser);
app.get("/usuarios", getUsers);
app.get("/", (req, res) => {
  res.send("Server is running 1.0");
  logger.info("Server is running 1.0");
});
var appRoutes = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  appRoutes
});
