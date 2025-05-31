import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";

interface SortSelectProps {
  setSortBy: Dispatch<SetStateAction<string>>;
}

function SortSelect(props: Readonly<SortSelectProps>) {
  const { setSortBy } = props;

  function handleSelectSort(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    setSortBy(value);
  }

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-xl mr-6 ml-2 font-mono pt-2">Sort by: </h1>
      <select
        className="w-sm border-1 border-black rounded-lg font-mono h-10 text-lg mt-2"
        onChange={handleSelectSort}
      >
        <option value="creation">Date Added</option>
        <option value="deadline">Due Date</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
}

export default SortSelect;
