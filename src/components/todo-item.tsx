"use client";

import { useState } from "react";
import TodoForm from "./form";
import PriorityPill from "./priority-pill";
import { doc, deleteDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/db";
import { toast } from "sonner";
import dayjs from "dayjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TodoItemProp {
  isCheck: boolean;
  time: string;
  date: string;
  priority: number;
  isEdit: boolean;
  id: string;
  description: string;
  key: string;
  dateCreated: Timestamp;
}

function TodoItem(props: Readonly<TodoItemProp>) {
  const { time, date, priority, description, dateCreated } = props;
  const { id, isEdit, isCheck, ...todoData } = props;

  const [showEditButton, setShowEditButton] = useState(false);
  const editStyle: string =
    "hover:bg-black text-black hover:text-white py-2 px-4 border border-black";
  const closeStyle: string =
    "hover:bg-red-700 text-red-700 hover:text-white py-2 px-4 border border-red-700";

  async function handleUndo() {
    const docRef = doc(db, "todos", id);
    await setDoc(docRef, todoData);
  }
  async function handleDelete() {
    try {
      toast("Successfully deleted todo!", {
        action: {
          label: "Undo",
          onClick: handleUndo,
        },
      });

      await deleteDoc(doc(db, "todos", id));
    } catch (e) {
      console.log(e);
    }
  }

  async function handleToggleCheck() {
    try {
      const docRef = doc(db, "todos", id);
      await setDoc(docRef, { ...todoData, isCheck: !isCheck });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {/* <ngx-sonner-toaster [expand]="true" /> */}
      <div className="flex my-2  justify-center">
        <input
          className="accent-black hover:accent-red-500 hover:border-green-500 hover:border-2 h-7 w-7 block mt-8 mr-3"
          type="checkbox"
          checked={isCheck}
          onClick={handleToggleCheck}
          readOnly
        />
        <div className="block bg-[#F0EAD6] my-2 p-3 rounded-b-lg border-2 border-[#d8bb5b] w-lg">
          <div className="flex items-center justify-between">
            <div className="max-w-70">
              {isCheck ? (
                <del>
                  <span className="block m-auto">{description}</span>
                  <span className="block">{date}</span>
                </del>
              ) : (
                <>
                  <span className="block m-auto mb-2 text-xl">
                    {description}
                  </span>
                  <span className="block text-sm font-mono">
                    {"Deadline: " + date}
                  </span>
                  <span className="block text-sm font-mono">{time}</span>
                  <span className="block text-sm font-mono mt-2">
                    {"Date created: " +
                      dayjs(dateCreated.toMillis()).format(
                        "dddd, MMMM D, YYYY"
                      )}
                  </span>
                </>
              )}
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="bg-transparent hover:bg-red-700 text-red-700 hover:text-white py-2 px-4 border border-red-700 hover:border-transparent rounded">
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete todo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Do you wish to delete this todo?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <button
                        onClick={handleDelete}
                        className="bg-transparent hover:bg-red-700 text-red-700 hover:text-white py-2 px-4 border border-red-700 hover:border-transparent rounded"
                      >
                        Yes
                      </button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <button
                onClick={() => {
                  setShowEditButton(!showEditButton);
                }}
                className={`mx-2 float-right bg-transparent hover:border-transparent rounded ${
                  !showEditButton ? editStyle : closeStyle
                }`}
              >
                {!showEditButton ? "Edit" : "Close"}
              </button>
            </div>
          </div>
          <PriorityPill priority={priority} />
          {showEditButton && (
            <TodoForm
              time={time}
              date={date}
              description={description}
              id={id}
              priority={priority}
              isEdit={isEdit}
              key={id}
              dateCreated={dateCreated}
            />
          )}
        </div>
        <div className="h-7 w-7 ml-3 mt-8"></div>
      </div>
    </>
  );
}

export default TodoItem;
