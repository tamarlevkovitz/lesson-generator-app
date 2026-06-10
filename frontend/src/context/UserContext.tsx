import { createContext, useContext, useState } from 'react';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);