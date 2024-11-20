import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import { ActivityIndicator, Alert, Animated, LayoutAnimation, Text, View } from "react-native";
import styles from './CommonCss';
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStore from './store/useStore';
import { StoreContext, StoreProvider, useStoreContext } from '../StoreProvider';

/* REST API 호출 */
export async function callApi(navigation, url, param, method, setLodingFlag, callback) {
  const domain = Platform.OS == 'android' ? 'http://10.0.2.2:8080' : 'http://127.0.0.1:8080';   // 개발
   //const domain = 'https://moorato.com';    // 운영

  const jwtToken = await AsyncStorage.getItem('jwtToken');

  if(setLodingFlag != null) setLodingFlag(true);

  axios({
      headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
      method: method,
      url: domain + url,
      data : param,
      responseType: "json",
  }).then(function (response) {
      console.log( '--- Transaction Success ---' );
      
      if(response.data.rsCode != "0000" && response.data.rsCode != undefined) {
        Alert.alert(response.data.rsMsg);
      } else {
        if(callback) callback( response.data, response.headers );
      }

      if(setLodingFlag) setLodingFlag(false);
  }).catch(async function(e) {
    // 토큰 없음 => 로그인 화면 이동
    if (e.response.data.rsCode != null && e.response.data.rsCode == '9001') {   
        if (navigation.canGoBack()) {
            navigation.pop();
        }
        navigation.navigate("LoginMain");
    
    // 액세스 토큰 기간 만료 => 리프레시 토큰으로 액세스 토큰 생성 요청
    } else if (e.response.data.rsCode != null && e.response.data.rsCode == '9002') {
        const isNewAccessToken = await getAccessTokenByRefreshToken(); // 한 번만 호출

        if (isNewAccessToken) { 
            callApi(navigation, url, param, method, setLodingFlag, callback);
        } else {
            if (navigation.canGoBack()) {
                navigation.pop();
            }
            navigation.navigate("LoginMain");
        }
    }

    if (setLodingFlag) setLodingFlag(false);
  });
}

// 리프래쉬 토큰으로 액세스 토큰 구하기
export async function getAccessTokenByRefreshToken() {
  const domain = Platform.OS == 'android' ? 'http://10.0.2.2:8080' : 'http://127.0.0.1:8080';   // 개발
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const {myInfo, setMyInfo} = useStore.getState();

  console.log("0000");

  if (refreshToken == null) return false;

  try {
    const response = await axios({
      headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {},
      method: 'post',
      url: domain + '/user/getAccessTokenByRefreshToken',
      data: {},
      responseType: "json",
    });

    const token = response.headers['authorization'];

    if (token != null) {
      const jwtToken = token.split(' ')[1];
      await AsyncStorage.setItem('jwtToken', jwtToken);
      setMyInfo(response.data.myInfo);
      return true;
    } else {
      console.log("error : " +response.data.rsMsg);
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}


export function callApiFormData(navigation, url, param, method, setLodingFlag, callback) {
  const domain = Platform.OS == 'android' ? 'http://10.0.2.2:8080' : 'http://127.0.0.1:8080';   // 개발
   //const domain = 'https://moorato.com';    // 운영

  if(setLodingFlag != null) setLodingFlag(true);

  axios({
    //headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Ijk5OSIsImlhdCI6MTcxMjA2OTk0MiwiZXhwIjoxNzEyOTMzOTQyfQ._Z-OmEtM2lTggZUfXj62Q7ONAvWa8ezLHxZGoKzuB6M'},
    method: method,
    url: domain + url,
    data : param,
    responseType: "json",
    headers: {"Content-Type": "multipart/form-data",},
  }).then(function (response) {
    console.log( '--- Transaction Success ---' );
    if(setLodingFlag) setLodingFlag(false);

    if(response.data.rsCode != "0000" && response.data.rsCode != undefined) {
      Alert.alert(response.data.rsMsg);
    } else {
      if(callback) callback( response.data, response.headers );
    }

  }).catch(function( e ){
    console.log( 'Transaction failed ::: ', e.message );
    if(setLodingFlag) setLodingFlag(false);
  });
}

/* REST API 호출 */
export function callApiAsync(url, param, method, setLodingFlag) {
  const domain = Platform.OS == 'android' ? 'http://10.0.2.2:8080' : 'http://127.0.0.1:8080';   // 개발
  // const domain = 'https://moorato.com';    // 운영

  if (setLodingFlag != null) setLodingFlag(true);

  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: domain + url,
      data: param,
      responseType: "json",
    }).then(function (response) {
      console.log('--- Transaction Success ---');
      if (setLodingFlag) setLodingFlag(false);
      resolve(response.data); // 성공 시 resolve 호출
    }).catch(function (e) {
      console.log('Transaction failed ::: ', e.message);
      if (setLodingFlag) setLodingFlag(false);
      reject(e); // 에러 발생 시 reject 호출
    });
  });
}

export function callApiWithHeader(url, param, headers, method, setLodingFlag, callback) {
  if(setLodingFlag) setLodingFlag(true);

  axios({
    headers: headers,
    method: method,
    url: url,
    data : param,
    responseType: "json",
  }).then(function (response) {
    console.log( '--- Transaction Success ---' );
    if(setLodingFlag) setLodingFlag(false);
    if(callback) callback( response.data );
  }).catch(function( e ){
    if(setLodingFlag) setLodingFlag(false);
    console.log( 'Transaction failed ::: ', e.message );
  });
}

export function confirm(message, callback) {
  Alert.alert(
    '알림',
    message,
    [
      {
        text: '확인',
        onPress: () => {
          callback();
        },
        style: 'destructive',
      },
      {text: '취소', onPress: () => {}, style: 'cancel'},
    ],
    {
      cancelable: true,
      onDismiss: () => {},
    },
  );
}

// 삭제,등록시 애니메이션 적용
export const layoutAniConfig = {
  duration: 500,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    duration: 500,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

export function showToast(text) {
  Toast.show({
    type: 'success',
    text1: text,
  });
}

export function timeForText(value) {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
  if (betweenTime < 1) return '방금전';
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
}

export const handlePressIn = (value) => {
  Animated.spring(value, {
      toValue: 1.3, // 확대 비율
      friction: 3,
      useNativeDriver: true,
  }).start();
};

export const handlePressOut = (value) => {
  Animated.spring(value, {
      toValue: 1, // 원래 크기로 돌아가기
      friction: 3,
      useNativeDriver: true,
  }).start();
};

