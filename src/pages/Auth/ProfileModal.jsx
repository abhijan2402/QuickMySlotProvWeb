import React, { useEffect, useRef, useState } from "react";
import { Modal, Form, Input, Upload, Button, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSetProfileMutation } from "../../services/authApi";
import { useGetcategoryQuery } from "../../services/categoryApi";
import {
  GoogleMap,
  MarkerF,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MdOutlineMyLocation } from "react-icons/md";
import { getLatLngFromAddress } from "../../utils/utils";
import { BiMapPin } from "react-icons/bi";

const { Option } = Select;

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

export default function ProfileModal({
  visible,
  onClose,
  onNext,
  userID,
  gEmail,
  gName,
}) {
  const [form] = Form.useForm();
  const [setProfile, { isLoading, isError }] = useSetProfileMutation();
  const { data: category } = useGetcategoryQuery();
  const [markerPos, setMarkerPos] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [searchText, setSearchText] = useState("");
  const autocompleteRef = useRef(null);

  console.log(isError);

  useEffect(() => {
    if (gName || gEmail) {
      form.setFieldsValue({
        ...(gName ? { name: gName } : {}),
        ...(gEmail ? { email: gEmail } : {}),
      });
    }
  }, [gName, gEmail, form]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    libraries: ["places"],
  });

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setMapCenter(userLoc);
          setMarkerPos(userLoc);
          // Optionally fill form fields with geocoded address
          geocodeAndSet(userLoc);
        },
        () => setMapCenter(DEFAULT_CENTER)
      );
    }
  }, []);

  // Sync search field with form
  useEffect(() => {
    setSearchText(form.getFieldValue("location") || "");
  }, [form]);

  // Helper: geocode and update fields
  const geocodeAndSet = (pos) => {
    const mapsUrl = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        form.setFieldsValue({
          location: address,
          map_link: mapsUrl,
        });
        setSearchText(address);
      } else {
        form.setFieldsValue({
          map_link: mapsUrl,
        });
      }
    });
  };

  // Autocomplete select
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const pos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarkerPos(pos);
      setMapCenter(pos);
      const address = place.formatted_address || place.name;
      const mapsUrl = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
      form.setFieldsValue({
        location: address,
        map_link: mapsUrl,
      });
      setSearchText(address);
    }
  };

  // Map click
  const handleMapClick = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setMapCenter(pos);
    geocodeAndSet(pos);
  };

  // Marker drag
  const handleMarkerDragEnd = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setMapCenter(pos);
    geocodeAndSet(pos);
  };

  // Recenter button logic
  const handleRecenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapCenter(userLoc);
        setMarkerPos(userLoc);
        geocodeAndSet(userLoc);
      });
    }
  };

  // Normalize event to retrieve fileList from Upload component events
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  // Handle form submission
  const handleFinish = async (values) => {
    try {
      // ✅ Validation Config
      const requiredFields = [
        { key: "service_category", msg: "Please select a business category." },
        { key: "photo", msg: "Please upload a photo verification image." },
        {
          key: "business_proof",
          msg: "Please upload your business proof document.",
        },
        { key: "aadhaar", msg: "Please upload your Aadhaar card." },
        { key: "pan", msg: "Please upload your PAN card." },
        { key: "portfolio", msg: "Please upload at least 1 portfolio image." },
        { key: "name", msg: "Please enter your full name." },
        { key: "email", msg: "Please enter your email." },
        { key: "business_name", msg: "Please enter your business/shop name." },
        { key: "about", msg: "Please describe your business." },
        { key: "experience", msg: "Please enter years of experience." },
        { key: "location", msg: "Please select a location." },
      ];

      // ✅ Check required fields
      for (const field of requiredFields) {
        const value = values[field.key];
        if (
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "string" && value.trim() === "")
        ) {
          toast.error(field.msg);
          return;
        }
      }

      // ✅ Special Validations
      if (!/^[0-9]+$/.test(values.experience)) {
        toast.error("Years of experience must be a valid number.");
        return;
      }

      if (values.website && !/^https?:\/\/.+/.test(values.website)) {
        toast.error("Please enter a valid website URL (https://...).");
        return;
      }

      if (values.gstin && !/^[0-9A-Z]{15}$/.test(values.gstin)) {
        toast.error("GSTIN must be 15 characters (A-Z, 0-9).");
        return;
      }

      const fd = new FormData();

      let coords = null;
      if (values.location) {
        coords = await getLatLngFromAddress(values.location);
      }

      // Helper to append single file (binary only)
      const pushSingleFile = (fieldValue, key) => {
        if (fieldValue && fieldValue.length > 0) {
          const file = fieldValue[0].originFileObj;
          if (file) {
            fd.append(key, file);
          }
        }
      };

      // Append all document fields (single file each)
      pushSingleFile(values.photo, "photo_verification");
      pushSingleFile(values.business_proof, "business_proof");
      pushSingleFile(values.aadhaar, "adhaar_card_verification");
      pushSingleFile(values.pan, "pan_card");

      // Append business-related fields
      fd.append("business_description", values.about || "");
      fd.append("business_name", values.business_name || "");
      fd.append("name", values.name || "");
      fd.append("email", values.email || "");
      fd.append("years_of_experience", values.experience || "");
      fd.append("exact_location", values.location || "");
      fd.append("business_website", values.website || "");
      fd.append("gstin_number", values.gstin || "");
      fd.append("user_id", userID);

      // Required category field (single select with id)
      fd.append("service_category", values.service_category);

      if (values.portfolio && values.portfolio.length > 0) {
        values.portfolio.forEach((file, index) => {
          if (file.originFileObj) {
            fd.append(`portfolio_images[${index}]`, file.originFileObj);
          }
        });
      }

      if (coords) {
        fd.append("lat", coords.lat.toString());
        fd.append("long", coords.lng.toString());
      }
      await setProfile(fd)
        .unwrap()
        .then(() => {
          toast.success("Profile submitted successfully.");
          form.resetFields();
          onNext();
        })
        .catch((err) => {
          console.error("Profile submission error:", err);
          toast.error("Failed to submit profile. Try again.");
        });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit profile. Try again.");
    }
  };

  // Upload config shared by single file Upload.Dragger components
  const singleFileUploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    accept: ".jpg,.jpeg,.png,.pdf",
  };

  const [modalWidth, setModalWidth] = useState("90%");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setModalWidth("95%");
      } else if (window.innerWidth < 1024) {
        setModalWidth("70%");
      } else {
        setModalWidth("50%");
      }
    };

    handleResize(); // run once
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Complete Your Profile"
      destroyOnClose
      width={modalWidth}
    >
      <p style={{ color: "#555", marginBottom: 16, fontSize: 13 }}>
        <strong>Note:</strong> Please provide accurate details, including valid
        proof documents.
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        validateMessages={{
          required: "${label} is required!",
          types: {
            number: "${label} must be a valid number",
            url: "${label} is not a valid URL",
          },
        }}
      >
        {/* Business Category Dropdown */}
        <Form.Item
          name="service_category"
          label="Select Business Category"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Choose a category"
            showSearch
            optionFilterProp="children"
          >
            {category?.data?.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Photo Verification (Single Image) */}
        <Form.Item
          name="photo"
          label="Photo Verification"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload a photo verification image.",
            },
          ]}
        >
          <Upload.Dragger {...singleFileUploadProps}>
            <p className="text-[20px]">
              <InboxOutlined style={{ color: "#EE4E34" }} />
            </p>
            <p>Click or drag shop image to upload</p>
          </Upload.Dragger>
        </Form.Item>

        {/* Business Proof (Single Image) */}
        <Form.Item
          name="business_proof"
          label="Business Proof"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload business proof document.",
            },
          ]}
        >
          <Upload.Dragger {...singleFileUploadProps}>
            <p className="text-[20px]">
              <InboxOutlined style={{ color: "#EE4E34" }} />
            </p>
            <p>Click or drag (Image/Pdf) to upload</p>
          </Upload.Dragger>
        </Form.Item>

        {/* Aadhaar Card (Single Image) */}
        <Form.Item
          name="aadhaar"
          label="Aadhaar Card"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload Aadhaar card." }]}
        >
          <Upload.Dragger {...singleFileUploadProps}>
            <p className="text-[20px]">
              <InboxOutlined style={{ color: "#EE4E34" }} />
            </p>
            <p>Upload Aadhaar(Image/Pdf)</p>
          </Upload.Dragger>
        </Form.Item>

        {/* PAN Card (Single Image) */}
        <Form.Item
          name="pan"
          label="PAN Card"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload PAN card." }]}
        >
          <Upload.Dragger {...singleFileUploadProps}>
            <p className="text-[20px]">
              <InboxOutlined style={{ color: "#EE4E34" }} />
            </p>
            <p className="">Upload PAN card(Image/Pdf)</p>
          </Upload.Dragger>
        </Form.Item>

        {/* Portfolio Images (Multiple Images) */}
        <Form.Item
          name="portfolio"
          label="Portfolio Images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload at least 1 photo",
              validator: (_, value) =>
                value && value.length >= 1
                  ? Promise.resolve()
                  : Promise.reject(new Error("Please upload at least 1 photo")),
            },
          ]}
        >
          <Upload
            multiple
            maxCount={10}
            accept=".jpg,.jpeg,.png"
            listType="picture-card"
            beforeUpload={() => false}
          >
            <div>
              <InboxOutlined style={{ color: "#EE4E34", fontSize: 28 }} />
              <div style={{ marginTop: 8, fontSize: 10 }}>
                Click or drag portfolio images to upload
              </div>
            </div>
          </Upload>
        </Form.Item>

        {/* Full Name */}
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter the full name." }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>
        {/* Full Name */}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter the email." }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        {/* Business Name */}
        <Form.Item
          name="business_name"
          label="Business Name"
          rules={[
            { required: true, message: "Please enter the business name." },
          ]}
        >
          <Input placeholder="Enter your Businees/Shop name" />
        </Form.Item>

        {/* About Business */}
        <Form.Item
          name="about"
          label="About Your Business"
          rules={[
            { required: true, message: "Please describe your business." },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Brief description" />
        </Form.Item>

        {/* Years of Experience */}
        <Form.Item
          name="experience"
          label="Years of Experience"
          rules={[
            { required: true, message: "Please enter years of experience." },
            {
              pattern: /^[0-9]+$/,
              message: "Please enter a valid number",
            },
          ]}
        >
          <Input
            placeholder="e.g. 5"
            inputMode="numeric"
            pattern="\d*"
            maxLength={2}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^\d]/g, "");
              form.setFieldsValue({ experience: digits });
            }}
          />
        </Form.Item>

        {/* Location Picker */}
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please select location" }]}
        >
          {isLoaded ? (
            <Autocomplete
              onLoad={(ac) => (autocompleteRef.current = ac)}
              onPlaceChanged={handlePlaceChanged}
            >
              <Input
                placeholder="Search location"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  form.setFieldsValue({
                    location: e.target.value,
                    lat: null,
                    long: null,
                  });
                }}
                allowClear
              />
            </Autocomplete>
          ) : (
            <Input placeholder="Loading Google Maps..." disabled />
          )}
        </Form.Item>
        <div className="relative mb-4" style={{ position: "relative" }}>
          {isLoaded && (
            <>
              <Button
                onClick={handleRecenter}
                style={{
                  position: "absolute",
                  zIndex: 2,
                  right: 10,
                  top: 60,
                  background: "#fff",
                  padding: 4,
                  border: "1px solid #ccc",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png"
                  alt="Recenter"
                  style={{
                    width: 24,
                    height: 36,
                  }}
                />
              </Button>

              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={15}
                onClick={handleMapClick}
              >
                {markerPos && (
                  <MarkerF
                    position={markerPos}
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                  />
                )}
              </GoogleMap>
            </>
          )}
        </div>

        {/* Website */}
        <Form.Item
          name="website"
          label="Business Website"
          rules={[
            {
              type: "url",
              message: "Enter a valid URL (https://...)",
            },
          ]}
        >
          <Input placeholder="https://your-business.com" />
        </Form.Item>

        {/* GSTIN Number */}
        <Form.Item
          name="gstin"
          label="GSTIN No."
          rules={[
            {
              pattern: /^[0-9A-Z]{15}$/,
              message: "Enter a valid 15-character GSTIN",
            },
          ]}
        >
          <Input placeholder="GSTIN number" />
        </Form.Item>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Next
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
