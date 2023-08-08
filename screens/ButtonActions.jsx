import { Dimensions, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, View, Text } from 'react-native'
import React, { useReducer, useState, useEffect } from 'react'
import Animated, { Extrapolate, interpolate, interpolateColor, log, useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated';
import { AntDesign, Ionicons, SimpleLineIcons, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window')
const FAB_SIZE = 54;
const circleScale = (width / FAB_SIZE).toFixed(1)
const circleSize = circleScale * FAB_SIZE;
const dist = circleSize / 2 - FAB_SIZE;
const middleDist = dist / 1.41;








/*FUNCION DE FLECHA ES6*/
  const icono1 = () => {
    return (
       <AntDesign name="printer" size={24} color="black" />   
      )
  } 

  const icono2 = () => {
    return (
      <AntDesign name="barcode" size={24} color="black" />
      )
  } 


  const icono3 = () => {
    return (
      <AntDesign name="edit" size={24} color="black" /> 
      )
  } 



const ActionButton = ({ icon, style, onPress = () => { } }) => {
  return (
    <Animated.View style={[styles.actionBtn, style]}>
      <TouchableHighlight
        underlayColor='green'
        style={styles.actionBtn}
        onPress={onPress}>
        <>
        {icon}
        </>
       </TouchableHighlight>
    </Animated.View>
  )
}


//Inicializacion Componente FAB
export default function Fab() {


  const [open, toggle] = useReducer(s => !s, false)
  const rotation = useDerivedValue(() => {
    return withTiming(open ? '360deg' : '0deg');
  }, [open])
  const progress = useDerivedValue(() => {
    return open ? withSpring(1) : withSpring(0)
  })
  const translation = useDerivedValue(() => {
    return open ? withSpring(1, { stiffness: 80, damping: 8 }) : withSpring(0)
  })
  const fabStyles = useAnimatedStyle(() => {
    const rotate = rotation.value;
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['red','black']
    )
    return {
      transform: [{ rotate }],
      backgroundColor:'black',
    }
  })
  const scalingStyles = useAnimatedStyle(() => {
    const scale = interpolate(
      progress.value,
      [0, 1],
      [0, circleScale],
    )
    return {
      transform: [{ scale }]
    }
  })
  const translationStyles = (x, y, value) => (
    useAnimatedStyle(() => {
      const translate = interpolate(
        translation.value,
        [0, 1],
        [0, -value],
        { extrapolateLeft: Extrapolate.CLAMP }
      )
      const scale = interpolate(
        progress.value,
        [0, 1],
        [0, 1],
        { extrapolateLeft: Extrapolate.CLAMP }
      )
      if (x && y) {
        return {
          transform: [{ translateX: translate }, { translateY: translate }, { scale }]
        }
      } else if (x) {
        return {
          transform: [{ translateX: translate }, { scale }]
        }
      } else {
        return {
          transform: [{ translateY: translate }, { scale }]
        }
      }
    })
  )




const button_print_action = async () => {

  try {

    const api_data = ""
    const data_print = JSON.parse(await AsyncStorage.getItem('data_api')).data_print
    console.log(data_print)
    await axios.post('http://201.239.17.218:8000/api/print_test', data_print, {
        haeders: {
            'content-type': 'text/json'
        }
    }).then((res) => {
        if(res.status = 200) {
            alert('Impresion en proceso')
        }
    }).catch ((err) => {
      alert(err)
    })
 } catch (error) {
    console.log(error)
    }

}//Cierre button print action






const button_create_action = () => {
  const data_crear = AsyncStorage.getItem('data_crear')
     try {
      axios.post('http://201.239.17.218:105/crear_barcode', data_crear, {
           headers: {
               'content-type': 'text/json'
           }
       }).then((res) => {
            if(res.status = 200) {
               alert('Creacion exitosa')
             }
       }).catch(function (error) {
               alert(error);
           })      
     } catch (error) {
         alert(error);
         setIsLoading(false);     
       }
}








const button_modify_action = () => {
  const data_modificar = AsyncStorage.getItem('data_modificar')
    try {
    axios.post('http://201.239.17.218:105/modificar_barcode', data_modificar, {
          headers: {
                    'content-type': 'text/json'
          }
      }).then((res) => {
              if(res.status = 200) {
                  alert('Modificacion exitosa')
                }
      }).catch(function (error) {
              alert(error);
      });    
    } catch (error) {
          alert(error);
          setIsLoading(false);    
        }
}



  return (
    <View style={styles.container}>
      <View style={styles.fabContainer}>
        <Animated.View style={[styles.expandingCircle, scalingStyles]} />
        <TouchableWithoutFeedback onPress={toggle}>
          <Animated.View style={[styles.fab, fabStyles]}>
          <Entypo name="tools" size={24} color="gray" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <ActionButton style={translationStyles(false, true, dist)}            icon={icono1()}  onPress={button_print_action}/>
        <ActionButton style={translationStyles(true, true, middleDist)} icon={icono2()}  onPress={button_create_action}/>
        <ActionButton style={translationStyles(true, false, dist)}            icon={icono3()}  onPress={button_modify_action}/>
      </View>
    </View>
  )
}

const CircleStyle = {
  width: FAB_SIZE,
  height: FAB_SIZE,
  borderRadius: FAB_SIZE / 2,
  justifyContent: 'center',
  alignItems: 'center',
}

const styles = StyleSheet.create({
  container: {
    zIndex:1,
    backgroundColor: 'green',
    left:'50%',
    bottom:'-60%',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    ...CircleStyle,
    backgroundColor: 'green',
    transform: [{ rotate: '135deg' }],
    borderWidth: 5,
        borderTopColor: '#7dba06',
        borderRightColor: '#7dba06',
        borderBottomColor: '#7dba06',
        borderLeftColor: '#7dba06',
  },
  expandingCircle: {
    ...CircleStyle,
    //transform: [{ scale: 8 }],
    backgroundColor: 'black',
    position: 'absolute',
    zIndex: -1,
    borderWidth: 1,
        borderTopColor: '#7dba06',
        borderRightColor: '#7dba06',
        borderBottomColor: '#7dba06',
        borderLeftColor: '#7dba06',
  },
  actionBtn: {
    ...CircleStyle,
    backgroundColor: 'green',
    position: 'absolute',
    zIndex: -1,
  },
})