import React from 'react';
import ReactDOM from 'react-dom';
import MQTTClientApp from './components/MQTTClientApp';
import './index.css';

import reportWebVitals from './reportWebVitals';

//localStorage.debug = 'mqttjs*';

ReactDOM.render(
  //<React.StrictMode>
  <MQTTClientApp/>,
  //</React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
