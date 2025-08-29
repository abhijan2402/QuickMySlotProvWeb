import { Button, Table, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";

const { Title } = Typography;

const TransactionHistory = ({ transactions }) => {
  const generatePDF = (transaction) => {
    const doc = new jsPDF();
    doc.text(`Invoice for transaction ID: ${transaction.id}`, 10, 10);
    doc.text(`Amount: ₹${transaction.amount}`, 10, 20);
    doc.text(
      `Date: ${new Date(transaction.date).toLocaleDateString()}`,
      10,
      30
    );
    doc.save(`invoice_${transaction.id}.pdf`);
    console.log("Invoice generated for transaction", transaction.id);
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount}`,
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Invoice",
      key: "invoice",
      render: (_, record) => (
        <Button
          icon={<DownloadOutlined />}
          type="link"
          onClick={() => generatePDF(record)}
        >
          Download Invoice
        </Button>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-lg ">
      <Title level={4} className="mb-4">
        Transaction History
      </Title>

      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
        className="min-w-full"
      />
    </div>
  );
};

export default TransactionHistory;
