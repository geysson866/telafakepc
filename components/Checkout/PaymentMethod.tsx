import { useState } from 'react';
import CreditCardForm from './CreditCardForm';
import PixPayment from './PixPayment';
import styles from '../../styles/Checkout.module.scss';

interface Props {
  total: number;
  onPaymentComplete: (paymentData: any) => void;
}

export default function PaymentMethod({ total, onPaymentComplete }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<'credit_card' | 'pix' | null>(null);

  return (
    <div className={styles.paymentMethod}>
      <h2>Escolha o método de pagamento</h2>
      
      <div className={styles.methodOptions}>
        <button
          className={selectedMethod === 'credit_card' ? styles.selected : ''}
          onClick={() => setSelectedMethod('credit_card')}
        >
          <div className={styles.methodIcon}>💳</div>
          <div>
            <h3>Cartão de Crédito</h3>
            <p>Pagamento seguro com cartão</p>
          </div>
        </button>

        <button
          className={selectedMethod === 'pix' ? styles.selected : ''}
          onClick={() => setSelectedMethod('pix')}
        >
          <div className={styles.methodIcon}>📱</div>
          <div>
            <h3>PIX</h3>
            <p>Pagamento instantâneo</p>
          </div>
        </button>
      </div>

      {selectedMethod === 'credit_card' && (
        <CreditCardForm 
          total={total}
          onPaymentComplete={onPaymentComplete}
        />
      )}

      {selectedMethod === 'pix' && (
        <PixPayment 
          total={total}
          onPaymentComplete={onPaymentComplete}
        />
      )}
    </div>
  );
}