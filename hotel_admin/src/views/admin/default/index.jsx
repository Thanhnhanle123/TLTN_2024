import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue
} from "@chakra-ui/react";
// Assets

// Custom components
import axios from "axios";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdBarChart,
  MdHotel,
  MdSupervisedUserCircle
} from "react-icons/md";
import ComplexTable from "views/admin/default/components/ComplexTable";
import ComplexTableService from "views/admin/default/components/ComplexTableService";
import ComplexTableUser from "views/admin/users/components/ComplexTable";

export default function UserReports() {
  const API_URL = process.env.REACT_APP_API;
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [count, setCount] = useState(0);
  const [countHotel, setCountHotel] = useState(0);
  const [countUser, setCountUser] = useState(0);
  const [total, setTotal] = useState(0);
  const [tableDataComplex, setTableDataComplex] = useState([]);
  const [tableDataComplexUser, setTableDataComplexUser] = useState([]);
  const [tableDataComplexSevice, setTableDataComplexService] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  const formatPriceVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };


  useEffect(() => {
    const fetchCountBooking = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/v1/booking/count`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.data.status === 200) {
          setCount(response.data.data);
        } else {
          setError("Failed to fetch data"); // Handle unexpected status
        }
      } catch (error) {
        setError("Error fetching the hotel data"); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    const fetchCountHotel = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/v1/hotel/count`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.data.status === 200) {
          setCountHotel(response.data.data);
        } else {
          setError("Failed to fetch data"); // Handle unexpected status
        }
      } catch (error) {
        setError("Error fetching the hotel data"); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    const fetchCountUser = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/v1/user/count`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.data.status === 200) {
          setCountUser(response.data.data);
        } else {
          setError("Failed to fetch data"); // Handle unexpected status
        }
      } catch (error) {
        setError("Error fetching the hotel data"); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    const fetchTotalPrice = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.get(`${API_URL}/api/v1/booking/getIncome`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        if (response.data.status === 200) {
          setTotal(formatPriceVND(response.data.data));
        } else {
          setError("Failed to fetch data"); // Handle unexpected status
        }
      } catch (error) {
        setError("Error fetching the hotel data"); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    const fetchDataBooking = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.get(`${API_URL}/api/v1/booking/getAll`,  {
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

    const fetchDataUser = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.get(`${API_URL}/api/v1/user/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        if (response.data.status === 200) {
          setTableDataComplexUser(response.data.data);
        } else {
          setError("Failed to fetch data"); // Handle unexpected status
        }
      } catch (error) {
        setError("Error fetching the hotel data"); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    const fetchDataService = async () => {
      try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const response = await axios.get(`${API_URL}/api/v1/service/list-all`);
      setIsLoading(true);
      if (response.data.status === 200) {
        setTableDataComplexService(response.data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching the services data: ", error);
    }
  };

    fetchCountBooking();
    fetchCountHotel();
    fetchTotalPrice();
    fetchDataBooking();
    fetchDataUser();
    fetchCountUser();
    fetchDataService();

    // Optional: return a cleanup function if needed
    return () => {
      setCount(0); // Clean up state if component unmounts
    };
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Booking'
          value={count}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Income'
          value={total}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdHotel} color={brandColor} />
              }
            />
          }
          name='Hotel'
          value={countHotel}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdSupervisedUserCircle } color={brandColor} />
              }
            />
          }
          name='User'
          value={countUser}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
        <ComplexTable tableData={tableDataComplex} isLoading={isLoading} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTableUser tableData={tableDataComplexUser} isLoading={isLoading} />
         <ComplexTableService tableData={tableDataComplexSevice} isLoading={isLoading} />
      </SimpleGrid>
    </Box>
  );
}
