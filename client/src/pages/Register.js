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

import {
    register
} from '../services/authservice';

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const doRegister = async (e) => {
        e.preventDefault();

        try {
            const ret = await register({
                email: email,
                password: password,
                repeatPassword: repeatPassword
            });

            if (ret.data.status === "ok") {
                navigate("/login");
            } else {
                alert(ret.data.message);
            }
        } catch (err) {
            // console.log(err.response.data);
            alert(err.response.data.message);
        }
    }

    return (
        <Row className='mt-5'>
            <Col lg={12} md={12} sm={12}>
                <Jumbotron className="pt-3 pb-5">
                    <h3>Register</h3>
                    <hr></hr>
                    <Form onSubmit={doRegister}>
                        <Form.Group controlId="title">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="isi email..." />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="isi password..." />
                        </Form.Group>

                        <Form.Group controlId="repeat-password">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control type="password" value={repeatPassword} onChange={(e) => { setRepeatPassword(e.target.value) }} placeholder="isi password..." />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </Form>
                </Jumbotron>
            </Col>
        </Row >
    )
}

export default Register;