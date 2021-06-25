import React, { useCallback, useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'

const ProgressBar = props => {
  let {
    progressValue,
    maxValue,
    _height: height,
    _width,
    direction,
    editor,
    styles,
    animate,
    setProgressValue,
  } = props

  // Get the previous value (was passed into hook on last render)
  const prevProgressValue = usePrevious(progressValue)
  let _progressValue = progressValue
  let _maxValue = maxValue

  const animationDuration = 100
  let innerBorderStyle = {}
  let animation = useRef(new Animated.Value(0))
  let width
  let innerHeight
  let flexDirection
  let {
    backgroundColor,
    progressColor,
    exteriorRounding,
    interiorRounding,
    exteriorBorderWidth,
    exteriorBorderColor,
    interiorBorderWidth,
    interiorBorderColor,
    intBorderEnabled,
    extBorderEnabled,
  } = styles
  let { animationSpeed, animationBounciness, animateWhen } = animate
  let interiorRadius = {}

  //set border values based on enabled/disabled
  if (!extBorderEnabled) {
    exteriorBorderWidth = 0
  }

  if (!intBorderEnabled) {
    interiorBorderWidth = 0
  }

  //Set default values if the editor input is invalid
  if (!progressValue) {
    _progressValue = 0
  }
  if (!maxValue) {
    _maxValue = 100
  }
  if (maxValue <= 0) {
    _maxValue = 100
  }
  if (progressValue < 0) {
    _progressValue = 0
  }
  if (progressValue > maxValue) {
    _progressValue = maxValue
  }

  const exteriorBorderRadius = (exteriorRounding / 100) * (height / 2)
  const interiorBorderRadius = (interiorRounding / 100) * (height / 2)

  switch (direction) {
    case 0:
      flexDirection = 'row'
      width = animation.current.interpolate({
        inputRange: [0, _maxValue],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
      })
      innerHeight = height - exteriorBorderWidth * 2
      innerBorderStyle = {
        borderRightWidth: interiorBorderWidth,
        borderRightColor: interiorBorderColor,
      }
      interiorRadius = {
        borderBottomRightRadius: interiorBorderRadius,
        borderTopRightRadius: interiorBorderRadius,
      }
      break
    case 1:
      flexDirection = 'row-reverse'
      width = animation.current.interpolate({
        inputRange: [0, _maxValue],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
      })
      innerHeight = height - exteriorBorderWidth * 2
      innerBorderStyle = {
        borderLeftWidth: interiorBorderWidth,
        borderLeftColor: interiorBorderColor,
      }
      interiorRadius = {
        borderBottomLeftRadius: interiorBorderRadius,
        borderTopLeftRadius: interiorBorderRadius,
      }
      break
    case 2:
      flexDirection = 'column'
      innerHeight = animation.current.interpolate({
        inputRange: [0, _maxValue],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
      })
      width = _width - exteriorBorderWidth * 2
      innerBorderStyle = {
        borderBottomWidth: interiorBorderWidth,
        borderBottomColor: interiorBorderColor,
      }
      interiorRadius = {
        borderBottomLeftRadius: interiorBorderRadius,
        borderBottomRightRadius: interiorBorderRadius,
      }
      break
    case 3:
      flexDirection = 'column-reverse'
      innerHeight = animation.current.interpolate({
        inputRange: [0, _maxValue],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
      })
      width = _width - exteriorBorderWidth * 2
      innerBorderStyle = {
        borderTopWidth: interiorBorderWidth,
        borderTopColor: interiorBorderColor,
      }
      interiorRadius = {
        borderTopRightRadius: interiorBorderRadius,
        borderTopLeftRadius: interiorBorderRadius,
      }
      break
  }

  //editor display and reanimation (needs help, not best practices or functionally correct)
  if (editor) {
    const debounce = useCallback(
      _.debounce((bounce, speed, progress) => {
        animation.current.setValue(0)
        Animated.spring(animation.current, {
          toValue: progress,
          duration: animationDuration,
          bounciness: bounce,
          speed: speed,
        }).start()
      }, 500),
      [animateWhen]
    )

    useEffect(
      () => debounce(animationBounciness, animationSpeed, progressValue),
      [animationSpeed, animationBounciness]
    )
  }

  //Animation hook
  useEffect(() => {
    switch (animateWhen) {
      case 0:
        //on mount and change

        Animated.spring(animation.current, {
          toValue: _progressValue,
          duration: animationDuration,
          bounciness: animationBounciness,
          speed: animationSpeed,
        }).start()

        break
      case 1:
        // on mount
        console.log('prev value' + prevProgressValue)
        console.log('_progress value' + _progressValue)

        if (prevProgressValue === undefined) {
          Animated.spring(animation.current, {
            toValue: _progressValue,
            duration: animationDuration, //maybe 0?
            bounciness: animationBounciness,
            speed: animationSpeed,
          }).start()
        } else {
          Animated.timing(animation.current, {
            toValue: _progressValue,
            duration: 0,
          }).start()
        }

        break
      case 2:
        //on change

        if (prevProgressValue !== undefined) {
          Animated.spring(animation.current, {
            toValue: _progressValue,
            duration: animationDuration,
            bounciness: animationBounciness,
            speed: animationSpeed,
          }).start()
        } else {
          Animated.timing(animation.current, {
            toValue: _progressValue,
            duration: 0,
          }).start()
        }
        break
      case 3:
        Animated.timing(animation.current, {
          toValue: _progressValue,
          duration: 0,
        }).start()
        break
    }
  }, [progressValue])

  const outerStyles = {
    backgroundColor,
    height,
    borderRadius: exteriorBorderRadius,
    borderWidth: exteriorBorderWidth,
    borderColor: exteriorBorderColor,
    flexDirection,
    overflow: 'hidden',
  }

  let innerStyles = {
    backgroundColor: progressColor,
    height: innerHeight,
    width,
  }

  return (
    <View style={[styles.wrapper, outerStyles]}>
      <Animated.View
        style={[styles.progress, innerStyles, innerBorderStyle, interiorRadius]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'left',
  },
  progress: {
    display: 'flex',
  },
})

// Hook
function usePrevious(value) {
  const ref = useRef()
  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes
  return ref.current
}

export default ProgressBar
