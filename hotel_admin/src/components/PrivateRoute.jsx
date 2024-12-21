import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';


// PrivateRoute component
const PrivateRoute = ({ children }) => {
    const API_URL = process.env.REACT_APP_API;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountBooking = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/v1/booking/count`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (response.data.status !== 200) {
                    navigate('/auth/sign-in');
                }
            } catch (error) {
               navigate('/auth/sign-in');
            }
        };
        fetchCountBooking();
    }, []);

  return token ? children : <Navigate to="/auth/sign-in" replace />;
};

export default PrivateRoute;
