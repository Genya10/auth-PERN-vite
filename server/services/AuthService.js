import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import TokenService from "./TokenService.js";
import { NotFound, Forbidden, Conflict, Unauthorized } from "../utils/Error.js";
import RefreshSessionsRepository from "../repositories/RefreshSession.js";
import UserRepository from "../repositories/UserRepository.js";
import { ACCESS_TOKEN_EXPIRATION } from "../constants.js";

class AuthService {
  static async signIn({ userName, password, fingerprint }) {
    const userData = await UserRepository.getUserData(userName);
    if(!userData){
      throw new NotFound("User not find")
    }
    const isPasswordValid = bcrypt.compareSync(password,userData.password);

    if(!isPasswordValid){
      throw new Unauthorized("Wrong login or password");
    }
      const payload = {id:userData.id, role:userData.role,userName};
      const accessToken = await TokenService.generateAccessToken(payload);
      const refreshToken = await TokenService.generateRefreshToken(payload);
      await RefreshSessionsRepository.createRefreshSession({
        id:userData.id, refreshToken, fingerprint
      });
      return {
        accessToken, refreshToken, accessTokenExpiration:ACCESS_TOKEN_EXPIRATION
      };
    }
  

  static async signUp({ userName, password, fingerprint, role }) {
    const userData = await UserRepository.getUserData(userName);
    if(userData){
      throw new Conflict("User has already")
    }
    const hashedPassword = bcrypt.hashSync(password,8);

    const {id}= await UserRepository.createUser({
      userName, hashedPassword, role,
    });
   
    const payload = {id, userName, role};

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      id, refreshToken, fingerprint
    });
    return {
      accessToken, refreshToken, accessTokenExpiration:ACCESS_TOKEN_EXPIRATION
    };
  }

  static async logOut(refreshToken) {
    await RefreshSessionsRepository.deleteRefreshSession(refreshToken);
  }

  static async refresh({ fingerprint, currentRefreshToken }) {}
}

export default AuthService;