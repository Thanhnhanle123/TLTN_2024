import { Box, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import Booking from "./components/Booking";
import BookingAnalytics from "./components/BookingAnalytics";
import CreateHotel from "./components/Create_hotel";
import Discount from "./components/Discount";
import ManageRooms from "./components/ManageRooms";
import "./manage_hotel.css";

const ManageHotel = () => {
  const [activeTab, setActiveTab] = useState("hotel");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="page-container">
      <h2>
        <FormattedMessage
          id="manage_hotel_title"
          defaultMessage="manage_hotel_title"
        />
      </h2>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="manage hotel tabs"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab
          className="tabs-item"
          label={
            <FormattedMessage
              id="manage_hotel_title"
              defaultMessage="manage_hotel_title"
            />
          }
          value="hotel"
        />
        <Tab
          className="tabs-item"
          label={
            <FormattedMessage id="manage_rooms" defaultMessage="manage_rooms" />
          }
          value="rooms"
        />
        <Tab
          className="tabs-item"
          label={
            <FormattedMessage
              id="manage_discounts"
              defaultMessage="manage_discounts"
            />
          }
          value="discount"
        />
        <Tab
          className="tabs-item"
          label={
            <FormattedMessage
              id="manage_bookings"
              defaultMessage="manage_bookings"
            />
          }
          value="booking"
        />
        <Tab
          className="tabs-item"
          label={
            <FormattedMessage
              id="statistical"
              defaultMessage="statistical"
            />
          }
          value="statistical"
        />
      </Tabs>

      <Box sx={{ padding: 2 }}>
        {activeTab === "hotel" ? (
          <CreateHotel />
        ) : activeTab === "rooms" ? (
          <ManageRooms />
        ) : activeTab === "booking" ? (
          <Booking />
        ) : activeTab === "discount" ?(
          <Discount />
        ) : <BookingAnalytics />}
      </Box>
    </div>
  );
};

export default ManageHotel;
