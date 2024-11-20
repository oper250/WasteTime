import React, { useEffect, useState, memo } from "react";
import { ActivityIndicator, Dimensions, FlatList, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as cu from "../../common/CommonUtil";
import BucketList_TAB from "../noTab/BucketList_TAB";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AlarmMain from "../alarm/AlarmMain";
import cs from "../../common/CommonCss";

const Tab = createMaterialTopTabNavigator();

function HomeMain({ navigation, route }) {
    return (
        <SafeAreaView style={cs.container}>
            <Tab.Navigator
                initialLayout={{width: Dimensions.get('window').width}}
                screenOptions={{
                  tabBarLabelStyle: { fontSize: 12 },
                  tabBarItemStyle: { width: 80, },
                  tabBarContentContainerStyle: {marginLeft: 10,},
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'black',
                  tabBarIndicatorStyle: {
                    backgroundColor: "#32324C",
                    height: 30,
                    borderRadius: 30,
                    top: 9,
                    marginLeft: 10,
                  },
                }}
            >
                <Tab.Screen options={{title: '인기순'}} name="guideAlarm" component={BucketList_TAB} />
                <Tab.Screen options={{title: '최신순'}} name="messasgeAlarm" component={BucketList_TAB} />
            </Tab.Navigator>
        </SafeAreaView>
    )
}



export default HomeMain;