import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { sampleOrders, Order } from '@/data/products';

const statusOptions: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered'];
const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="bg-card rounded-xl shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr></thead>
            <tbody>
              {filtered.map(o => (
                <>
                  <tr key={o.id} className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}>
                    <td className="px-4 py-3 font-semibold text-foreground">{o.id}</td>
                    <td className="px-4 py-3 text-foreground">{o.customerName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.email}</td>
                    <td className="px-4 py-3 text-foreground">₹{o.total.toLocaleString()}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value as Order['status'])}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer ${statusStyles[o.status]}`}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{o.createdAt}</td>
                  </tr>
                  {expandedId === o.id && (
                    <tr key={`${o.id}-detail`} className="border-b border-border bg-muted/30">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-foreground">Customer Details</p>
                            <p className="text-muted-foreground">{o.customerName}</p>
                            <p className="text-muted-foreground">{o.email}</p>
                            <p className="text-muted-foreground">{o.phone}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Shipping Address</p>
                            <p className="text-muted-foreground">{o.address}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
