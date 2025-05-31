import { getFirestore } from "firebase/firestore";
import { app } from "./app.ts";

export const db = getFirestore(app);
