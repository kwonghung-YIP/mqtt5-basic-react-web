import React from 'react';
import NavBar from './NavBar';
import RequestResponsePattern from './RequestResponsePattern';
import MQTTClientContext from './MQTTClientContext';

import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import ConnectDialogue from './ConnectDialogue';
import BroadcastPanel from './BroadcastPanel';

const mqtt = require('mqtt');

const reducer = (state, action) => {
    const { type, payload } = action;
    let newState;
    if (type === 'client/init') {
        newState = { ...state, client: payload };
    } else if (type === 'client/close') {
        newState = { ...state, client: null };
    } else if (type === 'client/end') {
        newState = { ...state, client: null };
    } else {
        newState = { ...state };
    }
    return newState;
}

const MQTTClientApp = (props) => {

    const initState = {
        client: null,
    };
    const [state, dispatch] = React.useReducer(reducer, initState);

    const connect = (clientId, brokerUrl, username, password) => {
        let { client } = state;
        if (client !== null && client.connected) {
            throw new Error('Client has already been connected');
        }

        client = mqtt.connect(brokerUrl, {
            clientId: clientId,
            reconnectPeriod: 0,
            protocolVersion: 5,
            username: username,
            password: password,
            rejectUnauthorized: false,
        });

        client.on('error', (error) => {
            throw error;
        });

        client.on('connect', (connAck) => {
            dispatch({ type: 'client/connect', payload: connAck });
            //client.subscribe(state.responseTopic, {}, (err, granted) => {});
        });

        /*client.on('message', (topic, message, packet) => {
            console.log(`message received: ${JSON.stringify(packet)}`);
        });

        client.on('packetsend', (packet) => {
            console.log(`package sent: ${JSON.stringify(packet)}`);
            //dispatch({ type: 'packet/sent', payload: packet });
        });

        client.on('packetreceive', (packet) => {
            console.log(`package received: ${JSON.stringify(packet)}`);
            //dispatch({ type: 'packet/received', payload: packet });
        });*/

        client.on('disconnect', (packet) => {
            console.log('client disconnect');
            //dispatch({ type:"client/close", payload: client});
        });

        client.on('offline', () => {
            console.log('client offline');
            //dispatch({ type:"client/close", payload: client});
        });

        client.on('reconnect', () => {
            console.log('client reconnect');
            //dispatch({ type:"client/close", payload: client});
        });

        client.on('close', () => {
            console.log('client close');
            dispatch({ type:"client/close", payload: client});
        });

        client.on('end', () => {
            console.log('client end');
            dispatch({ type: 'client/end', payload: client });
        });

        client.on('newListener', () => {
            console.log("newListener");
        });

        client.on('removeListener', () => {
            console.log("removeListener");
        });

        dispatch({ type: 'client/init', payload: client });
    }

    return (
        <div className="container">
            <MQTTClientContext.Provider value={{ client: state.client, connected: (state.client!==null && state.client.connected) }}>
                <HashRouter>
                    <NavBar />
                    <Switch>
                        <Route path="/" exact>
                            <Redirect to="/request_response_pattern" />
                        </Route>
                        <Route path="/request_response_pattern">
                            <RequestResponsePattern />
                        </Route>
                        <Route path="/broadcast">
                            <BroadcastPanel />
                        </Route>
                    </Switch>
                    <ConnectDialogue connect={connect}/>
                </HashRouter>
            </MQTTClientContext.Provider>
        </div>
    );
}

export default MQTTClientApp;
