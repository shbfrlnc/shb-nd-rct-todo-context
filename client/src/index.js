import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

import {
    AppProvider
} from "./app-context";

ReactDOM.render(<AppProvider><App /></AppProvider>, document.getElementById('root'));
