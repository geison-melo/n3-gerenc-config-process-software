/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  ClipboardList,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { api } from "../services/api";

export function Pedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [itens, setItens] = useState<any[]>([{ produtoId: "", quantidade: 1 }]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [pData, cData, prData] = await Promise.all([
        api.get("/pedidos"),
        api.get("/clientes"),
        api.get("/produtos"),
      ]);
      setPedidos(pData.content || []);
      setClientes(cData.content || []);
      setProdutos(prData.content || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || itens.some((i) => !i.produtoId)) return;
    setLoading(true);
    try {
      const formattedItens = itens.map((i) => ({
        produtoId: Number(i.produtoId),
        quantidade: Number(i.quantidade),
      }));
      await api.post("/pedidos", {
        clienteId: Number(clienteId),
        itens: formattedItens,
      });
      setClienteId("");
      setItens([{ produtoId: "", quantidade: 1 }]);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const next = [...itens];
    next[index][field] = value;
    setItens(next);
  };

  const adjustQty = (index: number, delta: number) => {
    const next = [...itens];
    next[index].quantidade = Math.max(
      1,
      Number(next[index].quantidade) + delta,
    );
    setItens(next);
  };

  const removeItem = (index: number) => {
    if (itens.length === 1) return;
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja cancelar este pedido?")) return;
    try {
      await api.delete(`/pedidos/${id}`);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={styles.page}>
      {/* Top Header Section */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.mainTitle}>Pedidos de Venda</h1>
          <p style={styles.subtitle}>
            Gerencie ordens de serviço, adicione produtos e visualize seu
            histórico.
          </p>
        </div>
      </header>

      <div style={styles.dashboardGrid}>
        {/* Form Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <ShoppingCart size={18} color="#2563EB" />
            <span style={styles.cardTitle}>Novo Pedido</span>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Cliente</label>
              <select
                style={styles.select}
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                required
              >
                <option value="">Selecione um cliente…</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={styles.sectionLabel}>Produtos do Pedido</div>
              {itens.map((item, index) => (
                <div key={index} style={styles.itemRow}>
                  <select
                    style={{ ...styles.select, flex: 1 }}
                    value={item.produtoId}
                    onChange={(e) =>
                      handleItemChange(index, "produtoId", e.target.value)
                    }
                    required
                  >
                    <option value="">Produto…</option>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>

                  <div style={styles.qtyControl}>
                    <button
                      type="button"
                      style={styles.qtyBtn}
                      onClick={() => adjustQty(index, -1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={styles.qtyValue}>{item.quantidade}</span>
                    <button
                      type="button"
                      style={styles.qtyBtn}
                      onClick={() => adjustQty(index, 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    style={{
                      ...styles.iconBtn,
                      borderColor: "#F1F5F9",
                      visibility: itens.length > 1 ? "visible" : "hidden",
                    }}
                    onClick={() => removeItem(index)}
                    title="Remover item"
                  >
                    <Trash2 size={13} color="#EF4444" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                style={styles.addItemBtn}
                onClick={() =>
                  setItens([...itens, { produtoId: "", quantidade: 1 }])
                }
              >
                <Plus size={13} />
                Adicionar outro produto
              </button>
            </div>

            <button
              type="submit"
              style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={16} style={styles.spinner} />
              ) : (
                <ShoppingCart size={16} />
              )}
              {loading ? "Salvando…" : "Finalizar Pedido"}
            </button>
          </form>
        </div>

        {/* List Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <ClipboardList size={18} color="#2563EB" />
              <span style={styles.cardTitle}>Histórico de Pedidos</span>
            </div>
            <span style={styles.badge}>{pedidos.length}</span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: 80 }}>ID</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Valor Total</th>
                  <th style={{ ...styles.th, width: 60, textAlign: "center" }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={{ ...styles.td, ...styles.mono }}>#{p.id}</td>
                    <td style={{ ...styles.td, fontWeight: 500 }}>
                      {p.cliente?.nome}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontVariantNumeric: "tabular-nums",
                        color: "#0F172A",
                        fontWeight: 600,
                      }}
                    >
                      R$ {p.total.toFixed(2)}
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        style={styles.iconBtn}
                        title="Cancelar pedido"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={15} color="#EF4444" />
                      </button>
                    </td>
                  </tr>
                ))}
                {pedidos.length === 0 && (
                  <tr>
                    <td colSpan={4} style={styles.empty}>
                      Nenhum pedido registrado no sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
    fontFamily: "Inter, system-ui, sans-serif",
    backgroundColor: "#F8FAFC",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "2rem",
    borderBottom: "1px solid #E2E8F0",
    paddingBottom: "1.5rem",
  },
  mainTitle: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0F172A",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#64748B",
    margin: "0.25rem 0 0 0",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "2rem",
    alignItems: "start",
  },
  card: {
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "1rem",
    borderBottom: "1px solid #F1F5F9",
  },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#1E293B",
  },
  badge: {
    background: "#EFF6FF",
    color: "#2563EB",
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "99px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  sectionLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.75rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#475569",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  select: {
    padding: "0.625rem 0.75rem",
    fontSize: "0.875rem",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    background: "#FFF",
    color: "#0F172A",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
  },
  itemRow: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    overflow: "hidden",
    background: "#FFF",
    flexShrink: 0,
  },
  qtyBtn: {
    background: "none",
    border: "none",
    padding: "8px 10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: "#64748B",
  },
  qtyValue: {
    fontSize: "0.875rem",
    fontWeight: 600,
    minWidth: 28,
    textAlign: "center",
    color: "#0F172A",
  },
  addItemBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "#FFF",
    border: "1px dashed #CBD5E1",
    borderRadius: "8px",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    color: "#475569",
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
    justifyContent: "center",
    marginTop: "0.25rem",
    transition: "background-color 0.15s ease",
  },
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.875rem",
  },
  th: {
    textAlign: "left",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    padding: "0.75rem 1rem",
    borderBottom: "2px solid #F1F5F9",
  },
  tr: {
    borderBottom: "1px solid #F1F5F9",
  },
  td: {
    padding: "0.875rem 1rem",
    color: "#334155",
    verticalAlign: "middle",
  },
  mono: {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "0.8125rem",
    color: "#64748B",
    fontWeight: 500,
  },
  iconBtn: {
    background: "#FFF",
    border: "1px solid #F1F5F9",
    borderRadius: "6px",
    padding: "6px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  empty: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: "0.875rem",
    padding: "3rem 1rem",
  },
  spinner: {
    animation: "spin 1s linear infinite",
  },
};
