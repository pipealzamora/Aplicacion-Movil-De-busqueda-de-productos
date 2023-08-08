import { StyleSheet, ImageBackground,Text, View, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { width } from '@mui/system';




const Importaciones = ({ navigation }) => {


  // UseStates
  // Este primer useState permite setear las informacion obtenida del fetch de listado de importaciones  
  const [ coins, setCoins ] = useState([])
  // Este useState permite seleccionar y a una importacion dentro de la lista  
  const [selectedId, setSelectedId] = useState(null);


  const [store, setStore] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [DataModal, setDataModal] = useState([]);
  const [disabled, setDisabled] = useState(true)
  const [check_truper,setChecktruper] =useState(false)
  const [check_ecosa, setCheckecosa] = useState(false);
  const [stylever, setStylever] = useState(styles.buttondisable)
  


  /*SELECCION DE IMPRESORA*/
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

const clear_storage  = async() => {
  try{
    await AsyncStorage.removeItem('local')
  }catch(e){
    alert(e)
  }
}


  const storeDataTruper = async() => {
        setChecktruper(true)
        setCheckecosa(false)
        setDisabled(false)
        setStylever(styles.buttonactivate)
      try {
        await AsyncStorage.removeItem('local')
        await AsyncStorage.setItem('local', 'truper')
        //printAsyncStorage()
      } catch(e) {
        alert(e)
      } 
    }


  const storeDataEcosa = async() => {
        setDisabled(false)
        setCheckecosa(true)
        setChecktruper(false)
        setStylever(styles.buttonactivate)
    try {
        await AsyncStorage.removeItem('local')
        await AsyncStorage.setItem('local', 'ecosa')
        //printAsyncStorage()
      } catch(e) {
        alert(e)
      }
  }

/* FIN SELECCION DE IMPRESORA*/


  

  // Obtención del listado de importaciones   
  useEffect(() => {
      async function fetchData() {
          const URL = 'http://201.239.17.218:105/listado_orden_de_compra';
            try {
              const ans = await axios.get(URL)
              setCoins(ans.data.data);
            } catch (error) {
              alert(error);
            }
      }
        fetchData();
  }, [])




const importacion_function = () => {
  //navigation.navigate('ProductosImportacion', { item: item.id})

}



/*LISTADO DE IMPORTACIONES*/
  const Item  = ({item, textColor }) => {
      return(
          <View style={styles.content}>
              <TouchableOpacity onPress={() => {
                setModalVisible(true)
                setDataModal(item)
                setSelectedId(item.id)
              }} style={[styles.item]}>
                  <Text title={item.name} style={[styles.title, textColor]}>{`${item.numero}`}</Text>
                  <Text style={styles.proveedor}>{`${item.razon_social}`}</Text>
                  </TouchableOpacity>
          </View>
      )
  }


  const renderItem = ({ item }) => {
      return (
          <Item
              style={styles.flat}
              item={item}
              //onPress={() => setSelectedId(item.id) }
          />
     );
  };

/*FIN LISTADO IMPORTACIONES*/





  
  return (
  <>
      <ImageBackground style={styles.home} source={require('../assets/fondo5.jpg')} blurRadius={modalVisible ? 4 : 0}>

        <View style={styles.importContainer}>
        
            {modalVisible ? ( 
            <Modal 
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.mymodal}>
                    <View>

                        <Text style={styles.social}>Razon Social:{DataModal.razon_social}</Text>
                        <Text style={styles.number}>Número:{DataModal.numero}</Text>
                        <Text style={styles.prox}>Fecha De Llegada:{DataModal.fecha_de_llegada}</Text>


                        <View style={styles.buttonContainer}>
                         <Text style={styles.impresion} >Opciones de impresion</Text>

                              <View style={styles.check}>
                                  <TouchableOpacity style={check_truper ? styles.showcheck : styles.blockcheck}  onPress={storeDataTruper}
                                        >
                                        <Text style={styles.print} >BODEGA TRUPER</Text>
                                        
                                 </TouchableOpacity>
                                 <Ionicons style={check_truper ? styles.checkstyle:styles.checknone} name="md-checkmark-circle" size={32} color="green" />
                              </View>


                              <View style={styles.check}>
                                 <TouchableOpacity style={check_ecosa ? styles.showcheck : styles.blockcheck} onPress={storeDataEcosa}>
                                    <Text style={styles.print} >BODEGA ECOSA</Text>
                                    
                                 </TouchableOpacity>
                                 <Ionicons style={ check_ecosa ? styles.checkstyle:styles.checknone } name="md-checkmark-circle" size={32}  color="green" />
                              </View>

                         </View>

                         <View>
                              <TouchableOpacity disabled={disabled} style={stylever} activeOpacity={disabled ? 0.3 :0.7 } onPress={() =>{
                                    navigation.navigate('ProductosImportacion', {item: selectedId})
                                    setModalVisible(false)
                                    setDisabled(true)
                                  }}
                              >
                                <Text style={styles.ver} >Ver</Text>
                             </TouchableOpacity>

                              <TouchableOpacity style={styles.buttonContt} onPress={() => {
                                setModalVisible(false)
                                setDisabled(true)
                                setChecktruper(false)
                                setCheckecosa(false)
                                setStylever(styles.buttondisable)
                                
                              }}>
                                  <Text style={styles.close} >Cerrar</Text>
                              </TouchableOpacity>
                          </View>

                        </View>
                  </View>
              </Modal>
          ) : null}


       {/* Título */}
       <View style={styles.importTitle}>
           <Text style={styles.text}>Listado Importaciones</Text>
       </View>
        {/* Tabla informacion importaciones */}
       <View style={styles.tablaImport}>
          <SafeAreaView style={styles.container}>
              <FlatList
                style={styles.flat}
                data={coins}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
              />
          </SafeAreaView>
       </View>
       
    </View>
    </ImageBackground>
    </>

  )
}

