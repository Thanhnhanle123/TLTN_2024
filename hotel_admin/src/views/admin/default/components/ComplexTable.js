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
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import * as React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver'; // Add this import

const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const { tableData, isLoading } = props;
  const [sorting, setSorting] = React.useState([]);
  const [error, setError] = React.useState(null);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const formatPriceVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const exportToCSV = () => {
    const csvHeader = [
      'Booking ID',
      'Username',
      'Room Number',
      'Total Price',
      'Hotel',
      'Check In',
      'Check Out',
      'Created At',
      'Updated At',
    ];

    const csvRows = tableData.map((row) => [
      row.id,
      row.user_name,
      row.room_number,
      formatPriceVND(row.total_price),
      row.hotel_name || 'N/A',
      new Date(row.check_in_date).toLocaleDateString('vi-VN') || 'N/A',
      new Date(row.check_out_date).toLocaleDateString('vi-VN') || 'N/A',
      new Date(row.createdAt).toLocaleDateString('vi-VN'),
      new Date(row.updatedAt).toLocaleDateString('vi-VN'),
    ]);

    const csvContent = [
      csvHeader.join(','),
      ...csvRows.map((row) => row.map((field) => `"${field}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'bookings.csv');
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'Booking ID',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('user_name', {
      header: 'Username',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('room_number', {
      header: 'Room Number',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('total_price', {
      header: 'Total Price',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {formatPriceVND(info.getValue())}
        </Text>
      ),
    }),
    columnHelper.accessor('hotel_name', {
      header: 'Hotel',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue() || ''}
        </Text>
      ),
    }),
    columnHelper.accessor('check_in_date', {
      header: 'Check in',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toLocaleDateString('vi-VN') || 'N/A'}
        </Text>
      ),
    }),
    columnHelper.accessor('check_out_date', {
      header: 'Check Out',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toLocaleDateString('vi-VN') || 'N/A'}
        </Text>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toLocaleDateString('vi-VN')}
        </Text>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated At',
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {new Date(info.getValue()).toLocaleDateString('vi-VN')}
        </Text>
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
          List of Booking
        </Text>
        <Button colorScheme="blue" onClick={exportToCSV}>
          Export to CSV
        </Button>
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
