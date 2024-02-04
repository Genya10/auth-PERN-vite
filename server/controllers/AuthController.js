import AuthService from "../services/AuthService.js";
import ErrorsUtils from "../utils/Error.js";
import { COOKIE_SETTINGS } from "../constants.js";

class AuthController {
  static async signIn(req, res) {
    const { fingerprint } = req;
    try {
      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async signUp(req, res) {
    const {useName,password,role} = req.body;
    const { fingerprint } = req;
    try {
      await AuthService.signUp({userName,password,role,fingerprint})
      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async logOut(req, res) {
    const { fingerprint } = req;
    try {
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