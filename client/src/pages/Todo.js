import {
    useState,
    useEffect,
    useCallback
} from 'react';

import {
    Row,
    Col,
    Button
} from 'react-bootstrap';

import {
    useNavigate
} from 'react-router-dom';

import CreateOrEditModal from '../components/CreateOrEditModal';
import Jumbo from '../components/Jumbo';
import Logo from '../components/Logo';
import TodoTabs from '../components/TodoTabs';

import {
    getAllTodos,
    getLimitedTodos,
    getTodo,
    createTodo,
    editTodo,
    deleteTodo
} from '../services/todoservice';

import {
    useApp
} from '../app-context.js';

function Todo() {
    const navigate = useNavigate();
    const { item, setItem, items, setItems, noMoreItems, setNoMoreItems } = useApp();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(false);
    const [page, setPage] = useState(0);
    const [searchTerms, setSearchTerms] = useState("");

    const doCloseModal = () => {
        setShow(false);
    }

    const doShowModal = () => {
        setShow(true);
    }

    const doGetCreateTodo = async () => {
        doShowModal();

        setItem({
            ...item,
            _id: "",
            title: "",
            description: ""
        });
    }

    const doAddRandomTodoClick = async () => {
        for (let i = 0; i < 10; ++i) {
            await createTodo({
                title: "todo title " + Math.random().toString(),
                description: "todo description " + Math.random().toString()
            });
        }

        setUpdate(!update);
    }

    const doSearch = async (e) => {
        if (e.charCode === 13) {
            setItems([]);
            setNoMoreItems(true);

            doGetLimitedTodos(0, e.target.value);
        }
    }

    const doDeleteTodo = async (id) => {
        const { data } = await deleteTodo(id);
        setItem(data);
        setUpdate(!update);
    }

    const doGetEditTodo = async (id) => {
        doShowModal();

        const { data } = await getTodo(id);

        setItem({
            ...item,
            _id: data._id,
            title: data.title,
            description: data.description
        });
    }

    const doLoadMore = async () => {
        doGetLimitedTodos(page, searchTerms);
    }

    const doEditOrCreateTodo = async (e) => {
        if (item._id === "") {
            doCreateTodo(e);
        } else {
            doEditTodo(e);
        }
    }

    const doCreateTodo = async (e) => {
        e.preventDefault();

        await createTodo({
            title: item.title,
            description: item.description
        });

        doCloseModal();
        setUpdate(!update);
    }

    const doEditTodo = async (e) => {
        e.preventDefault();

        await editTodo({
            id: item._id,
            title: item.title,
            description: item.description
        });

        doCloseModal();
        setUpdate(!update);
    }

    const doGetLimitedTodos = async (valPage, query) => {
        setLoading(true);

        setTimeout(async () => {
            const { data } = await getLimitedTodos(valPage, 2, query);

            setItems((prev) => {
                let result = prev.concat(data);
                let result1 = result.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t._id === value._id
                    ))
                )
                return result1;
            });

            setNoMoreItems(items.length < 1 ? true : false);

            setLoading(false);

            const newPage = valPage + 1;
            setPage(newPage);

            setSearchTerms(query ? query : "");
        }, 1000);
    }

    const doUpdateTodoItems = async () => {
        setItems([]);
        setNoMoreItems(true);
        doGetLimitedTodos(0);
    }

    const doCheckAccessToken = useCallback(async () => {
        try {
            if (!sessionStorage.getItem("accessToken")) {
                navigate("/login");
            }
        } catch (err) {
            if (err.response) {
                navigate("/login");
            }
        }
    }, [navigate]);

    useEffect(() => {
        async function fetchAllTodos() {
            const { data } = await getAllTodos();
            setItems(data);
        }
        fetchAllTodos();
    }, []);

    useEffect(() => {
        doCheckAccessToken();
    }, [doCheckAccessToken]);

    useEffect(() => {
        doUpdateTodoItems();
    }, [update]);

    useEffect(() => {
        setNoMoreItems(noMoreItems);
    }, [noMoreItems, setNoMoreItems]);

    return (
        <div>
            <Row className="mt-5">
                <Logo />
                <Jumbo onAddTodoClick={doGetCreateTodo} onAddRandomTodoClick={doAddRandomTodoClick} onSearchKeyDown={doSearch} />
            </Row>

            <Row className="mt-3">
                <TodoTabs onDelete={doDeleteTodo} onGetEdit={doGetEditTodo} />
            </Row>

            <Row className="mt-3 mb-3">
                <Col lg={12} md={12} sm={12}>
                    {loading ? <h4 className="text-center">memuat data...</h4> : noMoreItems ? <h4 className="text-center">tidak ada data lagi...</h4> : ""}

                    <Button variant="primary" className="w-100" onClick={doLoadMore}>Muat Lebih Banyak Lagi</Button>
                </Col>
            </Row>

            <CreateOrEditModal
                show={show}
                onModalHide={doCloseModal}
                onFormSubmit={doEditOrCreateTodo}
                onButtonCloseClick={doCloseModal}
            />
        </div>
    )
}

export default Todo;