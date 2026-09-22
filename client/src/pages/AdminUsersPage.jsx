import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "@/features/admin/adminSlice";
import { Header } from "@/components/header";
import { CreateStaffDialog } from "@/features/admin/CreateStaffDialog";
import { UsersTable } from "@/features/admin/UsersTable";
import { AdminUsersSkeleton } from "@/components/skeletons/AdminUsersSkeleton";

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { users, status, error } = useSelector((state) => state.admin);
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          {isAdmin && <CreateStaffDialog />}
        </div>

        {status === "loading" && <AdminUsersSkeleton />}
        {status === "failed" && <p className="text-destructive">{error}</p>}
        {status === "succeeded" && (
          <UsersTable
            users={users}
            isAdmin={isAdmin}
            currentUserId={currentUser?.id}
          />
        )}
      </main>
    </div>
  );
}
