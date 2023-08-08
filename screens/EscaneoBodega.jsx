import { Dimensions,StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Pressable  } from 'react-native'
import React, { useState, useEffect, useReducer } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { Extrapolate, interpolate, interpolateColor, log, useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated';
import Fab from "./ButtonActions.jsx";
import { AntDesign } from '@expo/vector-icons';
import { fontSize } from '@mui/system';
import zIndex from '@mui/material/styles/zIndex.js';


const EscaneoBodega = ({navigation}) => {



    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [code, setCode] = React.useState('') 

    const [master, setMaster] = React.useState(false);
    const [box, setBox] = React.useState(false);
    const [product, setProduct] = React.useState(false); 


    const [cantidad, setCantidad] = useState('')
    const [producto, setProducto] = useState({})
    const [data_fab, setDatafab] = useState([])
    


    /*UseEffect*/
    useEffect(() => {
          permisos_camara()
          //printAsyncStorage()
          GetDataProLocalStorage()
    }, [] );
    /*FIN UseEffect*/

    /*UseEffect*/
    useEffect(() => {
        prepare_data_api()
    });
    /*FIN UseEffect*/

    const permisos_camara = async () => {
         const { status } = await BarCodeScanner.requestPermissionsAsync();
         setHasPermission(status === 'granted');
    };    





          const printAsyncStorage = () => {
            AsyncStorage.getAllKeys((err, keys) => {
              AsyncStorage.multiGet(keys, (error, stores) => {
                let asyncStorage = {}
                stores.map((result, i, store) => {
                  asyncStorage[store[i][0]] = store[i][1]
                });
                console.log(asyncStorage)
              });
            });
          };

        const GetDataProLocalStorage = async() => {
            try {
                const codigo_de_barras = await AsyncStorage.getItem('producto_ean13')
                const producto_descripcion = await AsyncStorage.getItem('producto_descripcion')
                const producto_id = await AsyncStorage.getItem('producto_id')
                setProducto( {"producto_id": producto_id, "producto_descripcion": producto_descripcion, "producto_codigo_de_barras": codigo_de_barras,  });
                } catch (err) {
                    console.log(err);
                }}




        const prepare_data_api = async () => {
            try{
                const print_data = await handlePrint();
                const create_data = await handleCreate();
                const modify_data = await handleModify();
                const producto_data = ({producto})["producto"]
                const data_api = JSON.stringify({"producto_data": producto_data, 'data_print': print_data, 'data_crear': create_data, 'data_modificar': modify_data})
                //console.log(data_api)
                await AsyncStorage.removeItem('data_api')
                await AsyncStorage.setItem('data_api', data_api)
            }
            catch(err){
             alert(err)    
            }

        };






/*handleBarCodeScanned*/
    const handleBarCodeScanned = async({ type, data }) => {
        setScanned(true);
        setCode(data)
        alert(`Codigo ${data} escaneado correctamente`);
      };
/*FIN handleBarCodeScanned*/


/*handleText*/
    const handleText = (text) => {
        setCantidad(text.toUpperCase())
    }
/*FIN handleText*/








  



/*handleCreate*/
    const handleCreate = async () => {
        const array_crear = [{"checkedBox": "", "cantidad":"", "id": "" }];
        array_crear.map((value, key) => {
            if(master == true){
                value.checkedBox = "master"
            } 
            if (box == true ) {
                value.checkedBox = "box"
            } 
            if (product == true) {
                value.checkedBox = "product"
            }
                value.cantidad = cantidad
                value.id = producto.id
            });   
            let data_crear = (array_crear[0])
        return data_crear;
    }
/*FIN handleCreate*/
 



/*handleModify*/
    const handleModify  = async () => {
        const array_modificar = [{"master":"false","box":"false", "product":"false", "id": "", "cantidad": ""}]
        array_modificar.map((value, key) => {
            value.id = producto.id
            value.cantidad = cantidad
            if(master === true){
                value.master = 'true'
            }
            else{
                value.master = 'false'
            } 
            if(box === true){
                value.box = 'true'
            }
            else{
                value.box = 'false'
             } 
             if(product === true){  
                value.product = 'true'
            }
            else{
                value.product = 'false'
            }
        })  
        const data_modificar = (array_modificar[0])
        return data_modificar;

    }
/* FIN handleModify*/



/*
EMEPLO DEL ARREGLO QUE DEBO CREAR PARA IMPRIMIR.
  
  const data_print = {
      "data": {
               "1": {"box": "", "master": "", "printer": "DEFAULT", "product": "", "producto_id": "81838"},
               "2": {"box": "", "master": "", "printer": "DEFAULT", "product": "", "producto_id": "81838"}
              }
  }
  

*/


/*handlePrint*/
    const handlePrint = () => {


        const values = []

        let array_print = { "producto_id": "", "master": "", "product": "", "box": "", "printer": "DEFAULT"}
        master == false ? array_print.master = "" : array_print.master = cantidad; 
        box == false ? array_print.box = "" : array_print.box = cantidad; 
        product == false ? array_print.product = "" : array_print.product = cantidad;
        array_print.producto_id = producto.producto_id
        values.push(array_print) 
        const data = Object.assign({}, {'data': {"producto_1":values[0]}});
        const data_print = (data)
        return  data_print;
    }
/*FIN handlePrint*/








  return (
    <>
    <View style={styles.container}>
        <StatusBar style= 'light' />
         <Fab  style={styles.fab}  />

        <View style={styles.Barcontainer}>
                <BarCodeScanner
                    onBarCodeScanned={scanned == true ? undefined : handleBarCodeScanned}
                    style={styles.barCode}
                />        
        </View>

        <View style={styles.retryscan}>
            <TouchableOpacity onPress={() => setScanned(false)}>
                <Text style={styles.retry}>Escanear</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>

            <View style={styles.options}>
                <View style={styles.checkin}>
                    <Text style={styles.box}>Master</Text>
                    <Checkbox
                        status={master ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setMaster(!master);
                        }}
                    />
                </View>

                <View style={styles.checkin}>
                    <Text style={styles.box}>Box</Text>
                    <Checkbox
                        status={box ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setBox(!box);
                        }}
                    />
                </View>

                <View style={styles.checkin}>
                    <Text style={styles.box}>Product</Text>
                    <Checkbox 
                        status={product ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setProduct(!product);
                        }}
                    />
                </View>
            </View>

            <View>
                <Text style={styles.cantidad}>Cantidad</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={text => handleText(text)}
                />
            </View>

            <View style={styles.buttons}>
            <AntDesign name="printer" size={24}    color="green" /><Text style={styles.icon}>imprimir</Text> 
            <AntDesign name="barcode" size={24} color="green" /><Text style={styles.icon}>Crear</Text>
            <AntDesign name="edit" size={24}         color="green" /><Text style={styles.icon}>Editar</Text>
            </View>
        </View>
    </View>
    </>
  )
}

