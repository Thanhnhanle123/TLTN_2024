import { Box, SimpleGrid, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Textarea, Select, useDisclosure, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import ComplexTable from "views/admin/promotions/components/ComplexTable";
import { columnsDataComplex } from "views/admin/promotions/variables/columnsData";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Promotion() {
  const API_URL = process.env.REACT_APP_API;
  const toast = useToast(); // Chakra UI toast for notifications
  const [tableDataComplex, setTableDataComplex] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State variables for the modal fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // default value for discount type
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active"); // default status

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/v1/promotion/promotions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      setIsLoading(true);
     if (response.data.status === 200) {
      const sortedData = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTableDataComplex(sortedData);
      setIsLoading(false);
    }

    } catch (error) {
      console.error("Error fetching the services data: ");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/api/v1/promotion/promotions`, {
        name: name,
        description: description,
        discount_type: discountType,
        discount_value: discountValue,
        start_date: startDate,
        end_date: endDate,
        status: status === "active" ? true: false,
      },{
        headers: {
          Authorization: `Bearer ${token}`, // Add token in the headers
        },
      });

      setIsLoading(true);
      if (response.data.status === 201) {
        toast({
          title: 'Success!',
          description: 'Promotion created successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchData();
        setIsLoading(false);
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to created promotion. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
          title: 'Error!',
          description: 'Failed to created promotion. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
    } finally {
      onClose(); // Close the modal after submission
      // Clear form inputs
      setName("");
      setDescription("");
      setDiscountType("percentage");
      setDiscountValue("");
      setStartDate("");
      setEndDate("");
      setStatus("active");
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid mb="20px" columns={{ sm: 1, md: 1 }} spacing={{ base: "20px", xl: "20px" }}>
        <Flex align="center" justifyContent="end">
          <Button variant="brand" fontWeight="500" w="17%" h="50" mb="24px" onClick={onOpen}>
            Add new Promotion
          </Button>
        </Flex>
        <ComplexTable columnsData={columnsDataComplex} tableData={tableDataComplex} isLoading={isLoading} refreshTable={() => fetchData()} />
      </SimpleGrid>

      {/* Modal for adding a new promotion */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Promotion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Promotion Name"
              mb="4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              placeholder="Promotion Description"
              mb="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormControl mb="4">
              <FormLabel>Discount Type</FormLabel>
              <Select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Amount</option>
              </Select>
            </FormControl>
            <Input
              placeholder="Discount Value"
              type="number"
              mb="4"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
            <FormLabel>Start Date</FormLabel>
            <Input
              placeholder="Start Date"
              type="date"
              mb="4"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <FormLabel>End Date</FormLabel>
            <Input
              placeholder="End Date"
              type="date"
              mb="4"
              min={startDate} // Restricts to dates on or after the start date
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <FormControl mb="4">
              <FormLabel>Status</FormLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreate}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
