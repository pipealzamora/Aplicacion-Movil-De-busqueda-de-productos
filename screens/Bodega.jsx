import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image, Dimensions } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Checkbox } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { AntDesign } from '@expo/vector-icons';
import { withRepeat } from 'react-native-reanimated';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;



const Bodega = ({navigation}) => {
    
// USE STATE'S//
  // ************************************************************************************//
      const [parametro_checkbox, setParametro_checkbox] = useState('')
      const [data, setData] = useState('')
      const [textValue, setTextValue] = useState('')
      const [buttonactivate, setButtonactivate] = useState(true)
      const [api_err, setApi_err] = useState(false)
  // ************************************************************************************//



// USE EFFECT//
  // ************************************************************************************//
    useEffect(() => {
        if (textValue.length > 0 && parametro_checkbox.length > 0 && api_err == false){
            setButtonactivate(false);
        }
        else{
            setButtonactivate(true)
        }   
    });
  // ************************************************************************************//



  // FUNCIONES CUSTOM//
  // ************************************************************************************//
    const text_input_function = (x) => {
        if (parametro_checkbox == 'codigo_producto') {
            if(x.length == 2){
                x+="-"
            }
            if(x.length == 5){
                if(x.slice(3,5).match("^[0-9]+$") == null){
                    alert("Se deben ingresar solo valores numéricos, el guión se agregará automaticamente según digites.")
                    var ret = x.replace(x.slice(3,5),'')
                    setTextValue(x.replace(x.slice(3,5),''))
                }
                x+="-"
            }
            if (x.length > 9){
                x = (x.slice(0,9))
            }
            setTextValue(x)
           }
           else{
               setTextValue(x)
           }
    } 
  
  
    const ClearTextInput = () => {
        setTextValue('')
    };


    const setValue = (data) => {
        const producto_descripcion = data.descripcion
        const producto_ean13 = data.ean13
        const producto_id = data._id
        const  producto_codigo = data.codigo
        alert(`Nombre: ${producto_descripcion} EAN-13: ${producto_ean13} ID : ${producto_id}`)
        const data_prod = [["producto_descripcion",  producto_descripcion.toString()], ["producto_ean13",  producto_ean13.toString()], ["producto_id",  producto_id.toString()]]
        try {
            AsyncStorage.multiSet(data_prod)
        } catch (err) {
            alert(err);
       }
    }

    const onButton = async () => {
        try {
            AsyncStorage.clear();
            const get_res = await axios.get(`http://201.239.17.218:8000/api/busqueda/${parametro_checkbox}/${textValue}`)
            const res = get_res.data.data[0];
            setData(res)
            setValue(res)
        } catch (error) {
            setApi_err(true)
            alert(error);
        }          
    }
  // ************************************************************************************//




  return (
      <>
          <ImageBackground style={styles.back} source={require('../assets/fondo5.jpg')}>

              <BlurView  intensity={80}  tint="light" style={styles.container_logo }>
                  <Image style={styles.logo_image} source={require('../assets/footer-logo.png')} />
             </BlurView>


             <View style={styles.searchbarContainer}>
                 <TextInput 
                     placeholder='Buscar Producto'
                     style={styles.textInput}
                     autoCapitalize="none"
                     autCorrect={false}
                     value={textValue} 
                     onChangeText={value => text_input_function(value.toUpperCase())}
                 />
             </View>

             <View style={styles.Clear}>
                 <View style={{flexDirection: 'row', alignItems: 'center' }}>
                 { textValue.length > 0 && (
                     <TouchableOpacity style={styles.buttonn} onPress={() => ClearTextInput()}>
                         <Text style={styles.text}>Borrar </Text>
                     </TouchableOpacity>
                 )}
                 </View>
             </View>
             

             <View style={styles.checks}>
                 <View style={styles.elections}>
                     <Text style={styles.checkText}>Codigo Origen</Text>
                     <Checkbox
                         status={parametro_checkbox ==  'codigo_origen'? 'checked' : 'unchecked'}
                          onPress={()=>setParametro_checkbox('codigo_origen')}
                     />
                 </View>
                 <View style={styles.elections}>
                     <Text style={styles.checkText}>Nombre Producto</Text>
                     <Checkbox
                         status={parametro_checkbox == 'nombre_producto' ? 'checked' : 'unchecked'}
                         onPress={()=>setParametro_checkbox('nombre_producto')}
                     />
                 </View>
                 <View style={styles.elections}>
                     <Text style={styles.checkText}>Codigo Producto</Text>
                     <Checkbox
                         status={parametro_checkbox == 'codigo_producto' ? 'checked' : 'unchecked'}
                         onPress={()=>setParametro_checkbox('codigo_producto')}
                     />
                 </View>
            </View>


             <View style={styles.buttonBox}>
                 <View style={styles.searchBtnCont}>
                     <TouchableOpacity style={styles.buttonsearch} onPress={onButton}>
                         <Text style={styles.text}>Buscar</Text><AntDesign name="search1" size={24} color="white" />
                     </TouchableOpacity>
                 </View>
                 <View style={styles.searchBtnCont}>
                     <TouchableOpacity 
                         style={styles.button} 
                         disabled={buttonactivate}
                         onPress={() => navigation.navigate('EscaneoBodega') } 
                     >
                         <Text style={styles.text}>Crear y Modificar Codigo </Text> 
                         <AntDesign name="barcode" size={24} color="white" />
                
                     </TouchableOpacity>
                 </View>
             </View>


          </ImageBackground>
      </>
  )
}






