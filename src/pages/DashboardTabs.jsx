import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import Wallet from "../components/Wallet";
import AccountManagement from "../components/AccountManagement";
import TransactionHistory from "../components/TransactionHistory";
import FAQ from "../components/FAQ";
import { useState } from "react";
import Analytics from "../components/Analytics";
import OfferManagement from "../components/OfferManagement";
import PricingModal from "../components/PricingModal";

const DashboardTabs = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "Primary Account",
      email: "primary@example.com",
      isDefault: true,
    },
  ]);
  const [walletHistory, setWalletHistory] = useState([
    { id: 1, type: "Credit", amount: 1500, date: "2025-08-20" },
    { id: 2, type: "Debit", amount: 300, date: "2025-08-22" },
  ]);
  const [walletTotal, setWalletTotal] = useState(1200);
  const [transactions, setTransactions] = useState([
    { id: "tx1", amount: 2300, date: "2025-07-15" },
    { id: "tx2", amount: 500, date: "2025-08-05" },
  ]);

  const setDefaultAccount = (id) => {
    const updated = accounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === id,
    }));
    setAccounts(updated);
  };

  const addAmount = (amount) => {
    const amtNum = parseInt(amount, 10);
    if (!isNaN(amtNum) && amtNum > 0) {
      setWalletTotal(walletTotal + amtNum);
      setWalletHistory([
        ...walletHistory,
        {
          id: Date.now(),
          type: "Credit",
          amount: amtNum,
          date: new Date().toISOString(),
        },
      ]);
      message.success("Amount added successfully");
    }
  };

  return (
    <Tabs
      defaultActiveKey="analytics"
      type="line"
      className="bg-white rounded-2xl p-6 shadow-md"
    >
      {/* Existing Analytics Tab */}
      <TabPane tab="My Analytics" key="analytics">
        <Analytics />
      </TabPane>

      {/* Wallet Tab */}
      <TabPane tab="Wallet" key="wallet">
        <Wallet
          walletHistory={walletHistory}
          walletTotal={walletTotal}
          addAmount={addAmount}
        />
      </TabPane>

      {/* Account Management Tab */}
      <TabPane tab="Account Management" key="accountManagement">
        <AccountManagement
          accounts={accounts}
          setAccounts={setAccounts}
          setDefaultAccount={setDefaultAccount}
        />
      </TabPane>

      {/* Transaction History Tab */}
      <TabPane tab="Transaction History" key="transactionHistory">
        <TransactionHistory transactions={transactions} />
      </TabPane>

      {/* Offer Managemnet */}
      <TabPane tab="Offer Management " key="offer">
        <OfferManagement/>
      </TabPane>
      {/* Prcing Managemnet */}
      {/* <TabPane tab="Pricing Management " key="price">
        <PricingModal/>
      </TabPane> */}

      {/* FAQ Tab */}
      <TabPane tab="FAQ" key="faq">
        <FAQ />
      </TabPane>
    </Tabs>
  );
};

export default DashboardTabs;
