import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Homepage from './pages/homepage/Homepage';
import Dashboard from './pages/dashboard/Dashboard';
import ChatPage from './pages/chatPage/ChatPage';
import RootLayout from './layouts/rootLayout/RootLayout';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout';
import SignInPage from './pages/signInPage/SignInPage';
import SignUpPage from './pages/signUpPage/SignUpPage';



const router = createBrowserRouter([
  {
    element: <RootLayout />,

    children: [

      {
        path: "/", 
        element: <Homepage />
      },

      {
        path: "/sign-in",
        element: <SignInPage/>
      },

      {
        path: "/sign-up",
        element: <SignUpPage/>
      },

      {
        element: <DashboardLayout />,

        children: [

          { 
            path: "/dashboard", 
            element: <Dashboard/> 
          },

          { 
            path: "/dashboard/chats/:id", 
            element: <ChatPage/> 
          }

        ]
      }
    ]
  }
  
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

