import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import Wallet from "../components/Wallet";
import AccountManagement from "../components/AccountManagement";
import TransactionHistory from "../components/TransactionHistory";
import FAQ from "../components/FAQ";
import { useEffect, useState } from "react";
import Analytics from "../components/Analytics";
import OfferManagement from "../components/OfferManagement";
import PricingModal from "../components/PricingModal";

const DashboardTabs = ({ initialTab = "analytics", walletAmount }) => {
  const [activeKey, setActiveKey] = useState(initialTab);

  useEffect(() => {
    if (initialTab === "wallet") {
      setActiveKey("wallet");
    }
  }, [initialTab]);

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      type="line"
      className="bg-white rounded-2xl p-6 shadow-md"
    >
      {/* Existing Analytics Tab */}
      <TabPane tab="My Analytics" key="analytics">
        <Analytics />
      </TabPane>

      {/* Wallet Tab */}
      <TabPane tab="Wallet" key="wallet">
        <Wallet />
      </TabPane>

      {/* Account Management Tab */}
      <TabPane tab="Account Management" key="accountManagement">
        <AccountManagement />
      </TabPane>

      {/* Transaction History Tab */}
      <TabPane tab="Transaction History" key="transactionHistory">
        <TransactionHistory />
      </TabPane>

      {/* Offer Managemnet */}
      <TabPane tab="Offer Management " key="offer">
        <OfferManagement />
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
