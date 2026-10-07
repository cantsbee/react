import './Sidebar.css';

const menuItems = [
  {
    name: "Inicio",
    icon: "🏠",
    path: "/"
  },
  {
    name: "Diario",
    icon: "📖",
    path: "/diary"
  },
  {
    name: "Herramientas",
    icon: "🧠",
    path: "/tools"
  },
  {
    name: "Progreso",
    icon: "📊",
    path: "/progress"
  },
  {
    name: "Ajustes",
    icon: "⚙️",
    path: "/settings"
  }
];

function Sidebar() {

  return (
    <aside className="sidebar">

      <div className="sidebar-header">
        <h2>Mi App</h2>
      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => (
          <a href={item.path}>
            {item.icon} {item.name}
          </a>
        ))}

      </nav>

      <div className="sidebar-bottom">
        <button>
          🚪 Cerrar sesión
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;