import { Button, Table, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import { useGetvendorTransactionQuery } from "../services/vendorTransactionListApi";

const { Title } = Typography;

const TransactionHistory = () => {
  const { data, isFetching } = useGetvendorTransactionQuery();
  console.log(data?.data)
  const generatePDF = (transaction) => {
    const doc = new jsPDF();
    doc.text(`Invoice for transaction ID: ${transaction.id}`, 10, 10);
    doc.text(`User: ${transaction.userName}`, 10, 20);
    doc.text(`Phone: ${transaction.phone}`, 10, 30);
    doc.text(`Email: ${transaction.email}`, 10, 40);
    doc.text(`Account: ${transaction.account}`, 10, 50);
    doc.text(`Amount: ₹${transaction.amount}`, 10, 60);
    doc.text(`Type: ${transaction.type}`, 10, 70);
    doc.text(
      `Date: ${new Date(transaction.date).toLocaleDateString()}`,
      10,
      80
    );
    if (transaction.note) {
      doc.text(`Note: ${transaction.note}`, 10, 90);
    }
    doc.save(`invoice_${transaction.id}.pdf`);
    console.log("Invoice generated for transaction", transaction.id);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      render: (value) => <span>{value}</span>,
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (value) => <span>{value}</span>,
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value) => <span>{value}</span>,
      responsive: ["lg", "xl"],
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
      render: (value) => <span>{value}</span>,
      responsive: ["lg", "xl"],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount}`,
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span className={type === "credit" ? "text-green-600" : "text-red-600"}>
          {type}
        </span>
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ["sm", "md", "lg", "xl"],
    },
    // {
    //   title: "Note",
    //   dataIndex: "note",
    //   key: "note",
    //   render: (note) => <span>{note || "-"}</span>,
    //   responsive: ["lg", "xl"],
    // },
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
        dataSource={data?.data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
        className="min-w-full"
        loading={isFetching}
      />
    </div>
  );
};

export default TransactionHistory;
