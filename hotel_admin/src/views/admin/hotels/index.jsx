import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Textarea, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ComplexTable from "views/admin/hotels/components/ComplexTable";

export default function Settings() {
  const API_URL = process.env.REACT_APP_API;
  const [tableDataComplex, setTableDataComplex] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/hotel/list-all`);
        if (response.data.status === 200) {
          setTableDataComplex(response.data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching the hotel data: ", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = () => {
    console.log("Hotel Name:", name);
    console.log("Hotel Description:", description);
    onClose();
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid mb="20px" columns={{ sm: 1, md: 1 }} spacing={{ base: "20px", xl: "20px" }}>
        <ComplexTable tableData={tableDataComplex} isLoading={isLoading} />
      </SimpleGrid>

      {/* Modal for adding a new hotel */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Hotel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Hotel Name" mb="4" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea placeholder="Hotel Description" mb="4" value={description} onChange={(e) => setDescription(e.target.value)} />
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
