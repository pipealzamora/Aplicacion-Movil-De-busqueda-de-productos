import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Pressable, StatusBar } from 'react-native'
import React, {useEffect, useState} from 'react'
import { BlurView } from 'expo-blur';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Home = ({ navigation }) => {


    useEffect(() => {
        AsyncStorage.clear();
    }, []);


 
  return (
   
    <ImageBackground style={styles.home} source={require('../assets/fondo5.jpg')} >
     <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#808080" translucent = {true}/>

        <BlurView intensity={80} tint="light" style={styles.container_logo}>
            <Image style={styles.logo_image}
            source={require('../assets/footer-logo.png')}
            
         />
        </BlurView>

        <View style={styles.homeButtons}>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bodega')}>
                <Text style={styles.text}>Busqueda Bodega</Text><FontAwesome5 name="box" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Importaciones')}>
                <Text style={styles.text}>Busqueda Importaciones</Text><AntDesign name="dropbox" size={24} color="white" />
            </TouchableOpacity>
            
        </View>

        <View style={styles.homeFooter}>
            <Text style={styles.footerText}>Powered By</Text>
            <Text style={styles.footerText}>Fenix Software</Text>
        </View>

    </ImageBackground>
        
  )
}

export default Home

const styles = StyleSheet.create({

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 50,
        elevation: 3,
        backgroundColor: 'black',
        width:"100%",
        transform: [{ scale: 0.85 }],
        marginTop: 24,
        borderWidth: 5,
        borderTopColor: '#7dba06',
        borderRightColor: '#7dba06',
        borderBottomColor: '#7dba06',
        borderLeftColor: '#7dba06',
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },

    container_logo:{
    justifyContent: 'center',
    alignItems: 'center',
    height: '10.5%',
    width: '100%',
    borderRadius: 0,
    marginTop:24
    },

    logo_image:{
     transform: [{ scale: 0.1 }],
    },
    home: {
        width: '100%',
        height: '100%'
    },
    logo: {
        marginTop: 35,
        fontSize: 35,
    },
    homeButtons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },
    btnText: {
        color: 'white',
    },
    homeFooter: {
       
    },
    footerText: {
        textAlign: 'center',
        color: 'white',
    },



})









