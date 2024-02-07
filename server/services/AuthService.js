import bcrypt from "bcryptjs";
import TokenService from "./TokenService.js";
import { NotFound, Forbidden, Conflict, Unauthorized } from "../utils/Error.js";
import RefreshSessionRepository from "../repositories/RefreshSession.js";
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
      await RefreshSessionRepository.createRefreshSession({
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
    const {id} = await UserRepository.createUser({
      userName, hashedPassword, role,
    });
   
    const payload = {id, userName, role};

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionRepository.createRefreshSession({
      id, refreshToken, fingerprint
    });
    return {
      accessToken, refreshToken, accessTokenExpiration:ACCESS_TOKEN_EXPIRATION
    };
  }

  static async logOut(refreshToken) {
    await RefreshSessionRepository.deleteRefreshSession(refreshToken);
  }

  static async refresh({ fingerprint, currentRefreshToken }) {
    if(!currentRefreshToken){
      throw new Unauthorized();
    }
    const refreshSession = await RefreshSessionRepository.getRefreshSession(
     currentRefreshToken
    );
    if (!refreshSession){
      throw new Unauthorized();
    }
    if (refreshSession.finger_print !== fingerprint.hash){
      console.log("Attempted unauthorized token update!");
      throw new Forbidden();
    }
    await RefreshSessionRepository.deleteRefreshSession(currentRefreshToken);

    let payload;
    try {
      payload = await TokenService.verifyRefreshToken(currentRefreshToken)
     } catch (error) {
      throw new Forbidden(error);
    }
    
    const {id, role, name: userName
    } = await UserRepository.getUserData(payload.userName);

    const actualPayload = {id, userName, role};

    const accessToken = await TokenService.generateAccessToken(actualPayload);
    const refreshToken = await TokenService.generateRefreshToken(actualPayload);
    
    await RefreshSessionRepository.createRefreshSession({
      id, refreshToken, fingerprint
    });

    return { 
      accessToken, refreshToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION
    }
  }
}

export default AuthService;