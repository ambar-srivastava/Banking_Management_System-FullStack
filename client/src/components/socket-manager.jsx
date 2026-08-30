import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { connectSoket, disconnectSocket } from "@/lib/socket";
import { fetchAccounts } from "@/features/accounts/accountSlice";

export function SocketManager() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    const socket = connectSoket(token);

    socket.on("transaction:new", (payload) => {
      const verb = payload.type === "transfer_in" ? "Received" : "Sent";
      toast.info(
        `${verb} Rs. ${parseFloat(payload.amount).toFixed(2)} - ${payload.accountNumber}`,
      );
      dispatch(fetchAccounts());
    });

    return () => socket.off("transaction:new");
  }, [token, dispatch]);

  return null;
}
