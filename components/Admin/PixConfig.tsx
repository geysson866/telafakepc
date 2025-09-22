import { useState, useEffect } from 'react';
import styles from '../../styles/Admin.module.scss';

interface PixConfig {
  clientId: string;
  clientSecret: string;
  isActive: boolean;
}

export default function PixConfig() {
  const [config, setConfig] = useState<PixConfig>({
    clientId: '',
    clientSecret: '',
    isActive: false
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const savedConfig = localStorage.getItem('pixConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pixConfig', JSON.stringify(config));
    setIsEditing(false);
    alert('Configuração PIX salva com sucesso!');
  };

  const handleTest = async () => {
    if (!config.clientId || !config.clientSecret) {
      alert('Configure o Client ID e Client Secret primeiro!');
      return;
    }

    try {
      // Test the PIX API connection
      const credentials = `${config.clientId}:${config.clientSecret}`;
      const base64Credentials = btoa(credentials);
      
      const response = await fetch('https://api.pixupbr.com/v2/pix/qrcode', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Basic ${base64Credentials}`
        },
        body: JSON.stringify({
          amount: 1.00,
          external_id: 'test_' + Date.now(),
          payerQuestion: 'Teste de conexão',
          payer: {
            name: 'Teste',
            document: '12345678901'
          }
        })
      });

      if (response.ok) {
        alert('Conexão com PIX API testada com sucesso!');
      } else {
        alert('Erro ao conectar com PIX API. Verifique as credenciais.');
      }
    } catch (error) {
      alert('Erro ao testar conexão: ' + error);
    }
  };

  return (
    <div className={styles.pixConfig}>
      <h2>Configuração do Gateway PIX</h2>
      
      <div className={styles.configCard}>
        <div className={styles.configHeader}>
          <h3>Credenciais PIX</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={styles.editBtn}
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className={styles.configForm}>
            <div className={styles.formGroup}>
              <label>Client ID:</label>
              <input
                type="text"
                value={config.clientId}
                onChange={(e) => setConfig({...config, clientId: e.target.value})}
                placeholder="Digite o Client ID"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Client Secret:</label>
              <input
                type="password"
                value={config.clientSecret}
                onChange={(e) => setConfig({...config, clientSecret: e.target.value})}
                placeholder="Digite o Client Secret"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={config.isActive}
                  onChange={(e) => setConfig({...config, isActive: e.target.checked})}
                />
                Ativar PIX como método de pagamento
              </label>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn}>
                Salvar Configuração
              </button>
              <button type="button" onClick={handleTest} className={styles.testBtn}>
                Testar Conexão
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.configDisplay}>
            <p><strong>Client ID:</strong> {config.clientId || 'Não configurado'}</p>
            <p><strong>Client Secret:</strong> {config.clientSecret ? '••••••••••••' : 'Não configurado'}</p>
            <p><strong>Status:</strong> 
              <span className={config.isActive ? styles.active : styles.inactive}>
                {config.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className={styles.instructions}>
        <h3>Instruções de Configuração</h3>
        <ol>
          <li>Obtenha suas credenciais PIX (Client ID e Client Secret) do provedor</li>
          <li>Configure as credenciais acima</li>
          <li>Teste a conexão para verificar se está funcionando</li>
          <li>Ative o PIX como método de pagamento</li>
        </ol>
        
        <div className={styles.apiInfo}>
          <h4>Informações da API</h4>
          <p><strong>Endpoint:</strong> https://api.pixupbr.com/v2/pix/qrcode</p>
          <p><strong>Método:</strong> POST</p>
          <p><strong>Autenticação:</strong> Basic Auth (Base64)</p>
        </div>
      </div>
    </div>
  );
}