export default Bodega

const styles = StyleSheet.create({

  back: {
    width: '100%',
    height: '100%'
  },

  container_logo:{
    justifyContent: 'center',
    alignItems: 'center',
    height: '10.5%',
    width: '100%',
    
    marginTop:'7%'
   },

    logo_image:{      
      transform:[{ scale: 0.1}],

    },

    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 7,
      paddingHorizontal: 15,
      borderRadius: 50,
      elevation: 3,
      backgroundColor: 'black',
      width:"100%",
      height:'70%',
      transform: [{ scale: 0.85 }],
      marginTop: '15%',
      bottom:'35%',
      borderWidth: 5,
      borderTopColor: '#7dba06',
      borderRightColor: '#7dba06',
      borderBottomColor: '#7dba06',
      borderLeftColor: '#7dba06',
    },
    text: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
      textAlign:'center'
    },
 
  searchbarContainer: {
    marginTop: "5%",
    bottom:'-2%',
    width: "100%",
    height: '9%',
    

  },


  textInput: {
    width: '100%',
    height: '100%',
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingLeft: 20,
    backgroundColor: 'white',
  },


  checks: {
    marginTop: '1%',
    height: '22%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#708090',
    bottom:'-10%',
    borderRadius:20
    
  },
  elections: {
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color:'blue',
  },
  checkText: {
    fontSize: 20,
    color: "white"
  },
  buttonBox: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '20%',  
  },
  searchBtnCont: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom:'-111%',
  },
  homeBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    padding: 10,
    backgroundColor: '#4389F3',
    fontSize: 35,
    elevation: 10,
    borderRadius: 20,
  },
  btnText: {
    fontSize: 20,
    color: 'white',
  },
  listCard: {
    flex: 1,
    bottom: 200,
    elevation: 10,
    position: 'absolute',
    height: 200,
    width: 350,
    backgroundColor: 'white',
    borderRadius: 15,
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius:50
  },
  listHide: {
    display: 'none',
  },  
  cardText: {
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },  
  bold: {
    fontSize: 20,
  },

  Clear:{
    bottom:'-8%',

  },

  buttonn:{
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 7,
      paddingHorizontal: 15,
      borderRadius: 50,
      elevation: 3,
      backgroundColor: 'black',
      width:"100%",
      
      transform: [{ scale: 0.85 }],
      marginTop: '-5%',
      borderWidth: 5,
      borderTopColor: '#7dba06',
      borderRightColor: '#7dba06',
      borderBottomColor: '#7dba06',
      borderLeftColor: '#7dba06',
  },
  buttonsearch:{
    alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 7,
      paddingHorizontal: 15,
      borderRadius: 50,
      elevation: 3,
      backgroundColor: 'black',
      width:"100%",
      transform: [{ scale: 0.85 }],
      marginTop: '-20%',
      bottom:'50%',
      borderWidth: 5,
      borderTopColor: '#7dba06',
      borderRightColor: '#7dba06',
      borderBottomColor: '#7dba06',
      borderLeftColor: '#7dba06',
  }
})