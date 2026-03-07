import { useState, useEffect } from 'react';
import type { Todo, TodoCreateInput } from './types/todo';
import { getTodos, createTodo, updateTodo, deleteTodo } from './lib/api';
import Modal from './components/Modal';  // ← 新規追加

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // 編集用モーダル状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      console.error('Failed to fetch todos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const newTodo = await createTodo({ title: newTitle.trim() });
      setTodos(prev => [...prev, newTodo]);
      setNewTitle('');
    } catch (err) {
      alert('追加に失敗しました');
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updated = await updateTodo(id, {...todo, completed: !completed });
      setTodos(prev =>
        prev.map(t => (t.id === id ? updated : t))
      );
    } catch (err) {
      alert('更新に失敗しました');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('削除に失敗しました');
    }
  };

  // 編集開始
  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsModalOpen(true);
  };

  // 編集保存
  const handleSaveEdit = async () => {
    if (!editingTodo) return;
    if (!editTitle.trim()) {
      alert('タイトルは必須です');
      return;
    }

    try {
      const updated = await updateTodo(editingTodo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        completed: editingTodo.completed
      });
      setTodos(prev => prev.map(t => t.id === editingTodo.id ? updated : t));
      setIsModalOpen(false);
      setEditingTodo(null);
    } catch (err) {
      alert('更新に失敗しました');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">TODO App</h1>

      {/* 追加フォーム */}
      <form onSubmit={handleAdd} className="mb-10 flex gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          追加
        </button>
      </form>

      {loading && <p className="text-center">読み込み中...</p>}

      <ul className="space-y-3">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.title}
                </span>
                {todo.description && (
                  <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => startEdit(todo)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                編集
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                削除
              </button>
            </div>
          </li>
        ))}

        {todos.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-10">まだタスクがありません</p>
        )}
      </ul>

      {/* 編集モーダル */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="タスクを編集"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル（必須）
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              詳細（任意）
            </label>
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="詳細やメモを入力..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              キャンセル
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              保存
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;