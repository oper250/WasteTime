import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../common/CommonCss";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import { TextInput } from "react-native-gesture-handler";
import cs from "../../common/CommonCss";
import * as cu from "../../common/CommonUtil";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CommonActions } from "@react-navigation/native";

function JoinForm({navigation, route}) {
    const nameRef = useRef(null);
    const emailInputRef = useRef(null);
    const nicknameInputRef = useRef(null);
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');

    const onPressBack = () => {
        navigation.goBack();
    }

    const onPressNext = () => {
        if(!validateChk()) { return }
        sendVerificationEmail();
        navigation.navigate("JoinEmailCheckForm", {'email': email, 'nickname': nickname});
    }

    // 인증 메일 전송
    const sendVerificationEmail = () => {
        const param = {'email': email};
        cu.callApi(navigation, '/user/sendVerificationEmail', param, 'post', null, (data) => {
            if(data.rsMsg == "0000") { console.log(' >>> 메일 발송 성공')}
        });
    }

    const validateChk = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            Alert.alert("유효하지 않은 이메일 형식입니다.");
            return false;
        }

        if (!nickname.trim()) {
            Alert.alert("닉네임을 입력해 주세요.");
            return false;
        }

        return true;
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
                        <Text style={{ fontSize: 30, fontWeight: "bold", }}>계정을 생성하세요</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', }}>
                        <TextInput style={[cs.textInput, { marginTop: 40, }]}
                            placeholder="이메일"
                            placeholderTextColor={'#aaa'}
                            ref={emailInputRef}
                            returnKeyType="next"
                            onChangeText={setEmail}
                            onSubmitEditing={() => nicknameInputRef.current.focus()}>
                        </TextInput>
                        <TextInput style={[cs.textInput, { marginTop: 40, }]}
                            placeholder="닉네임"
                            placeholderTextColor={'#aaa'}
                            ref={nicknameInputRef}
                            returnKeyType="done"
                            onChangeText={setNickname}
                            onSubmitEditing={onPressNext}>
                        </TextInput>
                    </View>
                </View>
                <View style={{height: 80,}}>
                    <Pressable style={cs.nextButton} onPress={onPressNext}>
                        <Text style={cs.nextButtonText}>다음</Text>
                    </Pressable>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}    

export default JoinForm;