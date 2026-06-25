import { useState } from "react";
import { Clientes } from "./components/Clientes";
import { Produtos } from "./components/Produtos";
import { Pedidos } from "./components/Pedidos";
import { ShoppingBag, Users, Package, LayoutDashboard } from "lucide-react";
import "./index.css";

function App() {
  const [tab, setTab] = useState("pedidos");

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <LayoutDashboard size={22} color="#2563EB" />
          <span className="brand-text">E-Commerce Admin</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${tab === "pedidos" ? "active" : ""}`}
            onClick={() => setTab("pedidos")}
          >
            <ShoppingBag size={18} />
            <span>Pedidos</span>
          </button>

          <button
            className={`nav-item ${tab === "clientes" ? "active" : ""}`}
            onClick={() => setTab("clientes")}
          >
            <Users size={18} />
            <span>Clientes</span>
          </button>

          <button
            className={`nav-item ${tab === "produtos" ? "active" : ""}`}
            onClick={() => setTab("produtos")}
          >
            <Package size={18} />
            <span>Produtos</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <span className="version-tag">v2.0.0</span>
        </div>
      </aside>

      {/* Main Panel Content Wrapper */}
      <main className="main-content">
        {tab === "pedidos" && <Pedidos />}
        {tab === "clientes" && <Clientes />}
        {tab === "produtos" && <Produtos />}
      </main>
    </div>
  );
}

export default App;
