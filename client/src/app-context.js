import React, {
    useContext,
    useState,
    createContext
} from 'react';

const Context = createContext({});

export const AppProvider = ({ children }) => {
    const [item, setItem] = useState({
        _id: "",
        title: "",
        description: ""
    });
    const [items, setItems] = useState([]);
    const [noMoreItems, setNoMoreItems] = useState(false);

    // const [allData, setAllData] = useState({
    //     items: [],
    //     item: {
    //         _id: "",
    //         title: "",
    //         description: ""
    //     },
    //     noMoreItems: false
    // });

    return (
        <Context.Provider value={{
            item,
            setItem,
            items,
            setItems,
            noMoreItems,
            setNoMoreItems
        }}>
            {children}
        </Context.Provider>
    )

}

export const useApp = () => useContext(Context);