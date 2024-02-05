import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Fingerprint from "express-fingerprint";
import cookieParser from "cookie-parser";
import AuthRouter from "./routers/AuthRouter.js";
import TokenService from "./services/TokenService.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL,
 }));

app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  })
);

app.use("/auth",AuthRouter);

app.get("/resourse/protected",TokenService.checkAccess,(_, res) => {

  return res.status(200).json("Welcome!" + Date.now());
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} `);
  });
  