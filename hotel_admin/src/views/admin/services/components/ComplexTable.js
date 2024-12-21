import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast, // Import Chakra UI toast for notifications
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import Card from 'components/card/Card';
import * as React from 'react';

const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const API_URL = process.env.REACT_APP_API;
  const { tableData, isLoading, refreshTable } = props;
  const [sorting, setSorting] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRowData, setSelectedRowData] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false); // State for loading spinner
  const toast = useToast(); // Chakra UI toast for notifications

  const columns = [
    columnHelper.accessor('service_name', {
      id: 'service_name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Service Name
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('description', {
      id: 'description',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Description
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Created At
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toLocaleDateString('vi-VN')}
        </Text>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      id: 'updatedAt',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Updated At
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toLocaleDateString('vi-VN')}
        </Text>
      ),
    }),
    {
      id: 'actions',
      header: () => <></>,
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (row) => {
    setSelectedRowData(row.original);
    onOpen();
  };

  const handleInputChange = (e) => {
    setSelectedRowData({
      ...selectedRowData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Show spinner
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/v1/service/update/${selectedRowData.id}`,
        {
          service_name: selectedRowData.service_name,
          description: selectedRowData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast({
          title: 'Success!',
          description: 'Service updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        refreshTable(); // Refresh the table after successful update
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update service. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error!',
        description: 'An error occurred while updating the service.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false); // Hide spinner
      onClose();
    }
  };



  const handleDelete = async (service) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/v1/service/remove/${service.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast({
          title: 'Deleted!',
          description: 'Service deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        refreshTable();
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to delete service. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error while deleting service:', error); // Added logging for better debugging
      toast({
        title: 'Error!',
        description: 'An error occurred while deleting the service.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          List services
        </Text>
      </Flex>
      <Box>
        {isLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner
              size="lg"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
            />
          </Flex>
        ) : (
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted()
                          ? header.column.getIsSorted() === 'asc'
                            ? ' 🔼'
                            : ' 🔽'
                          : null}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id} cursor="pointer">
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor="transparent"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                  <Td>
                    <Button
                      className="mr-10"
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleRowClick(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(row.original)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Service Name"
              name="service_name"
              value={selectedRowData.service_name || ''}
              onChange={handleInputChange}
              mb="4"
            />
            <Textarea
              placeholder="Description"
              name="description"
              value={selectedRowData.description || ''}
              onChange={handleInputChange}
              mb="4"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
