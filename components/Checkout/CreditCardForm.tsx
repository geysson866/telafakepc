import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/Checkout.module.scss';

interface Props {
  total: number;
  onPaymentComplete: (paymentData: any) => void;
}

interface CardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cpf: string;
  holderName: string;
}

export default function CreditCardForm({ total, onPaymentComplete }: Props) {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cpf: '',
    holderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 11) {
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleInputChange = (field: keyof CardData, value: string) => {
    let formattedValue = value;
    
    switch (field) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        if (formattedValue.replace(/\s/g, '').length > 16) return;
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        if (formattedValue.length > 5) return;
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '');
        if (formattedValue.length > 4) return;
        break;
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'holderName':
        formattedValue = value.toUpperCase();
        break;
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const validateCard = () => {
    const cardNumberClean = cardData.cardNumber.replace(/\s/g, '');
    const cpfClean = cardData.cpf.replace(/\D/g, '');
    
    if (cardNumberClean.length !== 16) {
      alert('Número do cartão deve ter 16 dígitos');
      return false;
    }
    
    if (cardData.expiryDate.length !== 5) {
      alert('Data de validade inválida');
      return false;
    }
    
    if (cardData.cvv.length < 3) {
      alert('CVV deve ter pelo menos 3 dígitos');
      return false;
    }
    
    if (cpfClean.length !== 11) {
      alert('CPF deve ter 11 dígitos');
      return false;
    }
    
    if (!cardData.holderName.trim()) {
      alert('Nome do portador é obrigatório');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCard()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        method: 'credit_card',
        cardData: {
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
          cpf: cardData.cpf.replace(/\D/g, ''),
          holderName: cardData.holderName
        },
        transactionId: uuidv4(),
        status: 'pending'
      };
      
      setIsProcessing(false);
      onPaymentComplete(paymentData);
    }, 2000);
  };

  return (
    <div className={styles.creditCardForm}>
      <h3>Dados do Cartão de Crédito</h3>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Nome do Portador</label>
          <input
            type="text"
            value={cardData.holderName}
            onChange={(e) => handleInputChange('holderName', e.target.value)}
            placeholder="NOME COMO ESTÁ NO CARTÃO"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Número do Cartão</label>
          <input
            type="text"
            value={cardData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            placeholder="0000 0000 0000 0000"
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Validade</label>
            <input
              type="text"
              value={cardData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              placeholder="MM/AA"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>CVV</label>
            <input
              type="text"
              value={cardData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              placeholder="000"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>CPF do Portador</label>
          <input
            type="text"
            value={cardData.cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div className={styles.paymentSummary}>
          <p><strong>Total a pagar: {total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}</strong></p>
        </div>

        <button 
          type="submit" 
          className={styles.payButton}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processando...' : 'Finalizar Pagamento'}
        </button>
      </form>
    </div>
  );
}