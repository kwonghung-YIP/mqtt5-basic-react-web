import React, { useState } from 'react';
import moment from 'moment';
import { Prompt } from 'react-router';
import MQTTClientContext from './MQTTClientContext';
import TextInput from './TextInput';

const BroadcastPanel = (props) => {

    const { client, connected } = React.useContext(MQTTClientContext);

    const [broadcastTopic, setBroadcastTopic] = useState('measure/latency');
    const [subscribed, setSubScribed] = React.useState(false);

    const [logs, setLogs] = React.useState([]);
    const logsRef = React.useRef(logs);
    const logsCnt = React.useRef(1);

    const logMsg = (msg) => {
        //console.log(`before:${logsRef.current.length}`);
        logsRef.current = [msg, ...logsRef.current].slice(0,19);
        setLogs(logsRef.current);
        //console.log(`after: ${logsRef.current.length}`);
    }

    const messageCallback = (topic, message, packet) => {
        //console.log(`message received: ${new String(message)}`);
        const msg = JSON.parse(message);
        const sentTime = moment(msg.sentTime);
        const recvTime = moment();
        const delay = recvTime.valueOf() - sentTime.valueOf();

        logMsg({
            cnt: msg.count,
            sent: sentTime.format('D/M/YYYY[T]HH:mm:ss.SSSSS'),
            recv: recvTime.format('D/M/YYYY[T]HH:mm:ss.SSSSS'),
            delay: delay,
        });
    }

    const subscribe = () => {
        if (!subscribed) {
            logsCnt.current =1;
            logsRef.current =[];
            setLogs(logsRef.current);

            client.on('message', messageCallback);

            const options = {};
            client.subscribe(broadcastTopic,options,(err,granted) => {
                setSubScribed(true);
            });
        }
    }

    const unsubscribe = () => {
        if (subscribed) {
            const options = {};
            client.unsubscribe(broadcastTopic,options,(err) => {              
                client.removeAllListeners('message');
                setSubScribed(false);
            });
        }
    }
    return (
        <div>
            <Prompt when={subscribed} 
                message={(location,action) => {
                    unsubscribe();
                    return true;
                }}/>
            <TextInput id="broadcastTopic" label="Boardcast Topic" 
                value={broadcastTopic} 
                readOnly={subscribed} 
                onChange={setBroadcastTopic} />

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
            </div>

            {logs.length==0?(<></>):(
            <div className="mt-2">
                <h5>Received message</h5>
            
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">sent time</th>
                            <th scope="col">received time</th>
                            <th scope="col">delay</th>
                        </tr>
                    </thead>
                    <tbody>
                    {logs.map((msg, key) => (
                        <tr key={key}>
                            <td scope="row">{msg.cnt}</td>
                            <td>{msg.sent}</td>
                            <td>{msg.recv}</td>
                            <td>{msg.delay}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>              
            </div>
            )}              
        </div>
    );
}

export default BroadcastPanel;