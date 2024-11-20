import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  LayoutAnimation
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop, BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView
} from "@gorhom/bottom-sheet";
import cs from "./CommonCss";
import * as cu from "./CommonUtil";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import { Dimensions } from 'react-native';


export const CommonOptionSheet = ({refSheet, height, contents}) => {
  const snapPoints = useMemo(() => [height], []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),[]
  );

  return (
      <BottomSheet
        ref={refSheet}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        style={{flex: 1,}}
      >
        <BottomSheetView style={{flex: 1}}>
          {contents}
        </BottomSheetView>
      </BottomSheet>
  );
}

export const ReplyBottomSheet = ({refSheet, list, ItemView}) => {
  const snapPoints = useMemo(() => ['60%'], []);
  const renderBackdrop = useCallback(
      (props) => (
      <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
      />
      ),[]
  );

  return (
      <BottomSheet
        ref={refSheet}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        style={{flex: 1,}}
        enableDynamicSizing={false}
      >
          <BottomSheetFlatList
              data={list}
              keyExtractor={item => item.rn.toString()} // rn이 고유한 경우
              renderItem={ItemView}
              // contentContainerStyle={{flex: 1}}
          />
      </BottomSheet>
  );
}



export const CommonScrollBottomSheet = ({sheetRef, setSheetIdx, replyList, onPressReplySend, profileUrl, setReplyContents, replyContents, userSeq, onPressDeleteReply}) => {
  const replyContentsRef = useRef<TextInput | null>(null);
  const snapPoints = useMemo(() => ['60%'], []);
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  const renderBackdrop = useCallback(
    (props) =>
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close" />,
    [],
  );

  useEffect(() => {
    LayoutAnimation.configureNext(cu.layoutAniConfig);  // 이게 있어야 댓글 스무스하게 추가/삭제됨
  },[replyList])

  function itemView(data) {
    const item = data.item;
    const regDttm = cu.timeForText(item.regDttm);

    return (
      <View style={{width: '100%', maxHeight: 150, flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20,}} >
        <Pressable style={{width: 40, height: 40,}} >
          <Image style={{width: '100%', height: '100%', borderRadius: 50,}} source={{uri: item.profileUrl}} />
        </Pressable>
        <View style={{width: '100%'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '85%', }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 15, color: '#aaaaaa', marginLeft: 10}}>{'@'+item.nickname}</Text>
              <Text style={{fontSize: 15, color: '#aaaaaa', marginLeft: 10}}>{regDttm}</Text>
            </View>
            {userSeq == item.userSeq ?      // 자기글에만 삭제버튼 표시
              (
                <TouchableOpacity onPress={() => {onPressDeleteReply(item.replyNo);}}>
                  <Text style={{color: '#aaaaaa', fontSize: 15}}>삭제</Text>
                </TouchableOpacity>
              ) : null
            }
          </View>
          <View style={{marginTop: 5,}}>
            <Text style={{fontSize: 18, color: 'black', marginLeft: 10,}}>{item.replyContents}</Text>
          </View>
        </View>
      </View>
    );
  };

  function EmptyView() {
    return (
      <View style={{width: 380, height: 380, alignItems: 'center', justifyContent: 'center', }}>
        <Text style={{fontSize: 15}}>작성된 댓글이 없습니다.</Text>
      </View>
    )
  }

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={(idx) => {
          setSheetIdx(idx);
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetFlatList
          data={replyList}
          renderItem={itemView}
          keyExtractor={(item) => item.rn}
          ListEmptyComponent={EmptyView}
        />
        <View style={{flexDirection: 'row', minHeight: 50, paddingVertical: 5,}}>
          <View style={{width: 60, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: 47,height: 47, }}>
              <Image style={{width: '100%', height: '100%', borderRadius: 50,}} source={{uri: profileUrl}} />
            </View>
          </View>
          <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
            <TextInput
              style={{width: '100%', backgroundColor: '#EFF3F4', borderColor: '#D8DCDD', borderRadius: 25, borderWidth: 1, paddingLeft: 30,}}
              multiline={true}
              placeholder={'답글 추가...'}
              ref={replyContentsRef}
              onChangeText={(text) => {
                setReplyContents(text);
              }}
            />
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            {
              replyContents.trim() ? (
                <TouchableOpacity style={{width: '100%', height: 50, alignItems: 'center', justifyContent: 'center'}} activeOpacity={0.9} onPress={() => {onPressReplySend(); replyContentsRef.current?.clear()}}>
                  <Ionicons name="send" color={'#607ad1'} size={25} />
                </TouchableOpacity>
              ) : (
                <Ionicons name="send-outline" color={'#ddd'} size={25} />
              )
            }
          </View>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
});

