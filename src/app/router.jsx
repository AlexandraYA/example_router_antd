import { createBrowserRouter } from 'react-router-dom';
import { Main } from '../pages/main/Main';
import { Customers } from '../pages/customers/Customers';
import FormPage from '../pages/form/FormPage';

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
      {
        path: '/form',
        element: <FormPage />,
      },
    ],
  },
]);