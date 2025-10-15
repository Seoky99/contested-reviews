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
import PodHomePage from './components/Pages/PodPage/PodHomePage.jsx';
import PodPage from './components/Pages/PodPage/PodPage.jsx';
import FallbackPage from './components/Pages/PodPage/FallbackPage.jsx';
import ViewPodPage from "./components/Pages/ViewPodPage/ViewPodPage.jsx";
import CreatePod from "./components/Pages/PodPage/CreatePod/CreatePod.jsx";
import useAuthInit from "./customHooks/store/useAuthInit.js";
import SettingsPage from "./components/Pages/SettingsPage/SettingsPage.jsx";

const queryClient = new QueryClient(); 

function AppWrapper() {
  useAuthInit();

  return <RouterProvider router={router} />;
}

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
            path: "settings",
            Component: SettingsPage,
          },
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
            Component: () => <SetReviewViewPage mode={"owner"}/>,
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
            Component: PodHomePage,
            children: 
              [ 
                {
                  index: true,
                  Component: FallbackPage,
                },
                {
                  path: ":podId/:podCode",
                  Component: PodPage
                }, 
                {
                  path: "create",
                  Component: CreatePod 
                }
              ]
          },
          {
            path: "pods/:podId/setreviews/:userSetId/cards/view",
            Component: ViewPodPage,
          },
          {
            path: "pods/:podId/setreviews/:userSetId/stats/view",
            Component: () => <SetReviewViewPage mode={"other"}/>,
          },
        ]
      }, 
      {
        path: "*",
        Component: NotFoundPage,
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWrapper/>
    </QueryClientProvider>
  </StrictMode>
)
