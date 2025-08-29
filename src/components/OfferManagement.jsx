import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Popconfirm,
  Collapse,
} from "antd";
import moment from "moment";

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const discountTypes = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed Amount", value: "fixed" },
];

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [currentOfferId, setCurrentOfferId] = useState(null);

  const [offerForm] = Form.useForm();
  const [couponForm] = Form.useForm();

  // Open offer modal for create/edit
  const openOfferModal = (offer) => {
    if (offer) {
      const values = {
        ...offer,
        validity:
          offer.validFrom && offer.validTo
            ? [moment(offer.validFrom), moment(offer.validTo)]
            : null,
      };
      setEditingOffer(offer);
      offerForm.setFieldsValue(values);
    } else {
      setEditingOffer(null);
      offerForm.resetFields();
    }
    setModalVisible(true);
  };

  // Offer form submit
  const handleOfferSubmit = () => {
    offerForm
      .validateFields()
      .then((values) => {
        const newOffer = {
          ...values,
          validFrom: values.validity ? values.validity[0].toISOString() : null,
          validTo: values.validity ? values.validity[1].toISOString() : null,
          id: editingOffer ? editingOffer.id : Date.now(),
          coupons: editingOffer?.coupons || [],
        };
        if (editingOffer) {
          setOffers(
            offers.map((offer) =>
              offer.id === editingOffer.id ? newOffer : offer
            )
          );
        } else {
          setOffers([...offers, newOffer]);
        }
        setModalVisible(false);
      })
      .catch(() => {});
  };

  // Delete offer
  const handleDeleteOffer = (id) => {
    setOffers(offers.filter((offer) => offer.id !== id));
  };

  // Open coupon modal
  const openCouponModal = (offerId, coupon) => {
    setCurrentOfferId(offerId);
    if (coupon) {
      setEditingCoupon(coupon);
      couponForm.setFieldsValue(coupon);
    } else {
      setEditingCoupon(null);
      couponForm.resetFields();
    }
    setCouponModalVisible(true);
  };

  // Submit coupon form
  const handleCouponSubmit = () => {
    couponForm
      .validateFields()
      .then((values) => {
        setOffers((prevOffers) => {
          return prevOffers.map((offer) => {
            if (offer.id === currentOfferId) {
              let updatedCoupons;
              if (editingCoupon) {
                updatedCoupons = offer.coupons.map((c) =>
                  c.id === editingCoupon.id ? { ...c, ...values } : c
                );
              } else {
                const newCoupon = { id: Date.now(), ...values };
                updatedCoupons = [...(offer.coupons || []), newCoupon];
              }
              return { ...offer, coupons: updatedCoupons };
            }
            return offer;
          });
        });
        setCouponModalVisible(false);
      })
      .catch(() => {});
  };

  // Delete coupon
  const handleDeleteCoupon = (offerId, couponId) => {
    setOffers((prevOffers) =>
      prevOffers.map((offer) => {
        if (offer.id === offerId) {
          return {
            ...offer,
            coupons: offer.coupons.filter((c) => c.id !== couponId),
          };
        }
        return offer;
      })
    );
  };

  const offerColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Discount",
      key: "discount",
      render: (_, record) =>
        record.discountType === "percentage"
          ? `${record.discountValue}%`
          : `₹${record.discountValue}`,
    },
    {
      title: "Validity",
      key: "validity",
      render: (_, record) =>
        record.validFrom && record.validTo
          ? `${moment(record.validFrom).format("YYYY-MM-DD")} to ${moment(
              record.validTo
            ).format("YYYY-MM-DD")}`
          : "---",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openOfferModal(record)} type="link">
            Edit
          </Button>
          <Popconfirm
            title="Delete this offer?"
            onConfirm={() => handleDeleteOffer(record.id)}
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
          <Button onClick={() => openCouponModal(record.id, null)} type="link">
            Add Coupon
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => openOfferModal(null)}
        className="mb-4"
      >
        Add New Offer
      </Button>

      <Table
        dataSource={offers}
        columns={offerColumns}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <Collapse defaultActiveKey={["coupons"]}>
              <Panel header="Coupons" key="coupons">
                {!record.coupons || record.coupons.length === 0 ? (
                  <p>No coupons added</p>
                ) : (
                  <Table
                    size="small"
                    dataSource={record.coupons}
                    pagination={false}
                    rowKey="id"
                    columns={[
                      { title: "Code", dataIndex: "code", key: "code" },
                      {
                        title: "Description",
                        dataIndex: "description",
                        key: "description",
                      },
                      {
                        title: "Actions",
                        key: "actions",
                        render: (_, coupon) => (
                          <Space>
                            <Button
                              type="link"
                              onClick={() => openCouponModal(record.id, coupon)}
                            >
                              Edit
                            </Button>
                            <Popconfirm
                              title="Delete this coupon?"
                              onConfirm={() =>
                                handleDeleteCoupon(record.id, coupon.id)
                              }
                            >
                              <Button danger type="link">
                                Delete
                              </Button>
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                )}
              </Panel>
            </Collapse>
          ),
        }}
        pagination={{ pageSize: 5 }}
      />

      {/* Offer Modal */}
      <Modal
        title={editingOffer ? "Edit Offer" : "Add Offer"}
        visible={modalVisible}
        onOk={handleOfferSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingOffer ? "Update" : "Add"}
        destroyOnClose
      >
        <Form form={offerForm} layout="vertical" preserve={false}>
          <Form.Item
            label="Offer Title"
            name="title"
            rules={[{ required: true, message: "Please enter offer title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Discount Type"
            name="discountType"
            rules={[{ required: true, message: "Please select discount type" }]}
          >
            <Select options={discountTypes} />
          </Form.Item>

          <Form.Item
            label="Discount Value"
            name="discountValue"
            rules={[
              { required: true, message: "Please enter discount value" },
              {
                validator: (_, value) => {
                  if (!value || value <= 0)
                    return Promise.reject("Must be positive");
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" min="1" />
          </Form.Item>

          <Form.Item label="Validity Period" name="validity">
            <RangePicker />
          </Form.Item>
        </Form>
      </Modal>

      {/* Coupon Modal */}
      <Modal
        title={editingCoupon ? "Edit Coupon" : "Add Coupon"}
        visible={couponModalVisible}
        onOk={handleCouponSubmit}
        onCancel={() => setCouponModalVisible(false)}
        okText={editingCoupon ? "Update" : "Add"}
        destroyOnClose
      >
        <Form form={couponForm} layout="vertical" preserve={false}>
          <Form.Item
            label="Coupon Code"
            name="code"
            rules={[
              { required: true, message: "Please enter coupon code" },
              { min: 3, message: "Minimum 3 characters required" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Coupon Description"
            name="description"
            rules={[
              { required: true, message: "Please enter coupon description" },
            ]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OfferManagement;
