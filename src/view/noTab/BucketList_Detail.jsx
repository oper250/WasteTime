import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as cu from "../../common/CommonUtil";
import cs from "../../common/CommonCss";
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Animated } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";
import { CommonOptionSheet, ReplyBottomSheet } from "../../common/CommonView";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";

function BucketList_Detail({ navigation, route }) {
    const [loding, setLoding] = useState(true);                            // 메인 로딩바
    const [btmLoding, setBtmLoding] = useState(false);                      // 바닥 더보기 로딩바
    const [storyList, setStoryList] = useState([]);                         // 스토리리스트

    const [stNo, setStNo] = useState(0);                                    // 조회시작번호
    const [moreYn, setMoreYn] = useState("N")                               // 더보기 여부
    const [bucketNm, setBucketNm] = useState('');
    const [profileUrl, setProfileUrl] = useState('');
    const [repImgUrl, setRepImgUrl] = useState('');
    const [fullName, setFullName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);    // 등록중 모달
    const [isMine, setIsMine] = useState(false);    // 나의 것인가?
    const [successYn, setSuccessYn] = useState('N');   // 완료여부
    // const userSeq = useSelector((state:any) => state.userSeq);
    const userSeq = '';

    // 스토리 리플 프로퍼티
    const [replyStNo, setReplyStNo] = useState(0);                            // 조회시작번호
    const [replyMoreYn, setReplyMoreYn] = useState("N")                     // 더보기 여부
    const [replyList, setReplyList] = useState([]);               // 스토리 리플 리스트
    const [targetStorySeq, setTargetStorySeq] = useState();       // 선택한 스토리(리플 등록할때 식별)
    const replySheetRef = useRef(null);

    const [isFollow, setIsFollow] = useState(false);   // 팔로우중인가?
    const [isAddedBookmark, setIsAddedBookmark] = useState(false);   // 추가된 북마크인가?

    const bucketSheetRef = useRef(null);
    const [sheetIdxBucket, setSheetIdxBucket] = useState(-1); //바텀시트 활성화 여부

    const messageIconEffect = storyList.map(() => new Animated.Value(1));
    const heartIconEffect = storyList.map(() => new Animated.Value(1));
    const optionIconEffect = storyList.map(() => new Animated.Value(1));


    useEffect(() => {
        console.log(">>> bucketSeq :: " + route?.params.bucketSeq + " >>> userSeq :: " + route?.params.userSeq);
        getBucketDetail();

        const unsubscribe = navigation.addListener('focus', () => {
            getStoryList();
        });
      
        return unsubscribe;
    }, []);

    const onPressBack = () => {
        navigation.goBack();
    }

    const onPressWrite = () => {
        //navigation.navigate('WritePage',
        //{'writeType': 'story', 'bucketSeq': route?.params.bucketSeq, 'bucketNm': bucketNm});
        navigation.navigate('Login', {});
    }

    const onPressSuccess = () => {
    
    }

    const getBucketDetail = () => {
        let param = {
            bucketSeq: route.params.bucketSeq,
        };

        cu.callApi(navigation, '/main/getBucketDetail', param, 'post', null, ( data ) => {
            console.log("111", data.repImgUrl);
            console.log("222", data.profileUrl);

            setIsAddedBookmark(data.addedBookmarkYn == "Y" ? true : false);
            setIsFollow(data.followYn == "Y" ? true : false);
            setRepImgUrl(data.repImgUrl);
            setBucketNm(data.bucketNm);
            setProfileUrl(data.profileUrl);
            setFullName(data.fullName);
        });
    }

    const getStoryList = () => {
        let setLodingFlag;
        let param = {
            stNo: stNo,
            bucketSeq: route?.params.bucketSeq,
        };
    
        if(stNo == 0) {
            setLodingFlag = setLoding;
        } else {
            if (moreYn == "N") return;
            setLodingFlag = setBtmLoding;
        }
    
        cu.callApi(navigation, '/main/getStoryList', param, 'post', setLodingFlag, ( data ) => {
            setStNo(data.nextStNo);                             // 다음조회시작번호 set
            setMoreYn(data.moreYn);                             // 더보기여부 set
            setStoryList([...storyList, ...data.rsList]);      // 버킷리스트 set
        });
    }

    const onPressStoryReply = (storySeq) => {
        getStoryReplyList(storySeq);
        setTargetStorySeq(storySeq);
        replySheetRef.current?.expand();  // 바텀시트 open
    }

    const getStoryReplyList = (storySeq) => {
        setTargetStorySeq(storySeq);
        let setLodingFlag = null;
        let param = {
            stNo: replyStNo,
            bucketSeq: route?.params.bucketSeq,
            storySeq: storySeq,
        };
    
        if (replyStNo !== 0 && replyMoreYn !== "N") {
            setLodingFlag = setBtmLoding;
        }

        cu.callApi(navigation, '/main/getStoryReplyList', param, 'post', setLodingFlag, ( data ) => {
            setReplyStNo(data.nextStNo);                       // 다음조회시작번호 set
            setReplyMoreYn(data.moreYn);                       // 더보기여부 set
            setReplyList(data.rsList);                        // 리스트 set
        });
    }

    const onPressProfile = () => {
        // navigation.push('ProfilePageMain', {'userSeq': route?.params.userSeq, 'isFollow': isFollow,});
    }

    const onPressBucketOption = () => {
        bucketSheetRef.current.expand();
    }

    const onPressStoryOption = () => {

    }

    const onPressBookmark = (updateType) => {

    }

    function BucketSheetView() {
        return (
            <View style={{flex: 1, paddingHorizontal: 30, paddingVertical: 20,}}>
                {isMine ?
                (
                    <>
                    <TouchableOpacity onPress={onPressWrite} activeOpacity={0.5} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center',}}>
                        <FontAwesome5Icon name="pencil-alt" size={25}/>
                        <Text style={{fontSize: 18, color: 'black', marginLeft: 20,}}>버킷 수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressRemoveBucket} activeOpacity={0.5} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center',}}>
                        <Ionicons name="trash-outline" size={25}/>
                        <Text style={{fontSize: 18, color: 'black', marginLeft: 20,}}>버킷 삭제</Text>
                    </TouchableOpacity>
                    </>
                ) : (
                    isAddedBookmark ? (
                    <TouchableOpacity onPress={() => onPressBookmark("D")} activeOpacity={0.5} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center',}}>
                        <AntDesign name="star" size={25}/>
                        <Text style={{fontSize: 18, color: 'black', marginLeft: 20,}}>즐겨찾기 취소</Text>
                    </TouchableOpacity>
                    ) : (
                    <TouchableOpacity onPress={() => onPressBookmark("I")} activeOpacity={0.5} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center',}}>
                        <AntDesign name="staro" size={25}/>
                        <Text style={{fontSize: 18, color: 'black', marginLeft: 20,}}>즐겨찾기 추가</Text>
                    </TouchableOpacity>
                    )
                )
                }
            </View>
        )
    }

    function NoDataView() {
        return (
            <View style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height / 2, alignItems: 'center', justifyContent: 'center', }}>
                {
                    loding ? (
                        <ActivityIndicator size="large" color={'#1488cc'} />
                    ) : (
                    <>
                        <View style={{width: '20%', height: '25%', zIndex: 99, marginRight: 20, marginTop: -120,}}>
                            <Image source={require('../../resources/images/noData.png')} style={{width: 100, height: 80}} resizeMode={"contain"} />
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: 16, fontWeight: '400', color: '#3B4F67'}}>{'등록된 스토리가 없습니다.'}</Text>
                            {
                                isMine ? (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={onPressWrite}
                                        style={[cs.longBtn, {marginTop: 15,}]}>
                                        <Text style={{color: '#fff'}}>{'스토리 작성하기'}</Text>
                                    </TouchableOpacity>
                                ) : null
                            }
                        </View>
                    </>
                    )
                }
            </View>
          )
    }

    function BucketDetailView() {
        return (
            <View style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').height / 2}}>
                {
                    repImgUrl ? (
                        <Image style={[{width: '100%', height: '100%'}]}
                            source={{uri:repImgUrl}}
                            resizeMode={'cover'}
                        />
                    ) : null
                }
                <View style={{position: 'absolute', width: '90%', height: 80, paddingLeft: 8, backgroundColor: 'rgba(255, 255, 255, .8)', bottom: 30, alignSelf: 'flex-end', borderTopStartRadius: 25, borderBottomStartRadius: 25, flexDirection: 'row', alignItems: 'center'}}>
                    <Pressable style={{width: 70, height: 70,}} onPress={onPressProfile}>
                        {
                            profileUrl ? (
                                <Image style={{width: '100%', height: '100%', borderRadius: 50,}} source={{uri: profileUrl}} />
                            ) : null
                        }
                    </Pressable>
                    <View style={{flex: 1, justifyContent: 'center', marginLeft: 15, paddingRight: 20,}}>
                        <View style={{flexDirection: 'row', }}>
                            <TouchableOpacity activeOpacity={0.7} onPress={onPressProfile}>
                                <Text style={{fontSize: 14, color: '#636363'}}>{fullName}</Text>
                            </TouchableOpacity>
                            {
                                isMine ? (
                                    isFollow ? (
                                        <Pressable onPress={onPressFollow} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 5, paddingHorizontal: 5, borderRadius: 25, }}>
                                            <Ionicons name={'people'} color={'black'} size={12}/>
                                            <Text style={{fontSize: 13, color: 'black', fontWeight: '400'}}>{'팔로잉'}</Text>
                                        </Pressable>
                                    ) : (
                                        <Pressable onPress={onPressFollow} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', marginLeft: 5, paddingHorizontal: 5, borderRadius: 25,}}>
                                            <Ionicons name={'person-add'} color={'white'} size={12}/>
                                            <Text style={{fontSize: 13, color: 'white', fontWeight: '400'}}>{'팔로우'}</Text>
                                        </Pressable>
                                    )
                                ) : null
                            }
                        </View>
                        <View style={{height: 50, }}>
                            <Text style={{fontSize: 16, color: 'black',}} numberOfLines={2}>{bucketNm}</Text>
                        </View>
                    </View>
                    {
                        successYn == 'Y' ? (
                            <TouchableOpacity onPress={onPressSuccess} activeOpacity={0.7} style={{width: 45, height: 45, marginRight: 10, borderRadius: 50, backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center', elevation: 1,}}>
                                <Fontisto name={'checkbox-active'} color={'white'} size={22}/>
                            </TouchableOpacity>
                        ) : successYn == 'N' ? (
                            <TouchableOpacity onPress={onPressSuccess} activeOpacity={0.7} style={{width: 45, height: 45, marginRight: 10, borderRadius: 50, backgroundColor: '#34A853', alignItems: 'center', justifyContent: 'center', elevation: 1,}}>
                                <Fontisto name={'checkbox-passive'} color={'white'} size={22}/>
                            </TouchableOpacity>
                        ) : null}
                </View>
            </View>
        )
    }


    function ItemView({ item, index, messageIconEffect, heartIconEffect, optionIconEffect, /*onPressStoryReply, onPressStoryOption*/ }) {
        const regDttm = cu.timeForText(item.regDttm);
    
        return (
            <View style={{ width: '100%', paddingVertical: 10, marginTop: 5 }}>
                <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#dddddd', minHeight: 200 }}>
                    <View style={{ height: 350, alignItems: 'center', paddingHorizontal: 20 }}>
                        {item.imgUrl ? (
                            <Image style={[{ width: '100%', height: '100%' }]} source={{ uri: item.imgUrl }} resizeMode={'cover'} />
                        ) : null}
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <View style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: '500', color: 'black' }}>{item.fullName}</Text>
                                <Text style={{ color: '#c4c4c4', marginLeft: 10 }}>{regDttm}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity 
                                    onPressIn={() => cu.handlePressIn(messageIconEffect)}
                                    onPressOut={() => cu.handlePressOut(messageIconEffect)}
                                    activeOpacity={1} 
                                    style={{ width: 55, justifyContent: 'center', alignItems: 'center', }}
                                    onPress={() => onPressStoryReply(item.storySeq)} 
                                >
                                    <Animated.View style={{ transform: [{ scale: messageIconEffect }] }}>
                                        <Feather name="message-circle" color={'black'} size={25} />
                                    </Animated.View>
                                    {item.replyCnt > 0 && (
                                        <View style={cs.badge}>
                                            <Text style={cs.badgeText}>{item.replyCnt}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPressIn={() => cu.handlePressIn(heartIconEffect)}
                                    onPressOut={() => cu.handlePressOut(heartIconEffect)}
                                    activeOpacity={1} // 클릭 시 투명도 변경 방지
                                    style={{ width: 55, justifyContent: 'center', alignItems: 'center', }}
                                >
                                    <Animated.View style={{ transform: [{ scale: heartIconEffect }] }}>
                                        <Ionicons name="heart-outline" color={'black'} size={25} />
                                    </Animated.View>
                                </TouchableOpacity>
                                <View style={{ position: 'relative', width: 45, justifyContent: 'center' }}>
                                    <TouchableOpacity 
                                        onPress={() => onPressStoryOption(item.storySeq)} 
                                        style={{ width: 45, justifyContent: 'center', alignItems: 'center', }}
                                        onPressIn={() => cu.handlePressIn(optionIconEffect)}
                                        onPressOut={() => cu.handlePressOut(optionIconEffect)}
                                        activeOpacity={1} // 클릭 시 투명도 변경 방지
                                    >
                                        <Animated.View style={{ transform: [{ scale: optionIconEffect }] }}>
                                            <Entypo name="dots-three-vertical" size={20} color={'black'} />
                                        </Animated.View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingVertical: 10, marginBottom: 10 }}>
                            <Text>{item.storyContents}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    function ReplyItemView(data) {
        const item = data.item;
        const regDttm = cu.timeForText(item.regDttm);

        return (
            <View style={{width: '100%', maxHeight: 150, flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20,}} >
                <Pressable style={{width: 50, height: 50,}} >
                    <Image style={{width: '100%', height: '100%', borderRadius: 50,}} source={{uri: item.profileUrl}} />
                </Pressable>
                <View style={{width: '100%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '85%', }}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>{item.fullName}</Text>
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
                        <Text style={{fontSize: 18, color: 'black', marginLeft: 10, width: '85%', }}>{item.replyContents}</Text>
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
        <SafeAreaView style={{flex: 1,}}>
            <View style={{ width: '100%', height: 80, position: 'absolute', zIndex: 1, flexDirection: 'row', alignItems: 'center',}}>
                <LinearGradient
                    style={{ width: '100%', height: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}
                    colors={['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0)']}
                >
                    <View style={{ width: 100, paddingLeft: 20, paddingTop: 20, }}>
                    <Pressable onPress={onPressBack} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="arrow-back" color={'white'} size={30} />
                    </Pressable>
                    </View>
                    <View style={{ width: 200, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 20, paddingTop: 20,}}>
                        <Pressable onPress={onPressWrite} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                            <FontAwesome5Icon name="pencil-alt" size={25} color={'white'} />
                        </Pressable>
                        <Pressable onPress={onPressBucketOption} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                            <Entypo name="dots-three-vertical" size={25} color={'white'} />
                        </Pressable>
                    </View>
                </LinearGradient>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList 
                    data={storyList}
                    renderItem={({ item, index }) => (
                        <ItemView 
                            item={item} 
                            index={index} 
                            messageIconEffect={messageIconEffect[index]} 
                            heartIconEffect={heartIconEffect[index]} 
                            optionIconEffect={optionIconEffect[index]} 
                        />
                    )}
                    keyExtractor={item => item.rn.toString()} // rn이 고유한 경우
                    ListFooterComponent={<View style={{ height: 100 }} />}
                    ListHeaderComponent={<BucketDetailView />}
                    ListEmptyComponent={<NoDataView />}
                />
            </View>
            {/* <CommonBottomSheet sheetRef={sheetRefBucket} setSheetIdx={setSheetIdxBucket} BottomSheetContent={BottomSheetContentBucket} height={'35%'}/> */}

            <CommonOptionSheet refSheet={bucketSheetRef} height={'30%'} contents={<BucketSheetView/>} />
            <ReplyBottomSheet refSheet={replySheetRef} list={replyList} ItemView={ReplyItemView}></ReplyBottomSheet>
        </SafeAreaView>
    )
}

export default BucketList_Detail;