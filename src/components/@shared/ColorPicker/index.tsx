import React, { Component } from 'react';
import ColorPicker, { parseColor } from 'mb-react-color-picker';
import { Icon } from 'antd';
import tubeSVG from 'assets/img/tube.svg';
import './index.scss';

const Tube = () => <img src={tubeSVG} alt=""/>;
const DEFAULT_COLOR = '#1890ff';

class SystemColorPicker extends React.Component<any> {
  handleSystem = e => this.props.handleChange({ hex: e.target.value, a: this.props.alpha, })

  render() {
    const { hex, } = this.props;
    return (
      <div className="system-color-picker-wrapper">
        <Icon
          component={Tube}
          style={{ fontSize: 14, }}
        />
        <input
          className="system-color-picker"
          type="color"
          value={hex}
          onChange={this.handleSystem}
        />
      </div>
    );
  }
}

export default class ColorPicker2 extends Component<any> {
  static defaultProps = {
    colorPickerPosition: [0, 0],
    color: DEFAULT_COLOR,
  }
  state = {
    color: DEFAULT_COLOR,
    colorPickerPosition: [0, 0],
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentDidUpdate() {
    const { showColorPicker, } = this.props;

    if (showColorPicker) {
      const dom = document.querySelector('.color-picker-header .icon.dora');

      if (dom) {
        dom.innerHTML = 'x';
      }
    }
  }

  handleChange = color => {
    // this.setState({ color, });
    this.props.onColorConfirm && this.props.onColorConfirm(parseColor(color).hex);
  }

  handleConfirm = color => {
    // this.setState({ color, });
    this.props.onColorConfirm && this.props.onColorConfirm(parseColor(color).hex);
  }

  hideColorPicker = () => {
    this.props.hideColorPicker && this.props.hideColorPicker();
  }


  handleDragStart = e => {
    const onMouseMove = e => {
      this.setState({
        colorPickerPosition: [
          e.clientX,
          e.clientY
        ],
      });
      this.props.setColorPickerPosition && this.props.setColorPickerPosition([
        e.clientX,
        e.clientY
      ]);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  setColorPickerPosition = (mouseStartX, mouseStartY) => {
    // debugger
    const { colorPickerPosition: [initialX, initialY], } = this.state;

    const offsetX =  mouseStartX;
    const offsetY = mouseStartY;
    this.setState({
      colorPickerPosition: [
        initialX + offsetX,
        initialY + offsetY
      ],
    });
  }


  render() {
    const { color,
    } = this.props;

    const { showColorPicker,
      colorPickerPosition: [colorPickerLeft, colorPickerTop], } = this.props;

    // console.log('color', this.props.color)

    return (
      showColorPicker && <div style={{
        position: 'fixed',
        top: colorPickerTop,
        left: colorPickerLeft,
      }}>
        <ColorPicker
          color={color}
          onConfirm={this.handleConfirm}
          onClose={this.hideColorPicker}
          onChange={this.handleChange}
          onDragStart={this.handleDragStart}
        >
          <SystemColorPicker />
        </ColorPicker>
      </div>
    );
  }
}