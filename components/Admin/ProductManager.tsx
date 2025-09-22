import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/Admin.module.scss';

interface Product {
  id: string;
  name: string;
  categoria: string;
  fabricante: string;
  modelo: string;
  pPrazo: number;
  img: string;
  img2: string;
  pathName: string;
  garantia: string;
  promo: boolean;
  destaque: boolean;
  specs: any[];
  tags: string[];
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    categoria: '',
    fabricante: '',
    modelo: '',
    pPrazo: 0,
    img: '',
    img2: '',
    pathName: '',
    garantia: '',
    promo: false,
    destaque: false,
    specs: [],
    tags: []
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    // Em um ambiente real, isso viria de uma API
    // Por enquanto, vamos simular com localStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Produtos de exemplo
      const exampleProducts: Product[] = [
        {
          id: uuidv4(),
          name: 'Processador Intel Core i5-12400F',
          categoria: 'processador',
          fabricante: 'Intel',
          modelo: 'i5-12400F',
          pPrazo: 899.99,
          img: '/images/cpu/i5-1.jpg',
          img2: '/images/cpu/i5-2.jpg',
          pathName: 'intel-core-i5-12400f',
          garantia: '3 anos',
          promo: false,
          destaque: true,
          specs: [
            { 'Especificações Gerais': ['6 núcleos', '12 threads', '2.5 GHz base'] }
          ],
          tags: ['intel', 'processador', 'gaming']
        }
      ];
      setProducts(exampleProducts);
      localStorage.setItem('products', JSON.stringify(exampleProducts));
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (isCreating) {
      const newProduct: Product = {
        ...formData as Product,
        id: uuidv4(),
        pathName: formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || ''
      };
      const updatedProducts = [...products, newProduct];
      saveProducts(updatedProducts);
      setIsCreating(false);
    } else if (selectedProduct) {
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id ? { ...formData as Product, id: selectedProduct.id } : p
      );
      saveProducts(updatedProducts);
      setIsEditing(false);
      setSelectedProduct(null);
    }
    
    setFormData({
      name: '',
      categoria: '',
      fabricante: '',
      modelo: '',
      pPrazo: 0,
      img: '',
      img2: '',
      pathName: '',
      garantia: '',
      promo: false,
      destaque: false,
      specs: [],
      tags: []
    });
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setIsEditing(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      saveProducts(updatedProducts);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      categoria: '',
      fabricante: '',
      modelo: '',
      pPrazo: 0,
      img: '',
      img2: '',
      pathName: '',
      garantia: '',
      promo: false,
      destaque: false,
      specs: [],
      tags: []
    });
  };

  const categories = [
    'processador',
    'placa-mae',
    'placa-de-video',
    'memoria-ram',
    'ssd',
    'fonte',
    'gabinete'
  ];

  return (
    <div className={styles.productManager}>
      <div className={styles.productHeader}>
        <h2>Gerenciar Produtos</h2>
        <button onClick={handleCreate} className={styles.createBtn}>
          Criar Produto
        </button>
      </div>

      {(isEditing || isCreating) && (
        <div className={styles.productForm}>
          <h3>{isCreating ? 'Criar Produto' : 'Editar Produto'}</h3>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nome do Produto</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoria</label>
              <select
                value={formData.categoria || ''}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('-', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Fabricante</label>
              <input
                type="text"
                value={formData.fabricante || ''}
                onChange={(e) => handleInputChange('fabricante', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Modelo</label>
              <input
                type="text"
                value={formData.modelo || ''}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.pPrazo || 0}
                onChange={(e) => handleInputChange('pPrazo', parseFloat(e.target.value))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Garantia</label>
              <input
                type="text"
                value={formData.garantia || ''}
                onChange={(e) => handleInputChange('garantia', e.target.value)}
                placeholder="Ex: 3 anos"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Imagem Principal (URL)</label>
              <input
                type="text"
                value={formData.img || ''}
                onChange={(e) => handleInputChange('img', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Imagem Secundária (URL)</label>
              <input
                type="text"
                value={formData.img2 || ''}
                onChange={(e) => handleInputChange('img2', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))}
                placeholder="Ex: gaming, intel, processador"
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={formData.promo || false}
                onChange={(e) => handleInputChange('promo', e.target.checked)}
              />
              Produto em promoção
            </label>

            <label>
              <input
                type="checkbox"
                checked={formData.destaque || false}
                onChange={(e) => handleInputChange('destaque', e.target.checked)}
              />
              Produto em destaque
            </label>
          </div>

          <div className={styles.formActions}>
            <button onClick={handleSave} className={styles.saveBtn}>
              {isCreating ? 'Criar' : 'Salvar'}
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setIsCreating(false);
                setSelectedProduct(null);
              }} 
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className={styles.productsGrid}>
        {products.map(product => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImage}>
              <img src={product.img} alt={product.name} />
            </div>
            
            <div className={styles.productInfo}>
              <h4>{product.name}</h4>
              <p><strong>Categoria:</strong> {product.categoria}</p>
              <p><strong>Fabricante:</strong> {product.fabricante}</p>
              <p><strong>Preço:</strong> {product.pPrazo.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}</p>
              
              <div className={styles.productBadges}>
                {product.promo && <span className={styles.promoBadge}>PROMO</span>}
                {product.destaque && <span className={styles.destaqueBadge}>DESTAQUE</span>}
              </div>
            </div>

            <div className={styles.productActions}>
              <button onClick={() => handleEdit(product)} className={styles.editBtn}>
                Editar
              </button>
              <button onClick={() => handleDelete(product.id)} className={styles.deleteBtn}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}