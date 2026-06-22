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
    await api.delete(`/produtos/${id}`);
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
