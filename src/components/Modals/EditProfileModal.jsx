import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  Select,
  Checkbox,
  TimePicker,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetcategoryQuery } from "../../services/categoryApi";
import {
  GoogleMap,
  MarkerF,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { capitalizeFirstLetter, getLatLngFromAddress } from "../../utils/utils";
import { useUpdateProfileMutation } from "../../services/profileApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/authSlice";
import { toast } from "react-toastify";

const { Option } = Select;
const WORKING_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function urlToFileList(url, name) {
  return url
    ? [
        {
          uid: name,
          name: name,
          status: "done",
          url,
        },
      ]
    : [];
}

export default function EditProfileModal({ visible, onClose, user }) {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const { data: category } = useGetcategoryQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Google Map
  const [searchText, setSearchText] = useState(user?.exact_location || "");
  const [markerPos, setMarkerPos] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const autocompleteRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    libraries: ["places"],
  });

  // On load, set marker and center from address
  useEffect(() => {
    if (user?.exact_location) {
      getLatLngFromAddress(user.exact_location).then((pos) => {
        if (pos) {
          setMarkerPos(pos);
          setMapCenter(pos);
        }
      });
    }
    setSearchText(user?.exact_location || "");
  }, [user]);

  // Autocomplete event
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
      form.setFieldsValue({ exact_location: address });
      setSearchText(address);
    }
  };

  // Map click and marker drag events
  const handleMapClick = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setMapCenter(pos);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        form.setFieldsValue({ exact_location: address });
        setSearchText(address);
      }
    });
  };
  const handleMarkerDragEnd = handleMapClick;

  // Normalize Upload event
  const normFile = (e) => (Array.isArray(e) ? e : e && e.fileList);

  // Portfolio images file list
  const portfolioFileList =
    user?.portfolio_images?.map((img) => ({
      uid: img.id,
      name: img.image.split("/").pop(),
      status: "done",
      url: img.image_url,
    })) || [];

  // Submit handler using FormData
  const handleFinish = async (values) => {
    try {
      const fd = new FormData();
      const pushSingleFile = (v, key) => {
        if (v && v.length) {
          const file = v[0].originFileObj || v[0];
          if (file) fd.append(key, file);
        }
      };
      let coords = null;
      if (values.exact_location) {
        coords = await getLatLngFromAddress(values.exact_location);
      }
      pushSingleFile(values.photo_verification, "photo_verification");
      pushSingleFile(values.business_proof, "business_proof");
      pushSingleFile(
        values.adhaar_card_verification,
        "adhaar_card_verification"
      );
      pushSingleFile(values.pan_card, "pan_card");
      if (values.portfolio_images && values.portfolio_images.length > 0) {
        values.portfolio_images.forEach((file, idx) => {
          const originFile = file.originFileObj || file;
          if (originFile) {
            fd.append(`portfolio_images[${idx}]`, originFile);
          }
        });
      }
      fd.append("user_id", user.id);
      fd.append("business_name", values.business_name || "");
      fd.append("name", values.name || "");
      fd.append("service_category", values.service_category);
      fd.append("email", values.email || "");
      fd.append("phone_number", values.phone_number || "");
      fd.append("business_description", values.business_description || "");
      fd.append("years_of_experience", values.years_of_experience || "");
      fd.append("exact_location", values.exact_location || "");
      //   fd.append("location_area_served", values.location_area_served || "");
      fd.append("business_website", values.business_website || "");
      fd.append("gstin_number", values.gstin_number || "");
      if (values.working_days) {
        const dayMap = {
          Mon: "monday",
          Tue: "tuesday",
          Wed: "wednesday",
          Thu: "thursday",
          Fri: "friday",
          Sat: "saturday",
          Sun: "sunday",
        };

        (values.working_days || []).forEach((day, index) => {
          fd.append(`working_days[${index}]`, dayMap[day] || day.toLowerCase());
        });
      }
      if (values.daily_start_time)
        fd.append("daily_start_time", values.daily_start_time.format("HH:mm"));
      if (values.daily_end_time)
        fd.append("daily_end_time", values.daily_end_time.format("HH:mm"));
      if (coords) {
        fd.append("lat", coords.lat.toString());
        fd.append("long", coords.lng.toString());
      }
      const res = await updateProfile(fd).unwrap();
      dispatch(setUser(res?.data));
      toast.success(res.message || "Profile updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Edit Profile"
      destroyOnClose
      width="50%"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          business_name: user?.business_name || "",
          name: user?.name || "",
          service_category: user?.service_category,
          email: user?.email || "",
          phone_number: user?.phone_number || "",
          business_description: user?.business_description || "",
          years_of_experience: user?.years_of_experience || "",
          exact_location: user?.exact_location || "",
          location_area_served: user?.location_area_served || "",
          business_website: user?.business_website || "",
          gstin_number: user?.gstin_number || "",
          working_days: user?.working_days || [],
          daily_start_time: user?.daily_start_time
            ? dayjs(user.daily_start_time, "HH:mm")
            : null,
          daily_end_time: user?.daily_end_time
            ? dayjs(user.daily_end_time, "HH:mm")
            : null,
          photo_verification: urlToFileList(user.photo_verification, "photo"),
          business_proof: urlToFileList(user.business_proof, "business_proof"),
          adhaar_card_verification: urlToFileList(
            user.adhaar_card_verification,
            "aadhaar"
          ),
          pan_card: urlToFileList(user.pan_card, "pan"),
          portfolio_images: portfolioFileList,
        }}
        onFinish={handleFinish}
      >
        {/* Repeat all fields from your profile modal here */}
        <Form.Item name="business_name" label="Business Name">
          <Input />
        </Form.Item>
        <Form.Item name="service_category" label="Business Category">
          <Select placeholder="Select">
            {category?.data?.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="phone_number" label="Phone Number">
          <Input />
        </Form.Item>
        <Form.Item name="business_description" label="About Business">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="years_of_experience" label="Years of Experience">
          <Input type="number" />
        </Form.Item>
        {/* <Form.Item name="location_area_served" label="Service Location Area">
          <Input />
        </Form.Item> */}
        <Form.Item name="business_website" label="Business Website">
          <Input />
        </Form.Item>
        <Form.Item name="gstin_number" label="GSTIN Number">
          <Input />
        </Form.Item>
        <Form.Item name="working_days" label="Working Days">
          <Checkbox.Group
            options={WORKING_DAYS.map((day) => ({
              label: capitalizeFirstLetter(day),
              value: day,
            }))}
          />
        </Form.Item>
        <Form.Item name="daily_start_time" label="Daily Start Time">
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item name="daily_end_time" label="Daily End Time">
          <TimePicker format="HH:mm" />
        </Form.Item>
        {/* Location picker (with Google Maps) */}
        <Form.Item name="exact_location" label="Exact Location">
          {isLoaded ? (
            <Autocomplete
              onLoad={(ac) => (autocompleteRef.current = ac)}
              onPlaceChanged={handlePlaceChanged}
            >
              <Input
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  form.setFieldsValue({ exact_location: e.target.value });
                }}
                allowClear
              />
            </Autocomplete>
          ) : (
            <Input disabled placeholder="Loading Google Maps..." />
          )}
        </Form.Item>
        <div className="relative mb-4">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "300px",
                borderRadius: 12,
              }}
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
          )}
        </div>
        {/* Uploaders */}
        <Form.Item
          name="photo_verification"
          label="Photo Verification"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload.Dragger
            beforeUpload={() => false}
            maxCount={1}
            accept=".jpg,.jpeg,.png,.pdf"
          >
            <InboxOutlined style={{ color: "#EE4E34", fontSize: 24 }} />
            <p>Upload photo</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item
          name="business_proof"
          label="Business Proof"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload.Dragger
            beforeUpload={() => false}
            maxCount={1}
            accept=".jpg,.jpeg,.png,.pdf"
          >
            <InboxOutlined style={{ color: "#EE4E34", fontSize: 24 }} />
            <p>Upload Business Proof</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item
          name="adhaar_card_verification"
          label="Aadhaar Card"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload.Dragger
            beforeUpload={() => false}
            maxCount={1}
            accept=".jpg,.jpeg,.png,.pdf"
          >
            <InboxOutlined style={{ color: "#EE4E34", fontSize: 24 }} />
            <p>Upload Aadhaar</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item
          name="pan_card"
          label="PAN Card"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload.Dragger
            beforeUpload={() => false}
            maxCount={1}
            accept=".jpg,.jpeg,.png,.pdf"
          >
            <InboxOutlined style={{ color: "#EE4E34", fontSize: 24 }} />
            <p>Upload PAN</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item
          name="portfolio_images"
          label="Portfolio Images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            multiple
            maxCount={10}
            accept=".jpg,.jpeg,.png,.pdf"
            listType="picture-card"
            beforeUpload={() => false}
          >
            <InboxOutlined style={{ color: "#EE4E34", fontSize: 28 }} />
            <div style={{ marginTop: 8, fontSize: 10 }}>
              Click or drag photos to upload
            </div>
          </Upload>
        </Form.Item>
        {/* Buttons */}
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
