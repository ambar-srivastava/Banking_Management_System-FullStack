import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts } from "@/features/accounts/accountSlice";
import { fetchMyLoans } from "@/features/loans/loanSlice";
import { LoanApplicationForm } from "./LoanApplicationForm";
import { MyLoansTable } from "./MyLoansTable";

export function CustomerLoanView() {
  const dispatch = useDispatch();
  const accountsStatus = useSelector((state) => state.accounts.status);
  const { myLoans, myLoansStatus } = useSelector((state) => state.loans);

  useEffect(() => {
    if (accountsStatus === "idle") dispatch(fetchAccounts());
    dispatch(fetchMyLoans());
  }, [dispatch, accountsStatus]);

  return (
    <div className="space-y-6">
      <LoanApplicationForm />
      {myLoansStatus !== "idle" && <MyLoansTable loans={myLoans} />}
    </div>
  );
}
