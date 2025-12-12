import React, { useState } from "react";
import { MoreVert, Edit, Delete, Undo } from "@mui/icons-material";

interface ListItem {
  id: string;
  title: string;
  progress?: number;
  completed?: boolean;
}

interface DragDropListProps {
  items: ListItem[];
  onReorder: (items: ListItem[]) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const DragDropList: React.FC<DragDropListProps> = ({
  items: initialItems,
  onReorder,
  onDelete,
  onEdit,
}) => {
  const [items, setItems] = useState<ListItem[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<ListItem | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [previousItems, setPreviousItems] = useState<ListItem[]>([]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: ListItem,
  ) => {
    setDraggedItem(item);
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-blue-50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("bg-blue-50");
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: ListItem,
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-50");

    if (!draggedItem || draggedItem.id === targetItem.id) return;

    setPreviousItems([...items]);

    const newItems = items.filter((item) => item.id !== draggedItem.id);
    const targetIndex = newItems.findIndex((item) => item.id === targetItem.id);
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems);
    onReorder(newItems);
    setShowUndo(true);

    setTimeout(() => setShowUndo(false), 3000);
  };

  const handleUndo = () => {
    if (previousItems.length) {
      setItems(previousItems);
      onReorder(previousItems);
      setShowUndo(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* List Container */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item)}
            className="group flex cursor-move items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            {/* Drag Handle */}
            <div className="text-gray-400">
              <MoreVert />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{item.title}</h3>

              {/* Progress Bar */}
              {item.progress !== undefined && (
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {onEdit && (
                <button
                  onClick={() => onEdit(item.id)}
                  className="rounded p-1 text-gray-500 hover:text-blue-500"
                >
                  <Edit />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded p-1 text-gray-500 hover:text-red-500"
                >
                  <Delete />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Undo Button */}
      {showUndo && (
        <button
          onClick={handleUndo}
          className="fixed bottom-4 right-4 flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white shadow-lg transition-colors duration-200 hover:bg-gray-700"
        >
          <Undo />
          Undo
        </button>
      )}
    </div>
  );
};

export default DragDropList;
