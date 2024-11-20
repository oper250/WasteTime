//https://github.com/facebook/react-native

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import HomeMain from './src/view/home/HomeMain';
import MarketMain from "./src/view/market/MarketMain";
import AlarmMain from "./src/view/alarm/AlarmMain";
import ProfileMain from "./src/view/profile/ProfileMain";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoginMain from './src/view/login/LoginMain';
import LoginForm from './src/view/login/LoginForm';
import * as cu from './src/common/CommonUtil';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import BucketList_Detail from './src/view/noTab/BucketList_Detail';
import JoinForm from './src/view/login/JoinForm';
import JoinEmailCheckForm from './src/view/login/JoinEmailCheckForm';
import JoinPasswordForm from './src/view/login/JoinPasswordForm';
import useStore from './src/common/store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();


function App({navigation, route}) {
  const {callApiByJwtToken, myInfo} = useStore();
  // 최초 토큰으로 사용자정보 조회해오기
  useEffect(() => {
    const getMyInfo = async () => {
      const jwtToken = await AsyncStorage.getItem('jwtToken');

      if (jwtToken != null) {
        cu.callApi(navigation, '/user/getMyInfoByJwtToken', {}, 'post', null, (data) => {});
      }
    };

    getMyInfo();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={BottomTabScreen}
        screenOptions={{
          presentation: 'card',
          animationTypeForReplace: 'push',
        }}
      >
        <Stack.Screen 
          name="BottomTabScreen"
          component={BottomTabScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="BucketList_Detail"
          component={BucketList_Detail}
          options={{
              headerShown: false,
              animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen 
          name="LoginMain"
          component={LoginMain}
          options={{
              headerShown: false,
              animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen 
          name="JoinForm"
          component={JoinForm}
          options={{
              headerShown: false,
              animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen 
          name="JoinEmailCheckForm"
          component={JoinEmailCheckForm}
          options={{
              headerShown: false,
              animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen 
          name="JoinPasswordForm"
          component={JoinPasswordForm}
          options={{
              headerShown: false,
              animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen 
          name="LoginForm"
          component={LoginForm}
          options={{
              headerShown: false,
              animation: 'fade_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function BottomTabScreen() { 
  return (
    <BottomTab.Navigator
    //initialRouteName='LoginMain'
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#3B4F67',
        tabBarInactiveTintColor: '#3B4F67',
        tabBarBadgeStyle: {marginTop: 10, },
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: {marginBottom: 5,},
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingTop: 7,
          //borderTopLeftRadius: 24,
          //borderTopRightRadius: 24,
          position: 'absolute',
          overflow: 'hidden',
        }
      }}
    >
      <BottomTab.Screen
        name={"HomeMain"}
        component={HomeMain}
        options={{tabBarIcon: ({color, focused}) => (
            focused ?
                <Ionicons name="home-sharp" color={color} size={26} /> :
                <Ionicons name="home-outline" color={color} size={26} />
          )
        }}
      />
      <BottomTab.Screen
        name={"MarketMain"}
        component={MarketMain}
        options={{tabBarIcon: ({color, focused}) => (
            focused ?
            <Ionicons name="cart" color={color} size={26} /> :
            <Ionicons name="cart-outline" color={color} size={26} />
          )
        }}
      />
      <BottomTab.Screen
        name={"AlarmMain"}
        component={AlarmMain}
        options={{tabBarIcon: ({color, focused}) => (
            focused ?
            <MaterialCommunityIcons name="bell" color={color} size={24} />:
            <MaterialCommunityIcons name="bell-outline" color={color} size={24} />
          ),
          tabBarBadge: '10'
        }}
      />
      <BottomTab.Screen
        name={"ProfileMain"}
        component={ProfileMain}
        options={{tabBarIcon: ({color, focused}) => (
            focused ?
            <Ionicons name="file-tray-full" color={color} size={24} /> :
            <Ionicons name="file-tray-outline" color={color} size={24} />
          )
        }}
      />
      <BottomTab.Screen
        name={"LoginMain2"}
        component={LoginMain}
        options={{tabBarIcon: ({color, focused}) => (
            focused ?
            <Ionicons name="file-tray-full" color={color} size={24} /> :
            <Ionicons name="file-tray-outline" color={color} size={24} />
          )
        }}
      />
    </BottomTab.Navigator>
    
  )
}

export default App;
