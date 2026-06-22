const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');

function write(file, content) {
    const full = path.join(__dirname, 'frontend', file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content.trim() + '\n');
}

// 1. API Service
write('src/services/api.ts', `
const BASE_URL = 'http://localhost:3000';

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(\`\${BASE_URL}\${endpoint}\`);
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  post: async (endpoint: string, data: any) => {
    const res = await fetch(\`\${BASE_URL}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  delete: async (endpoint: string) => {
    const res = await fetch(\`\${BASE_URL}\${endpoint}\`, { method: 'DELETE' });
    if (!res.ok) throw new Error('API Error');
    return res;
  }
};
`);

// 2. CSS
write('src/index.css', `
:root {
  --bg-dark: #0f172a;
  --bg-darker: #020617;
  --bg-card: rgba(30, 41, 59, 0.7);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --danger: #ef4444;
  --danger-hover: #dc2626;
  --border: rgba(255, 255, 255, 0.1);
  --font-family: 'Inter', system-ui, sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font-family);
  background-color: var(--bg-darker);
  background-image: radial-gradient(circle at top right, rgba(59, 130, 246, 0.15), transparent 40%),
                    radial-gradient(circle at bottom left, rgba(239, 68, 68, 0.1), transparent 40%);
  color: var(--text-main);
  min-height: 100vh;
}

.glass {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 2rem; }

h1, h2, h3 { font-weight: 700; letter-spacing: -0.5px; }
h1 { font-size: 2.5rem; margin-bottom: 1.5rem; background: linear-gradient(to right, #60a5fa, #a78bfa); -webkit-background-clip: text; color: transparent; }
h2 { font-size: 1.75rem; margin-bottom: 1rem; color: var(--text-main); }

input, select {
  width: 100%; padding: 0.75rem 1rem; margin-bottom: 1rem;
  background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 8px;
  color: var(--text-main); font-size: 1rem; transition: all 0.2s ease;
}
input:focus, select:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }

.btn { padding: 0.75rem 1.5rem; border-radius: 8px; border: none; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
.btn-primary { background-color: var(--primary); color: white; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3); }
.btn-primary:hover { background-color: var(--primary-hover); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4); }
.btn-danger { background-color: transparent; color: var(--danger); border: 1px solid var(--danger); padding: 0.4rem 0.8rem; font-size: 0.875rem; }
.btn-danger:hover { background-color: var(--danger); color: white; }

nav { display: flex; gap: 1rem; margin-bottom: 2rem; background: var(--bg-card); padding: 1rem; border-radius: 16px; border: 1px solid var(--border); backdrop-filter: blur(12px); }
nav a { text-decoration: none; color: var(--text-muted); font-weight: 600; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.2s; cursor: pointer; }
nav a:hover, nav a.active { color: var(--text-main); background: rgba(255, 255, 255, 0.1); }

table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
th, td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); }
th { color: var(--text-muted); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
tr:hover td { background: rgba(255, 255, 255, 0.03); }

.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
.card { padding: 1.5rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.875rem; }
.flex { display: flex; gap: 1rem; align-items: center; }
.justify-between { justify-content: space-between; }
`);

