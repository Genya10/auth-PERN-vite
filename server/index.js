import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Fingerprint from "express-fingerprint";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  })
);

app.listen(PORT, () => {
    console.log("Сервер успешно запущен");
  });
  