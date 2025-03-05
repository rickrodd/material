import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers"

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "200px",
    padding: "8px",
    margin: "4px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    boxShadow: isDragging ? "0px 5px 15px rgba(0,0,0,0.2)" : "0px 2px 5px rgba(0,0,0,0.1)",
    cursor: "grab",
    position: "relative",
    zIndex: isDragging ? 10 : 1, // Ensure the dragged item is above others
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        console.log(newArray.map((item, index) => item))
        return newArray
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
