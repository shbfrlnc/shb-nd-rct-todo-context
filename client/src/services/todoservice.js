import axios from "axios";

axios.defaults.withCredentials = true;

export function getAllTodos() {
    return axios.get("http://localhost:3001/todo/", {
        headers: {
            Authorization: sessionStorage.getItem("accessToken")
        },
    });
}

export function getLimitedTodos(page, perPage, query) {
    let url;

    if (query) {
        url = `http://localhost:3001/todo/?page=${page}&perPage=${perPage}&q=${query}`
    } else {
        url = `http://localhost:3001/todo/?page=${page}&perPage=${perPage}`
    }

    return axios.get(url, {
        headers: {
            Authorization: sessionStorage.getItem("accessToken")
        },
    });
}

export function getTodo(id) {
    return axios.get("http://localhost:3001/todo/" + id, {
        headers: {
            Authorization: sessionStorage.getItem("accessToken")
        }
    });
}

export function createTodo(data) {
    return axios.post("http://localhost:3001/todo/", data, {
        headers: {
            Authorization: sessionStorage.getItem("accessToken")
        }
    });
}

export function editTodo(data) {
    return axios.put("http://localhost:3001/todo/", data, {
        headers: {
            Authorization: sessionStorage.getItem("accessToken")
        }
    });
}

export function deleteTodo(id) {
    let obj1 = {
        headers: {
            Authorization: sessionStorage.getItem("accessToken")
        }
    };

    let obj2 = { params: { id: id } };

    return axios.delete("http://localhost:3001/todo/", { ...obj1, ...obj2 });
}