import { storage } from "firebase-functions";
import { drive } from "./config/gdrive";
import * as fs from "fs";

export const onFileUpload = storage.object().onFinalize(async object => {
  try {
    const folderId = "1dQSHZFvTzvneGrtvRrBHEyPBfJs9Ozmb";
    const fileMetadata = {
      name: object.name,
      parents: [folderId]
    };

    const media = {
      mimeType: object.contentType,
      body: fs.createReadStream('files/photo.jpg')
    };

    console.log(`File uploaded: ${object.name}`);

    const res = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    return error;
  }
});
