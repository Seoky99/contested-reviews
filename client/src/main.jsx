import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css';
import Root from './Root.jsx';
import SetPage from "./components/Pages/SetPage.jsx";
import CardGalleryPage from './components/Pages/CardGalleryPage.jsx';
import SetReviewPage from './components/Pages/SetReviewPage.jsx';
import SetReviewList from './components/SetReview/SetReviewList.jsx';
import AddPanel from './components/AddPanel/AddPanel.jsx';
import CardPage from "./components/Pages/CardPage.jsx";
import TagPanel from "./components/Pages/CardPageComponents/Tag/TagPanel.jsx";

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
        path: "setreviews/:userSetId/cards/:cardId",
        Component: CardPage, 
        children: [
          {
            path: "tags/create",
            Component: TagPanel
          }
        ]
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
