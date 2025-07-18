import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import Root from './Root.jsx';
import SetPage from "./components/Pages/SetPage.jsx";
import CardGalleryPage from './components/Pages/CardGalleryPage.jsx';
import SetReviewPage from './components/Pages/SetReviewPage.jsx';
import SetReviewList from './components/SetReview/SetReviewList.jsx';
import AddPanel from './components/AddPanel/AddPanel.jsx';
import CardPage from "./components/Pages/CardPage.jsx";
import TagPanel from "./components/Pages/CardPageComponents/Tag/TagPanel.jsx";
import NotFoundPage from './components/Pages/ErrorHandling/NotFoundPage.jsx';

const queryClient = new QueryClient(); 

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "setreviews",
        Component: SetPage,
        children: [
          {
            path: "",
            Component: SetReviewList,
          }, 
          {
            path: "create",
            Component: AddPanel,
          }
        ]
      }, 
      {
        path: "setreviews/:userSetId",
        Component: SetReviewPage,
      },
      {
        path: "setreviews/:userSetId/cards",
        Component: CardGalleryPage,
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
      }, {
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
