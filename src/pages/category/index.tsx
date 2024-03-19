import Head from "next/head";
import { Header } from "../../components/Header";
import { FormEvent, useState } from "react";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { canSSRAuth } from "../../utils/canSSRAuth";

type ItemProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  categories: ItemProps[];
}

export default function add({ categories }: CategoryProps) {
  return (
    <>
      <Head>
        <title>Painel - AcaiLegal</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <div className={styles.header}>
            <h1>Categorias</h1>
            <Link href="/category/add">
              <button>
                <FaPlus color="#3fffa3" />
              </button>
            </Link>
          </div>

          <article className={styles.listOrders}>
            {categories.length === 0 && (
              <span className={styles.emptyList}>
                Nenhuma categoria cadastrada.
              </span>
            )}
            {categories.map((item) => (
              <section key={item.id} className={styles.orderItem}>
                <div className={styles.tag}></div>
                <span>Categoria: {item.name} </span>
              </section>
            ))}
          </article>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const api = setupAPIClient(ctx);

  const response = await api.get("/categories");

  return {
    props: {
      categories: response.data || [],
    },
  };
});
