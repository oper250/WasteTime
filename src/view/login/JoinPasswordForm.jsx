import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../common/CommonCss";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import { TextInput } from "react-native-gesture-handler";
import cs from "../../common/CommonCss";
import * as cu from "../../common/CommonUtil";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CommonActions } from "@react-navigation/native";

function JoinPasswordForm({navigation, route}) {
    const [password, setPassword] = useState('');

    const onPressBack = () => {
        navigation.goBack();
    }

    const onPressDone = () => {
        var param = {
            'email' : route.params.email,
            'nickname' : route.params.nickname,
            'password' : password,
        }

        cu.callApi(navigation, '/user/joinWithEmail', param, 'post', null, (data) => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0, // 이동할 화면의 인덱스
                    routes: [
                        { name: 'BottomTabScreen' }, // 첫 번째 화면의 이름
                    ],
                })
            );
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
                        <Text style={{ fontSize: 30, fontWeight: "bold", }}>비밀번호가 필요합니다</Text>
                    </View>
                    <View style={{marginTop: 10,}}>
                        <Text style={{ fontSize: 15, color: 'gray', }}>8자 이상이어야 합니다.</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', }}>
                    <TextInput 
                        style={[cs.textInput, { marginTop: 10, }]}
                        placeholder="비밀번호"
                        placeholderTextColor={'#aaa'}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        returnKeyType="done"
                        onSubmitEditing={onPressDone}>
                    </TextInput>
                </View>
            </View>
            <View style={{height: 80,}}>
                <Pressable style={cs.nextButton} onPress={onPressDone}>
                    <Text style={cs.nextButtonText}>가입</Text>
                </Pressable>
            </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default JoinPasswordForm;