import { useState } from "react";
import { login } from "../lib/api";

type Props = {
  onLogin: (token: string) => void;
};

export default function LoginForm({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = await login({ username, password});  // ← 何を渡す？
        onLogin(token);         // ← 成功時だけ呼ぶ
    } catch {
        setError('ログイン認証に失敗しました');   // ← 失敗時のメッセージ
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <label>ユーザ名</label>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
        </div>
        <div>
            <label>パスワード</label>
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
        </div>
        {error && <p>{error}</p>}
        <div>
            <label>送信</label>
            <button type="submit">ログイン</button>
        </div>
    </form>
  );
}
