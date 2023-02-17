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
var import_client = require("@prisma/client");
var import_multer = __toESM(require("multer"));
var import_path = __toESM(require("path"));

// node_modules/uuid/dist/esm-node/rng.js
var import_crypto = __toESM(require("crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm-node/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/uuid/dist/esm-node/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).substr(1));
}
function stringify(arr, offset = 0) {
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate_default(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
var stringify_default = stringify;

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return stringify_default(rnds);
}
var v4_default = v4;

// src/controller/usuarioController.ts
var z = __toESM(require("zod"));
var prisma = new import_client.PrismaClient();
var storage = import_multer.default.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, v4_default() + import_path.default.extname(file.originalname));
  }
});
var upload = (0, import_multer.default)({ storage });
var userSchema = z.object({
  nome: z.string(),
  fotoBase64: z.string(),
  email: z.string().email()
});
var createUserB64 = async (req, res) => {
  try {
    const { nome, email, fotoBase64 } = userSchema.parse(req.body);
    const usuario = await prisma.testUser.create({
      data: {
        nome,
        email,
        fotoBase64
      }
    });
    res.status(200).json({ Message: "Usuario salvo!", Error: "Falso", Status: "200 ok" });
  } catch (e) {
    logger.error(e);
    res.status(500).send(e);
  }
};
var createUser = async (req, res) => {
  try {
    const { nome, email, fotoBase64 } = req.body;
    const photo = req.file ? req.file.path : "";
    if (photo !== "" || nome == "" || email == "" || fotoBase64 == "") {
      const usuario = await prisma.testUser.create({
        data: {
          nome,
          email,
          fotoBase64
        }
      });
      res.status(200).json({ Message: "User successfully saved", Error: "False" });
    } else {
      console.log("pimba");
      res.status(400).json({ message: "Erro ao salvar usu\xE1rio: foto n\xE3o enviada" });
    }
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
var import_multer2 = __toESM(require("multer"));
var import_path2 = __toESM(require("path"));
var port = process.env.PORT;
var storage2 = import_multer2.default.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, v4_default() + import_path2.default.extname(file.originalname));
  }
});
var upload2 = (0, import_multer2.default)({ storage: storage2 });
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
app.post("/usuarios", upload2.single("photo"), createUser);
app.post("/usuariosB64", createUserB64);
app.get("/usuarios", getUsers);
app.get("/", (req, res) => {
  res.send("Server is running 1.0");
  req.log.info("Server is running 1.0");
});
var appRoutes = app;

// src/server.ts
var import_body_parser2 = __toESM(require("body-parser"));
import_dotenv.default.config();
var app2 = (0, import_express2.default)();
var port2 = process.env.PORT;
app2.use(import_body_parser2.default.json());
app2.use(import_express2.default.json());
app2.use("/", appRoutes);
app2.listen(port2, () => {
  console.log(`\u26A1\uFE0F[${port2}]: Server is running at http://localhost:${port2}`);
  logger.info(`\u26A1\uFE0F[${port2}]: Server is running at http://localhost:${port2}`);
});
