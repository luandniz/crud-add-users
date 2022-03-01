import styles from "./styles.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useModal } from "../../context/ModalContext";
import { useUsers } from "../../context/UsersContext";
import { FormEvent, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  name: string;
  image: string;
  stars: number;
};

interface ModalProps {
  title: string;
  type: string;
  user: User;
}

export function Modal({ title, type, user }: ModalProps) {
  const { closeModal } = useModal();
  const [name, setName] = useState("");
  const { users, updateUsers } = useUsers();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // FAZER IF E CASO O TYPE SEJA EDITAR EDITE O USUÁRIO
    // CASO NÃO SEJA ADICIONE O USUÁRIO

    if (type === "edit") {
      const { data } = await axios.put(
        `http://localhost:3333/users/${user.id}`,
        {
          ...user,
          name,
        }
      );
      const usersUpdated = users.map((user) =>
        user.id == data.id ? data : user
      );

      updateUsers(usersUpdated);
      closeModal();
    } else {
      const newUser = {
        id: new Date().getTime(),
        name,
        image:
          "https://avatars.githubusercontent.com/u/86088287?s=400&u=dcd7be222cc30b740640f0c4ede9a511eea7abcf&v=4",
        stars: 100,
      };

      const { data } = await axios.post("http://localhost:3333/users", newUser);
      const addNewUser = [...users, data];
      updateUsers(addNewUser);
      closeModal();
    }
  }

  return (
    <div className={styles.containerModal}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <AiOutlineCloseCircle
          className={styles.closeButton}
          onClick={closeModal}
        />

        <h2>{title}</h2>

        <input
          placeholder="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <button type="submit" className={styles.submitButton}>
          Enviar
        </button>
      </form>
    </div>
  );
}
