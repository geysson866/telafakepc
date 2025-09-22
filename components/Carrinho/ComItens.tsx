import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { RootState } from "../../store/store";
import { cleanCart } from "../../store/slices/cartSlice";
import { cleanSlice } from "../../store/slices/newSlice";

import Item from "./Item";
import PrecoFinal from "./PrecoFinal";
import Frete from "./Frete";

import styles from "../../styles/Carrinho.module.scss";

function ComItens() {
  const cartStore = useSelector((state: RootState) => state.cartStore.cart);
  const totalPrice = useSelector((state: RootState) => state.newSlice.obj);
  const dispatch = useDispatch();
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [cep, setCep] = useState("");
  const [valorCep, setValorCep] = useState(0);
  const [addressData, setAddressData] = useState<any>(null);

  useEffect(() => {
    if (cartStore.length === 0) {
      setTotalProdutos(0);
    } else {
      const reducedPrices = totalPrice
        .map((i) => {
          return i.valorTotal;
        })
        .reduce((a, b) => {
          return a + b;
        });
      setTotalProdutos(reducedPrices);
    }
  }, [totalPrice, cartStore.length]);

  function handleRemove() {
    if (window.confirm("Deseja limpar o carrinho?")) {
      dispatch(cleanCart());
      dispatch(cleanSlice());
    }
  }

  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    let novoValor = e.target.value.replace(/\D/g, "");

    if (novoValor.length > 5) {
      let novoCep = `${novoValor.slice(0, 5)}-${novoValor.slice(5)}`;
      setCep(novoCep);
    } else {
      setCep(novoValor);
    }
  }

  function handleValidarCep(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (cep.length === 9) {
      setValorCep(50);
    } else {
      alert("CEP INVÁLIDO!");
    }
  }

  function handleAddressFound(data: any) {
    setAddressData(data);
  }

  return (
    <>
      <div className={styles.titulo}>
        <h2>CARRINHO</h2>
      </div>
      <div className={styles.itemCarrinho}>
        {cartStore.map((i, key) => (
          <Item
            key={key}
            img={i.img}
            id={i.id}
            pPrazo={i.pPrazo}
            name={i.name}
            num={key}
            handleRemove={handleRemove}
            promo={i.promo}
            pathName={i.pathName}
            categoria={i.categoria}
          />
        ))}
      </div>
      <div className={styles.carrinhoLimpar}>
        <button onClick={handleRemove} data-cy="cart-clean">
          LIMPAR CARRINHO
        </button>
      </div>
      <Frete
        handleCepChange={handleCepChange}
        handleValidarCep={handleValidarCep}
        cep={cep}
        onAddressFound={handleAddressFound}
      />
      <div className={styles.precoFinalizar}>
        <PrecoFinal valorCep={valorCep} totalProdutos={totalProdutos} />
        <div className={styles.finalizarCompra}>
          {valorCep === 0 ? (
            <button disabled data-cy="finish-button">
              <p>
                <FontAwesomeIcon icon={faCartShopping} />
                FINALIZAR COMPRA
              </p>
            </button>
          ) : (
            <Link href={"/checkout"} passHref>
              <button data-cy="finish-button">
                <p>
                  <FontAwesomeIcon icon={faCartShopping} />
                  FINALIZAR COMPRA
                </p>
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default ComItens;
