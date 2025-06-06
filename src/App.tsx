import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Calculator from './pages/calculator'
import CalculatorCSS from './pages/calculatorCSS'

function App() {
  const [displayBootstrapVersion, setDisplayBootstrapVersion] = useState<boolean>(true);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem' }}>
        <Button
          onClick={() => setDisplayBootstrapVersion(!displayBootstrapVersion)}
        >
          {displayBootstrapVersion ? 'Display CSS version' : 'Display Bootstrap version'}
        </Button>
      </div>
      {
        displayBootstrapVersion ? <Calculator /> : <CalculatorCSS />
      }
    </>
  )
}

export default App
