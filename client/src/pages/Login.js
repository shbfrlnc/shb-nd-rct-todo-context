import {
    useState
} from 'react';

import {
    Row,
    Col,
    Button,
    Jumbotron,
    Form
} from 'react-bootstrap';

import {
    useNavigate
} from 'react-router-dom';

// import jwt_decode from "jwt-decode";

import {
    login
} from '../services/authservice';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const doLogin = async (e) => {
        e.preventDefault();

        try {
            const ret = await login({
                email: email,
                password: password
            });

            if (ret.data.status === "ok") {
                if (ret.data.accessToken) {
                    sessionStorage.setItem("accessToken", ret.data.accessToken);
                    sessionStorage.setItem("refreshToken", ret.data.refreshToken);
                    // const decoded = jwt_decode(ret.data.accessToken)

                    navigate("/todo");
                }
            } else {
                alert(ret.data.message);
            }
        } catch (err) {
            console.log(err.response.data);
            alert(err.response.data.message);
        }
    }

    return (
        <Row className='mt-5'>
            <Col lg={12} md={12} sm={12}>
                <Jumbotron className="pt-3 pb-5">
                    <h3>Login</h3>
                    <hr></hr>
                    <Form onSubmit={doLogin}>
                        <Form.Group controlId="title">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="isi email..." />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="isi password..." />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Jumbotron>
            </Col>
        </Row >
    )
}

export default Login;