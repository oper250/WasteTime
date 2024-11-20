import React from "react";
import { Dimensions, Image, Pressable, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cs from "../../common/CommonCss";
import Ionicons from "react-native-vector-icons/Ionicons"; 


function LoginMain({ navigation, route }) {
    const onPressKakaoLogin = () => {
        console.log("~~~~~~~있자나!!!!!!");
    }

    const onPressGoogleLogin = () => {

    }

    const onPressBack = () => {
        navigation.goBack();
    }

    const onPressEmailLogin = () => {
        navigation.navigate("LoginForm");
    }

    const onPressEmailJoin = () => {
        navigation.navigate("JoinForm");
    }

    return (
        <SafeAreaView style={cs.notabContainer}>
            <View style={{width: '100%', height: 80, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, }}>
                <Pressable onPress={onPressBack} style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center',}}>
                    <Ionicons name="arrow-back" color={'black'} size={30}/>
                </Pressable>
            </View>
            <View style={{flex: 1, paddingTop: 20, justifyContent: 'center'}}>
                <View style={{alignItems: 'center',}}>
                    <Text style={{fontSize: 50, fontFamily: 'Dongle-Regular', }}>{'희망서랍'}</Text>
                </View>
                <View style={{alignItems: 'center', marginTop: 30,}}>
                    <Text style={{ fontSize: 15, color: 'gray', }}>{'회원가입으로 비스킷의 모든 기능을 활용하세요.'}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 40,}}>
                <TouchableOpacity activeOpacity={0.8} onPress={onPressKakaoLogin} style={{width: 60, height: 60, marginHorizontal: 20,}}>
                    <Image style={{width: '100%', height: '100%', borderRadius: 25,}} 
                        source={require('../../resources/images/kakaoIcon.png')} 
                    />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={onPressGoogleLogin} style={{width: 60, height: 60, marginHorizontal: 20,}}>
                    <Image style={{width: '100%', height: '100%', borderRadius: 25,}} source={require('../../resources/images/googleIcon.png')}  />
                </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', marginTop: 20, position: 'relative'}}>
                    <Text style={{borderWidth: 1, borderColor: '#ddd', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 20,}}>{'3초만에 빠른 회원가입'}</Text>
                    <View style={cs.triangle}></View>
                </View>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', }}> 
                <View style={{height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                    <TouchableOpacity onPress={onPressEmailLogin} style={{}}>
                        <Text style={{color: 'blue'}}>{'E-mail 로그인하기 / '}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressEmailJoin} style={{}}>
                        <Text style={{color: 'blue'}}>{'회원가입'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    bubble: {
        width: 200,
        height: 200,
        backgroundColor: '#fff', // 배경색
        borderRadius: 25,
        justifyContent: 'flex-start', // 삼각형을 위쪽에 위치시키기 위해
        position: 'relative', // 삼각형을 절대 위치로 설정하기 위해
        shadowColor: '#000', // 그림자 효과
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // 안드로이드에서 그림자 효과
    },
    triangle: {
        position: 'absolute',
        top: -30, // 정사각형의 상단에 위치
        left: '50%', // 가운데 정렬
        marginLeft: -15, // 삼각형의 너비의 절반으로 이동
        width: 0,
        height: 0,
        borderLeftWidth: 15, // 삼각형의 왼쪽 변
        borderRightWidth: 15, // 삼각형의 오른쪽 변
        borderBottomWidth: 30, // 삼각형의 높이
        borderLeftColor: 'transparent', // 왼쪽 변 색상
        borderRightColor: 'transparent', // 오른쪽 변 색상
        borderBottomColor: '#fff', // 삼각형의 색상
    },
});

export default LoginMain;