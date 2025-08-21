// @ts-nocheck
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


  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  });


  const filteredUsers = useMemo(() => {
    console.log("Filtering...");
    return users.filter((u) => u.name.toLowerCase().includes(filter.toLowerCase()));
  }, [users]); // filter missing dependency


  const deleteUser = useCallback((id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  }, []);


  const themeValue = {
    theme,
    toggle: () => setTheme(theme === "light" ? "dark" : "light"),
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <div style={{ padding: 20 }}>
        <h1>User Management (Buggy) 🐞</h1>

        <SearchBar value={filter} onChange={setFilter} />

        <UserList users={filteredUsers} onDelete={deleteUser} />

        <ThemeSwitcher />
      </div>
    </ThemeContext.Provider>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <input
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function UserList({ users, onDelete }: { users: User[]; onDelete: (id: number) => void }) {
  return (
    <ul>
      {users.map((u, idx) => (

        <li key={idx}>
          {u.name} <button onClick={() => onDelete(u.id)}>❌</button>
        </li>
      ))}
    </ul>
  );
}

function ThemeSwitcher() {
  const { theme, toggle } = useContext(ThemeContext);

  useEffect(() => {
    document.body.style.background = theme === "light" ? "#fff" : "#333";
  }, []); 

  return (
    <button className="toggle-button" onClick={toggle}>Toggle Theme (Current: {theme})</button>
  );
}

export default App;
