import { Package, ShoppingCart, Users, TrendingUp, IndianRupee } from 'lucide-react';
import { products, sampleOrders } from '@/data/products';

const stats = [
  { icon: IndianRupee, label: 'Total Revenue', value: '₹16,596', color: 'bg-secondary text-secondary-foreground' },
  { icon: ShoppingCart, label: 'Total Orders', value: '3', color: 'bg-primary text-primary-foreground' },
  { icon: Package, label: 'Products', value: String(products.length), color: 'bg-amber text-secondary-foreground' },
  { icon: Users, label: 'Customers', value: '3', color: 'bg-chocolate text-primary-foreground' },
];

const AdminDashboard = () => (
  <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="bg-card rounded-xl p-5 shadow-warm">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-display text-xl font-bold text-foreground">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Sales Chart Placeholder */}
    <div className="bg-card rounded-xl p-6 shadow-warm">
      <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-secondary" /> Sales Overview</h3>
      <div className="h-48 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
        Connect to a database to see real-time sales charts
      </div>
    </div>

    {/* Recent Orders */}
    <div className="bg-card rounded-xl shadow-warm overflow-hidden">
      <h3 className="font-display font-semibold text-foreground p-6 pb-3">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Total</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Date</th></tr></thead>
          <tbody>
            {sampleOrders.map(order => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 font-semibold text-foreground">{order.id}</td>
                <td className="px-6 py-3 text-foreground">{order.customerName}</td>
                <td className="px-6 py-3 text-foreground">₹{order.total.toLocaleString()}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{order.status}</span>
                </td>
                <td className="px-6 py-3 text-muted-foreground">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
