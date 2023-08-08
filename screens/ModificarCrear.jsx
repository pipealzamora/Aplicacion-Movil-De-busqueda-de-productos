import { StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity  } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';

let parametro = [];

const ModificarCrear = ({route, navigation }) => {


  
    //const { num } = route.params
    // UseStates
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [master, setMaster] = React.useState(false);
    const [box, setBox] = React.useState(false);
    const [product, setProduct] = React.useState(false); 
    const [code, setCode] = React.useState('') 
    const [modify, setModify] = useState({ master: '', box: '', product: ''});
    const [num, setNum] = React.useState(''); 


    // UseEffect


    useEffect(() => {

        alert(route.params)
        setNum(route.params)

        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();


      }, []);

    //   ***********************************************************************

      const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setCode(data)
        alert(`Codigo ${data} escaneado correctamente`);
      };

    // *************************************************************************

    const handleCreate = async () => {
                if(master == true){
                    if(!Object.values(parametro).includes("master")){
                    let strMaster = 'master'
                    parametro.push(strMaster)
                    }
                } if(box == true){
                    if(!Object.values(parametro).includes("box")){
                    let strBox = 'box'
                    parametro.push(strBox)
                    }
                } if(product == true){
                    if(!Object.values(parametro).includes("producto")){
                    let strProducto = 'producto'
                    parametro.push(strProducto)
                    }
                }
                parametro.push(num)
                const obj = Object.assign({}, parametro);
                // console.log(obj);
                console.log(parametro);

                try {
                    await axios.post('http://201.239.17.218:105/listado', obj, {
                        haeders: {
                            'content-type': 'text/json'
                        }
                    })
                      .then((res) => {
                        // console.log(res); 
                      })
                      .catch(function (error) {
                        // console.log(error);
                      });
                } catch (error) {
                          alert("An error has occurred");
                          setIsLoading(false);
                }
    }

    // *************************************************************************************************************

    const arr = [{"master":"false","box":"false", "product":"false", "codigo":""}]

    const handleModify  = async () => {

        // arr["codigo"] = String(code)
        
            arr.map((el, val) => {
                el.codigo = String(code)

                if(master === true){
                    el.master = 'true'
                }
                else{
                    el.master = 'false'
                } 
                if(box === true){
                    el.box = 'true'
                }
                else{
                    el.box = 'false'
                } 
                if(product === true){  
                    el.product = 'true'
                }
                else{
                    el.product = 'false'
                }
            })
            // console.log(arr);

        try {
            await axios.post('http://201.239.17.218:105/barcode_post', arr, {
                haeders: {
                    'content-type': 'text/json'
                }
            })
              .then((res) => {
                  if(res.status = 200) {
                    alert('Modificacion exitosa')
                  }
              })
              .catch(function (error) {
                  alert('Error')
                // console.log(error);
              });
        } catch (error) {
                  alert("An error has occurred");
                  setIsLoading(false);
        }
    }


    //   ***********************************************************************************************************
  return (
    <View style={styles.container}> 
        <StatusBar style= 'light' />
        <View style={styles.Barcontainer}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.barCode}
                />
                
        </View> 

        <View style={styles.optionsContainer}>
            <View style={styles.options}>
                <View>
                    <Text>Master</Text>
                    <Checkbox
                        status={master ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setMaster(!master);
                        }}
                    />
                </View>

                <View>
                    <Text>Box</Text>
                    <Checkbox
                        status={box ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setBox(!box);
                        }}
                    />
                </View>

                <View>
                    <Text>Product</Text>
                    <Checkbox
                        status={product ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setProduct(!product);
                        }}
                    />
                </View>
            </View>

            <View style={styles.buttons}>
                {/* <Button title={'Modificar'} onPress={handleModify} /> */}
                <TouchableOpacity style={styles.buttonContModificar} onPress={handleModify}>
                    <Text style={styles.print} >MODIFICAR</Text>
                </TouchableOpacity>
                {scanned && 
                    // <Button style={styles.scan} title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
                   <TouchableOpacity style={styles.buttonContScan} onPress={() => setScanned(false)}>
                        <Text style={styles.print} >ESCANEAR</Text>
                   </TouchableOpacity>
                }
                {/* <Button title='CREAR' onPress={handleCreate}/> */}
                <TouchableOpacity style={styles.buttonContCrear} onPress={handleCreate}>
                    <Text style={styles.print} >CREAR</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

export default ModificarCrear

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1, 
        zIndex: 0,
        flexDirection: 'column',
    },
    scannerContainer: {
        height: '30%',
        width: '90%',
        backgroundColor: 'green',
        borderRadius: 10,
        zIndex: 1,
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingTop: 50,
        alignItems: 'center',
        width: '100%',
        height: '70%',
        zIndex: 1,
        backgroundColor: 'whitesmoke',
        position: 'absolute',
        bottom: 0,
        padding: 10,
    },
    options: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-evenly',
        alignItems: 'center',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    barCode: {
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        position: 'absolute',
    },
    Barcontainer: {
        position: 'absolute',
          top: 0,
          width: 500,
          height: 650,
      },
      buttonContModificar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        zIndex: 1,
        backgroundColor: '#4389F3',
        width: 'auto',
        height: 45,
        borderRadius: 20,
        elevation: 10,
        margin: 10,
        padding: 10,
    },
    buttonContScan: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        zIndex: 1,
        backgroundColor: '#4389F3',
        width: 'auto',
        height: 45,
        borderRadius: 20,
        elevation: 10,
        margin: 10,
        padding: 10,
    },
    buttonContCrear: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        zIndex: 1,
        backgroundColor: '#4389F3',
        width: 'auto',
        height: 45,
        borderRadius: 20,
        elevation: 10,
        margin: 10,
        padding: 10,
    },    
    print: {
        color: '#fff',
    },
    alert: {
        position: 'absolute',
        bottom: 50,
        zIndex: 1,
        width: 'auto',
        height: 'auto',
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
})