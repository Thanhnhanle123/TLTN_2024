import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { ToastContainer, toast } from 'react-toastify'

const Discount = () => {
  const API_URL = process.env.REACT_APP_API
  const [promotions, setPromotions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hotel, setHotel] = useState([])
  const [rooms, setRooms] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [selectedRooms, setSelectedRooms] = useState({})
  const [selectedPromotion, setSelectedPromotion] = useState(null)

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })
      .format(price)
      .replace('₫', '')
      .trim()
  }

  const fetchHotel = async () => {
    try {
      setIsLoading(true)
      const userId = localStorage.getItem('userId')
      const response = await axios.get(
        `${API_URL}/api/v1/hotel/getHotelByUserId/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.status === 200) {
        setHotel(response.data.data)
        fetchRooms(response.data.data.id)
      }
    } catch (error) {
      console.error('Error fetching hotel:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRooms = async hotelId => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/room/getRoomsByHotelId/${hotelId}`
      )
      if (response.status === 200) {
        setRooms(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${API_URL}/api/v1/promotion/promotions`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.status === 200) {
        setPromotions(response.data.data)
      } else {
        alert('Failed to fetch promotions')
      }
    } catch (error) {
      console.error('Error fetching promotions: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHotel()
    fetchPromotions()
  }, [])

  const handleUsePromotion = id => {
    setSelectedPromotion(id)
    setOpenModal(true)
  }

  const handleCheckboxChange = roomId => {
    setSelectedRooms(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }))
  }

  const handleConfirm = async () => {
    const selectedRoomIds = Object.keys(selectedRooms).filter(
      roomId => selectedRooms[roomId]
    )

    if (selectedRoomIds.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một phòng.')
      return
    }

    try {
      const requests = selectedRoomIds.map(roomId =>
        axios.post(
          `${API_URL}/api/v1/promotion/promotions/room`,
          {
            promotion_id: selectedPromotion,
            hotel_id: hotel.id,
            room_id: roomId
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
      )

      const responses = await Promise.allSettled(requests)

      const successMessages = []
      const errorMessages = []

      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value.status === 201) {
          successMessages.push(`Mã khuyến mãi áp dụng thành công.`)
        } else if (
          response.status === 'rejected' ||
          response.value.status !== 201
        ) {
          const errorMessage =
            response.reason?.response?.data?.message ||
            `Phòng ${selectedRoomIds[index]}: Lỗi không xác định.`
          errorMessages.push(errorMessage)
        }
      })

      if (successMessages.length > 0) {
        toast.success(successMessages.join('\n'))
      }

      if (errorMessages.length > 0) {
        toast.error(errorMessages.join('\n'))
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.')
    } finally {
      setOpenModal(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer />
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {promotions.map(promotion => {
            const promotionEndDate = new Date(promotion.end_date).getTime()
            const isActive = promotion.status && promotionEndDate >= Date.now()

            return (
              <li
                key={promotion.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  backgroundColor: isActive ? '#FFF' : '#F0F0F0',
                  color: isActive ? '#000' : '#999'
                }}
              >
                <h2>{promotion.name}</h2>
                <p>{promotion.description}</p>
                <p>
                  <strong>
                    <FormattedMessage
                      id='discount_type'
                      defaultMessage='discount_type'
                    />
                    :
                  </strong>{' '}
                  {promotion.discount_type === 'percentage'
                    ? 'Percentage'
                    : 'Fixed Amount'}
                </p>
                <p>
                  <strong>
                    <FormattedMessage
                      id='discount_value'
                      defaultMessage='discount_value'
                    />
                    :
                  </strong>{' '}
                  {promotion.discount_type === 'percentage'
                    ? `${promotion.discount_value}%`
                    : `${promotion.discount_value}đ`}
                </p>
                <p>
                  <strong>
                    <FormattedMessage
                      id='discount_start'
                      defaultMessage='discount_start'
                    />
                    :
                  </strong>{' '}
                  {new Date(promotion.start_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>
                    <FormattedMessage
                      id='discount_end'
                      defaultMessage='discount_end'
                    />
                    :
                  </strong>{' '}
                  {new Date(promotion.end_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>
                    <FormattedMessage
                      id='discount_status'
                      defaultMessage='discount_status'
                    />
                    :
                  </strong>{' '}
                  {isActive ? 'Active' : 'Inactive'}
                </p>
                <button
                  onClick={() => handleUsePromotion(promotion.id)}
                  disabled={!isActive}
                  style={{
                    backgroundColor: isActive ? '#007BFF' : '#CCC',
                    color: isActive ? '#FFF' : '#666',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: isActive ? 'pointer' : 'not-allowed'
                  }}
                >
                  <FormattedMessage
                    id='discount_use'
                    defaultMessage='discount_use'
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
          <FormattedMessage
            id='select_room_discount'
            defaultMessage='select_room_discount'
          />
        </DialogTitle>
        <DialogContent>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {rooms.map(room => (
              <li key={room.id} style={{ marginBottom: '8px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!selectedRooms[room.id]}
                      onChange={() => handleCheckboxChange(room.id)}
                    />
                  }
                  label={`${room.room_number} - ${
                    room.new_price > 0 ? formatPrice(room.new_price) : 0
                  } VND`}
                />
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenModal(false)}
            color='secondary'
            variant='contained'
          >
            <FormattedMessage id='cancel' defaultMessage='Cancel' />
          </Button>
          <Button onClick={handleConfirm} color='primary' variant='contained'>
            <FormattedMessage id='confirm' defaultMessage='Confirm' />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Discount