export default Importaciones


//Styles
const styles = StyleSheet.create({

  
    importContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop:'5%',
        height:'100%',
        width:'100%',
        
    },
    importTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        marginBottom: '25%',
        backgroundColor: '',
        width: '90%',
        height: '10%',
        borderRadius: 15,
        elevation: 20,
        backgroundColor: 'black',
        marginTop:'20%',
        borderWidth: 5,
        borderTopColor: '#7dba06',
        borderRightColor: '#7dba06',
        borderBottomColor: '#7dba06',
        borderLeftColor: '#7dba06',
    },
    tablaImport: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        height: '60%',
        width: '100%',
        borderRadius: 15,
        padding: 5,
        overflow:'hidden',
        marginBottom:'50%',
        colortext:'#0a8a00',
    },
    flatTable : {
        width: '100%',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        width: '100%', 
        marginBottom: '5%',   
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 25,
        borderWidth: 0.1,
    },
    flat: {
        width: '100%',
    },
    itemTitle: {
        fontSize: 25,
    },
     
    item: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      width: '100%',
    },
    proveedor: {
      fontSize: 10,
      textAlign: 'center',
    },
    title: {
      fontSize: 15,
    },
    text: {
        color: '#fff'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: '25%',
        width: '50%',
        marginTop: '5%',
        marginBottom: '20%',
        bottom:'-5%',
    },
   
    print:{
      color:'white',
    textAlign:'center',
    },

    mymodal:{
    paddingHorizontal:40,
    paddingVertical:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 10,
    borderRadius:10,
    margin:'20%',
    height:'80%',
    width:'100%',
    right:'20%',
    bottom:'-5%',
    borderWidth: 5,
    borderTopColor: '#7dba06',
    borderRightColor: '#7dba06',
    borderBottomColor: '#7dba06',
    borderLeftColor: '#7dba06',
    },

    social:{
      justifyContent: 'center',
      alignItems: 'center',
      textAlign:'center',
      marginBottom:'-1%',
      padding:'1%',
      
      

    },
    number:{
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
    marginBottom:'-1%',
    padding:'6%',
    },

    prox:{
      justifyContent: 'center',
      alignItems: 'center',
      textAlign:'center',
      marginBottom:'-1%',
      padding:'6%',
    },

    close:{
      color:'white',
    },

    ver:{
      color:'white',
    },

    buttonContt:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '-30%',
    left:'12%',
    backgroundColor: 'red',
    width: '75%',
    height: 45,
    borderRadius: 20,
   
    
    },
    home: {
      width: '100%',
      height: '100%'
  },

    buttondisable:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '-15%',
    left:'12%',
    backgroundColor: 'gray',
    width: '75%',
    height: '25%',
    borderRadius: 20,
    

    
    },
    buttonactivate:{
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     bottom: '-15%',
     left:'12%',
     backgroundColor: 'green',
     width: '73%',
     height: '25%',
     borderRadius: 15,
     
      
    },
    check:{
      flexDirection: 'row',
      left:'12%'
    },
    
    blockcheck:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: '-25%',
        left:'35%',
        backgroundColor: 'black',
        width: '150%',
        height: '80%',
        borderRadius: 20,
        
        

    },
    showcheck:{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: '-25%',
      left:'40%',
      backgroundColor: 'black',
      width: '150%',
      height: '80%',
      borderRadius: 20,
      
        
    },

   checkstyle:{
    display:'flex',
    left:'50%',
    bottom:'-30%'
   },
   checknone:{
    display:'none'
   }
})