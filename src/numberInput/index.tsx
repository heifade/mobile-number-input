import React from "react";
import "./styles.less";

interface IProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  precision?: number;
  defaultValue?: string;
}

interface IState {
  value: string;
}

export class NumberInput extends React.PureComponent<IProps, IState> {
  state: IState = {
    value: this.props.value
  };

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { defaultValue = "" } = this.props;
    let value = e.target.value || defaultValue;
    if (value.length > 1 && value.startsWith("0") && value.substr(1, 1) !== ".") {
      value = value.substr(1);
    }
    this.setState({
      value
    });
  };

  onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.charCode >= 48 && e.charCode <= 57) || e.charCode === 46) {
      const { value = "" } = this.state;
      if (e.charCode === 46) {
        // 只能输入一个 "."
        if (value.includes(".")) {
          e.preventDefault();
          e.stopPropagation();
        }
        // 不能以 "." 打头。因为"." 打头的，输入连续多个点没办法控制
        if (value === "") {
          e.preventDefault();
          e.stopPropagation();
        }
      } else {
        // 控制小数点后面位数
        const { precision = 2 } = this.props;
        const values = value.split(".");
        const decimal = values[1] || "";
        if (decimal.length >= precision) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  onBlur = () => {
    const { value } = this.state;
    const { onChange, defaultValue = "" } = this.props;
    if (onChange) {
      onChange(value || defaultValue);
    }
  };

  render() {
    const { value } = this.state;
    return <input type="number" className="mni-input" onKeyPress={this.onKeyPress} onChange={this.onChange} value={value} onBlur={this.onBlur} />;
  }
}
