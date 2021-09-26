const TextInput = (props) => {
    return (
        <div className="mt-2 row">
            <label htmlFor={props.id}
                className="col-sm-2 col-form-label">{props.label}
            </label>
            <div className="col-sm-10">
                <input id={props.id}
                    className="form-control"
                    value={props.value}
                    readOnly={props.readOnly}
                    onChange={(e) => { props.onChange(e.target.value);}} />
            </div>
        </div>
    );
}

export default TextInput;