import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React, { useRef } from "react";
import { Animated, FlatList, StyleSheet, Text, View } from "react-native";
import cs from "../../common/CommonCss";

const Tab = createMaterialTopTabNavigator();

const DATA = Array.from({ length: 20 }, (_, i) => ({ key: `Item ${i + 1}` }));

const TabOne = () => {
  return (
    <FlatList
      data={DATA}
      renderItem={({ item }) => (
        <View style={cs.item}>
          <Text>{item.key}</Text>
        </View>
      )}
      keyExtractor={item => item.key}
    />
  );
};

const TabTwo = () => {
  return (
    <FlatList
      data={DATA}
      renderItem={({ item }) => (
        <View style={cs.item}>
          <Text>{item.key}</Text>
        </View>
      )}
      keyExtractor={item => item.key}
    />
  );
};


function MarketMain() {
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerTranslate = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -100],
      extrapolate: 'clamp',
    });

    return (
        <View style={cs.container}>
            <Animated.View style={[cs.header, { transform: [{ translateY: headerTranslate }] }]}>
                    <Text style={cs.headerText}>앱 이름</Text>
                </Animated.View>
                <Tab.Navigator>
                    <Tab.Screen name="Tab 1" component={TabOne} />
                    <Tab.Screen name="Tab 2" component={TabTwo} />
                </Tab.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      backgroundColor: '#6200ee',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    headerText: {
      color: '#fff',
      fontSize: 20,
    },
    item: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });


export default MarketMain;