export default EscaneoBodega

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1, 
        zIndex: 0,
        flexDirection: 'column',
    },
    scannerContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    optionsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingTop: 50,
        alignItems: 'center',
        width: '100%',
        height: '70%',
        zIndex: 0,
        backgroundColor: 'whitesmoke',
        position: 'absolute',
        bottom: 0,
        padding: 10,
    },
    options: {
        backgroundColor: 'black',
        borderRadius: 15,
        padding: 10,
        bottom:'10%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-evenly',
        alignItems: 'center',
        borderWidth: 5,
        borderTopColor: '#7dba06',
        borderRightColor: '#7dba06',
        borderBottomColor: '#7dba06',
        borderLeftColor: '#7dba06',
    },
    buttons: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
        height: '50%',
        bottom:'10%',
        right:'-5%'
        
    },
    barCode: {
        bottom: '1%',
        width: '100%',
        height: '150%',
        zIndex: 0,
        position: 'absolute',
    },
    Barcontainer: {
        position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
      },

    print: {
        color: '#fff',
    },
    alert: {
        position: 'absolute',
        bottom: 50,
        zIndex: 0,
        width: 'auto',
        height: 'auto',
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 20,
        
    },
    input: {
        height: '25%',
        width: '-60%',
        margin: 12,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 15,
        padding:1 ,
        bottom:'75%',
        left:'35%',
        textAlign: 'center',
        borderColor:'white',
        backgroundColor:'white'
    },
    icon:{
        color:'black',
        textAlign:'center',
        flex:1,
    },

    cantidad:{
        textAlign:'center',
        color:'white',
        left:'35%',
        bottom:'70%'
    },
    box:{
        color:'white',
    },
    checkin:{
        right:'70%'
    },
    retry:{
        color:'white',
        fontSize:15,
        bottom:'5%',
        textAlig:'center',
        fontWeight: 'bold',
    },
    retryscan:{
        zIndex:1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom:'1%',
        marginTop:'14%',
        backgroundColor: 'black',
        width: '35%',
        height: '9%',
        borderRadius: 20,
        borderWidth: 5,
        borderTopColor: '#7dba06',
        borderRightColor: '#7dba06',
        borderBottomColor: '#7dba06',
        borderLeftColor: '#7dba06',
    }
})