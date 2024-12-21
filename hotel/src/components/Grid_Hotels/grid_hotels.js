import {
  Autocomplete,
  CircularProgress,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export default function Grid_Hotel() {
  const API_URL = process.env.REACT_APP_API;
  const [hotels, setHotels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Default items per page

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/hotel/list-all`);
        setHotels(response.data.data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/location/list-all`);
        if (response.status === 200) {
          setLocations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchHotels(), fetchLocations()]);
      setLoading(false);
    };

    fetchData();
  }, [API_URL]);

  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.name : "Unknown location";
  };

  const filteredHotels = hotels.filter((hotel) => {
    const locationMatches = selectedLocation
      ? hotel.location === selectedLocation
      : true;

    const ratingMatches =
      ratingFilter > 0 ? parseFloat(hotel.rating) === ratingFilter : true;

    return (
      (hotel.hotel_name.toLowerCase().includes(filterText.toLowerCase()) ||
        hotel.description.toLowerCase().includes(filterText.toLowerCase())) &&
      locationMatches &&
      ratingMatches
    );
  });

  const totalItems = filteredHotels.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when changing items per page
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="page-hotel">
      <h2>
        <FormattedMessage id="hot_booking" defaultMessage="hot_booking" />
      </h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {/* Lọc theo tên, địa điểm, và đánh giá */}
        <TextField
          variant="outlined"
          placeholder="Filter by hotel name or description"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <Autocomplete
            options={locations}
            getOptionLabel={(option) => option.name || ""}
            value={locations.find((loc) => loc.id === selectedLocation) || null}
            onChange={(event, newValue) =>
              setSelectedLocation(newValue ? newValue.id : "")
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="All Locations" />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value={0}>All Ratings</MenuItem>
            <MenuItem value={1}>1 Star</MenuItem>
            <MenuItem value={2}>2 Stars</MenuItem>
            <MenuItem value={3}>3 Stars</MenuItem>
            <MenuItem value={4}>4 Stars</MenuItem>
            <MenuItem value={5}>5 Stars</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            displayEmpty
          >
            <MenuItem value={6}>6 per page</MenuItem>
            <MenuItem value={12}>12 per page</MenuItem>
            <MenuItem value={24}>24 per page</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Grid container spacing={3}>
        {paginatedHotels.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel.id}>
            <Link
              className="hotel-list-item"
              to={`/hotel_detail/${hotel.id}`}
              key={hotel.id}
            >
              <Card sx={{ maxWidth: 345}}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`${API_URL}/${hotel.image_path}`}
                    alt="green iguana"
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      e.target.src =
                        "https://grandtouranehotel.com/uploads/product/sp_55.jpg";
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {hotel.hotel_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {getLocationName(hotel.location)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      height={50}
                    >
                      <p className="list-hotel-desc">{hotel.description}</p>
                    </Typography>
                    <Rating value={parseFloat(hotel.rating)} readOnly />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          count={totalPages} // Tổng số trang
          page={currentPage} // Trang hiện tại
          onChange={handlePageChange} // Xử lý khi thay đổi trang
          shape="rounded" // Bo góc giống hình của bạn
          color="primary" // Màu sắc (có thể đổi thành secondary hoặc custom)
        />
      </div>
    </div>
  );
}
