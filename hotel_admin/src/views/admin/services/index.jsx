import { Box, SimpleGrid, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Textarea, useDisclosure } from "@chakra-ui/react";
import ComplexTable from "views/admin/services/components/ComplexTable";
import { columnsDataComplex } from "views/admin/services/variables/columnsData";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const API_URL = process.env.REACT_APP_API;
  const [tableDataComplex, setTableDataComplex] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/service/list-all`);
      setIsLoading(true);
      if (response.data.status === 200) {
        setTableDataComplex(response.data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching the services data: ", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/v1/service/create`, {
      service_name: name,
      description: description,
    },{
        headers: {
          Authorization: `Bearer ${token}`, // Add token in the headers
        },
      });
    setIsLoading(true);
    if (response.data.status === 201) {
      // Show success message
      alert("Service created successfully!");
      // Optionally, refresh the service list to include the new service
      const updatedServices = await axios.get(`${API_URL}/api/v1/service/list-all`);
      setTableDataComplex(updatedServices.data.data);
      setIsLoading(false);
    } else {
      alert("Failed to create service. Please try again.");
    }
  } catch (error) {
    console.error("Error creating the service: ", error);
    alert("An error occurred while creating the service.");
  } finally {
    onClose(); // Close the modal after submission
    // Clear form inputs
    setName("");
    setDescription("");
  }
};

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid mb="20px" columns={{ sm: 1, md: 1 }} spacing={{ base: "20px", xl: "20px" }}>
        <Flex align="center" justifyContent="end">
          <Button variant="brand" fontWeight="500" w="15%" h="50" mb="24px" onClick={onOpen}>
            Add new service
          </Button>
        </Flex>
        <ComplexTable columnsData={columnsDataComplex} tableData={tableDataComplex} isLoading={isLoading} refreshTable={() => fetchData()} />
      </SimpleGrid>

      {/* Modal for adding a new service */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Service Name"
              mb="4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              placeholder="Service Description"
              mb="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
