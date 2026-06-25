import { useState, useEffect } from "react";
import { UserPlus, Trash2, Users, Mail, User, Loader2 } from "lucide-react";
import { api } from "../services/api";

export function Clientes() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clientes, setClientes] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const data = await api.get("/clientes");
      setClientes(data.content || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;
    setLoading(true);
    try {
      await api.post("/clientes", { nome, email });
      setNome("");
      setEmail("");
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}`);
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
          <h1 style={styles.mainTitle}>Gestão de Clientes</h1>
          <p style={styles.subtitle}>
            Cadastre e gerencie a base de dados dos seus clientes.
          </p>
        </div>
      </header>

      <div style={styles.dashboardGrid}>
        {/* Form Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <UserPlus size={18} color="#2563EB" />
            <span style={styles.cardTitle}>Novo Cliente</span>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Nome completo</label>
              <div style={styles.inputWrapper}>
                <User size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  style={styles.input}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>E-mail</label>
              <div style={styles.inputWrapper}>
                <Mail size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  style={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: joao@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={16} style={styles.spinner} />
              ) : (
                <UserPlus size={16} />
              )}
              {loading ? "Salvando…" : "Cadastrar Cliente"}
            </button>
          </form>
        </div>

        {/* List Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Users size={18} color="#2563EB" />
              <span style={styles.cardTitle}>Clientes Cadastrados</span>
            </div>
            <span style={styles.badge}>
              {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"}
            </span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>E-mail</th>
                  <th style={{ ...styles.th, width: 60, textAlign: "center" }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: 500 }}>{c.nome}</td>
                    <td style={{ ...styles.td, color: "#64748B" }}>
                      {c.email}
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        style={styles.iconBtn}
                        title="Excluir cliente"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 size={15} color="#EF4444" />
                      </button>
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr>
                    <td colSpan={3} style={styles.empty}>
                      Nenhum cliente encontrado na base de dados.
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
    gridTemplateColumns: "360px 1fr",
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
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "0.625rem 0.75rem 0.625rem 2.25rem",
    fontSize: "0.875rem",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    background: "#FFF",
    color: "#0F172A",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
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
