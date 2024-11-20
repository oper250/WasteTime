import { Dimensions, StyleSheet } from "react-native";


const cs = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },

    notabContainer: {
      flex: 1,
      backgroundColor: '#fff',
      paddingBottom: 50
    },

    longBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 'auto',
      height: 48,
      paddingHorizontal: 50,
      backgroundColor: '#4285F4',
      borderColor: '#4285F4',
      borderWidth: 1,
      borderRadius: 20,
      elevation: 3,
    },

    badge: {
      position: 'absolute',
      right: 10,
      top: 15,
      backgroundColor: 'red',
      borderRadius: 30,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },

    textInput: {
      height: 50, // 높이
      width: '80%', // 너비
      borderColor: '#ccc', // 테두리 색상
      borderWidth: 1, // 테두리 두께
      borderRadius: 5, // 모서리 둥글기
      paddingHorizontal: 10, // 좌우 패딩
      fontSize: 16, // 글자 크기
      backgroundColor: '#fff', // 배경색
    },
    nextButton: {
      position: 'absolute',
      bottom: 10, // 버튼을 화면 하단에 위치시킵니다.
      right: 20, // 버튼을 오른쪽에 위치시킵니다.
      backgroundColor: '#007BFF', // 버튼 색상
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      elevation: 3, // 안드로이드에서 그림자 효과
    },
    nextButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },

});



export default cs
