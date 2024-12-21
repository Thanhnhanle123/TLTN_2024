
import { Icon } from '@chakra-ui/react';
import {
  MdEmojiFoodBeverage,
  MdHome,
  MdLock,
  MdHotel,
  MdPerson,
  MdSupervisorAccount,
  MdCardGiftcard,
  MdModeComment,
  MdBook,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import Hotels from 'views/admin/hotels';
import HotelDetails from 'views/admin/hotels/detail.js';
import Users from 'views/admin/users';
import Comments from 'views/admin/comments';
import Promotions from 'views/admin/promotions';
import Bookings from 'views/admin/bookings';
import Services from 'views/admin/services';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Manage Hotels',
    layout: '/admin',
    path: '/hotels',
    icon: <Icon as={MdHotel} width="20px" height="20px" color="inherit" />,
    component: <Hotels />,
    secondary: true,
  },
  {
    name: 'Hotel Details',
    path: '/hotel/:hotelId',
    component: <HotelDetails />,
    layout: '/admin',
  },
  {
    name: 'Services',
    layout: '/admin',
    icon: (
      <Icon
        as={MdEmojiFoodBeverage}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: '/services',
    component: <Services />,
  },
  {
    name: 'Bookings',
    icon: <Icon as={MdBook} width="20px" height="20px" color="inherit" />,
    path: '/bookings',
    component: <Bookings />,
    layout: '/admin',
  },
  {
    name: 'Comments',
    icon: (
      <Icon as={MdModeComment} width="20px" height="20px" color="inherit" />
    ),
    path: '/comments',
    component: <Comments />,
    layout: '/admin',
  },
  {
    name: 'Promotions',
    icon: (
      <Icon as={MdCardGiftcard} width="20px" height="20px" color="inherit" />
    ),
    path: '/promotions',
    component: <Promotions />,
    layout: '/admin',
  },
  {
    name: 'Users',
    icon: (
      <Icon
        as={MdSupervisorAccount}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: '/users',
    component: <Users />,
    layout: '/admin',
  },
  {
    name: 'Logout',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
