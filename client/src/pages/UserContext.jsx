import React, { createContext, useState } from 'react';

// יצירת ה-UserContext
export const UserContext = createContext();

// יצירת ה-UserProvider שמספק את הקונטקסט
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
