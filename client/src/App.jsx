import './App.css'
import SetPage from './components/SetPage'
import HomePage from './components/HomePage'
import { useState } from 'react';

function App() {

  const [shownPage, setShownPage] = useState('sets');
  function handleClick() {
    setShownPage('sets');
  }

  return (
    <>
      {/*{shownPage === 'home' && <HomePage handleClick={handleClick}>Hello</HomePage>} */}
      {shownPage === 'sets' && <SetPage></SetPage>}
      {shownPage === 'setreview' && <h1>Hello</h1>}
    </>
  )
}

export default App
