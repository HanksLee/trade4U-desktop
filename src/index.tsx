import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import App from './App';
import utils from 'utils';
import 'styles/index.scss';
import 'nprogress/nprogress.css';
import { message } from 'antd';

utils.setRootFontSizeFromClient();
utils.initI18n(navigator.language);

configure({ enforceActions: 'observed', });

message.config({
  maxCount: 1,
});

ReactDOM.render(<App />, document.getElementById('app'));
