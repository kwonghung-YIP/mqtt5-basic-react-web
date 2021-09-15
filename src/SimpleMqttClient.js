import { useReducer, useState } from 'react';

const mqtt = require('mqtt');

const reducer = (state, action) => {
    let newState = {...state};
    if (action.type === "change/brokerUrl") {
        newState = { ...state, brokerUrl: action.payload.target.value };  
    } else if (action.type === "change/username") {
        newState = { ...state, username: action.payload.target.value };    
    } else if (action.type === "change/password") {
        newState = { ...state, password: action.payload.target.value };    
    } else if (action.type === "change/publishTopic") {
        newState = { ...state, publishTopic: action.payload.target.value };
    } else if (action.type === "change/responseTopic") {
        newState = { ...state, responseTopic: action.payload.target.value };              
    } else if (action.type === "change/message") {
        newState = { ...state, message: action.payload.target.value };                
    } else if (action.type === "client/init") {
        newState = { ...state, mqttClient: action.payload };
    } else if (action.type === "client/connect") {
        newState = { ...state, connected: true };
    } else if (action.type === "client/end") {
        newState = { ...state, mqttClient: null, connected: false };         
    } else if (action.type === "message/received") {
        const { message, topic } = action.payload;
        console.log(`[${message}] received from topic [${topic}]`);
    } else if (action.type === "packet/sent") {
        const { payload: packet } = action;
        console.log(`package sent to topic [${packet.topic}] : messageId [${packet.messageId}]`);
    } else if (action.type === "packet/received") {
        const { payload: packet } = action;
        console.log(`package received to topic [${packet.topic}] : messageId [${packet.messageId}]`);
    }
    return newState;
};

const SimpleMqttClient = (props) => {

    const clientId = `webclient_${Math.random().toString(16).substr(2, 8)}`;

    const initState = {
        clientId: clientId,
        brokerUrl: props.url,
        username: props.username,
        password: props.password,
        publishTopic: "request/echo",
        responseTopic: `response/${clientId}/echo`,
        message: "GoGoGo!",
        mqttClient: null,
        connected: false,
    };

    const [ state, dispatch ] = useReducer(reducer,initState);
    const [ logs, setLogs ] = useState([]);

    const logmsg = (message) => {
        logs.push({
            ts: new Date(),
            msg: message,
        });
        setLogs(logs);
    }

    const connect = () => {
        const { clientId, username, password, mqttClient: client } = state;
        if (client==null) {
            let client = mqtt.connect(state.brokerUrl,{
                clientId: clientId,
                reconnectPeriod: 0,
                protocolVersion: 5,
                username: username,
                password: password,
            });

            client.on('error',(error) => {
                console.error(error);
            });

            client.on('connect',(connAck) => {
                dispatch({ type:"client/connect", payload: connAck });
                logmsg(`client connected: ${JSON.stringify(connAck)}`);
        
                const { responseTopic } = state;
                client.subscribe(responseTopic,{},(err,granted) => {
                });                
            });

            client.on('message',(topic,message,packet) => {
                dispatch({ type:"message/received", payload:{ topic: topic, message: message, packet: packet }});
                logmsg(`message received from topic [${topic}]: ${message}`);
            });

            client.on('packetsend',(packet) => {
                dispatch({ type:"packet/sent", payload: packet });
                logmsg(`packet sent: ${JSON.stringify(packet)}`);
            });

            client.on('packetreceive',(packet) => {
                //console.log(`package received: ${JSON.stringify(packet)}`);
                dispatch({ type:"packet/received", payload: packet });
                logmsg(`packet received: ${JSON.stringify(packet)}`);
            });

            client.on('disconnect',(packet) => {
                console.log("client disconnect");
                //dispatch({ type:"client/close", payload: client});
            });

            client.on('offline',() => {
                console.log("client offline");
                //dispatch({ type:"client/close", payload: client});
            });

            client.on('reconnect',() => {
                console.log("client reconnect");
                //dispatch({ type:"client/close", payload: client});
            });

            client.on('close',() => {
                console.log("client close");
                //dispatch({ type:"client/close", payload: client});
            });

            client.on('end',() => {
                dispatch({ type:"client/end", payload: client});
            });

            dispatch({ type:"client/init", payload: client});
            logmsg(`client connecting to [${state.brokerUrl}]...`)
        }        
    }

    const send = () => {
        const { mqttClient:client, publishTopic, responseTopic, message } = state;

        const options = {
            retain: true,
            properties: {
                responseTopic: responseTopic,
                correlationData: `${Math.random().toString(16)}`,
                payloadFormatIndicator: true,
                contentType: 'text/plain',
            },
        };

        client.publish(publishTopic,message,options,() => {
            console.log("message published!");
        });
    }

    const end = () => {
        const { mqttClient: client } = state;
        if (client != null) {
            client.end();
        }
    }

    return (
        <div className="container my-3">
            <h2>MQTT.js Test Client</h2>
            <TextInput id="clientId" label="Client ID" readOnly={true}
                value={state.clientId} onChange={(e) => dispatch({type:"change/clientId",payload:e})}/>
            <TextInput id="brokerUrl" label="Broker URL" readOnly={state.connected}
                value={state.brokerUrl} onChange={(e) => dispatch({type:"change/brokerUrl",payload:e})}/>
            <TextInput id="usename" label="Username" readOnly={state.connected}
                value={state.username} onChange={(e) => dispatch({type:"change/username",payload:e})}/>
            <TextInput id="password" label="Password" readOnly={state.connected}
                value={state.password} onChange={(e) => dispatch({type:"change/password",payload:e})}/>
            <TextInput id="publishTopic" label="Publish Topic" 
                value={state.publishTopic} onChange={(e) => dispatch({type:"change/publishTopic",payload:e})}/>
            <TextInput id="responseTopic" label="Response Topic" 
                value={state.responseTopic} onChange={(e) => dispatch({type:"change/responseTopic",payload:e})}/>
            <TextInput id="message" label="Message" 
                value={state.message} onChange={(e) => dispatch({type:"change/message",payload:e})}/>                        
            <div className="mt-2">
                <button className="btn btn-primary ms-2"
                    disabled={state.connected}
                    onClick={connect}>
                    Connect
                </button>
                
                <button className="btn btn-primary mx-2" 
                    disabled={!state.connected}
                    onClick={end}>
                    Disconnect
                </button>
                
                <button className="btn btn-secondary me-2"
                    disabled={!state.connected}
                    onClick={send}>
                    Send message
                </button>
            </div>
            <div className="mt-2">
                <label htmlFor="logs" className="form-label">Logs</label>
                <textarea id="logs" className="form-control" rows="10" readOnly
                    value={logs.reduce((output,log) => {
                        output += `- [${log.ts.toTimeString()}]\n${log.msg}\n`;
                        return output;
                    },"")}/>
            </div>
        </div>
    );
}

const TextInput = (props) => {
    return (
        <div className="mt-2 row">
            <label htmlFor={props.id}
                className="col-sm-2 col-form-label">{props.label}
            </label>
            <div className="col-sm-10">
                <input id={props.id}
                    className="form-control"
                    readOnly={props.readOnly}
                    value={props.value}
                    onChange={props.onChange}/>
            </div>
        </div>
    );
}

export default SimpleMqttClient;