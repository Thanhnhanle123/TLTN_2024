import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ToastContainer, toast } from "react-toastify";

const Booking = () => {
  const API_URL = process.env.REACT_APP_API;
  const [hotel, setHotel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchHotelData = async () => {
      try {
        setLoading(true);

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const hotelResponse = await axios.get(
          `${API_URL}/api/v1/hotel/getHotelByUserId/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (isMounted && hotelResponse.status === 200) {
          const hotelData = hotelResponse.data.data;
          setHotel(hotelData);

          const bookingsResponse = await axios.get(
            `${API_URL}/api/v1/booking/getBookingByHotelId/${hotelData.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (isMounted && bookingsResponse.status === 200) {
            setBookings(
              Array.isArray(bookingsResponse.data.data)
                ? bookingsResponse.data.data
                : []
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setBookings([]);
          setIncome(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHotelData();
    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  useEffect(() => {
    // Tính lại income khi selectedDate hoặc bookings thay đổi
    const calculateIncome = () => {
      if (!selectedDate || !Array.isArray(bookings)) {
        setIncome(0);
        return;
      }

      const totalIncome = bookings
        .filter(
          (booking) =>
            dayjs(booking.check_in_date).isSame(selectedDate, "day") &&
            booking.booking_status === 2
        )
        .reduce((acc, booking) => acc + parseFloat(booking.total_price || 0), 0);

      setIncome(totalIncome);
    };

    calculateIncome();
  }, [selectedDate, bookings]);

  const filteredBookings =
    Array.isArray(bookings) && selectedDate
      ? bookings.filter((booking) =>
          dayjs(booking.check_in_date).isSame(selectedDate, "day")
        )
      : [];

  const handleUpdateBooking = async (
    endpoint,
    bookingId,
    updatedStatus,
    successMessage
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}${endpoint}/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success(successMessage);

        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, booking_status: updatedStatus }
              : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking. Please try again.");
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return (
          <FormattedMessage id="not_check_in" defaultMessage="Not Checked In" />
        );
      case 1:
        return <FormattedMessage id="received" defaultMessage="Received" />;
      case 2:
        return (
          <FormattedMessage id="checked_out" defaultMessage="Checked Out" />
        );
      case 3:
        return <FormattedMessage id="canceled" defaultMessage="Canceled" />;
      default:
        return <FormattedMessage id="unknown" defaultMessage="Unknown" />;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      gap={4}
      padding={2}
    >
      <ToastContainer />

      <Box flex={1}>
        <Typography variant="h5" marginBottom={2}>
          <FormattedMessage id="booking_on" defaultMessage="Booking on" />{" "}
          {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
        </Typography>
        <Typography variant="h6" marginBottom={2} color="primary">
          <FormattedMessage id="income" defaultMessage="Income" />: {" "}
          {income ? `${income.toLocaleString()} VND` : "0.0 VND"}
        </Typography>

        <Grid container spacing={2}>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`booking-${booking.id}`}
                style={{ marginRight: "1rem" }}
              >
                <Card style={{ width: "max-content" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <strong>
                        <FormattedMessage
                          id="room_number"
                          defaultMessage="Room Number"
                        />
                        :
                      </strong>{" "}
                      {booking.room_number || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage id="price" defaultMessage="Price" />:
                      </strong>{" "}
                      {parseFloat(booking.total_price).toLocaleString()} VND
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage
                          id="check_in"
                          defaultMessage="Check In"
                        />
                        :
                      </strong>{" "}
                      {dayjs(booking.check_in_date).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage
                          id="check_out"
                          defaultMessage="Check Out"
                        />
                        :
                      </strong>{" "}
                      {dayjs(booking.check_out_date).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage
                          id="customer"
                          defaultMessage="Customer"
                        />
                        :
                      </strong>{" "}
                      {booking.fullname || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage id="phone" defaultMessage="Phone" />:
                      </strong>{" "}
                      {booking.phone || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage
                          id="quantity_people"
                          defaultMessage="Quantity People"
                        />
                        :
                      </strong>{" "}
                      {booking.people}
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage id="status" defaultMessage="Status" />
                        :
                      </strong>{" "}
                      {getStatusLabel(booking.booking_status)}
                    </Typography>
                  </CardContent>
                  <CardActions className="booking-card-actions">
                    {booking.booking_status === 0 && (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            handleUpdateBooking(
                              "/api/v1/booking/cancelBooking",
                              booking.id,
                              3,
                              "Booking cancelled successfully!"
                            )
                          }
                        >
                          <FormattedMessage
                            id="cancel"
                            defaultMessage="Cancel"
                          />
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleUpdateBooking(
                              "/api/v1/booking/checkedInBooking",
                              booking.id,
                              1,
                              "Booking checked in successfully!"
                            )
                          }
                        >
                          <FormattedMessage
                            id="received"
                            defaultMessage="Received"
                          />
                        </Button>
                      </>
                    )}
                    {booking.booking_status === 1 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleUpdateBooking(
                            "/api/v1/booking/checkedOutBooking",
                            booking.id,
                            2,
                            "Booking checked out successfully!"
                          )
                        }
                      >
                        <FormattedMessage
                          id="checked_out"
                          defaultMessage="Checked Out"
                        />
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                {selectedDate ? (
                  <FormattedMessage
                    id="no_booking"
                    defaultMessage="No bookings found for this date."
                  />
                ) : (
                  <FormattedMessage
                    id="select_booking_date"
                    defaultMessage="Please select a booking date."
                  />
                )}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box
        flex={{ xs: "none", md: 1 }}
        alignSelf="flex-start"
        sx={{ width: "100%", height: "100%" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate || dayjs()}
            onChange={(newValue) => setSelectedDate(newValue)}
          />
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default Booking;
