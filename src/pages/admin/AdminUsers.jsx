import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Eye,
  X,
  Shield,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      let userData = [];

      if (isLocal) {
        // --- LOCAL DEVELOPMENT: Direct Supabase Queries ---
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        userData = data || [];
      } else {
        // --- PRODUCTION: Secure API Calls ---
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          console.error("No session token available");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/admin/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        const result = await response.json();
        userData = result.users || [];
      }

      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage registered users from Supabase.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
          Total: {users.length} users
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            Loading users...
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No users found.
          </div>
        ) : (
          paginatedUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.avatar_url ||
                      `https://ui-avatars.com/api/?name=${user.email}`
                    }
                    alt=""
                    className="w-12 h-12 rounded-full object-cover bg-slate-100"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {user.first_name || "No"} {user.last_name || "Name"}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone || "No phone"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </div>
                <button
                  onClick={() => setSelectedUser(user)}
                  className="p-2 text-slate-400 hover:text-[#4ec5c1] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  User Profile
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X />
                </button>
              </div>
              <div className="text-center mb-6">
                <img
                  src={
                    selectedUser.avatar_url ||
                    `https://ui-avatars.com/api/?name=${selectedUser.email}`
                  }
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="text-lg font-bold">
                  {selectedUser.first_name} {selectedUser.last_name}
                </h3>
                <p className="text-slate-500 text-sm">{selectedUser.email}</p>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl text-sm">
                  <p className="text-slate-500">About</p>
                  <p className="font-medium text-slate-800">
                    {selectedUser.about_yourself || "No info provided."}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-sm">
                  <p className="text-slate-500">Role</p>
                  <p className="font-medium text-slate-800 capitalize">
                    {selectedUser.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full mt-6 py-3 bg-[#4ec5c1] text-white rounded-xl font-bold"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
