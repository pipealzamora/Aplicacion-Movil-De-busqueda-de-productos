import { StyleSheet, Text, View, TextInput, FlatList, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Icon } from 'react-native-elements'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';




const arrayImpresion = [];

const ProductosImportacion = ({route, navigation}) => {


    const {item} = route.params

    const [inputs, setInputs] = React.useState({nombre: '', master: '', box: '', product: ''});
    const [ product, setProduct ] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchQuery, setSearchQuery] = React.useState('');
    const [local, setLocal] = useState('')





    const searchFilterFunction = (text) => {
        if(text){
            const newData = product.filter(item => {
              const itemData = item.nombre ? item.nombre.toUpperCase() : ''.toLocaleUpperCase()
              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
        } else {
          setFilteredData(product)
       }
    };
 




  // UseEffect para consultar por productos dentro de la consulta de importacion anterior en Importaciones.js
  //** Dichos resultados de productos se enlistan para poder seleccionar su respectiva Master, Box y Producto y así poder 
  //** Imprimir las etiquetas correspondientes para su posterior alamacenamiento en bodega
  useEffect(() => {

      async function fetchData() {
          try {
              const listado_productos = await axios.get( `http://201.239.17.218:105/listado_productos/${item}`)
              setProduct(listado_productos.data.data);
              setFilteredData(listado_productos.data.data);
          } catch (error) {
              console.log(error);
          }
      }
      fetchData();


      async function getData() {
          try {
              const value = await AsyncStorage.getItem('local')
              if (value !== null) { 
              console.log('Value: ', value)
              setLocal(value)
              }
          } catch (err) {
              console.log(err);
          }
          try {
              await AsyncStorage.removeItem('local')
          } catch(error) {
              console.log(error)
          }
      }
      getData()


  }, [])




// ***********************************************************************************************************************************

  // Algoritmo Singularidad, evita que que se generen los objetos dentro del array mas de una vez
  if(arrayImpresion.length > 0 ){
    product.map((elem, key) => {
        console.log('product map elem: ', elem) 
        arrayImpresion[key].local = local
    })
    //console.log("no se ejecuta el insert")
  } else{
      arrayImpresion.splice(0, arrayImpresion.length)
      product.map((elem, key) => { 
          let arreglo = {"master": '', "product": '', "box": '', "estado": 'true', "codigo": elem.codigo, "local": local}
          arrayImpresion.push(arreglo)
      })
  }

  // ***********************************************************************************************************************************

  // Incorporacion de información a los objetos creados en el array segun key
  const handleChange = (name, value, key) => {
      setInputs({
        ...inputs,
        [name]: value,
      })


  // Estas condicionantes permiten determinar el estado y color identificador de las casillas Master, Box, Product quer pemiten identificar si una casilla fue editada
      if(name.toLowerCase() === 'product'){
          arrayImpresion[key].product = value
              if(arrayImpresion[key].product > 0 && arrayImpresion[key].master > 0 && arrayImpresion[key].box > 0 ) {
                  arrayImpresion[key].estado = 'true'
              }
      } else if(name.toLowerCase() === 'master'){
          arrayImpresion[key].master= value
              if(arrayImpresion[key].product > 0 && arrayImpresion[key].master > 0 && arrayImpresion[key].box > 0 ){
                  arrayImpresion[key].estado = 'true'
              }
      } else if(name.toLowerCase() === 'box'){
          arrayImpresion[key].box= value
              if(arrayImpresion[key].product > 0 && arrayImpresion[key].master > 0 && arrayImpresion[key].box > 0){
                  arrayImpresion[key].estado = 'true'
              }
      }
  };

  // **************************************************************************

  const onSubmit = () => {
      const datos = Object.assign({}, arrayImpresion);
      //Datos impresion
      //console.log(datos)
          try {
              axios.post('http://201.239.17.218:8000/api/print_test', datos, {
                  haeders: {
                      'content-type': 'text/json'
                  }
              })
              .then((res) => {
                  if(res.status = 200) {
                  alert('Impresion en progreso')
              }
              }).catch ((err) => {
                  alert(err)
              })
              } catch (error) {
                  alert("Ha ocurrido un error, vuelva a intentarlo");
                  setIsLoading(false);
              }
  }

  // **************************************************************************






  return (
    <KeyboardAvoidingView behavior="height" style={styles.productImport}>

      <View style={styles.tablaProductos}>
        <View style={styles.searchbarContainer}>
        <Searchbar
            keyboardShouldPersistTaps='handled'
            placeholder="Buscar"
            onChangeText={searchFilterFunction}
            style={styles.searchbar}
        />
        </View>
          <SafeAreaView>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Area donde se genera el mapeo de los productos encontrados en el fetch de arriba */}
             {filteredData.map((elem, key) =>
                <View style={styles.modulosContenedores} key={key} >
                  <View style={styles.productoUpContent}>
                      <Text  style={styles.nombreProducto} >{elem.nombre}</Text>
                          
                          <View style={styles.icons}>
                          <TouchableOpacity onPress={  () => { 
                                                                                      navigation.navigate('EscaneoBodega', {data : elem.codigo}) 
                                                                                  }  
                                                                                }>
                                  <Icon
                                        name='create-outline'
                                        type='ionicon'
                                        color='gray'
                                  />
                          </TouchableOpacity>                  
                          </View>
                          
                  </View>
                  <Text>CódigoProducto: {elem.codigo}</Text>
                    <View style={styles.modulos}>
                        <View style={styles.modulosCampos}>
                            <Text style={[styles.modulosOpciones, elem.master === 'false' ? styles.textRed : styles.textGreen]}>Master</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                onChangeText={text => handleChange('master', text, key)}
                                placeholder={elem.master === 'false' ? 'X' : ''}
                                editable = {elem.master === 'false' ? false : true}
                            />
                        </View>

                        <View style={styles.modulosCampos}>
                            <Text style={[styles.modulosOpciones, elem.box === 'false' ? styles.textRed : styles.textGreen]}>Box</Text>
                            <TextInput
                                keyboardType='numeric'
                                style={styles.input}
                                onChangeText={text => handleChange('box', text, key)}
                                placeholder={elem.box === 'false' ? 'X' : ''}
                                editable = {elem.box === 'false' ? false : true}
                            />
                        </View>

                        <View style={styles.modulosCampos}>
                            <Text style={[styles.modulosOpciones, elem.prod === 'false' ? styles.textRed : styles.textGreen]}>Producto</Text>
                            <TextInput
                                  keyboardType='numeric'
                                  style={styles.input}
                                  onChangeText={text => handleChange('Product', text, key)}
                                  placeholder={elem.prod === 'false' ? 'X' : '' }
                                  editable = {elem.prod === 'false' ? false : true}
                            />
                        </View>
                    </View>
                </View>
              )}
           </ScrollView> 
          </SafeAreaView>
        <TouchableOpacity style={styles.buttonCont} onPress={onSubmit}>
                  <Text style={styles.print} >Imprimir</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ProductosImportacion

const styles = StyleSheet.create({
    productImport : {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'darkslategrey',
      
    },
    title: {
        fontSize: 18,
        color: 'white',
    },
    inputBusqueda: {
        width: '80%',
        alignItems: 'center',
        borderRadius: 60,
        height: 'auto',
        marginBottom: 60,
        padding: 10,
    },
    tablaProductos: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '80%',
        width: '85%',
        padding: '11%',
        marginTop:'-3%',
    },
    productoUpContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    icons: {
      display: 'flex',
      flexDirection: 'row',
      width: 'auto',
      alignItems: 'center',
    },
    nombreProducto: {
      width: 200,
      marginBottom: 5,
      fontSize: 20,
      paddingBottom: 5,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.3,
    },
    textRed: {
      color: 'red',
    },
    textGreen: {
      color: 'green',
    },
    modulosContenedores: {
      width: '100%',
      height: 'auto',
      marginBottom: 20,
      padding: 20,
      borderRadius: 4,
      backgroundColor: 'white',
      borderColor: 'gray',
      borderWidth: 0.3,
    },
    scrollView: {
      width: 310,
    },
    modulos: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: 20,

    },
    modulosCampos: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      height: 25,
      width: 35,
      margin: 12,
      borderWidth: 1,
      borderRadius: 5,
      fontSize: 15,
      padding: 2,
      textAlign: 'center',
    },
    modulosOpciones: {
      fontSize: 18,
    },
    buttonCont: {
      zIndex:1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bottom:'-13%',
      marginTop:'35%',
      backgroundColor: 'black',
      width: '80%',
      height: '-10%',
      borderRadius: 20,
      borderWidth: 5,
      borderTopColor: '#7dba06',
      borderRightColor: '#7dba06',
      borderBottomColor: '#7dba06',
      borderLeftColor: '#7dba06',
        
    },
    
    print: {
      color: '#fff',
      fontSize: 20,
    },
    flat: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignContent: 'center',
      width: '90%',    
      margin: 10,
      padding: 'auto',
    },
    bloqued: {
      backgroundColor: 'gray',
      width: '100%',
      height: 'auto',
      marginBottom: 20,
      borderRadius: 25,
      padding: 20,
      borderColor: 'gray',
      borderWidth: 0.3,
    },
    searchbarContainer: {
      marginBottom: 90,
    },
    searchbar: {
      width: 330,
    },
})