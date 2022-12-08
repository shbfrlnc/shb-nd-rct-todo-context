import {
    Col,
    Row
} from 'react-bootstrap';

function Home() {
    return (
        <Row>
            <Col lg={12} md={12} sm={12}>
                <img src={require("../resources/icon.png")} className="img-fluid rounded-circle mx-auto d-block mt-5" alt="logo" />
                <h2 className="text-center mt-5">Aplikasi Todo...</h2>
            </Col>
        </Row>
    );
}

export default Home;