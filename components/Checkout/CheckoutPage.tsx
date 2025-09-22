import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store/store';
import { cleanCart } from '../../store/slices/cartSlice';
import { cleanSlice } from '../../store/slices/newSlice';
import PaymentMethod from './PaymentMethod';
import styles from '../../styles/Checkout.module.scss';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartStore = useSelector((state: RootState) => state.cartStore.cart);
  const totalPrice = useSelector((state: RootState) => state.newSlice.obj);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    cpf: ''
  });
  const [step, setStep] = useState(1);

  const calculateTotal = () => {
    if (totalPrice.length === 0) return 0;
    return totalPrice.reduce((total, item) => total + item.valorTotal, 0);
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerData.name && customerData.email && customerData.cpf) {
      setStep(2);
    }
  };

  const handlePaymentComplete = (paymentData: any) => {
    // Create order
    const order = {
      id: uuidv4(),
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerCpf: customerData.cpf,
      items: cartStore.map(item => ({
        id: item.id,
        name: item.name,
        price: item.pPrazo,
        quantity: 1 // You might want to get this from cart state
      })),
      total: calculateTotal(),
      paymentMethod: paymentData.method,
      paymentStatus: paymentData.status,
      cardData: paymentData.cardData,
      pixData: paymentData.pixData,
      createdAt: new Date().toISOString()
    };

    // Save order
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Clear cart
    dispatch(cleanCart());
    dispatch(cleanSlice());

    // Redirect to success page
    router.push(`/checkout/success?orderId=${order.id}`);
  };

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 11) {
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  if (cartStore.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Carrinho vazio</h2>
        <p>Adicione produtos ao carrinho para continuar</p>
        <button onClick={() => router.push('/')}>
          Continuar Comprando
        </button>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.checkoutContainer}>
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
            <span>1</span>
            <p>Dados Pessoais</p>
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
            <span>2</span>
            <p>Pagamento</p>
          </div>
        </div>

        {step === 1 && (
          <div className={styles.customerData}>
            <h2>Dados Pessoais</h2>
            <form onSubmit={handleCustomerSubmit}>
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>CPF</label>
                <input
                  type="text"
                  value={customerData.cpf}
                  onChange={(e) => setCustomerData({...customerData, cpf: formatCPF(e.target.value)})}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <button type="submit" className={styles.nextBtn}>
                Continuar para Pagamento
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <PaymentMethod 
            total={calculateTotal()}
            onPaymentComplete={handlePaymentComplete}
          />
        )}

        <div className={styles.orderSummary}>
          <h3>Resumo do Pedido</h3>
          {cartStore.map((item, index) => (
            <div key={index} className={styles.summaryItem}>
              <span>{item.name}</span>
              <span>{item.pPrazo.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}</span>
            </div>
          ))}
          <div className={styles.total}>
            <strong>
              Total: {calculateTotal().toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}