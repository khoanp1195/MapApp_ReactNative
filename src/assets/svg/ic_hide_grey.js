import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  const { color = "#000" } = props;
  return (
    <Svg
      width={18}
      height={12}
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.179 5.597a2.821 2.821 0 115.642 0 2.821 2.821 0 01-5.642 0zm.904 0a1.917 1.917 0 103.834 0 1.917 1.917 0 00-3.834 0z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0c4.822 0 8.644 5.112 8.804 5.329l.196.268-.196.268-.016.021c-.314.41-4.073 5.308-8.788 5.308-4.822 0-8.644-5.112-8.804-5.329L0 5.597l.196-.268C.356 5.112 4.178 0 9 0zM1.136 5.597C1.977 6.631 5.223 10.29 9 10.29s7.023-3.66 7.864-4.693C16.023 4.563 12.777.904 9 .904s-7.023 3.66-7.864 4.693z"
        fill={color}
      />
    </Svg>
  );
}

export default SvgComponent;
