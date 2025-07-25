import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import Root from './Root.jsx';
import HomePage from './components/Pages/HomePage/HomePage.jsx';
import SetReviewPage from "./components/Pages/SetReviewPagesComponents/SetReviewPage.jsx";
import CardGalleryPage from './components/Pages/CardGalleryComponents/CardGalleryPage.jsx';
import SetReviewViewPage from "./components/Pages/SetReviewViewPageComponents/SetReviewViewPage.jsx";
import SetReviewEditCardsPage from "./components/Pages/SetReviewEditCardsPageComponents/SetReviewEditCardsPage.jsx";
import SetReviewAddPage from './components/Pages/SetReviewPagesComponents/SetReviewAddPage.jsx';
import RegisterPage from "./components/Pages/RegisterPageComponents/RegisterPage.jsx";
import CardPage from "./components/Pages/CardPageComponents/CardPage.jsx";
import TagPanel from "./components/Pages/CardPageComponents/Tag/TagPanel.jsx";
import NotFoundPage from './components/Pages/ErrorHandling/NotFoundPage.jsx';
import LoginPage from './components/Pages/LoginPage/LoginPage.jsx';
import AuthGuard from './components/Pages/AuthGuard/AuthGuard.jsx';
import PodPage from './components/Pages/PodPage/PodPage.jsx';

const queryClient = new QueryClient(); 

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "register",
        Component: RegisterPage,
      }, 
      {
        path: "login",
        Component: LoginPage
      },
      {
        Component: AuthGuard, 
        children: [
          {
            path: "setreviews",
            Component: SetReviewPage,
          },
          {
            path: "setreviews/create",
            Component: SetReviewAddPage,
          },
          {
            path: "setreviews/:userSetId",
            Component: SetReviewViewPage,
          },
          {
            path: "setreviews/:userSetId/cards",
            Component: CardGalleryPage,
          },
          {
            path: "setreviews/:userSetId/cards/edit",
            Component: SetReviewEditCardsPage,
          },
          {
            path: "setreviews/:userSetId/reviews/:reviewId/cards/:cardId",
            Component: CardPage, 
            children: [
              {
                path: "tags/create",
                Component: TagPanel
              }
            ]
          },
          {
            path: "pods",
            Component: PodPage
          }
        ]
      }, 
      {
        path: "*",
        Component: NotFoundPage
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </StrictMode>
)
