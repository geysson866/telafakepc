import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/Checkout.module.scss';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o: any) => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successContainer}>
          <h1>Carregando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.successPage}>
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✅</div>
        <h1>Pedido Realizado com Sucesso!</h1>
        
        <div className={styles.orderInfo}>
          <p><strong>Número do Pedido:</strong> #{order.id.slice(-8)}</p>
          <p><strong>Total:</strong> {order.total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}</p>
          <p><strong>Método de Pagamento:</strong> {
            order.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'PIX'
          }</p>
          <p><strong>Status:</strong> {
            order.paymentStatus === 'pending' ? 'Aguardando Pagamento' : 
            order.paymentStatus === 'completed' ? 'Pagamento Confirmado' : 'Pagamento Falhou'
          }</p>
        </div>

        {order.paymentMethod === 'pix' && order.paymentStatus === 'pending' && (
          <div className={styles.pixInstructions}>
            <h3>Instruções para Pagamento PIX</h3>
            <p>Seu PIX foi gerado com sucesso. Complete o pagamento para confirmar seu pedido.</p>
          </div>
        )}

        <div className={styles.successActions}>
          <Link href="/">
            <button className={styles.continueBtn}>
              Continuar Comprando
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}