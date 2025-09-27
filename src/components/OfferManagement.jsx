import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Tag,
  Row,
  Col,
  Popconfirm,
} from "antd";
import moment from "moment";
import {
  useAddofferMutation,
  useDeleteofferMutation,
  useGetofferQuery,
  useUpdateofferMutation,
} from "../services/offersApi";
import { toast } from "react-toastify";
import { CalendarOutlined, PercentageOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const discountTypes = [
  { label: "Percentage", value: "percentage" },
  { label: "Flat", value: "flat" },
];

const OfferManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [offerForm] = Form.useForm();

  // API hooks
  const { data: offers, refetch, isLoading } = useGetofferQuery();
  const [addOffer] = useAddofferMutation();
  const [updateOffer] = useUpdateofferMutation();
  const [deleteOffer] = useDeleteofferMutation();

  // Open modal
  const openOfferModal = (offer) => {
    if (offer) {
      setEditingOffer(offer);
      offerForm.setFieldsValue({
        promo_code: offer.promo_code,
        type: offer.type,
        amount: offer.amount,
        description: offer.description,
        isActive: offer.isActive === true,
        is_highlighted: offer.is_highlighted === 1, // new field
        validity:
          offer.start_on && offer.expired_on
            ? [moment(offer.start_on), moment(offer.expired_on)]
            : null,
      });
    } else {
      setEditingOffer(null);
      offerForm.resetFields();
    }
    setModalVisible(true);
  };

  // Submit form
  const handleOfferSubmit = async () => {
    try {
      const values = await offerForm.validateFields();
      const formData = new FormData();
      formData.append("promo_code", values.promo_code);
      formData.append("type", values.type);
      formData.append("amount", values.amount);
      formData.append("description", values.description || "");
      formData.append("isActive", values.isActive ? 1 : 0);
      formData.append("is_highlighted", values.is_highlighted ? 1 : 0); // new field
      if (values.validity) {
        formData.append("start_on", values.validity[0].format("YYYY-MM-DD"));
        formData.append("expired_on", values.validity[1].format("YYYY-MM-DD"));
      }

      if (editingOffer) {
        await updateOffer({ id: editingOffer.id, formData }).unwrap();
        toast.success("Offer updated successfully!");
      } else {
        await addOffer(formData).unwrap();
        toast.success("Offer added successfully!");
      }
      setModalVisible(false);
      refetch();
    } catch {
      toast.error("Failed to save offer!");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteOffer(id).unwrap();
      toast.success("Offer deleted!");
      refetch();
    } catch {
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="p-4">
      <Row justify="space-between" align="middle" className="mb-6">
        <Col>
          <h2  className="text-md sm:text-xl font-semibold">Offer Management</h2>
        </Col>
        <Col>
          <Button type="primary" onClick={() => openOfferModal(null)}>
            + Add New Offer
          </Button>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {isLoading ? (
          <p>Loading offers...</p>
        ) : offers?.data && offers.data.length > 0 ? (
          offers.data.map((offer) => (
            <Col xs={24} sm={12} md={8} lg={8} key={offer.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
                title={
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontWeight: 600 }}>{offer.promo_code}</span>
                    <div>
                      {offer.isActive ? (
                        <Tag color="green">Active</Tag>
                      ) : (
                        <Tag color="red">Inactive</Tag>
                      )}
                      {offer.is_highlighted ? (
                        <Tag color="gold">Highlighted</Tag>
                      ) : null}
                    </div>
                  </div>
                }
                actions={[
                  <Button type="link" onClick={() => openOfferModal(offer)}>
                    ✏️ Edit
                  </Button>,
                  <Popconfirm
                    title="Delete this offer?"
                    onConfirm={() => handleDelete(offer.id)}
                  >
                    <Button type="link" danger>
                      🗑 Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <div className="flex mb-1">
                  <p>
                    <Tag color="blue">{offer.type}</Tag>
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 500 }}>
                    {offer.type === "flat" ? (
                      <>₹{offer.amount}</>
                    ) : (
                      <>
                        {offer.amount}
                        <PercentageOutlined />
                      </>
                    )}
                  </p>
                </div>
                <p style={{ color: "#555" }}>{offer.description}</p>
                <p style={{ fontSize: 13, color: "#888" }}>
                  <CalendarOutlined />{" "}
                  {offer.start_on && offer.expired_on
                    ? `${moment(offer.start_on).format(
                        "MMM DD, YYYY"
                      )} → ${moment(offer.expired_on).format("MMM DD, YYYY")}`
                    : "No validity"}
                </p>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24} className="text-center py-10 text-gray-500">
            <p className="text-lg font-medium">
              No offers available currently.
            </p>
            <p className="mt-2">Please check back later or add new offers.</p>
          </Col>
        )}
      </Row>

      {/* Modal for Add/Edit */}
      <Modal
        title={editingOffer ? "Edit Offer" : "Add Offer"}
        open={modalVisible}
        onOk={handleOfferSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingOffer ? "Update" : "Add"}
        destroyOnClose
      >
        <Form form={offerForm} layout="vertical">
          <Form.Item
            label="Promo Code"
            name="promo_code"
            rules={[{ required: true, message: "Please enter promo code" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select options={discountTypes} />
          </Form.Item>

          <Form.Item
            label="Discount Value"
            name="amount"
            rules={[{ required: true, message: "Please enter discount value" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Validity" name="validity">
            <RangePicker />
          </Form.Item>

          <Form.Item
            label="Active Status"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* New field */}
          <Form.Item
            label="Highlighted Offer"
            name="is_highlighted"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OfferManagement;
