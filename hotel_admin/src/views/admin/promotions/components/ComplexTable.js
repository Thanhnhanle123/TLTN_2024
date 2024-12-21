import {
  Box,
  Flex,
  Table,
  Spinner,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  useDisclosure,
  FormControl,
  Select,
  FormLabel,
  useToast, // Import Chakra UI toast for notifications
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import React, { useState } from 'react';
import axios from 'axios';

const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const API_URL = process.env.REACT_APP_API;
  const { tableData, isLoading, refreshTable } = props;
  const [sorting, setSorting] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [discountType, setDiscountType] = useState('percentage');
  const [status, setStatus] = useState('active'); // default status
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRowData, setSelectedRowData] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false); // State for loading spinner
  const toast = useToast(); // Chakra UI toast for notifications

  const formatPriceVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Name
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
    columnHelper.accessor('discount_value', {
      id: 'discount_value',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Discount Value
        </Text>
      ),
      cell: (info) => {
        const { discount_type } = info.row.original; // Get the discount_type for this row
        const discountValue = info.getValue();

        return (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {discount_type === 'fixed'
              ? formatPriceVND(discountValue) // Display as currency if type is 'fixed'
              : `${discountValue}%`}{' '}
          </Text>
        );
      },
    }),
    columnHelper.accessor('start_date', {
      id: 'start_date',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Start Date
        </Text>
      ),
      cell: (info) => {
        const date = new Date(info.getValue());
        const formattedDate = date.toLocaleDateString(); // Only the date part
        return (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {formattedDate}
          </Text>
        );
      },
    }),
    columnHelper.accessor('end_date', {
      id: 'end_date',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          End Date
        </Text>
      ),
      cell: (info) => {
        const date = new Date(info.getValue());
        const formattedDate = date.toLocaleDateString(); // Only the date part
        return (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {formattedDate}
          </Text>
        );
      },
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Status
        </Text>
      ),
      cell: (info) => {
        const status = info.getValue(); // Assuming status is a boolean (true or false)
        const statusText = status ? 'Active' : 'Inactive'; // Display "Active" if true, otherwise "Inactive"

        return (
          <Text
            color={status ? 'green.500' : 'red.500'}
            fontSize="sm"
            fontWeight="700"
          >
            {statusText}
          </Text>
        );
      },
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
    const { name, value } = e.target;
    setSelectedRowData((prevData) => ({
      ...prevData,
      [name]: name === 'start_date' ? new Date(value).toISOString() : value,
      [name]: name === 'end_date' ? new Date(value).toISOString() : value,
    }));

    if (name === 'discount_type') {
      setDiscountType(value); // Sync discount type
    }

    if (name === 'status') {
      setStatus(value); // Sync status
    }
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/v1/promotion/promotions/${selectedRowData.id}`,
        {
          promotion_name: selectedRowData.name,
          description: selectedRowData.description,
          discount_value: selectedRowData.discount_value,
          discount_type: selectedRowData.discount_type,
          start_date: selectedRowData.start_date,
          end_date: selectedRowData.end_date,
          status: selectedRowData.status, // Update status
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
          description: 'Promotion updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        refreshTable(); // Refresh the table after successful update
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to update promotion. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error!',
        description: 'An error occurred while updating the promotion.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };


  const handleDelete = async (promotion) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/api/v1/promotion/promotions/${promotion.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast({
          title: 'Deleted!',
          description: 'Promotion deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        refreshTable();
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to delete promotion. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error while deleting promotion:', error); // Added logging for better debugging
      toast({
        title: 'Error!',
        description: 'An error occurred while deleting the promotion.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="20px">
      <Card
        p="0px"
        mb={{ base: '20px', xl: '30px' }}
        overflowX={{ sm: 'scroll', xl: 'hidden' }}
      >
        <Table variant="simple" colorScheme="gray">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={columns.length}>
                  <Flex justify="center" align="center">
                    <Spinner />
                  </Flex>
                </Td>
              </Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Tr key={row.id} onClick={() => handleRowClick(row)}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                  <Td>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(row.original);
                      }}
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Card>

      {/* Modal for Update */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Promotion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Promotion Name */}
            <Input
              name="name"
              value={selectedRowData.name || ''}
              onChange={handleInputChange}
              placeholder="Promotion Name"
              mb="4"
              isDisabled={isSubmitting}
            />

            {/* Promotion Description */}
            <Textarea
              name="description"
              value={selectedRowData.description || ''}
              onChange={handleInputChange}
              placeholder="Promotion Description"
              mb="4"
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
              name="discount_value"
              type="number"
              value={selectedRowData.discount_value || ''}
              onChange={handleInputChange}
              placeholder="Discount Value"
              mb="4"
            />

            {/* Start Date */}
            <Input
              name="start_date"
              type="date"
              value={
                selectedRowData.start_date
                  ? new Date(selectedRowData.start_date)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={handleInputChange}
              mb="4"
            />
            <Input
              name="end_date"
              type="date"
              value={
                selectedRowData.end_date
                  ? new Date(selectedRowData.end_date)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={handleInputChange}
              mb="4"
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
            <Button onClick={onClose} mr={3}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              isLoading={isSubmitting} // Add loading state to button
              onClick={handleSubmit}
            >
              Update Promotion
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
