import { Box, SimpleGrid, Flex, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ComplexTable from "views/admin/users/components/ComplexTable";

export default function Settings() {
    const API_URL = process.env.REACT_APP_API;
  const [tableDataComplex, setTableDataComplex] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.get(`${API_URL}/api/v1/user/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        if (response.data.status === 200) {
          setTableDataComplex(response.data.data);
        } else {
          setError("Failed to fetch data"); // Handle unexpected status
        }
      } catch (error) {
        setError("Error fetching the hotel data"); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();

    // Optional: return a cleanup function if needed
    return () => {
      setTableDataComplex([]); // Clean up state if component unmounts
    };
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid mb="20px" columns={{ sm: 1, md: 1 }} spacing={{ base: "20px", xl: "20px" }}>
        {isLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="lg" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
          </Flex>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : (
          <ComplexTable tableData={tableDataComplex} isLoading={isLoading} />
        )}
      </SimpleGrid>
    </Box>
  );
}
