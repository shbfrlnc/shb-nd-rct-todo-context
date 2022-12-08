import {
    useEffect
} from 'react';

import {
    Container
} from 'react-bootstrap';

import {
    BrowserRouter,
    Route,
    Routes
} from 'react-router-dom'

import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Todo from './pages/Todo';
import Home from './pages/Home';

import {
    renewToken
} from './services/authservice';

import './App.css';

function App() {
    useEffect(() => {
        setInterval(() => {
            renewToken();
        }, 5000);
    }, []);

    return (
        <>
            <BrowserRouter>
                <Container>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />

                        <Route path="/todo" element={<Todo />} />

                        <Route path="/login" element={<Login />} />

                        <Route path="/register" element={<Register />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </>
    );
}

export default App;
