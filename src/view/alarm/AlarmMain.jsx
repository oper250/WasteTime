import React, { useRef } from "react";
import { Dimensions, Image, Pressable, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cs from "../../common/CommonCss";
import Ionicons from "react-native-vector-icons/Ionicons"; 

function AlarmMain() {

    const onPressBack = () => {
      navigation.goBack();
    }

    return (
        <SafeAreaView style={cs.container}>
            <View style={{width: '100%', height: 80, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, }}>
                <Pressable onPress={onPressBack} style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center',}}>
                    <Ionicons name="arrow-back" color={'black'} size={30}/>
                </Pressable>
            </View>
        </SafeAreaView>
    )
};


export default AlarmMain;