// 3. Components
write('src/components/Clientes.tsx', `
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function Clientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const load = async () => {
    try { const data = await api.get('/clientes'); setClientes(data.content || []); } 
    catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await api.post('/clientes', { nome, email });
    setNome(''); setEmail('');
    load();
  };

  const handleDelete = async (id: number) => {
    await api.delete(\`/clientes/\${id}\`);
    load();
  };

  return (
    <div className="grid">
      <div className="card glass">
        <h2>Novo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input required value={nome} onChange={e => setNome(e.target.value)} placeholder="João Silva" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="joao@email.com" />
          </div>
          <button className="btn btn-primary" type="submit">Cadastrar Cliente</button>
        </form>
      </div>
      <div className="card glass">
        <h2>Lista de Clientes</h2>
        <table>
          <thead><tr><th>Nome</th><th>Email</th><th>Ações</th></tr></thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.email}</td>
                <td><button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Excluir</button></td>
              </tr>
            ))}
            {clientes.length === 0 && <tr><td colSpan={3} style={{textAlign:'center'}}>Nenhum cliente cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

write('src/components/Produtos.tsx', `
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');

  const load = async () => {
    try { const data = await api.get('/produtos'); setProdutos(data.content || []); } 
    catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await api.post('/produtos', { nome, preco: Number(preco), descricao });
    setNome(''); setPreco(''); setDescricao('');
    load();
  };

  const handleDelete = async (id: number) => {
    await api.delete(\`/produtos/\${id}\`);
    load();
  };

  return (
    <div className="grid">
      <div className="card glass">
        <h2>Novo Produto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Produto</label>
            <input required value={nome} onChange={e => setNome(e.target.value)} placeholder="Teclado Mecânico" />
          </div>
          <div className="form-group">
            <label>Preço (R$)</label>
            <input required type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} placeholder="150.00" />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Teclado RGB..." />
          </div>
          <button className="btn btn-primary" type="submit">Cadastrar Produto</button>
        </form>
      </div>
      <div className="card glass">
        <h2>Lista de Produtos</h2>
        <table>
          <thead><tr><th>Produto</th><th>Preço</th><th>Ações</th></tr></thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>R$ {p.preco.toFixed(2)}</td>
                <td><button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Excluir</button></td>
              </tr>
            ))}
            {produtos.length === 0 && <tr><td colSpan={3} style={{textAlign:'center'}}>Nenhum produto cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

write('src/components/Pedidos.tsx', `
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function Pedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState<any[]>([{ produtoId: '', quantidade: 1 }]);

  const load = async () => {
    try { 
      const pData = await api.get('/pedidos'); setPedidos(pData.content || []); 
      const cData = await api.get('/clientes'); setClientes(cData.content || []); 
      const prData = await api.get('/produtos'); setProdutos(prData.content || []); 
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formattedItens = itens.map(i => ({ produtoId: Number(i.produtoId), quantidade: Number(i.quantidade) }));
    await api.post('/pedidos', { clienteId: Number(clienteId), itens: formattedItens });
    setClienteId('');
    setItens([{ produtoId: '', quantidade: 1 }]);
    load();
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItens = [...itens];
    newItens[index][field] = value;
    setItens(newItens);
  };

  const handleDelete = async (id: number) => {
    await api.delete(\`/pedidos/\${id}\`);
    load();
  };

  return (
    <div className="grid">
      <div className="card glass">
        <h2>Novo Pedido</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cliente</label>
            <select required value={clienteId} onChange={e => setClienteId(e.target.value)}>
              <option value="">Selecione um cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          
          <h3>Itens do Pedido</h3>
          {itens.map((item, index) => (
            <div key={index} className="flex" style={{marginBottom: '1rem'}}>
              <select required value={item.produtoId} onChange={e => handleItemChange(index, 'produtoId', e.target.value)}>
                <option value="">Produto...</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <input required type="number" min="1" value={item.quantidade} onChange={e => handleItemChange(index, 'quantidade', e.target.value)} style={{width: '100px', marginBottom: 0}} />
            </div>
          ))}
          <div style={{marginBottom: '1rem'}}>
            <button type="button" className="btn btn-primary" style={{padding: '0.4rem 0.8rem', fontSize: '0.875rem', background: 'rgba(255,255,255,0.1)'}} onClick={() => setItens([...itens, {produtoId:'', quantidade:1}])}>
              + Adicionar Item
            </button>
          </div>
          
          <button className="btn btn-primary" style={{width: '100%'}} type="submit">Finalizar Pedido</button>
        </form>
      </div>
      
      <div className="card glass">
        <h2>Histórico de Pedidos</h2>
        <table>
          <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Ações</th></tr></thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td>{p.cliente?.nome}</td>
                <td>R$ {p.total.toFixed(2)}</td>
                <td><button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Cancelar</button></td>
              </tr>
            ))}
            {pedidos.length === 0 && <tr><td colSpan={4} style={{textAlign:'center'}}>Nenhum pedido realizado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

// App.tsx
write('src/App.tsx', `
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
`);
