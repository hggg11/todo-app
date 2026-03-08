import { useState, useEffect } from 'react';
import type { Todo, Priority } from './types/todo';
import { getTodos, createTodo, updateTodo, deleteTodo } from './lib/api';
import Modal from './components/Modal';  // ← 新規追加
import LoginForm from './components/LoginForm';

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  HIGH: { label: '高', className: 'bg-red-100 text-red-700' },
  MEDIUM: { label: '中', className: 'bg-yellow-100 text-yellow-700' },
  LOW: { label: '低', className: 'bg-green-100 text-green-700' },
};

function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = priorityConfig[priority];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${className}`}>
      {label}
    </span>
  );
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');
  const [loading, setLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  // 編集用モーダル状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('MEDIUM');

  // 新規: 完了セクションの開閉状態
  const [showCompleted, setShowCompleted] = useState(false);

  // 未完了タスク：completed が false のものだけを抽出
  const activeTodos = todos.filter(todo => !todo.completed);
  // 完了済みタスク：completed が true のものだけを抽出
  const completedTodos = todos.filter(todo => todo.completed);
  
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
      const newTodo = await createTodo({
        title: newTitle.trim(),
        dueDate: newDueDate || undefined,
        priority: newPriority,
      });
      setTodos(prev => [...prev, newTodo]);
      setNewTitle('');
      setNewDueDate('');
      setNewPriority('MEDIUM');
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
    setEditDueDate(todo.dueDate || '');
    setEditPriority(todo.priority);
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
        completed: editingTodo.completed,
        dueDate: editDueDate || undefined,
        priority: editPriority,
      });
      setTodos(prev => prev.map(t => t.id === editingTodo.id ? updated : t));
      setIsModalOpen(false);
      setEditingTodo(null);
    } catch (err) {
      alert('更新に失敗しました');
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn')
  };

  if (!isLoggedIn) {
  return <LoginForm onLogin={() => {setIsLoggedIn(true);localStorage.setItem('isLoggedIn','true')}} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">TODO App</h1>
        <button onClick={handleLogout}>ログアウト</button>
      </div>
      {/* 追加フォーム */}
      <form onSubmit={handleAdd} className="mb-10 space-y-2">
        <div className="flex gap-3">
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
        </div>
        <div className="flex gap-3">
          <select
            value={newPriority}
            onChange={e => setNewPriority(e.target.value as Priority)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="LOW">低</option>
            <option value="MEDIUM">中</option>
            <option value="HIGH">高</option>
          </select>
          <input
            type="date"
            value={newDueDate}
            onChange={e => setNewDueDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </form>

      {loading && <p className="text-center">読み込み中...</p>}

      {/* 未完了タスク */}
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        未完了のタスク
        <span className="text-sm font-normal text-gray-600">
          {activeTodos.length} 件
        </span>
      </h2>

      <ul className="space-y-3 mb-12">
        {activeTodos.map(todo => (
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
                <div className="flex items-center gap-2">
                  <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                    {todo.title}
                  </span>
                  <PriorityBadge priority={todo.priority} />
                </div>
                {todo.description && (
                  <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                )}
                {todo.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">期限: {todo.dueDate}</p>
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

        {activeTodos.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-6">すべてのタスクが完了しました！🎉</p>
        )}
      </ul>

      {/* 完了済みセクション（accordion） */}
      {completedTodos.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full flex justify-between items-center p-4 bg-gray-100 border rounded-lg hover:bg-gray-200 transition text-left"
          >
            <h2 className="text-xl font-semibold">
              完了済み
              <span className="ml-2 text-sm font-normal text-gray-600">
                {completedTodos.length} 件
              </span>
            </h2>
            <span className="text-2xl font-bold">
              {showCompleted ? '−' : '+'}
            </span>
          </button>

          {showCompleted && (
            <ul className="space-y-3 mt-3">
              {completedTodos.map(todo => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg opacity-80"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggle(todo.id, true)}  // 解除可能
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="line-through text-gray-600">{todo.title}</span>
                        <PriorityBadge priority={todo.priority} />
                      </div>
                      {todo.description && (
                        <p className="text-sm text-gray-500 mt-1 line-through">
                          {todo.description}
                        </p>
                      )}
                      {todo.dueDate && (
                        <p className="text-xs text-gray-400 mt-1">期限: {todo.dueDate}</p>
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
            </ul>
          )}
        </div>
      )}

      {/* 編集モーダル（前回と同じ） */}
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

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                優先度
              </label>
              <select
                value={editPriority}
                onChange={e => setEditPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">低</option>
                <option value="MEDIUM">中</option>
                <option value="HIGH">高</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                期限（任意）
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={e => setEditDueDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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