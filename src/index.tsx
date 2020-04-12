import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import App from './App';
import utils from 'utils';
import 'styles/index.scss';
import 'nprogress/nprogress.css';

utils.setRootFontSizeFromClient();
utils.initI18n(navigator.language);

configure({ enforceActions: 'observed', });

ReactDOM.render(<App />, document.getElementById('app'));
