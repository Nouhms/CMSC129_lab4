import type { Timestamp } from "firebase/firestore";

export interface TodoType {
  id: string | null;
  isCheck: boolean;
  time: string;
  date: string;
  isEdit: boolean;
  description: string;
  priority: number;
  dateCreated: Timestamp;
}
