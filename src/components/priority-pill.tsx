interface PriorityPillProp {
  priority: number;
}

function PriorityPill(props: Readonly<PriorityPillProp>) {
  const { priority } = props;
  const priorityClass = ["bg-green-500", "bg-yellow-500", "bg-red-500"];
  return (
    <div
      className={
        `max-w-15 rounded-full text-white text-center font-mono mt-2 ` +
        priorityClass[priority - 1]
      }
    >
      {["low", "mid", "high"][priority - 1]}
    </div>
  );
}

export default PriorityPill;
