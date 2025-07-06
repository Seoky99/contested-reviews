import './App.css'
import SetPage from './components/pages/SetPage'
import CardsPage from './components/pages/CardsPage';
import { useState } from 'react';

function App() {

  const [pageData, setPageData] = useState({'shownPage': 'sets'});

  function tempPageNav(id) {
    setPageData({...pageData, 'shownPage': 'setreview', 'data': id});
  }

  //TODO: replace with dataloading router + tanstack, especially the ugly state page rendering 
  return (
    <>
      {pageData.shownPage === 'sets' && <SetPage tempPageNav={tempPageNav}></SetPage>}
      {pageData.shownPage === 'setreview' && <CardsPage userSetID={pageData.data}></CardsPage>}
      {/*<CardsPage userSetID={9}></CardsPage>*/}
    </>
  )
}

export default App
