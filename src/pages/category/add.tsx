import Head from "next/head";
import { Header } from "../../components/Header";
import { FormEvent, useState } from "react";
import styles from "./styles.module.scss";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";

export default function Category() {
  const [name, setName] = useState("");

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (!name) return;

    const apiClient = setupAPIClient();

    await apiClient.post("/categories", { name: name });

    toast.success("Categoria cadastrada com sucesso!");

    setName("");
  }
  return (
    <>
      <Head>
        <title>Nova Categoria - AcaiLegal</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Nova categoria</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nome da Categoria"
              className={styles.input}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            <button className={styles.button} type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
