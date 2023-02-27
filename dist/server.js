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

// src/routes/routes.ts
var import_express = __toESM(require("express"));

// src/controller/usuarioController.ts
var dotenv = __toESM(require("dotenv"));
var import_client = require("@prisma/client");
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
  const optionsLogin = {
    headers: {
      // "content-type": "multipart/form-data",
      // "Accept": "*/*",
      // "Accept-Encoding": "gzip, deflate, br",
      // "Connection": "keep-alive",
      "Authorization": "Basic Y2VudGVyLWFwaTphcGktc2VjcmV0"
    }
  };
  const optionsRefreshLogin = {
    headers: {
      // "content-type": "multipart/form-data",
      // "Accept": "*/*",
      // "Accept-Encoding": "gzip, deflate, br",
      // "Connection": "keep-alive",
      "Authorization": "Basic Y2VudGVyLWFwaTphcGktc2VjcmV0",
      "tenant": "newline_sistemas_de_seguranca_103147"
    }
  };
  const formDataLogin = new import_form_data.default();
  const formDataRefresh = new import_form_data.default();
  const formDataGet = new import_form_data.default();
  let objData = {
    access_token: "",
    refresh_token: "",
    grant_type: "refresh_token",
    token_type: "",
    Authorization: "Basic Y2VudGVyLWFwaTphcGktc2VjcmV0",
    tenant: "newline_sistemas_de_seguranca_103147"
  };
  let data = {
    "criarUsuario": true,
    "nome": "integrador teste",
    "sobrenome": "integrador teste",
    "dataNascimento": "09/02/2000",
    "sociedade": "PESSOA_FISICA",
    "documentosDTO": [
      {
        "tipoDocumento": "CPF",
        "documento": "784.362.900-97"
      },
      {
        "tipoDocumento": "RG",
        "documento": "500000"
      }
    ],
    "email": "teste4@scond.com.br",
    "nomeTratamento": "String 255",
    "telefone": "+55 99 99999-9999",
    "telefone2": "+55 99 99999-9999",
    "profissao": "Aluno",
    "grupoPessoa": "Aluno"
  };
  formDataLogin.append("username", process.env.USER_LOGIN);
  formDataLogin.append("password", process.env.USER_PASSWORD);
  formDataLogin.append("grant_type", process.env.USER_GRANT_TYPE);
  try {
    await import_axios.default.post(process.env.API_URL_LOGIN, formDataLogin, optionsLogin).then(async function(res2) {
      objData.access_token = res2.data.access_token;
      objData.refresh_token = res2.data.refresh_token;
      objData.token_type = res2.data.token_type;
      console.log("debug axios 1", objData);
      formDataRefresh.append("grant_type", objData.grant_type);
      formDataRefresh.append("refresh_token", objData.refresh_token);
      await import_axios.default.post(process.env.API_URL_REFRESH, formDataRefresh, {
        headers: {
          Authorization: objData.Authorization,
          tenant: objData.tenant
        }
      }).then(async function(res3) {
        await import_axios.default.post(process.env.API_URL_GET, data, {
          headers: {
            "Authorization": `bearer ${objData.access_token}`,
            "tenant": objData.tenant,
            "Content-Type": "application/json"
          }
        }).then(async function(res4) {
          console.log("pimbalization");
        });
      });
    });
  } catch (e) {
    console.log("Fail Login", e);
    res.status(400).json({ Error: e });
  }
};

// src/routes/routes.ts
var import_body_parser = __toESM(require("body-parser"));
var import_cors = __toESM(require("cors"));
var app = (0, import_express.default)();
app.use(import_body_parser.default.json());
app.use((0, import_cors.default)({ origin: "*" }));
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.post("/usuariosB64", createUserB64);
app.put("/usuariosB64", updateUserB64);
app.delete("/usuariosB64", deleteUserB64);
app.get("/usuarios", getUsers);
app.post("/api", sendUser);
app.get("/", (req, res) => {
  res.send("Server is running 1.0");
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
