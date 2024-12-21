import DeleteIcon from '@mui/icons-material/Delete'
import RestoreIcon from '@mui/icons-material/Restore'
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

const ManageRooms = () => {
  const API_URL = process.env.REACT_APP_API
  const navigate = useNavigate()
  const [hotel, setHotel] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [reload, setReload] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })
      .format(price)
      .replace('₫', '')
      .trim()
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

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true)
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
        setLoading(false)
      }
    }

    fetchHotel()
  }, [reload])

  const handleCreateRoomClick = () => {
    localStorage.setItem('hotelId', hotel.id)
    navigate('/create-room')
  }

  const handleOpenModal = room => {
    setSelectedRoom(room)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setSelectedRoom(null)
  }

  const handleInputChange = e => {
    const { name, value } = e.target

    setSelectedRoom(prev => ({
      ...prev,
      [name]:
        name === 'original_price' || name === 'room_number'
          ? Number(value)
          : value,
      ...(name === 'original_price' && { new_price: Number(value) })
    }))
  }

  const handleUpdateRoom = async () => {
    try {
      const token = localStorage.getItem('token')
      const requestBody = {
        id: selectedRoom.id,
        hotel_id: selectedRoom.hotel_id,
        room_type_id: 1,
        room_number: selectedRoom.room_number,
        price: selectedRoom.original_price,
        description: selectedRoom.description,
        availability_status: selectedRoom.availability_status
      }

      const response = await axios.post(
        `${API_URL}/api/v1/room/updateRoom`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        toast.success(
          <FormattedMessage
            id='update_room_successful'
            defaultMessage='Room updated successfully'
          />
        )
        setReload(!reload)
        handleCloseModal()
      }
    } catch (error) {
      toast.error(
        <FormattedMessage
          id='error_updating_room'
          defaultMessage='Error updating room. Please try again.'
        />
      )
    }
  }

  const openConfirmDeleteDialog = room => {
    setRoomToDelete(room)
    setConfirmDeleteDialogOpen(true)
  }

  const closeConfirmDeleteDialog = () => {
    setConfirmDeleteDialogOpen(false)
  }

  const handleDeleteRoom = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${API_URL}/api/v1/room/deleteRoom/${roomToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.status === 200) {
        toast.success(
          <FormattedMessage
            id='deleteRoomSuccessful'
            defaultMessage='Room deleted successfully'
          />
        )
        setRooms(prevRooms =>
          prevRooms.filter(room => room.id !== roomToDelete.id)
        )
        closeConfirmDeleteDialog()
        setTimeout(() => {
          setReload(prev => !prev)
        }, 2000)
      }
    } catch (error) {
      toast.error(
        <FormattedMessage
          id='error_deleting_room'
          defaultMessage='Error deleting room. Please try again.'
        />
      )
    }
  }

  const handleRestoreRoom = async id => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/api/v1/room/restoreRoom/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        toast.success(
          <FormattedMessage
            id='restore_room_successful'
            defaultMessage='Room restored successfully'
          />
        )
        setTimeout(() => {
          setReload(prev => !prev)
        }, 2000)
      }
    } catch (error) {
      toast.error(
        <FormattedMessage
          id='error_restoring_room'
          defaultMessage='Error restoring room. Please try again.'
        />
      )
    }
  }

  if (loading) {
    return (
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
    )
  }

  return (
    <div>
      <ToastContainer />
      <h2>
        <FormattedMessage id='manage_rooms' defaultMessage='Manage Rooms' />
      </h2>
      <Button variant='contained' onClick={handleCreateRoomClick}>
        <FormattedMessage id='create_room' defaultMessage='Create Room' />
      </Button>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: '20px'
        }}
      >
        {rooms.map(room => (
          <Card
            key={room.id}
            style={{
              width: '300px',
              position: 'relative',
              cursor: room.is_deleted ? 'default' : 'pointer',
              opacity: room.is_deleted ? 0.5 : 1
            }}
            onClick={() => !room.is_deleted && handleOpenModal(room)}
          >
            <CardContent>
              <Typography variant='h5'>
                <strong>
                  <FormattedMessage id='room_number' defaultMessage='Room' />{' '}
                  {room.room_number}
                </strong>
              </Typography>
              <Typography variant='body2'>
                <strong>
                  <FormattedMessage id='price' defaultMessage='Price' />
                </strong>
                :{' '}
                {formatPrice(room.original_price) !==
                formatPrice(room.new_price) ? (
                  <>
                    <span style={{ textDecoration: 'line-through' }}>
                      {formatPrice(room.original_price)} VND
                    </span>{' '}
                    -{' '}
                    <span style={{ color: 'red' }}>
                      {room.new_price > 0 ? formatPrice(room.new_price) : '0'}{' '}
                      VND
                    </span>
                  </>
                ) : (
                  <span>{formatPrice(room.original_price)} VND</span>
                )}
              </Typography>
              <Typography variant='body2'>
                <strong>
                  <FormattedMessage
                    id='description'
                    defaultMessage='Description'
                  />
                </strong>{' '}
                {room.description}
              </Typography>
              <Typography variant='body2'>
                <strong>
                  <FormattedMessage
                    id='availability_status'
                    defaultMessage='Availability Status'
                  />
                </strong>
                :{' '}
                {room.availability_status === 'OK' ? (
                  <FormattedMessage id='available' defaultMessage='Available' />
                ) : (
                  <FormattedMessage
                    id='not_available'
                    defaultMessage='Not Available'
                  />
                )}
              </Typography>
              {room.is_deleted ? (
                <IconButton
                  className='icon-restore'
                  onClick={e => {
                    e.stopPropagation()
                    handleRestoreRoom(room.id)
                  }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8
                  }}
                >
                  <RestoreIcon />
                </IconButton>
              ) : (
                <IconButton
                  className='icon-delete'
                  onClick={e => {
                    e.stopPropagation()
                    openConfirmDeleteDialog(room)
                  }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {rooms.length === 0 && (
        <p>
          <FormattedMessage id='no_room' defaultMessage='No room available' />
        </p>
      )}
      <Dialog open={confirmDeleteDialogOpen} onClose={closeConfirmDeleteDialog}>
        <DialogTitle>
          <FormattedMessage
            id='confirm_delete'
            defaultMessage='Confirm Delete'
          />
        </DialogTitle>
        <DialogContent>
          <FormattedMessage
            id='confirm_delete_message'
            defaultMessage='Are you sure you want to delete this room?'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDeleteDialog} color='secondary'>
            <FormattedMessage id='cancel' defaultMessage='Cancel' />
          </Button>
          <Button
            onClick={handleDeleteRoom}
            color='primary'
            variant='contained'
          >
            <FormattedMessage id='confirm' defaultMessage='Confirm' />
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>
          <FormattedMessage id='edit_room' defaultMessage='Edit Room' />
        </DialogTitle>
        <DialogContent>
          {selectedRoom && (
            <div>
              <TextField
                fullWidth
                label={
                  <FormattedMessage
                    id='room_number'
                    defaultMessage='Room Number'
                  />
                }
                name='room_number'
                value={selectedRoom.room_number || ''}
                onChange={handleInputChange}
                variant='outlined'
                style={{ marginBottom: '16px' }}
              />
              <TextField
                fullWidth
                label={<FormattedMessage id='price' defaultMessage='Price' />}
                name='original_price'
                type='number'
                value={selectedRoom.original_price || ''}
                onChange={handleInputChange}
                variant='outlined'
                style={{ marginBottom: '16px' }}
              />
              <TextField
                fullWidth
                label={
                  <FormattedMessage
                    id='description'
                    defaultMessage='Description'
                  />
                }
                name='description'
                multiline
                rows={4}
                value={selectedRoom.description || ''}
                onChange={handleInputChange}
                variant='outlined'
                style={{ marginBottom: '16px' }}
              />
              <FormControl fullWidth style={{ marginBottom: '16px' }}>
                <InputLabel>
                  <FormattedMessage
                    id='availability_status'
                    defaultMessage='Availability Status'
                  />
                </InputLabel>
                <Select
                  label={
                    <FormattedMessage
                      id='availability_status'
                      defaultMessage='Availability Status'
                    />
                  }
                  name='availability_status'
                  value={selectedRoom.availability_status || ''}
                  onChange={handleInputChange}
                >
                  <MenuItem value='OK'>
                    <FormattedMessage
                      id='available'
                      defaultMessage='Available'
                    />
                  </MenuItem>
                  <MenuItem value='Off'>
                    <FormattedMessage
                      id='not_available'
                      defaultMessage='Not Available'
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color='secondary'
            variant='contained'
          >
            <FormattedMessage id='cancel' defaultMessage='Cancel' />
          </Button>
          <Button
            onClick={handleUpdateRoom}
            color='primary'
            variant='contained'
          >
            <FormattedMessage id='confirm' defaultMessage='Confirm' />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ManageRooms
