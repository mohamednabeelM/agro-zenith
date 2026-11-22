// src/utils/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { Storage } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = Storage.load("user");
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  const register = (data) => {
    const users = Storage.load("all_users") || [];
    if (users.find(u => u.phone === data.phone)) {
      return { error: "Phone number already registered" };
    }
    const newUser = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      farms: [],
      cropHistory: [],
      diseaseHistory: [],
    };
    users.push(newUser);
    Storage.save("all_users", users);
    Storage.save("user", newUser);
    setUser(newUser);
    return { success: true };
  };

  const login = (phone, password) => {
    const users = Storage.load("all_users") || [];
    const found = users.find(u => u.phone === phone && u.password === password);
    if (!found) return { error: "Invalid phone or password" };
    Storage.save("user", found);
    setUser(found);
    return { success: true };
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    const users = Storage.load("all_users") || [];
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) users[idx] = updated;
    Storage.save("all_users", users);
    Storage.save("user", updated);
    setUser(updated);
  };

  const logout = () => {
    Storage.remove("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
