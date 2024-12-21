import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const BookingAnalytics = () => {
  const API_URL = 'http://localhost:3000'
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [analyticsData, setAnalyticsData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('userId')
      const token = localStorage.getItem('token')
      if (!userId || !token) {
        throw new Error('User not authenticated')
      }

      // Fetch the hotel associated with the user
      const responseHotel = await axios.get(
        `${API_URL}/api/v1/hotel/getHotelByUserId/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (responseHotel.status === 200) {
        const hotelId = responseHotel.data.data.id

        // Fetch analytics data for the hotel
        const response = await axios.post(
          `${API_URL}/api/v1/booking/getIncomeAll`,
          {
            hotelId,
            year: year || null,
            month: month || null
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (response.status === 200) {
          setAnalyticsData(response.data.data)
        } else {
          toast.error('Failed to fetch analytics data')
        }
      } else {
        toast.error('Failed to fetch hotel information')
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      // toast.error(
      //   error.response?.data?.message || 'An error occurred while fetching data'
      // )
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    fetchAnalytics()
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return (
    <Box padding={2}>
      <ToastContainer />
      <Typography variant='h4' marginBottom={3}>
        Booking Analytics
      </Typography>

      <Box display='flex' gap={2} marginBottom={3}>
        <TextField
          label='Year'
          type='number'
          value={year}
          onChange={e => setYear(e.target.value)}
          variant='outlined'
        />
        <TextField
          label='Month'
          type='number'
          value={month}
          onChange={e => setMonth(e.target.value)}
          variant='outlined'
        />
        <Button variant='contained' color='primary' onClick={handleFilter}>
          Filter
        </Button>
      </Box>

      {loading ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='50vh'
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Year</TableCell>
                <TableCell align='center'>Month</TableCell>
                <TableCell align='center'>Income (VND)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyticsData.length > 0 ? (
                analyticsData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align='center'>{item.year}</TableCell>
                    <TableCell align='center'>{item.month}</TableCell>
                    <TableCell align='center'>{item.income}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align='center'>
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default BookingAnalytics
