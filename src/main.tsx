import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import LibraryPage from './pages/library.tsx'
import RecommendationsPage from './pages/recommendations.tsx'
import BookPage from './pages/book.tsx'
import SearchPage from './pages/search.tsx'
import ProtectedRoute from './main_components/protected_route.tsx'
import LoginPage from './pages/login.tsx'
import RegisterPage from './pages/register.tsx'
import ConfigRecommendation from './pages/config_recommendations.tsx'
import SettingsPage from './pages/settings.tsx'
import ProgressPage from './pages/progress.tsx'
import CataloguePage from './pages/catalogue.tsx'


// define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LibraryPage />
      },
      {
        path: "recommendations",
        element: <ProtectedRoute> <RecommendationsPage /> </ProtectedRoute> 
      },
      {
        path: "catalogue",
        element: <ProtectedRoute> <CataloguePage /> </ProtectedRoute> 
      },
      {
        path: "search",
        element: <SearchPage />,
        
      },
      {
        path: "book/:ISBN",
        element: <BookPage />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
      },
      {
        path: "config",
        element: <ConfigRecommendation />
      },
      {
        path: "settings",
        element: <ProtectedRoute> <SettingsPage /> </ProtectedRoute> 
      },
      {
        path: "progress",
        element: <ProtectedRoute> <ProgressPage /> </ProtectedRoute> 
      },
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
