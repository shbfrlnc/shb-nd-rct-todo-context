import {
    Col
} from 'react-bootstrap';

function Logo() {
    return (
        <Col lg={2} md={2} sm={12}>
            <img src={require("../resources/icon.png")} className="img-fluid rounded-circle" alt="logo" />
        </Col>
    );
}

export default Logo;