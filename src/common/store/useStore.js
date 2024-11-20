import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import { create } from "zustand";

const useStore = create(set => ({
    myInfo: {},
    setMyInfo: (item) => set({ myInfo: item}),
    clearMyInfo: () => set({myInfo: {}}),

    isMine: false,
    setIsMine: (item) => set({isMine: item}),
    clearIsMine: () => set({isMine: false}),

    callApiByJwtToken: async () => {
        const domain = Platform.OS == 'android' ? 'http://10.0.2.2:8080' : 'http://127.0.0.1:8080';   // 개발
        //const domain = 'https://moorato.com';    // 운영
        const jwtToken = await AsyncStorage.getItem('jwtToken');

        axios({
            headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
            method: 'post',
            url: domain + '/user/getMyInfoByJwtToken',
            data : {},
            responseType: "json",
        }).then(function (response) {
            if (response.data.rsCode = '9999') {
                console.log("최초 토큰정보 : ", response.data.rsMsg);
            }
            set({ myInfo: response.data.myInfo }); 
        }).catch(function( e ){
            console.error(e.response.data.rsMsg);
        });
    }
}));

export default useStore;