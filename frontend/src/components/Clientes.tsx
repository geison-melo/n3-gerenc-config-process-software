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
    await api.delete(`/clientes/${id}`);
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
