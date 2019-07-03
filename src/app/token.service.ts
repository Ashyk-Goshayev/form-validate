import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TokenService {
  constructor() {}

  getToken() {
    return localStorage.token;
  }
  refreshToken() {
    return localStorage.refreshToken;
  }
  getExpireDate() {
    return localStorage.expiresIn;
  }
}
