import AuthService from "../services/AuthService.js";
import ErrorsUtils from "../utils/Error.js";
import { COOKIE_SETTINGS } from "../constants.js";

class AuthController {
  static async signIn(req, res) {
    const {userName,password} = req.body;
    const { fingerprint } = req;

    try {
      const {accessToken, refreshToken,accessTokenExpiration}=
      await AuthService.signIn(
        {userName,password,fingerprint});

      res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      return res.status(200).json({accessToken,accessTokenExpiration});
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async signUp(req, res) {
    const {userName,password,role} = req.body;
    const { fingerprint } = req;

    try {
      const {accessToken, refreshToken,accessTokenExpiration}=
      await AuthService.signUp(
        {userName,password,role,fingerprint});

      res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      return res.status(200).json({accessToken,accessTokenExpiration});
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async logOut(req, res) {
    const refreshToken = req.cookies.refreshToken;
    const { fingerprint } = req;
    try {
      await AuthService.logOut(refreshToken);

      res.clearCookie("refreshToken");
      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async refresh(req, res) {
    const { fingerprint } = req;
    try {
      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }
}

export default AuthController;