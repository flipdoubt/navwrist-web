import * as React from "react";

type Props = {
  name: string;
  title: string;
  type: string;
  autoFocus?: boolean;
  placeHolder?: string;
  value: string;
  valueDidChange?: (string) => void;
};

// https://www.codementor.io/blizzerand/building-forms-using-react-everything-you-need-to-know-iz3eyoq4y
const Input = (props: Props) => {
  const changeHandler = function(source: React.ChangeEvent<HTMLInputElement>) {
    if (!props.valueDidChange) {
      console.log(
        `Add handleChange handler to ${
          props.name
        } Input to do something with the updated value.`
      );
      return;
    }

    props.valueDidChange(source.target.value);
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
