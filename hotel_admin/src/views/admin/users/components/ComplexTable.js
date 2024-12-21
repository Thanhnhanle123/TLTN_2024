import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
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
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API;
const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const { tableData, isLoading } = props;
  const [sorting, setSorting] = React.useState([]);
  const [error, setError] = React.useState(null);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const navigate = useNavigate();

  const blockUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/v1/user/block/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status === 200) {
        // Optionally update the table data to reflect the change
        alert('User blocked successfully.');
      } else {
        setError('Failed to block user.');
      }
    } catch (error) {
      setError('Error blocking user.');
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'User ID',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('full_name', {
      header: 'Full Name',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('phone_number', {
      header: 'Phone Number',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue() || 'N/A'}
        </Text>
      ),
    }),
    columnHelper.accessor('address', {
      header: 'Address',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue() || 'N/A'}
        </Text>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue() === 1 ? 'Admin' : 'User'}
        </Text>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toLocaleString()}
        </Text>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated At',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toLocaleString()}
        </Text>
      ),
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: (info) => (
        <Button
          colorScheme="red"
          size="sm"
          onClick={() => blockUser(info.row.original.id)}
        >
          Block User
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          List of Users
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
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : (
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      borderColor={borderColor}
                      onClick={header.column.getToggleSortingHandler()}
                      cursor="pointer"
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
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
                <Tr key={row.id} _hover={{ bg: 'gray.100', cursor: 'pointer' }}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} borderColor="transparent">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Card>
  );
}
