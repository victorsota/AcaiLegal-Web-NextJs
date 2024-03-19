import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import Modal from "react-modal";
import { FiRefreshCcw } from "react-icons/fi";
import styles from "./styles.module.scss";
import { useState } from "react";
import { setupAPIClient } from "../../services/api";
import { Header } from "../../components/Header";
import { ModalOrder } from "../../components/ModalOrder";

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
};

interface HomeProps {
  orders: OrderProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string | number;
    banner: string;
  };
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  };
};

export default function Dashboard({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);
  const [modalItem, setModalItem] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleFinishModal(id: string) {
    const api = setupAPIClient();

    await api.put("/order/finish", {
      order_id: id,
    });

    const response = await api.get("/orders");

    setOrderList(response.data);
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string) {
    const api = setupAPIClient();

    const response = await api.get("/order/detail", {
      params: {
        order_id: id,
      },
    });

    setModalItem(response.data);
    setModalVisible(true);
  }

  Modal.setAppElement("#__next");
  return (
    <>
      <Head>
        <title>Painel - AcaiLegal</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <div className={styles.header}>
            <h1>Últimos pedidos</h1>
            <button>
              <FiRefreshCcw color="#3fffa3" />
            </button>
          </div>

          <article className={styles.listOrders}>
            {orderList.length === 0 && (
              <span className={styles.emptyList}>
                Nenhum pedido aberto foi encontrado.
              </span>
            )}
            {orderList.map((item) => (
              <section key={item.id} className={styles.orderItem}>
                <button onClick={() => handleOpenModalView(item.id)}>
                  <div className={styles.tag}></div>
                  <span>Cliente: {item.name} </span>
                </button>
              </section>
            ))}
          </article>
        </main>

        {modalVisible && (
          <ModalOrder
            isOpen={modalVisible}
            order={modalItem}
            onClose={handleCloseModal}
            onFinish={handleFinishModal}
          />
        )}
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const ApiClient = setupAPIClient(ctx);

  const response = await ApiClient.get("/orders");
  return {
    props: {
      orders: response.data || [],
    },
  };
});
