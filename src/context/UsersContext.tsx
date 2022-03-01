import axios from "axios";
import {
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

interface UsersContextData {
  users: User[];
  updateUsers: (data: User[]) => void;
  removeUser: (userId: number) => void;
}

interface ModalProviderProps {
  children: ReactNode;
}

type User = {
  id: number;
  name: string;
  image: string;
  stars: number;
};

const UsersContext = createContext({} as UsersContextData);

export function UsersProvider({ children }: ModalProviderProps) {
  const [users, setUsers] = useState<User[]>([]);

  async function removeUser(userId: number) {
    // REMOVER USUÁRIO
    const response = await axios.delete(
      `http://localhost:3333/users/${userId}`
    );

    const removeUser = users.filter((user) => user.id !== userId);
    setUsers(removeUser);
  }

  async function getUsers() {
    // BUSCAR OS USUÁRIOS NA API COM AXIOS
    const response = await axios.get("http://localhost:3333/users");
    setUsers(response.data);
  }

  function updateUsers(data: User[]) {
    setUsers(data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, removeUser, updateUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => useContext(UsersContext);
