import {
    Col,
    Tabs,
    Tab
} from 'react-bootstrap';

import TodoList from './TodoList'

function TodoTabs({ todos, onDelete, onGetEdit }) {
    return (
        <Col xs={12} md={12} sm={12}>
            <Tabs defaultActiveKey="todo-list" id="uncontrolled-tab-example">
                <Tab eventKey="todo-list" title="Todo List">
                    <TodoList onDelete={onDelete} onGetEdit={onGetEdit} />
                </Tab>
            </Tabs >
        </Col>
    );
}

export default TodoTabs;