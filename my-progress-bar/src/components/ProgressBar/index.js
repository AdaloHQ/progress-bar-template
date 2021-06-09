import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

class ProgressBar extends Component {
  checkEdgeCases() {
    if (this.props.value > this.props.maxValue) {
      this.props.value = this.props.maxValue
    }

    if (this.props.maxValue < this.props.value) {
      this.props.maxValue = this.props.value
    }

    if (this.props.value < 0) this.props.value = this.props.value
    if (this.props.maxValue <= 0)
      this.props.maxValue = this.props.maxValue.default

    // if (this.props.value.type != 'number') this.props.value = 0

    //if (this.props.maxValue.type != 'number') this.props.value = 0
  }

  render() {
    this.checkEdgeCases()

    const style = {
      bar: {
        height: this.defaultHeight,
        width: this.props.value,
        backgroundColor: this.props.barColor,
        borderRadius: 5,
        textAlign: 'center',
        position: 'relative',
        color: this.props.textColor,
      },
      border: {
        height: this.defaultHeight, //how do i get this to dynamic sizing
        width: this.props.maxValue,
        backgroundColor: this.props.barBaseColor,
        borderRadius: 5,
        position: 'relative',
      },
    }

    let barProgress = Math.round((this.props.value / this.props.maxValue) * 100)

    return (
      <View style={style.border}>
        <View style={style.bar}>{barProgress}%</View>
      </View>
    )
  }
}

export default ProgressBar
