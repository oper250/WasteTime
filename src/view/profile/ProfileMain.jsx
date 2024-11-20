import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Pressable, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cs from "../../common/CommonCss";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import Feather from "react-native-vector-icons/Feather";
import { CommonOptionSheet, ReplyBottomSheet } from "../../common/CommonView";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import useStore from "../../common/store/useStore";
import * as cu from "../../common/CommonUtil";

function ProfileMain({navigation, route}) {
    const optionSheetRef = useRef(null);
    const replySheetRef = useRef(null);
    const [userSeq, setUserSeq] = useState('');
    const [nickname, setNickname] = useState('');
    const [profileUrl, setProfileUrl] = useState('');
    const [introDesc, setIntroDesc] = useState('');

    const { isMine, setIsMine, clearIsMine, myInfo } = useStore();

    useEffect(() => {
        if (route.param?.userSeq == myInfo.userSeq) {
            setIsMine(true);
        } else {
            setIsMine(false);
        }

        getUserInfo();

        console.log("~!~!33~!", myInfo);
    }, []);

    const getUserInfo = () => {


        if(route.params?.userSeq != undefined) {
            console.log("!!!!!!!");
        } else {
            console.log("2222");
            console.log("333" , myInfo.userSeq);
        }

        let param = {
          userSeq: route.params?.userSeq != undefined ? route.params?.userSeq : myInfo.userSeq,
        };

        console.log("!!", param);
    
        cu.callApi(navigation, '/main/getUserInfo', param, 'post', null, ( data ) => {
            console.log("~~~~", data);
            setUserSeq(data.userSeq);
            setNickname(data.nickname);
            setProfileUrl(data.profileUrl);
            setIntroDesc(data.introDesc);
        });
    }


    const onPressBack = () => {
        navigation.goBack();
    }

    const onPressOption = () => {
        optionSheetRef.current.expand();
    }

    const onPressEdit = () => {

    }

    const onPressUseGuide = () => {

    }

    const onPressPrivacyGuide = () => {

    }

    const onPressLogout = () => {
        
    }

    const onPressWrite = () => {

    }

    function OptionSheetView() {
        return (
            <View style={{flex: 1, paddingHorizontal: 30, paddingVertical: 20,}}>
                <TouchableOpacity onPress={onPressEdit} activeOpacity={0.5} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center',}}>
                    <AntDesign name={'edit'} size={25}/>
                    <Text style={{fontSize: 18, color: 'black', marginLeft: 20,}}>프로필 편집</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressUseGuide} activeOpacity={0.5} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name={'information-circle'} size={25}/>
                    <Text style={{fontSize: 18, color: 'black', marginLeft: 20,}}>이용약관</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressUseGuide} activeOpacity={0.5} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name={'at-circle'} size={25}/>
                    <Text style={{fontSize: 18, color: 'black', marginLeft: 20,}}>개인정보처리방침</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressUseGuide} activeOpacity={0.5} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialIcons name={'logout'} size={25}/>
                    <Text style={{fontSize: 18, color: 'black', marginLeft: 20,}}>로그아웃</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={cs.container}>
            <View style={{height: 60, flexDirection: 'row', paddingHorizontal: 20, backgroundColor: '#007BFF', elevation: 5, alignItems: 'center', justifyContent: 'space-between'}}>
                <View>
                    <Text style={{fontWeight: 'bold', fontSize: 17, color: '#fff'}}>{'내 서랍'}</Text>
                </View>
                {}
                <TouchableOpacity activeOpacity={0.8} onPress={onPressOption} style={{height: '100%', width: 50, alignItems: 'center', justifyContent: 'center',}}>
                    <Feather name="settings" color={'#fff'} size={25} />
                </TouchableOpacity>
            </View>
            <CommonOptionSheet refSheet={optionSheetRef} height={'40%'} contents={<OptionSheetView/>} />
        </SafeAreaView>
    )
}

export default ProfileMain;