import type { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import type { Status, Todo } from "../types/todo";
import PriorityBadge from "./PriorityBadge";
type TodoItemProps = {
    todo: Todo;
    onStatusChange: (id: number, status: Status) => void;
    onDelete: (id: number) => void;
    onEdit: (todo: Todo) => void;
    draggableProps?: DraggableProvidedDraggableProps;
    dragHandleProps?: DraggableProvidedDragHandleProps;
    innerRef?: (element?: HTMLElement | null) => void;
}
const today = new Date().toISOString().split('T')[0];
const isExpired = (todo: Todo): boolean => {
      return !!todo.dueDate && todo.dueDate < today;
  };
export function TodoItem({ todo, onDelete, onEdit, onStatusChange, draggableProps, dragHandleProps, innerRef }: TodoItemProps) {

    return (
                    <li
                      key={todo.id}
                      ref={innerRef}
                      {...draggableProps}
                      className={`${isExpired(todo) ? 'text-red-600 font-semi-bold' : 'text-gray-500'} items-center justify-between p-4 bg-gray-50 border rounded-lg opacity-80`}
                    >
                    <div className='flex'>
                      <div className="flex items-center gap-3 flex-1">                        
                        <div {...dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing text-xl select-none">
                              ⠿
                        </div>
                        <select value={todo.status} onChange={ (e) => onStatusChange(todo.id, e.target.value as Status)}>
                          <option key="active" value={"ACTIVE"}>未完了</option>
                          <option key="completed" value={"COMPLETED"}>完了</option>
                          <option key="cancelled" value={"CANCELLED"}>キャンセル</option>
                        </select>
                        <PriorityBadge priority={todo.priority} />
                        <div>
                        <div className="flex justify-between items-center">
                          <div className='flex'>                          
                            {todo.icon && <span className="text-xl">{todo.icon}</span>}
                            <div className="items-center gap-2">
                            <span className="text-gray-600">{todo.title}</span>
                            {todo.description && (
                            <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
                          )}
                          </div>
                          
                          </div>
                          </div>
                          </div>
                          </div>
                          <div className="flex gap-3 items-center">
                            <div>
                          {todo.dueDate && (
                            <p className="text-xs text-gray-400 mt-1">期限: {todo.dueDate}</p>
                          )}
                          </div>
                        <button onClick={() => onEdit(todo)} className="text-blue-600 hover:text-blue-800 font-medium">
                          編集
                        </button>
                        <button onClick={() => onDelete(todo.id)} className="text-red-600 hover:text-red-800 font-medium">
                          削除
                        </button>
                      </div>
                      </div>
                    </li>
                  )
}