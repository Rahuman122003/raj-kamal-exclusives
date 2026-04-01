import { useState, useMemo } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, IndianRupee, CalendarDays } from 'lucide-react';
import { useOrders, useProducts, useProfiles } from '@/hooks/useSupabaseData';
import { format, subDays, subMonths, startOfDay, endOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';

type RangeMode = 'last7' | 'last30' | 'monthly' | 'custom';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#D4A853', '#8B5E3C', '#6B2F3A', '#E8C547'];

const AdminDashboard = () => {
  const { orders, products, profiles } = useSupabaseData();
  const [rangeMode, setRangeMode] = useState<RangeMode>('last7');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(subDays(new Date(), 7));
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());

  const dateRange = useMemo(() => {
    const now = new Date();
    switch (rangeMode) {
      case 'last7': return { from: subDays(now, 7), to: now };
      case 'last30': return { from: subDays(now, 30), to: now };
      case 'monthly': return { from: subMonths(now, 6), to: now };
      case 'custom': return { from: dateFrom || subDays(now, 7), to: dateTo || now };
    }
  }, [rangeMode, dateFrom, dateTo]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const d = new Date(o.created_at);
      return isWithinInterval(d, { start: startOfDay(dateRange.from), end: endOfDay(dateRange.to) });
    });
  }, [orders, dateRange]);

  const totalRevenue = filteredOrders.reduce((s, o) => s + Number(o.total), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Revenue chart data
  const revenueData = useMemo(() => {
    if (rangeMode === 'monthly') {
      const months = eachMonthOfInterval({ start: dateRange.from, end: dateRange.to });
      return months.map(m => {
        const monthOrders = filteredOrders.filter(o => {
          const d = new Date(o.created_at);
          return isWithinInterval(d, { start: startOfMonth(m), end: endOfMonth(m) });
        });
        return {
          label: format(m, 'MMM yyyy'),
          revenue: monthOrders.reduce((s, o) => s + Number(o.total), 0),
          orders: monthOrders.length,
        };
      });
    }
    if (rangeMode === 'last30' || (rangeMode === 'custom' && (dateRange.to.getTime() - dateRange.from.getTime()) > 14 * 86400000)) {
      const weeks = eachWeekOfInterval({ start: dateRange.from, end: dateRange.to });
      return weeks.map(w => {
        const weekEnd = endOfWeek(w);
        const weekOrders = filteredOrders.filter(o => {
          const d = new Date(o.created_at);
          return isWithinInterval(d, { start: startOfWeek(w), end: weekEnd });
        });
        return {
          label: `${format(w, 'dd MMM')}`,
          revenue: weekOrders.reduce((s, o) => s + Number(o.total), 0),
          orders: weekOrders.length,
        };
      });
    }
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    return days.map(day => {
      const dayOrders = filteredOrders.filter(o => {
        const d = new Date(o.created_at);
        return isWithinInterval(d, { start: startOfDay(day), end: endOfDay(day) });
      });
      return {
        label: format(day, 'dd MMM'),
        revenue: dayOrders.reduce((s, o) => s + Number(o.total), 0),
        orders: dayOrders.length,
      };
    });
  }, [filteredOrders, dateRange, rangeMode]);

  // Orders by status
  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  // Category distribution
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [products]);

  const stats = [
    { icon: IndianRupee, label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'bg-primary text-primary-foreground' },
    { icon: ShoppingCart, label: 'Orders', value: String(totalOrders), color: 'bg-secondary text-secondary-foreground' },
    { icon: Package, label: 'Products', value: String(products.length), color: 'bg-accent text-accent-foreground' },
    { icon: Users, label: 'Customers', value: String(profiles.length), color: 'bg-muted text-muted-foreground' },
    { icon: TrendingUp, label: 'Avg Order', value: `₹${Math.round(avgOrderValue).toLocaleString()}`, color: 'bg-primary/80 text-primary-foreground' },
  ];

  const chartConfig = {
    revenue: { label: 'Revenue', color: 'hsl(var(--secondary))' },
    orders: { label: 'Orders', color: 'hsl(var(--primary))' },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard Analytics</h1>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={rangeMode} onValueChange={(v) => setRangeMode(v as RangeMode)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 Days</SelectItem>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="monthly">Monthly (6M)</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {rangeMode === 'custom' && (
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn('text-xs', !dateFrom && 'text-muted-foreground')}>
                    <CalendarDays className="w-3.5 h-3.5 mr-1" />
                    {dateFrom ? format(dateFrom, 'dd MMM yy') : 'From'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground text-xs">→</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn('text-xs', !dateTo && 'text-muted-foreground')}>
                    <CalendarDays className="w-3.5 h-3.5 mr-1" />
                    {dateTo ? format(dateTo, 'dd MMM yy') : 'To'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card rounded-xl p-5 shadow-warm border border-border">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${color}`}><Icon className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-display text-lg font-bold text-foreground">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-xl p-6 shadow-warm border border-border">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" /> Revenue Overview
        </h3>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
            <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--secondary))" fill="url(#revGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Orders Chart + Status Pie */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-warm border border-border">
          <h3 className="font-display font-semibold text-foreground mb-4">Orders Trend</h3>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-warm border border-border">
          <h3 className="font-display font-semibold text-foreground mb-4">Order Status</h3>
          {statusData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No orders in selected range</div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-card rounded-xl p-6 shadow-warm border border-border">
        <h3 className="font-display font-semibold text-foreground mb-4">Products by Category</h3>
        {categoryData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No products yet</div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-card rounded-xl shadow-warm border border-border overflow-hidden">
        <h3 className="font-display font-semibold text-foreground p-6 pb-3">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Total</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 10).map(order => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-semibold text-foreground">{order.order_id}</td>
                  <td className="px-6 py-3 text-foreground">{order.customer_name}</td>
                  <td className="px-6 py-3 text-foreground">₹{Number(order.total).toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{format(new Date(order.created_at), 'dd MMM yyyy')}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders in selected range</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
