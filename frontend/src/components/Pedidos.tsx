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
    await api.delete(`/pedidos/${id}`);
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
