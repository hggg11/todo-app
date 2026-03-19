import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';
import type { Todo, Priority, Status } from './types/todo';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';
import Calendar from './components/Calendar';
import { useTodos } from './hooks/useTodos';
import { TodoItem } from './components/TodoItem';
export const ICONS = ['📝', '💼', '📚', '🏃', '🍳', '🛒', '👖', '💪', '🎮', '🎵', '🏠', '✈️', '💊', '💻', '🛀', '🎬', '🍎', '🍌', '🥬'];

function App() {
  const {todos, loading, secondsAgo, lastFetched, fetchTodos, handleDragEnd, handleAdd, handleStatusChange, handleDelete, handleEdit} = useTodos();
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');
  const editTitleRef = useRef<HTMLInputElement>(null);
  const isExpired = (todo: Todo): boolean => {
      return !!todo.dueDate && todo.dueDate < today;
  };
  const [newIcon, setNewIcon] = useState<string>('📝');
  const [editIcon, setEditIcon] = useState<string>('📝');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('MEDIUM');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showcancelled, setShowCancelled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
  const [filterDueDate, setFilterDueDate] = useState<'ALL' | 'TODAY' | 'THIS_WEEK' | 'OVERDUE'>('ALL');
  const [activeTab, setActiveTab] = useState<'todos' | 'calendar'>('todos');
  const today = new Date().toISOString().split('T')[0];
  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  const nextWeek = nextWeekDate.toISOString().split('T')[0];
  const q = searchQuery.toLowerCase();
  const isFiltering = searchQuery !== '' || filterDueDate !== 'ALL' || filterPriority !== 'ALL';
  const activeTodos = todos
    .filter(todo => {
      if (todo.status !== 'ACTIVE') return false;
      if (!todo.title.toLowerCase().includes(q) && !todo.description?.toLowerCase().includes(q)) return false;
      if (filterPriority !== 'ALL' && todo.priority !== filterPriority) return false;
      if (filterDueDate === 'TODAY' && todo.dueDate !== today) return false;
      if (filterDueDate === 'OVERDUE' && (!todo.dueDate || todo.dueDate >= today)) return false;
      if (filterDueDate === 'THIS_WEEK' && (!todo.dueDate || todo.dueDate < today || todo.dueDate > nextWeek)) return false;
      return true;
    })
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const completedTodos = todos.filter(todo => todo.status === 'COMPLETED');
  const cancelledTodos = todos.filter(todo => todo.status === 'CANCELLED');
  
  useEffect(() => {
    isLoggedIn ? document.title = `TODO (${activeTodos.length}件)`
      : document.title = "ログイン"
  }, [activeTodos.length, isLoggedIn]);

  useEffect(() => {
    isLoggedIn&&fetchTodos();
  }, [isLoggedIn]);

  useEffect(() => {
    if(isModalOpen) {
      editTitleRef.current?.focus();
    }
  },[isModalOpen]);
  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate || '');
    setEditPriority(todo.priority);
    setIsModalOpen(true);
    setEditIcon(todo.icon || '');
};
  const handleSaveEdit = async () => {
    if (!editingTodo) return;
    if (!editTitle.trim()) {
        alert('タイトルは必須です');
        return;
    }
    const success = await handleEdit(editingTodo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      status: editingTodo.status,
      dueDate: editDueDate || undefined,
      priority: editPriority,
      icon: editIcon,
    });
    if (success) {
      setIsModalOpen(false);
      setEditingTodo(null);
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };
  if (!isLoggedIn) {
    return <LoginForm onLogin={(token: string) => {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', token);
    }} />;
  }
  return (
    <div className="max-w-8xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">TODO App</h1>
        {/* タブ */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📋 TODO
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📅✍ カレンダー詳細
          </button>
        </div>
        <button onClick={handleLogout}>ログアウト</button>
      </div>
      {/* メインコンテンツ：左にTODO、右にカレンダー */}
      {activeTab === 'todos' && (
        <div className="flex gap-10 items-start">

        {/* 左：TODOリスト */}
        <div className="w-2/5 min-w-0">
          {/* 検索〜完了済みセクションをここに移動 */}
          {/* 追加フォーム */}
          <>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newTitle.trim()) return;
            handleAdd({
              title: newTitle.trim(),
              dueDate: newDueDate,
              priority: newPriority,
              icon: newIcon,
              status: 'ACTIVE',
            }); 
            setNewTitle('');
          }} className="mb-10 space-y-2">
            <div className="flex"> 
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
            <div className="flex items-center gap-3">
              <span>優先度：</span>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as Priority)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="LOW">低</option>
                <option value="MEDIUM">中</option>
                <option value="HIGH">高</option>
              </select>
              <span>締切日：</span>
              <input
                type="date"
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-3">
              {/* アイコン選択 */}
              <div className="flex gap-1 flex-wrap">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewIcon(icon)}
                    className={`text-xl p-1 rounded transition ${
                      newIcon === icon
                        ? 'bg-blue-100 ring-2 ring-blue-400'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
                {newIcon && (
                  <button type="button" onClick={() => setNewIcon('')}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2">
                    ✕
                  </button>
                )}
              </div>
            </div>
          </form>
                    {/* 検索 */}
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="タスクを検索..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          {/* フィルター */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex gap-1">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    filterPriority === p
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {p === 'ALL' ? '全優先度' : p === 'HIGH' ? '高' : p === 'MEDIUM' ? '中' : '低'}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {(['ALL', 'TODAY', 'THIS_WEEK', 'OVERDUE'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDueDate(d)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    filterDueDate === d
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {d === 'ALL' ? '全期限' : d === 'TODAY' ? '今日' : d === 'THIS_WEEK' ? '今週' : '期限切れ'}
                </button>
              ))}
            </div>
          </div>
          {loading && <p className="text-center">読み込み中...</p>}
          {/* 未完了タスク */}
          <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
            未完了のタスク  
            <span className="text-sm font-normal text-gray-600">{secondsAgo}秒前取得 <br/> {activeTodos.length} 件</span>
          </h2>
          {isFiltering && (
            <p className="text-xs text-gray-400 mb-2">
              ⚠️ フィルター中はドラッグ並び替えができません
            </p>
          )}
          <DragDropContext onDragEnd={(result) => handleDragEnd(result, activeTodos)}>
            <Droppable droppableId="active-todos">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 mb-12"
                >
                  {activeTodos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={String(todo.id)} index={index} isDragDisabled={isFiltering}>
                      {(provided)=> (
                        <TodoItem key={todo.id} todo={todo} onEdit={startEdit} onStatusChange={handleStatusChange} onDelete={handleDelete} dragHandleProps={provided.dragHandleProps??undefined} draggableProps={provided.draggableProps} innerRef={provided.innerRef}/>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {activeTodos.length === 0 && !loading && (
                    <p className="text-center text-gray-500 py-6">タスクが見つかりません</p>
                  )}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
                   {/* 完了済みセクション */}
          {completedTodos.length > 0 && 
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full flex justify-between items-center p-4 bg-gray-100 border rounded-lg hover:bg-gray-200 transition text-left"
              >
                <h2 className="text-xl font-semibold">
                  完了済み
                  <span className="ml-2 text-sm font-normal text-gray-600">{completedTodos.length} 件</span>
                </h2>
                <span className="text-2xl font-bold">{showCompleted ? '−' : '+'}</span>
              </button>}
              {showCompleted && (
                <ul className="space-y-3 mt-3">
                  {completedTodos.map(todo => (<TodoItem key={todo.id} todo={todo} onDelete={handleDelete} onEdit={startEdit} onStatusChange={handleStatusChange}/>))}
                </ul>
            )
            
          }
          
          {/* キャンセル済みセクション */}
          {cancelledTodos.length > 0 &&             
              <button
                onClick={() => setShowCancelled(!showcancelled)}
                className="w-full flex justify-between items-center p-4 bg-gray-100 border rounded-lg hover:bg-gray-200 transition text-left"
              >
                <h2 className="text-xl font-semibold">
                  キャンセル
                  <span className="ml-2 text-sm font-normal text-gray-600">{cancelledTodos.length} 件</span>
                </h2>
                <span className="text-2xl font-bold">{showcancelled ? '−' : '+'}</span>
              </button>}
              {showcancelled && (
                <ul className="space-y-3 mt-3">
                  {(cancelledTodos.map(todo => (<TodoItem key={todo.id} todo={todo} onDelete={handleDelete} onEdit={startEdit} onStatusChange={handleStatusChange}/>)))}
                </ul>
              )}
            )
            


        </>
        </div>
        {/* 右：カレンダー（スクロールしても固定） */}
        <div className="flex-1 sticky top-6">
          <Calendar completedTodos={completedTodos} />
        </div>

      </div>
      ) }
      {activeTab === 'calendar' && (<p>kara</p>)}
      

      {/* 編集モーダル */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="タスクを編集">
        <div className="space-y-4">
          {/* アイコン選択 */}
          <div className="flex gap-1 flex-wrap">
            {ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setEditIcon(icon)}
                className={`text-xl p-1 rounded transition ${
                  editIcon === icon
                    ? 'bg-blue-100 ring-2 ring-blue-400'
                    : 'hover:bg-gray-100'
                }`}
              >
                {icon}
              </button>
            ))}
            {editIcon && (
              <button type="button" onClick={() => setEditIcon('')}
                className="text-xs text-gray-400 hover:text-gray-600 px-2">
                ✕
              </button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル（必須）</label>
            <input
              ref={editTitleRef}
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">詳細（任意）</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">期限（任意）</label>
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
