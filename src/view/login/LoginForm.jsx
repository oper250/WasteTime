import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../common/CommonCss";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import { TextInput } from "react-native-gesture-handler";
import cs from "../../common/CommonCss";
import * as cu from "../../common/CommonUtil";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStore from "../../common/store/useStore";
import { CommonActions } from "@react-navigation/native";

function LoginForm({navigation, route}) {
    const usernameRef = useRef(null);
    const passwrodRef = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { userInfo, setMyInfo, clearUserInfo } = useStore();

    const onPressBack = () => {
        navigation.goBack();
    }

    const onPressLogin = () => {
        const param = new FormData();
        param.append('username', username);
        param.append('password', password);

        cu.callApiFormData(navigation, '/login', param, 'post', null, async (data, headers) => {
            const token = headers['authorization'];

            if(token && data.refreshToken != null) {
                const nickname = data.userInfo.nickname;
                const jwtToken = token.split(' ')[1];

                await AsyncStorage.setItem('jwtToken', jwtToken);               // 액세스토큰 세팅
                await AsyncStorage.setItem('refreshToken', data.refreshToken);  // 리프래쉬토큰 세팅
                setMyInfo(data.userInfo);                                       // 사용자정보 세팅
                cu.showToast(nickname + '님 로그인 되었습니다.');            
                goMainScreen();                                                 // 메인화면으로 가기
            } else {
                Alert.alert('로그인에 실패하였습니다.');
            }
        });
    }

    const goMainScreen = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0, // 이동할 화면의 인덱스
                routes: [
                    { name: 'BottomTabScreen' }, // 첫 번째 화면의 이름
                ],
            })
        );
    }

    return (
        <SafeAreaView style={cs.notabContainer}>
            <KeyboardAwareScrollView
                style={cs.container}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
                keyboardShouldPersistTaps='handled'
                extraScrollHeight={120} // 키보드가 올라올 때 추가로 스크롤할 높이
            >
                <View style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Pressable onPress={onPressBack} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', }}>
                        <Ionicons name="arrow-back" color={'black'} size={30} />
                    </Pressable>
                </View>
                <View style={{ flex: 1, }}>
                    <View style={{ height: 100, paddingTop: 20, paddingLeft: 20, }}>
                        <View>
                            <Text style={{ fontSize: 30, fontWeight: "bold", }}>{'시작하려면 계정을 먼저'}</Text>
                        </View>
                        <View style={{marginTop: 10,}}>
                            <Text style={{ fontSize: 30, fontWeight: "bold", }}>{'입력하세요'}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', }}>
                        <TextInput style={[cs.textInput, { marginTop: 40, }]}
                            placeholder="이메일 주소"
                            placeholderTextColor={'#aaa'}
                            ref={usernameRef}
                            returnKeyType="next"
                            onChangeText={setUsername}
                            onSubmitEditing={() => passwrodRef.current.focus()}>
                        </TextInput>
                        <TextInput style={[cs.textInput, { marginTop: 40, }]}
                            placeholder="비밀번호"
                            placeholderTextColor={'#aaa'}
                            ref={passwrodRef}
                            returnKeyType="done"
                            secureTextEntry={true}
                            onChangeText={setPassword}
                            onSubmitEditing={onPressLogin}>
                        </TextInput>
                    </View>
                </View>
                <View style={{height: 80,}}>
                    <Pressable style={cs.nextButton} onPress={onPressLogin}>
                        <Text style={cs.nextButtonText}>로그인</Text>
                    </Pressable>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default LoginForm;    