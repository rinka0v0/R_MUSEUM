import React, {  useState } from "react";
import { db } from "../firebase";

type Props = {
  id: string;
  title: string;
};

const TaskItem: React.FC<Props> = (props) => {
  const [title, setTitle] = useState(props.title);

  const editTask = () => {
    db.collection("tasks").doc(props.id).set({ title: title }, { merge: true });
  };
  const deleteTask = () => {
    db.collection("tasks").doc(props.id).delete();
  };
  return (
    <div>
      <h2>{props.title}</h2>
      <input
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
      />
      <button onClick={editTask}>EDIT</button>
      <button onClick={deleteTask}>DELETE</button>
    </div>
  );
};

export default TaskItem;
