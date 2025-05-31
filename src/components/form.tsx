import { useState, type ChangeEvent, type FormEvent } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import { DatePicker } from "@mui/x-date-pickers";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/db";
import type { TodoType } from "@/types/todo";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Hong_Kong");

interface TodoFormProps {
  time: string | null;
  date: string | null;
  priority: number | null;
  isEdit: boolean | null;
  id: string | null;
  description: string | null;
  key: string | null;
  dateCreated: Timestamp | null;
}

function TodoForm(props: Readonly<TodoFormProps>) {
  const { time, date, priority, isEdit, id, description, dateCreated } = props;
  const [formData, setFormData] = useState<TodoType>({
    description: description ?? "",
    time: time ?? dayjs().format("HH:mm A"),
    date: date ?? dayjs().format("dddd, MMMM D, YYYY"),
    priority: priority ?? 1,
    dateCreated: Timestamp.now(),
    isCheck: false,
    isEdit: isEdit ?? true,
    id: id,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const load = { ...formData, dateCreated: new Date() };
    const docRef = id ? doc(db, "todos", id) : doc(collection(db, "todos"));
    await setDoc(docRef, load);
    setFormData({
      ...formData,
      description: description ?? "",
      time: dayjs().format("HH:mm A"),
      date: dayjs().format("dddd, MMMM D, YYYY"),
      priority: priority ?? 1,
      dateCreated: dateCreated ?? Timestamp.now(),
      isEdit: false,
    });
    console.log("added!!");
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleChangeTime(data: PickerValue) {
    if (!data) return;
    const time = dayjs.utc(data).tz("Asia/Singapore").format("hh:mm A");
    setFormData({
      ...formData,
      time: time,
    });
  }

  function handleChangeDate(data: PickerValue) {
    if (!data) return;
    const date = data.format("dddd, MMMM D, YYYY");
    setFormData({
      ...formData,
      date: date,
    });
  }

  return (
    <form
      className="border-black grid justify-center border-dashed border-2 p-4 my-2  bg-[#F0EAD6]"
      onSubmit={handleSubmit}
    >
      <label htmlFor="description">Todo: </label>
      <input
        type="text"
        id="description"
        name="description"
        className="border-1 border-black field-sizing-content md:field-sizing-fixed h-10 rounded-xl p-2 mb-2"
        placeholder="Enter your todo here"
        value={formData.description}
        onChange={handleChange}
      />
      <div className="flex mt-2 justify-between">
        <div className=" m-1 ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
              label="Time"
              value={dayjs(formData.time + ":00", "hh:mm A")}
              onChange={handleChangeTime}
            />
          </LocalizationProvider>
        </div>
        <div className="m-1">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={dayjs(
                formData.date.replace(/^[A-Za-z]+, /, ""),
                "MMMM D, YYYY"
              )}
              onChange={handleChangeDate}
            />
          </LocalizationProvider>
        </div>
      </div>
      <select
        className="w-md border-1 border-black rounded-lg font-mono h-10 text-lg mt-2"
        name="priority"
        onChange={handleChange}
        value={formData.priority?.toString()}
      >
        <option value="1">Low</option>
        <option value="2">Mid</option>
        <option value="3">High</option>
      </select>
      <button
        type="submit"
        className="bg-transparent hover:bg-black text-black hover:text-white py-2 px-4 border border-black hover:border-transparent rounded hover:font-semibold mt-6"
      >
        {isEdit ? "Edit" : "Submit"}
      </button>
    </form>
  );
}
export default TodoForm;
