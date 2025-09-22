import { useState } from "react";
import styles from "../../styles/Carrinho.module.scss";

interface Props {
  handleCepChange: Function;
  handleValidarCep: Function;
  cep: string;
  onAddressFound?: Function;
}

function Frete({ handleCepChange, handleValidarCep, cep, onAddressFound }: Props) {
  const [addressData, setAddressData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCepValidation = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (cep.length === 9) {
      setLoading(true);
      try {
        const cleanCep = cep.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          alert('CEP não encontrado!');
        } else {
          setAddressData(data);
          if (onAddressFound) {
            onAddressFound(data);
          }
          handleValidarCep(e);
        }
      } catch (error) {
        alert('Erro ao buscar CEP. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      alert("CEP INVÁLIDO!");
    }
  };

  return (
    <div className={styles.containerFrete}>
      <h3>CALCULAR FRETE</h3>
      <form className={styles.freteForm}>
        <input
          onChange={(e) => handleCepChange(e)}
          type="text"
          name="cep"
          placeholder="CEP"
          pattern="[0-9]8"
          maxLength={9}
          value={cep}
          data-cy="input-cep"
        />
        <button onClick={handleCepValidation} data-cy="cep-button" disabled={loading}>
          {loading ? 'Buscando...' : 'Calcular'}
        </button>
      </form>
      {addressData && (
        <div className={styles.addressInfo}>
          <p><strong>Endereço:</strong> {addressData.logradouro}</p>
          <p><strong>Bairro:</strong> {addressData.bairro}</p>
          <p><strong>Cidade:</strong> {addressData.localidade} - {addressData.uf}</p>
        </div>
      )}
    </div>
  );
}

export default Frete;
