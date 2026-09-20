import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { updateUserRole } from "@/features/admin/adminSlice";

const ROLE_VARIANT = {
  customer: "secondary",
  employee: "default",
  admin: "destructive",
};

export function UsersTable({ users, isAdmin, currentUserId }) {
  const dispatch = useDispatch();
  const isUpdating = useSelector(
    (state) => state.admin.updateStatus === "loading",
  );
  const [pendingChange, setPendingChange] = useState(null);

  async function handleConfirm() {
    const { user, newRole } = pendingChange;
    const result = await dispatch(
      updateUserRole({ userId: user.id, role: newRole }),
    );
    if (updateUserRole.fulfilled.match(result)) {
      toast.success(`${user.full_name}'s role updated to ${newRole}`);
    } else {
      toast.error(result.payload || "Could not update role");
    }
    setPendingChange(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              {isAdmin && (
                <TableHead className="text-right">Change Role</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={ROLE_VARIANT[user.role]}>{user.role}</Badge>
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    {user.id === currentUserId ? (
                      <span className="text-xs text-muted-foreground">
                        (you)
                      </span>
                    ) : (
                      <Select
                        value={user.role}
                        onValueChange={(newRole) =>
                          setPendingChange({ user, newRole })
                        }
                      >
                        <SelectTrigger className="ml-auto w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AlertDialog
        open={!!pendingChange}
        onOpenChange={(isOpen) => !isOpen && setPendingChange(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change this user's role?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingChange && (
                <>
                  Set {pendingChange.user.full_name}'s role to{" "}
                  <strong>{pendingChange.newRole}</strong>. This takes effect
                  the next time they log in.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isUpdating}>
              {isUpdating ? "Updating…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
