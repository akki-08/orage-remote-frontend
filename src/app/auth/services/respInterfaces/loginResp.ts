export interface loginResp {
  userExists?: boolean;
  userVerified?: boolean;
  accessToken?: string;
  isPasswordTrue?: boolean;
}
