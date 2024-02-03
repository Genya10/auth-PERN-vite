import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import TokenService from "./TokenService.js";
import { NotFound, Forbidden, Conflict } from "../utils/Error.js";
import RefreshSessionsRepository from "../repositories/RefreshSession.js";
import UserRepository from "../repositories/UserRepository.js";
import { ACCESS_TOKEN_EXPIRATION } from "../constants.js";

class AuthService {
  static async signIn({ userName, password, fingerprint }) {}

  static async signUp({ userName, password, fingerprint, role }) {}

  static async logOut(refreshToken) {}

  static async refresh({ fingerprint, currentRefreshToken }) {}
}

export default AuthService;