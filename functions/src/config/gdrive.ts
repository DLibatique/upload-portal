import { google } from "googleapis";
import * as path from "path";

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const credPath = "../../credentials.json";
const CREDENTIALS_PATH = path.resolve(__dirname, credPath);
const credentials = require(credPath);
export const auth = new google.auth.JWT(
  credentials.client_email,
  CREDENTIALS_PATH,
  credentials.private_key,
  SCOPES[0]
);
