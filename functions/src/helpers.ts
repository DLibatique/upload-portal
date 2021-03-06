import { storage } from "firebase-functions";
import * as admin from "firebase-admin";
import { google } from "googleapis";
import { auth } from "./config/gdrive";
import * as https from "https";
import * as fs from "fs";

export async function getDownloadURL(bucket: string, name: string) {
  try {
    const file_url = await admin
      .storage()
      .bucket(bucket)
      .file(name)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 900000 // add 15 min from now
      });
    const fileURL: string = file_url[0];
    return fileURL;
  } catch (error) {
    console.error(`Error getting the Signed URL: ${error}`);
    return error;
  }
}

export async function uploadToGoogleDrive(
  o: storage.ObjectMetadata,
  fId: string,
  fURL: string
) {
  try {
    const fileMetadata = {
      "name": o.name,
      "parents": [fId]
    };

    const fileStream = https.get(fURL, res => {
      return res.pipe(fs.createWriteStream(o.name!));
    });

    const media = {
      mimeType: o.contentType,
      body: fileStream
    };

    let data;

    auth.authorize(async (err, response) => {
      if (err) console.log(`Error authorizing google drive: ${err}`);
      const file = await google.drive({ version: "v3", auth }).files.create({
        requestBody: fileMetadata,
        media,
        fields: "id"
      });
      data = file.data;
      console.log(data);
      return data;
    });
  } catch (error) {
    console.error(`Error uploading to gDrive: ${error}`);
    return error;
  }
}
