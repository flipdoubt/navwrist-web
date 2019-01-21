import * as React from "react";

type Props = {
  name: string;
  title: string;
  type: string;
  autoFocus?: boolean;
  placeHolder?: string;
  value: string;
  handleChange?: (string) => void;
};

const Input = (props: Props) => {
  const changeHandler = function(source: React.ChangeEvent<HTMLInputElement>) {
    const { value } = source.target;
    if (props.handleChange) {
      props.handleChange(value);
    }
  };
  return (
    <div className="field">
      <label htmlFor={props.name} className="label">
        {props.title}
      </label>
      <input
        className="input"
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        placeholder={props.placeHolder}
        onChange={changeHandler}
        autoFocus={props.autoFocus}
      />
    </div>
  );
};

export default Input;
