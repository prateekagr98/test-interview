import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";

type User = {
  id: number;
  name: string;
};

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");
  const [theme, setTheme] = useState<Theme>("light");

  // ✅ Fix 1: Fetch once on mount
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // ✅ Fix 2: Add filter dependency
  const filteredUsers = useMemo(() => {
    console.log("Filtering...");
    return users.filter((u) => u.name.toLowerCase().includes(filter.toLowerCase()));
  }, [users, filter]);

  // ✅ Fix 3: Functional state update avoids stale closure
  const deleteUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  // ✅ Fix 4: Stable context value with useMemo
  const themeValue = useMemo(
    () => ({
      theme,
      toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <div style={{ padding: 20 }}>
        <h1>User Management ✅</h1>

        <SearchBar value={filter} onChange={setFilter} />

        <UserList users={filteredUsers} onDelete={deleteUser} />

        <ThemeSwitcher />
      </div>
    </ThemeContext.Provider>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="search-container">
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        placeholder="Search..."
        value={value}
        className="search"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function UserList({ users, onDelete }: { users: User[]; onDelete: (id: number) => void }) {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          {u.name} <button onClick={() => onDelete(u.id)}>❌</button>
        </li>
      ))}
    </ul>
  );
}

function ThemeSwitcher() {
  const { theme, toggle } = useContext(ThemeContext);

  // ✅ Fix 7: Add theme dependency
  useEffect(() => {
    document.body.style.background = theme === "light" ? "#fff" : "#333";
  }, [theme]);

  return (
    <button className="toggle-button" onClick={toggle}>Toggle Theme (Current: {theme})</button>
  );
}

export default App;
