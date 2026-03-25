import { Users } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Priya Sharma', email: 'priya@email.com', phone: '9876543210', joined: '2024-01-10' },
  { id: '2', name: 'Rahul Verma', email: 'rahul@email.com', phone: '9876543211', joined: '2024-02-05' },
  { id: '3', name: 'Anita Desai', email: 'anita@email.com', phone: '9876543212', joined: '2024-03-01' },
];

const AdminUsers = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Users className="w-6 h-6 text-primary" />
      <h1 className="font-display text-2xl font-bold text-foreground">Registered Users</h1>
    </div>
    <div className="bg-card rounded-xl shadow-warm overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Joined</th></tr></thead>
        <tbody>
          {mockUsers.map(u => (
            <tr key={u.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-semibold text-foreground">{u.name}</td>
              <td className="px-4 py-3 text-foreground">{u.email}</td>
              <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
              <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminUsers;
