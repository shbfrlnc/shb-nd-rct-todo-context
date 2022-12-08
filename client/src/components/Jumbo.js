import {
    Col,
    Button,
    Jumbotron,
    Form
} from 'react-bootstrap';

function Jumbo({ onAddTodoClick, onAddRandomTodoClick, onSearchKeyDown }) {
    return (
        <Col lg={10} md={10} sm={12}>
            <Jumbotron className="pt-3 pb-1">
                <h3>Selamat Datang!</h3>
                <p>Ini adalah contoh aplikasi todo list dengan React, Context, Bootstrap, dan Axios.</p>
                <hr></hr>
                <p>
                    <Button variant="primary" className="w-50" onClick={onAddTodoClick}>Tambah Todo</Button>
                    <Button variant="success" className="w-50" onClick={onAddRandomTodoClick}>Tambah 10 Random Todo</Button>
                </p>
                <p>
                    <Form.Control type="text" placeholder="Search" onKeyPress={onSearchKeyDown} />
                </p>
            </Jumbotron>
        </Col>
    );
}

export default Jumbo;