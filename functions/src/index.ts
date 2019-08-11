import { storage } from "firebase-functions";
import { initFirebase } from "./config/firebase";
initFirebase();
import { getDownloadURL, uploadToGoogleDrive } from "./helpers";

export const saveToGDrive = storage.object().onFinalize(async object => {
  try {
    const fileBucket = object.bucket;
    const fileName = object.name!;
    const fileURL = await getDownloadURL(fileBucket, fileName);
    const folderId = "1dQSHZFvTzvneGrtvRrBHEyPBfJs9Ozmb";
    const response = await uploadToGoogleDrive(object, folderId, fileURL);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
});
