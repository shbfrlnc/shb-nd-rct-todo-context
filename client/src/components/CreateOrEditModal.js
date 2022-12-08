import {
    Button,
    Modal,
    Form
} from 'react-bootstrap';

import {
    useApp
} from '../app-context';

function CreateOrEditModal({ show, onModalHide, onFormSubmit, onButtonCloseClick }) {
    const { item, setItem } = useApp();

    const doOnModalTitleChange = (e) => {
        setItem({
            ...item,
            title: e.target.value
        });
    }

    const doOnModalDescriptionChange = (e) => {
        setItem({
            ...item,
            description: e.target.value
        });
    }

    return (
        <Modal show={show} onHide={onModalHide}>
            <Form onSubmit={onFormSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="hidden" value={item._id} />
                    <Form.Group controlId="title">
                        <Form.Label>Judul</Form.Label>
                        <Form.Control type="text" value={item.title} onChange={doOnModalTitleChange} placeholder="isi judul..." />
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Deskripsi</Form.Label>
                        <Form.Control as="textarea" rows={3} value={item.description} onChange={doOnModalDescriptionChange} placeholder="isi deskripsi..." />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onButtonCloseClick}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CreateOrEditModal;