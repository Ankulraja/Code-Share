import { useState, useEffect } from "react";

export const useClients = (username) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (username) {
      setClients([{ id: 1, username }]);
    }
  }, [username]);

  return { clients };
};
