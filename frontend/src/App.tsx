import { useState } from 'react';
import { Clientes } from './components/Clientes';
import { Produtos } from './components/Produtos';
import { Pedidos } from './components/Pedidos';
import './index.css';

function App() {
  const [tab, setTab] = useState('pedidos');

  return (
    <div className="container">
      <h1>E-Commerce Admin</h1>
      <nav>
        <a className={tab === 'pedidos' ? 'active' : ''} onClick={() => setTab('pedidos')}>Pedidos</a>
        <a className={tab === 'clientes' ? 'active' : ''} onClick={() => setTab('clientes')}>Clientes</a>
        <a className={tab === 'produtos' ? 'active' : ''} onClick={() => setTab('produtos')}>Produtos</a>
      </nav>
      
      <main>
        {tab === 'pedidos' && <Pedidos />}
        {tab === 'clientes' && <Clientes />}
        {tab === 'produtos' && <Produtos />}
      </main>
    </div>
  );
}

export default App;
