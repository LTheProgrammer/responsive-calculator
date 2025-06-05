import { useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { MdHistory } from 'react-icons/md';

type Operation = '+' | '-' | '*' | '/' | '=' | null;

const calculate = (currentValue: number, inputValue: number, operation: Operation): number => {
    switch (operation) {
        case '+': return currentValue + inputValue;
        case '-': return currentValue - inputValue;
        case '*': return currentValue * inputValue;
        case '/': return inputValue !== 0 ? currentValue / inputValue : 0;
        default: return inputValue;
    }
};

const Calculator = () => {
    const [display, setDisplay] = useState<string>('0');
    const [equation, setEquation] = useState<string>('');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operation, setOperation] = useState<Operation>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);

    const inputNumber = (num: number) => {
        if (waitingForNewValue) {
            setDisplay(String(num));
            setWaitingForNewValue(false);
        } else {
            setDisplay(display === '0' ? String(num) : display + num);
        }
    };

    const inputDecimal = () => {
        if (waitingForNewValue) {
            setDisplay('0.');
            setWaitingForNewValue(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setEquation('');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(false);
    };

    const calculation = useCallback((nextOperation: Operation) => {
        const displayValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(displayValue);
            setEquation(`${displayValue} ${nextOperation}`);
        } else if (operation) {
            const result = calculate(previousValue || 0, displayValue, operation);

            setDisplay(String(result));
            setPreviousValue(result);

            if (nextOperation === '=') {
                const fullEquation = `${equation} ${displayValue} = ${result}`;
                setHistory((prev: string[]) => [fullEquation, ...prev]);
                setEquation('');
                setPreviousValue(null);
                setOperation(null);
                setWaitingForNewValue(true);
            } else {
                setEquation(`${result} ${nextOperation}`);
            }
        }

        if (nextOperation !== '=') {
            setWaitingForNewValue(true);
            setOperation(nextOperation);
        }
    }, [display, previousValue, operation, equation, calculate]);

    const toggleSign = () => {
        if (display !== '0') {
            const newValue = display.charAt(0) === '-' ? display.slice(1) : '-' + display;
            setDisplay(newValue);
        }
    };

    return (
        <Container fluid className="py-4" style={{ minHeight: '100vh' }}>
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4}>
                    <Card className="shadow">
                        <Card.Body className="p-4">
                            <Card className="bg-dark text-white mb-3">
                                <Card.Body className="p-3">
                                    <div
                                        className="text-end small"
                                        style={{
                                            minHeight: '1rem'
                                        }}
                                    >
                                        {equation}
                                    </div>
                                    <div
                                        className="text-end h2 fw-light"
                                        style={{
                                            wordBreak: 'break-all',
                                            fontSize: '2.5rem'
                                        }}
                                    >
                                        {display}
                                    </div>
                                </Card.Body>
                            </Card>
                            <Row className="g-2">
                                <Col xs={3}>
                                    <Button variant="info" size="lg" className="w-100" onClick={clear}>
                                        C
                                    </Button>
                                </Col>
                                <Col xs={3}>
                                    <Button variant="info" size="lg" className="w-100" onClick={toggleSign}>
                                        ±
                                    </Button>
                                </Col>
                                <Col xs={3}>
                                    <Button
                                        variant="info"
                                        size="lg"
                                        className="w-100"
                                        onClick={() => setShowHistory(!showHistory)}
                                    >
                                        <span className="d-inline d-sm-none">
                                            <MdHistory size={18} />
                                        </span>
                                        <span className="d-none d-sm-inline">Hist</span>
                                    </Button>
                                </Col>
                                <Col xs={3}>
                                    <Button
                                        variant="warning"
                                        size="lg"
                                        className="w-100"
                                        onClick={() => calculation('/')}
                                    >
                                        ÷
                                    </Button>
                                </Col>
                            </Row>
                            {([
                                [[7, 8, 9], '*'],
                                [[4, 5, 6], '-'],
                                [[1, 2, 3], '+']
                            ] as [number[], Operation][]).map(([numbers, operation], index: number) => (
                                <Row className="g-2 mt-1" key={index}>
                                    {numbers.map((num) => (
                                        <Col xs={3} key={num}>
                                            <Button
                                                variant="secondary"
                                                size="lg"
                                                className="w-100"
                                                onClick={() => inputNumber(num)}
                                            >
                                                {num}
                                            </Button>
                                        </Col>
                                    ))}
                                    <Col xs={3}>
                                        <Button
                                            variant="warning"
                                            size="lg"
                                            className="w-100"
                                            onClick={() => calculation(operation)}
                                        >
                                            {operation}
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Row className="g-2 mt-1">
                                <Col xs={6}>
                                    <Button variant="secondary" size="lg" className="w-100" onClick={() => inputNumber(0)}>
                                        0
                                    </Button>
                                </Col>
                                <Col xs={3}>
                                    <Button variant="secondary" size="lg" className="w-100" onClick={inputDecimal}>
                                        .
                                    </Button>
                                </Col>
                                <Col xs={3}>
                                    <Button
                                        variant="success"
                                        size="lg"
                                        className="w-100"
                                        onClick={() => calculation('=')}
                                    >
                                        =
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                {showHistory && (
                    <Col xs={12} md={6} lg={4}>
                        <Card className="shadow">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <Card.Title className="mb-0 h5">Calculation History</Card.Title>
                                <div>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => setHistory([])}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => setShowHistory(false)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div
                                    className="overflow-auto"
                                    style={{ maxHeight: '400px' }}
                                >
                                    {history.length === 0 ? (
                                        <div className="text-center p-4">
                                            <em>No calculations yet. Start calculating to see your history here!</em>
                                        </div>
                                    ) : (
                                        history.map((calc: string, index: number) => (
                                            <Card key={index} className="mb-2">
                                                <Card.Body className="p-2">
                                                    <div
                                                        className="small"
                                                        style={{
                                                            paddingLeft: '8px'
                                                        }}
                                                    >
                                                        {calc}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Calculator;