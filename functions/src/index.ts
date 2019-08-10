import { storage } from "firebase-functions";
import * as admin from "firebase-admin";
import { initFirebase } from "./config/firebase";
initFirebase();
import { drive } from "./config/gdrive";
import * as https from "https";
import * as fs from "fs";

export const saveToGDrive = storage.object().onFinalize(async object => {
  try {
    const fileBucket = object.bucket;
    const fileName = object.name!;
    console.log(`File name: ${fileName}`);
    const file_url = await admin
      .storage()
      .bucket(fileBucket)
      .file(fileName)
      .getSignedUrl({
        action: "read",
        expires: 604800
      });
    const fileURL = file_url[0]
    console.log(`File media link: ${fileURL}`);
    const folderId = "1dQSHZFvTzvneGrtvRrBHEyPBfJs9Ozmb";
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };
    const media = {
      mimeType: object.contentType,
      body: https.get(fileURL, res => res.pipe(fs.createWriteStream(fileName)))
    };

    console.log(`File uploaded to Google Drive: ${object.name}`);

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    console.log(`Link in Google Drive: ${response.data.webViewLink}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});
