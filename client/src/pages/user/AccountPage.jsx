import React, { useState } from "react";
import AccountList from "../../components/AccountList";
import AccountForm from "../../components/AccountForm";
import Layout from "../../components/Layout/Layout";

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);

  const handleAccountCreated = (newAccount) => {
    setAccounts([...accounts, newAccount]);
  };

  const handleAccountDeleted = (accountId) => {
    setAccounts(accounts.filter((account) => account._id !== accountId));
  };
  return (
    <Layout>
      <div className="h-screen bg-slate-950">
        <AccountForm onAccountCreated={handleAccountCreated} />
        <AccountList
          accounts={accounts}
          onAccountDeleted={handleAccountDeleted}
        />
      </div>
    </Layout>
  );
};

export default AccountPage;
