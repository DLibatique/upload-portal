import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const CREDENTIALS_PATH = "../../credentials.json";
const credentials = require(CREDENTIALS_PATH);
const auth = new google.auth.JWT(
  credentials.client_email,
  undefined,
  credentials.private_key,
  SCOPES
);

export const drive = google.drive({ version: "v3", auth });
