import { Users, RefreshCw } from 'lucide-react';
import { useProfiles } from '@/hooks/useSupabaseData';

const AdminUsers = () => {
  const { data: users, loading, refetch } = useProfiles();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">Registered Users</h1>
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">{users.length}</span>
        </div>
        <button onClick={refetch} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input text-foreground text-sm hover:bg-muted transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-warm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No registered users yet</p>
            <p className="text-xs mt-1">Users will appear here when they sign up on the main website</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">#</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Joined</th></tr></thead>
            <tbody>
              {users.map((u: any, i: number) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{u.display_name || 'No name'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.phone || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
