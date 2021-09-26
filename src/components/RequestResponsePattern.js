import React from 'react';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { Prompt } from 'react-router';
import MQTTClientContext from './MQTTClientContext';
import TextInput from './TextInput';


const RequestResponsePattern = (props) => {

    const { client, connected } = React.useContext(MQTTClientContext);

    const [requestTopic, setRequestTopic] = React.useState("request/echo");
    const [responseTopic, setResponseTopic] = React.useState();
    const [message, setMessage] = React.useState("GoGoGo!");
    const [correlationData, setCorrelationData] = React.useState(`${uuid()}`);

    const [subscribed, setSubScribed] = React.useState(false);

    const [logs, setLogs] = React.useState([]);
    const logsRef = React.useRef(logs);
    const logsCnt = React.useRef(1);

    React.useEffect(() => {
        console.log(`reset response topic with new clientId`)
        if (client!==null && client.connected) {
            setResponseTopic(`response/${client.options.clientId}/echo`);
        }
    },[ client, connected ]);

    /*React.useEffect(() => {
        console.log(`logs.current changed, size:${logs.length}`);
        return () => {
            console.log(`logs.current changed chenaup, size:${logs.current.length}`);
        }
    },[logs]);*/

    const logMsg = (event, log) => {
        //const msg = `[${new Date().toTimeString()}] - event:[${type}]\n${text}\n`;
        const msg = {
            cnt: logsCnt.current++,
            ts: moment().format('HH:mm:ss.SSSSS'),
            event: event,
            log: log,
        };
        //console.log(`before:${logsRef.current.length}`);
        logsRef.current = [msg, ...logsRef.current].slice(0,19);
        setLogs(logsRef.current);
        //console.log(`after: ${logsRef.current.length}`);
    }

    const messageCallback = (topic, message, packet) => {
        //console.log(`message received: ${JSON.stringify(packet)}`);
        logMsg('message',message);//new String(message));
    }

    const packetsendCallback = (packet) => {
        //console.log(`package sent2: ${JSON.stringify(packet)}`);
        logMsg('packetsend',JSON.stringify(packet));
    }

    const packetreceiveCallback = (packet) => {
        //console.log(`package received: ${JSON.stringify(packet)}`);
        logMsg('packetreceive',JSON.stringify(packet));
    };

    const subscribe = () => {
        if (!subscribed) {
            logsCnt.current =1;
            logsRef.current =[];
            setLogs(logsRef.current);

            client.on('message', messageCallback);
            client.on('packetsend', packetsendCallback);
            client.on('packetreceive', packetreceiveCallback);

            const options = {};
            client.subscribe(responseTopic,options,(err,granted) => {
                setSubScribed(true);
            });
        }
    }

    const unsubscribe = () => {
        if (subscribed) {
            //client.off to remove an eventlistener does not work
            //client.off('message', messageCallback);
            //client.off('packetsend', packetsendCallback);
            //client.off('packetreceive', packetreceiveCallback);  

            const options = {};
            client.unsubscribe(responseTopic,options,(err) => {              
                client.removeAllListeners('message');
                client.removeAllListeners('packetsend');
                client.removeAllListeners('packetreceive');
                setSubScribed(false);
            });
        }
    }
    
    const send = () => {
        if (subscribed) {
            const options = {
                retain: true,
                properties: {
                    responseTopic: responseTopic,
                    correlationData: correlationData,
                    payloadFormatIndicator: true,
                    contentType: 'text/plain',
                },
            };
    
            client.publish(requestTopic,message,options,() => {
                //console.log("message published!");
                setCorrelationData(`${uuid()}`);
            });  
        }
    }    
    return (
        <div>
            <Prompt 
                when={subscribed} 
                message={(location,action) => {
                    unsubscribe();
                    return true;
                }}/>
            <p>This page demonstrates how to use request response pattern</p>

            <TextInput id="requestTopic" label="Request Topic" 
                value={requestTopic} 
                readOnly={subscribed} 
                onChange={setRequestTopic} />
            <TextInput id="responseTopic" label="Response Topic" 
                value={responseTopic} 
                readOnly={subscribed} 
                onChange={setResponseTopic} />
            <TextInput id="message" label="Message" 
                value={message} 
                onChange={setMessage} />
            <TextInput id="correlationData" label="Correlation Data" 
                value={correlationData}
                readOnly={true}
                onChange={setCorrelationData} />

            <div className="mt-2">
                <button className="btn btn-primary me-2"
                    disabled={!(client !== null && client.connected && !subscribed)}
                    onClick={subscribe}>
                    Subscribe
                </button>

                <button className="btn btn-primary me-2" 
                    disabled={!subscribed}
                    onClick={unsubscribe}>
                    Unsubscribe
                </button>

                <button className="btn btn-primary me-2"
                    disabled={!subscribed}
                    onClick={send}>
                    Send
                </button>
            </div>

            {logs.length===0?(<></>):(
            <div className="mt-2">
                <h5>Sent/Received package/message</h5>
            
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">time</th>
                            <th scope="col">event</th>
                            <th scope="col">log</th>
                        </tr>
                    </thead>
                    <tbody>
                    {logs.map((msg, key) => (
                        <tr key={key}>
                            <th scope="row">{msg.cnt}</th>
                            <td>{msg.ts}</td>
                            <td>{msg.event}</td>
                            <td>{msg.log}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>              
            </div>
            )}  
        </div>
    );
}

export default RequestResponsePattern;

