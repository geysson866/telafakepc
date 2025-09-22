import { useState, useEffect } from 'react';
import styles from '../../styles/Admin.module.scss';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerAddress?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  items: any[];
  total: number;
  paymentMethod: 'credit_card' | 'pix';
  paymentStatus: 'pending' | 'completed' | 'failed';
  cardData?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cpf: string;
  };
  pixData?: {
    transactionId: string;
    qrcode: string;
    status: string;
  };
  createdAt: string;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  };

  const updateOrderStatus = (orderId: string, status: 'pending' | 'completed' | 'failed') => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, paymentStatus: status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})\d{8}(\d{4})/, '$1 **** **** $2');
  };

  return (
    <div className={styles.ordersList}>
      <h2>Lista de Pedidos</h2>
      
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <h3>Pedido #{order.id.slice(-8)}</h3>
                <span className={`${styles.status} ${styles[order.paymentStatus]}`}>
                  {order.paymentStatus === 'pending' && 'Pendente'}
                  {order.paymentStatus === 'completed' && 'Concluído'}
                  {order.paymentStatus === 'failed' && 'Falhou'}
                </span>
              </div>
              
              <div className={styles.orderInfo}>
                <p><strong>Cliente:</strong> {order.customerName}</p>
                <p><strong>Email:</strong> {order.customerEmail}</p>
                <p><strong>CPF:</strong> {order.customerCpf}</p>
                {order.customerAddress && (
                  <p><strong>Endereço:</strong> {order.customerAddress.street}, {order.customerAddress.number} - {order.customerAddress.neighborhood}</p>
                )}
                <p><strong>Total:</strong> {order.total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}</p>
                <p><strong>Pagamento:</strong> {order.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'PIX'}</p>
                <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
              </div>

              {order.paymentMethod === 'credit_card' && order.cardData && (
                <div className={styles.cardInfo}>
                  <h4>Dados do Cartão:</h4>
                  <p><strong>Número:</strong> {maskCardNumber(order.cardData.cardNumber)}</p>
                  <p><strong>Validade:</strong> {order.cardData.expiryDate}</p>
                  <p><strong>CVV:</strong> ***</p>
                  <p><strong>CPF:</strong> {order.cardData.cpf}</p>
                </div>
              )}

              {order.paymentMethod === 'pix' && order.pixData && (
                <div className={styles.pixInfo}>
                  <h4>Dados do PIX:</h4>
                  <p><strong>Transaction ID:</strong> {order.pixData.transactionId}</p>
                  <p><strong>Status:</strong> {order.pixData.status}</p>
                </div>
              )}

              <div className={styles.orderActions}>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className={styles.viewBtn}
                >
                  Ver Detalhes
                </button>
                {order.paymentStatus === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className={styles.approveBtn}
                    >
                      Aprovar
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'failed')}
                      className={styles.rejectBtn}
                    >
                      Rejeitar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Detalhes do Pedido #{selectedOrder.id.slice(-8)}</h3>
              <button onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.customerDetails}>
                <h4>Dados do Cliente</h4>
                <p><strong>Nome:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>CPF:</strong> {selectedOrder.customerCpf}</p>
                {selectedOrder.customerAddress && (
                  <div>
                    <p><strong>Endereço Completo:</strong></p>
                    <p>{selectedOrder.customerAddress.street}, {selectedOrder.customerAddress.number}</p>
                    <p>{selectedOrder.customerAddress.neighborhood}</p>
                    <p>{selectedOrder.customerAddress.city} - {selectedOrder.customerAddress.state}</p>
                    <p>CEP: {selectedOrder.customerAddress.cep}</p>
                  </div>
                )}
              </div>

              <div className={styles.itemsList}>
                <h4>Itens do Pedido</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <p><strong>{item.name}</strong></p>
                    <p>Quantidade: {item.quantity}</p>
                    <p>Preço: {item.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</p>
                  </div>
                ))}
              </div>

              {selectedOrder.paymentMethod === 'credit_card' && selectedOrder.cardData && (
                <div className={styles.paymentDetails}>
                  <h4>Dados do Cartão</h4>
                  <p><strong>Número:</strong> {formatCardNumber(selectedOrder.cardData.cardNumber)}</p>
                  <p><strong>Validade:</strong> {selectedOrder.cardData.expiryDate}</p>
                  <p><strong>CVV:</strong> {selectedOrder.cardData.cvv}</p>
                  <p><strong>CPF:</strong> {selectedOrder.cardData.cpf}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}