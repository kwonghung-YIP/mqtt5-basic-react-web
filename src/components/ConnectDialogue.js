import React from 'react';
import * as bootstrap from 'bootstrap';
import TextInput from './TextInput';
import MQTTClientContext from './MQTTClientContext';

const ConnectDialogue = (props) => {

    const profiles = [{
        url: "ws://test.mosquitto.org:8080/mqtt",  desc: "test.mosquitto.org - MQTT over WebSockets, unencrypted, unauthenticated", username: "", password: ""
    },{
        url: "wss://test.mosquitto.org:8081/mqtt", desc: "test.mosquitto.org - MQTT over WebSockets, encrypted, unauthenticated", username: "", password: ""
    },{
        url: "ws://test.mosquitto.org:8090/mqtt",  desc: "test.mosquitto.org - MQTT over WebSockets, unencrypted, authenticated (rw)", username: "rw", password: "readwrite"
    },{
        url: "ws://test.mosquitto.org:8090/mqtt",  desc: "test.mosquitto.org - MQTT over WebSockets, unencrypted, authenticated (ro)", username: "ro", password: "readonly"
    },{
        url: "ws://test.mosquitto.org:8090/mqtt",  desc: "test.mosquitto.org - MQTT over WebSockets, unencrypted, authenticated (wo)", username: "wo", password: "writeonly"
    },{
        url: "wss://test.mosquitto.org:8091/mqtt", desc: "test.mosquitto.org - MQTT over WebSockets, encrypted, authenticated (rw)"  , username: "rw", password: "readwrite"
    },{
        url: "wss://test.mosquitto.org:8091/mqtt", desc: "test.mosquitto.org - MQTT over WebSockets, encrypted, authenticated (ro)"  , username: "ro", password: "readonly"
    },{
        url: "wss://test.mosquitto.org:8091/mqtt", desc: "test.mosquitto.org - MQTT over WebSockets, encrypted, authenticated (wo)"  , username: "wo", password: "writeonly"
    },{
        url: "ws://localhost:8000/mqtt",  desc: "My local HiveMQ - MQTT over WebSockets, unencrypted, authenticated"  , username: "user1", password: "hm93bqCj6xR562U"
    },{
        url: "wss://localhost:8001/mqtt", desc: "My local HiveMQ - MQTT over WebSockets, encrypted, authenticated"  , username: "user1", password: "hm93bqCj6xR562U"
    },{
        url: "ws://kwonghung-yip.asuscomm.com:8000/mqtt", desc: "Loacl HiveMQ via asuscomm.com - MQTT over WebSockets, encrypted, authenticated"  , username: "user1", password: "hm93bqCj6xR562U"
    },{
        url: "wss://kwonghung-yip.asuscomm.com:8001/mqtt", desc: "Loacl HiveMQ via asuscomm.com - MQTT over WebSockets, encrypted, authenticated"  , username: "user1", password: "hm93bqCj6xR562U"
    }];

    const defaultProfile = 9;
    const [clientId, setClientId] = React.useState(`webclient_${Math.random().toString(16).substr(2, 8)}`);
    const [brokerUrl, setBrokerUrl] = React.useState(profiles[defaultProfile].url);
    const [username, setUsername] = React.useState(profiles[defaultProfile].username);
    const [password, setPassword] = React.useState(profiles[defaultProfile].password);

    const modal = React.useRef(null);
    const { connected } = React.useContext(MQTTClientContext);

    React.useEffect(() => {
        //console.log(`useEffect supposed to be called once`);
        if (modal.current===null) {
            //console.log("init modal object");
            modal.current = new bootstrap.Modal(document.getElementById('connectDialogue'),{
                backdrop: 'static',
                keyboard: false,
                focus: true,
            });
        }
    },[]);

    React.useEffect(() => {
        //console.log(`call useEffect: ${connected} ...`);
        if (connected) {
            modal.current.hide();
        } else {
            modal.current.show();
        }
    },[ connected ]);

    return (
        <div className="modal" tabIndex="-1" id="connectDialogue">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">MQTT.js client properties</h5>
                    </div>
                    <div className="modal-body">
                        <TextInput id="clientId" label="Client ID" value={clientId} readOnly={true}/>
                        <SelectInput id="profile" label="Profile" 
                            data={profiles} selected={defaultProfile} 
                            onChange={(data) => {
                                setBrokerUrl(data.url);
                                setUsername(data.username);
                                setPassword(data.password);
                            }
                        }/>
                        <TextInput id="brokerUrl" label="BrokerUrl" value={brokerUrl} onChange={setBrokerUrl}/>
                        <TextInput id="username" label="Username" value={username} onChange={setUsername}/>
                        <TextInput id="password" label="Password" value={password} onChange={setPassword}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={() => {props.connect(clientId,brokerUrl,username,password);}}>Connect</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConnectDialogue;

const SelectInput = (props) => {

    const [ option, setOption ] = React.useState(props.selected);

    return (
        <div className="mt-2 row">
            <label htmlFor={props.id}
                className="col-sm-2 col-form-label">{props.label}
            </label>
            <div className="col-sm-10">
                <select id={props.id} className="form-select"
                    value={option}
                    onChange={(e) => {
                        //console.log(props.data[e.target.value]);
                        setOption(e.target.value);
                        props.onChange(props.data[e.target.value]);
                    }}>
                {props.data.map((option,key) => (
                    <option key={key} value={key}>{option.desc}</option>
                ))}
                </select>
            </div>
        </div>
    );
}