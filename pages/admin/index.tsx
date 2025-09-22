import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/Admin/AdminLayout';
import OrdersList from '../../components/Admin/OrdersList';
import PixConfig from '../../components/Admin/PixConfig';
import ProductManager from '../../components/Admin/ProductManager';
import styles from '../../styles/Admin.module.scss';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      localStorage.setItem('adminAuth', 'authenticated');
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1>Dashboard Admin</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Sair
          </button>
        </div>
        
        <div className={styles.tabs}>
          <button 
            className={activeTab === 'orders' ? styles.active : ''}
            onClick={() => setActiveTab('orders')}
          >
            Pedidos
          </button>
          <button 
            className={activeTab === 'pix' ? styles.active : ''}
            onClick={() => setActiveTab('pix')}
          >
            Configuração PIX
          </button>
          <button 
            className={activeTab === 'products' ? styles.active : ''}
            onClick={() => setActiveTab('products')}
          >
            Produtos
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'orders' && <OrdersList />}
          {activeTab === 'pix' && <PixConfig />}
          {activeTab === 'products' && <ProductManager />}
        </div>
      </div>
    </AdminLayout>
  );
}