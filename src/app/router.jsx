import { createBrowserRouter } from 'react-router-dom';
import { Main } from '../pages/main/Main';
import { Customers } from '../pages/customers/Customers';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/table',
        element: <Customers />,
      },
    ],
  },
]);