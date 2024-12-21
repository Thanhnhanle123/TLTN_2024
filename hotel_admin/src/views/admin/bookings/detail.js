import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Image,
  Stack,
  Button,
  Center,
  Spinner,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function HotelDetails() {
  const API_URL = process.env.REACT_APP_API;
  const { hotelId } = useParams(); // Get hotelId from route params
  const [hotel, setHotel] = useState(null); // State to store the fetched hotel data
  const [rooms, setRooms] = useState([]); // State to store the fetched rooms data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors

 useEffect(() => {
   const fetchHotel = async () => {
     try {
       const response = await axios.get(
         `${API_URL}/api/v1/hotel/findById/${hotelId}`,
       );
       if (response.status === 200) {
         setHotel(response.data.data); // Set the hotel data
       } else if (response.status === 404) {
         throw new Error('Hotel not found (404)');
       } else {
         throw new Error('Failed to fetch hotel details');
       }
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };

   const fetchRooms = async () => {
     try {
       const response = await axios.get(
         `${API_URL}/api/v1/room/getRoomsByHotelId/${hotelId}`,
       );
       if (response.status === 200) {
         setRooms(response.data.data); // Set the rooms data
       } else if (response.status === 404) {
         setRooms([]); // If rooms not found, set an empty list
         throw new Error('No rooms found for this hotel (404)');
       } else {
         throw new Error('Failed to fetch rooms');
       }
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };

   fetchHotel();
   fetchRooms();
 }, [hotelId]);


  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Text fontSize="lg" color="red.500">
        {error}
      </Text>
    );
  }

  if (!hotel) {
    return (
      <Text fontSize="lg" color="red.500">
        Hotel not found
      </Text>
    );
  }

  return (
    <Box
      maxW="800px"
      mx="auto"
      mt="100px"
      p={5}
      boxShadow="lg"
      borderRadius="md"
      bg="white"
    >
      <Image
        src={`${API_URL}/${hotel.imageHotel}`}
        alt={hotel.hotelName || 'Hotel Image'}
        borderRadius="md"
        boxShadow="md"
        objectFit="cover"
        w="full"
        h="300px"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // Prevents infinite loop if fallback image fails
          currentTarget.src =
            'https://grandtouranehotel.com/uploads/product/sp_55.jpg';
        }}
      />

      <Stack spacing={4} mt={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {hotel.hotelName}
        </Text>
        <Text fontSize="md" color="gray.600">
          {hotel.description}
        </Text>
        <Text fontSize="lg" color="blue.600" fontWeight="bold">
          {hotel.rating} ⭐
        </Text>
        <Text fontSize="sm" color="gray.500">
          Location: {hotel.location}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Address: {hotel.address}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Type: {hotel.typeHotel}
        </Text>
        <Button mt={4} colorScheme="red">
          Delete
        </Button>
      </Stack>

      {/* Rooms Section */}
      <Text mt={8} fontSize="2xl" fontWeight="bold">
        Rooms Available
      </Text>

      {rooms.length > 0 ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={4}>
          {rooms.map((room) => (
            <GridItem
              key={room.id}
              p={4}
              boxShadow="md"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontSize="lg" fontWeight="bold">
                Room Number: {room.room_number}
              </Text>
              <Text>Price: {room.price} VND</Text>
              <Text>Description: {room.description}</Text>
              <Text>Availability: {room.availability_status}</Text>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Text mt={4} color="gray.500">
          No rooms available for this hotel.
        </Text>
      )}
    </Box>
  );
}
