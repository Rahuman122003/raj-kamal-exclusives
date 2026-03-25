import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FolderOpen, Image, Tag, ShoppingCart, Users, LogOut, Menu, X, Lock } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: Package, label: 'Products', to: '/admin/products' },
  { icon: FolderOpen, label: 'Categories', to: '/admin/categories' },
  { icon: Image, label: 'Banners', to: '/admin/banners' },
  { icon: Tag, label: 'Coupons', to: '/admin/coupons' },
  { icon: ShoppingCart, label: 'Orders', to: '/admin/orders' },
  { icon: Users, label: 'Users', to: '/admin/users' },
];

// ⚠️ ADMIN CREDENTIALS — Change these in production!
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'rajkamal@2025';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === ADMIN_USERNAME && loginForm.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-warm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full gradient-hero mx-auto flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Raj Kamal Exclusives</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter admin username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter admin password"
                required
              />
            </div>
            {loginError && <p className="text-sm text-destructive">{loginError}</p>}
            <button type="submit" className="w-full gradient-gold text-secondary-foreground py-3 rounded-lg font-semibold shadow-gold hover:opacity-90 transition-opacity">
              Sign In
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Default: admin / rajkamal@2025
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted">
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 gradient-hero transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
              <span className="text-secondary-foreground font-display font-bold text-sm">RK</span>
            </div>
            <span className="font-display font-bold text-sidebar-foreground text-sm">Admin Panel</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground"><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === to
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 space-y-1">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full">
            <LogOut className="w-4 h-4" /> Back to Store
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive/80 hover:text-destructive hover:bg-sidebar-accent/50 transition-colors w-full">
            <Lock className="w-4 h-4" /> Logout Admin
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="bg-background border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1"><Menu className="w-5 h-5 text-foreground" /></button>
          <h2 className="font-display font-semibold text-foreground text-lg">Raj Kamal Exclusives — Admin</h2>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
