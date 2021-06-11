import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

class ProgressBar extends Component {
  state = {
    width: null,
  }
  handleLayout = ({ nativeEvent }) => {
    const { width } = (nativeEvent && nativeEvent.layout) || {}
    const { width: prevWidth } = this.state

    if (width !== prevWidth) {
      this.setState({ width })
    }
  }

  render() {
    const { value, maxValue, barColor, textColor, barBaseColor, _height } =
      this.props
    const { width } = this.state

    let barProgress = value / maxValue

    let widthAdjustmentNeeded = width * barProgress > width

    //if (typeof width !== 'number') {
    //}

    const style = {
      bar: {
        height: _height,
        width: widthAdjustmentNeeded ? width : width * barProgress,
        backgroundColor: barColor,
        borderRadius: 5,
        textAlign: 'center',
        justifyContent: 'center',
        position: 'relative',
        color: textColor,
        transition: 1,
        transitionDelay: 0.5,
      },
      border: {
        height: _height,
        width: width,
        backgroundColor: barBaseColor,
        borderRadius: 5,
        position: 'relative',
      },
    }

    return (
      <View onLayout={this.handleLayout}>
        {width && (
          <View style={style.border}>
            <View style={style.bar}>
              {widthAdjustmentNeeded ? 100 : Math.round(barProgress * 100)}%
            </View>
          </View>
        )}
      </View>
    )
  }
}

export default ProgressBar
