import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../common/CommonCss";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import { TextInput } from "react-native-gesture-handler";
import cs from "../../common/CommonCss";
import * as cu from "../../common/CommonUtil";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function JoinEmailCheckForm({navigation, route}) {

    const [verifyCode, setVerifyCode] = useState('');

    const onPressBack = () => {
        navigation.goBack();
    }

    const onPressNext = () => {
        if (!verifyCode.trim() || verifyCode.length != 6) {
            Alert.alert("인증코드가 정확하지 않습니다.");
            return;
        }

        var param = {'email': route.params.email, 'verifyCode': verifyCode};

        cu.callApi(navigation, '/user/chkEmailVerifyCode', param, 'post', null, (data) => {
            if(data.verifyResult == "Y") {
                console.log("인증코드 일치");
                navigation.navigate("JoinPasswordForm", {'email': route.params.email, 'nickname': route.params.nickname});
            } else {                      
                Alert.alert("인증코드가 일치하지 않습니다.");
                console.log("인증코드 불일치");
            }
        });
    }

    return (
        <SafeAreaView style={cs.notabContainer}>
            <KeyboardAwareScrollView
                style={cs.container}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
                keyboardShouldPersistTaps='handled'
            >
            <View style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                <Pressable onPress={onPressBack} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', }}>
                    <Ionicons name="arrow-back" color={'black'} size={30} />
                </Pressable>
            </View>
            <View style={{ flex: 1,}}>
                <View style={{ height: 100, paddingTop: 20, paddingLeft: 20, }}>
                    <View>
                        <Text style={{ fontSize: 30, fontWeight: "bold", }}>코드를 보내 드렸습니다.</Text>
                    </View>
                    <View style={{marginTop: 10,}}>
                        <Text style={{ fontSize: 15, color: 'gray', }}>{route.params?.email + ' 인증을 위해 아래에 입력하세요.'}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', }}>
                    <TextInput 
                        style={[cs.textInput, { marginTop: 10, }]}
                        placeholder="인증코드"
                        placeholderTextColor={'#aaa'}
                        returnKeyType="done"
                        onChangeText={setVerifyCode}
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

export default JoinEmailCheckForm;