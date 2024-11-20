import React, { useEffect, useState, memo } from "react";
import { ActivityIndicator, Dimensions, FlatList, ImageBackground, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../common/CommonCss";
import * as cu from "../../common/CommonUtil";
import cs from "../../common/CommonCss";

function BucketList_TAB({ navigation, route }) {
    const [stNo, setStNo] = useState(0);
    const [moreYn, setMoreYn] = useState("N");
    const [bucketList, setBucketList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isBtmLoading, setIsBtmLoading] = useState(false);

    useEffect(() => {
        getBucketList();
    }, []);

    const getBucketList = () => {
        if (isLoading || isBtmLoading) return; // 로딩 중이면 함수 종료

        let loadingFlag;

        const param = {
            stNo: stNo,
            searchGubun: 'null',
        };

        if (stNo === 0) {
            loadingFlag = setIsLoading;
        } else {
            if (moreYn === "N") return;
            loadingFlag = setIsBtmLoading;
        }

        cu.callApi(navigation, '/main/getBucketList', param, 'post', loadingFlag, (data) => {
            setStNo(data.nextStNo); // 다음조회시작번호 set
            setMoreYn(data.moreYn); // 더보기여부 set
            setBucketList(prevList => [...prevList, ...data.rsList]); // 버킷리스트 set
        });
    };

    const onPressBucket = (bucketSeq, userSeq) => {
        navigation.navigate('BucketList_Detail', {'bucketSeq': bucketSeq, 'userSeq': userSeq});
    };

    // React.memo를 사용하여 itemView 최적화
    const ItemView = memo(({ item }) => (
        <TouchableOpacity
            style={{ width: Dimensions.get('window').width * 0.315, height: 170, marginHorizontal: 3, marginTop: 7 }}
            activeOpacity={0.9}
            onPress={() => onPressBucket(item.bucketSeq, item.userSeq)}
        >
            <View style={{ flex: 1, backgroundColor: 'black', elevation: 2 }}>
                <ImageBackground
                    resizeMode={'cover'}
                    style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
                    source={{ uri: item.repImgUrl }}
                >
                    <View style={{ width: '100%', height: '30%', backgroundColor: 'rgba(255, 255, 255, .8)', paddingHorizontal: 5 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, color: 'black' }}>{item.bucketNm}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    ));

    // function ItemView({item}) {
    //     return (
    //     <TouchableOpacity
    //         style={{ width: Dimensions.get('window').width * 0.315, height: 170, marginHorizontal: 3, marginTop: 7 }}
    //         activeOpacity={0.9}
    //         onPress={() => onPressBucket(item.bucketSeq, item.userSeq)}
    //     >
    //         <View style={{ flex: 1, backgroundColor: 'black', elevation: 2 }}>
    //             <ImageBackground
    //                 resizeMode={'cover'}
    //                 style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
    //                 source={{ uri: item.repImgUrl }}
    //             >
    //                 <View style={{ width: '100%', height: '30%', backgroundColor: 'rgba(255, 255, 255, .8)', paddingHorizontal: 5 }}>
    //                     <View style={{ flex: 1, justifyContent: 'center' }}>
    //                         <Text style={{ fontSize: 14, color: 'black' }}>{item.bucketNm}</Text>
    //                     </View>
    //                 </View>
    //             </ImageBackground>
    //         </View>
    //     </TouchableOpacity>
    //     )
    // };

    const EmptyView = () => (
        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, position: 'absolute', alignItems: 'center', justifyContent: 'center', marginTop: 55 }}>
            <ActivityIndicator size="large" color={'#1488cc'} />
        </View>
    );

    const BtmLoading = () => (
        isBtmLoading ? (
            <View style={{ 
                height: Dimensions.get('window').height * 0.15, 
                justifyContent: 'center', 
                alignItems: 'center',
                // marginBottom을 제거하거나 조정
                marginBottom: 0 
            }}>
                <ActivityIndicator size="large" color={'#1488cc'} />
            </View>
        ) : (
            <View style={{ 
                height: Dimensions.get('window').height * 0.15, 
                justifyContent: 'center', 
                alignItems: 'center', 
                marginBottom: 0 // marginBottom을 조정
            }}>
            </View>
        )
    );
    

    return (
        <SafeAreaView style={cs.container}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={'#1488cc'} />
                </View>
            ) : (
                <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    keyExtractor={item => item.bucketSeq.toString()} // keyExtractor 수정
                    data={bucketList}
                    renderItem={({ item }) => <ItemView item={item} />} // ItemView 사용
                    horizontal={false}
                    numColumns={3}
                    ListFooterComponent={BtmLoading}
                    onEndReached={() => { if (moreYn == 'Y') getBucketList(); }}
                    //onEndReachedThreshold={0.6}
                />
            )}
        </SafeAreaView>
    );
}

export default BucketList_TAB;