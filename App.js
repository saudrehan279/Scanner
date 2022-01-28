import { Button, PermissionsAndroid, SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Modal from "react-native-modal";
import Clipboard from '@react-native-clipboard/clipboard';

const App = () => {
  const [ShowModal, setShowModal] = useState(false);
  const [Data, setData] = useState("");
  const [Flash, setFlash] = useState(RNCamera.Constants.FlashMode.off);
  const [Icon, setIcon] = useState(require("./Assets/flash-off.png"));
  const [Loading, setLoading] = useState(false);
  const toggleModal = () => {
    setShowModal(!ShowModal);
  }


  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Scanner App Camera Permission",
          message:
            "Scanner App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        setLoading(true);
        
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const onSuccess = (resp) => {
    setData(resp.data);
    toggleModal();
  }

  const onFlashButtonPress = () => {
    if (Flash == RNCamera.Constants.FlashMode.off && Icon == require("./Assets/flash-off.png")) {
      setFlash(RNCamera.Constants.FlashMode.torch)
      setIcon(require("./Assets/flash.png"))
    } else if (Flash == RNCamera.Constants.FlashMode.torch && Icon == require("./Assets/flash.png")) {
      setFlash(RNCamera.Constants.FlashMode.off)
      setIcon(require("./Assets/flash-off.png"))
    }
  }

  const copyToClipBoard = () => {
    Clipboard.setString(Data)
    ToastAndroid.show("Text Copied to Cliboard!", ToastAndroid.SHORT);

  }
  return (
    <View style={styles.container}>
      <Modal
        isVisible={ShowModal}
        onBackdropPress={() => toggleModal()}
        onBackButtonPress={() => toggleModal()}
      >
        <View style={styles.modalMainView}>
          <View style={{ height: "20%", justifyContent: "center", alignItems: "center" }}>
            <View></View>
            <Text style={{ color: "black", fontWeight: "normal", fontSize: 30 }}>Scanned Data</Text>
          </View>
          <View style={{ height: "60%", width: "100%", justifyContent: "space-around", alignItems: "center",flexDirection:"row" }}>
            <Text style={{ color: "black",width:"80%",paddingLeft:5}}>{Data}</Text>
            <TouchableOpacity onPress={() => copyToClipBoard()}>
              <Image source={require("./Assets/copy.png")} style={{width:40,height:40}}/>
            </TouchableOpacity>
          </View>
          <View style={{ width: "100%", height: "20%", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity onPress={() => {toggleModal();setData("")}} style={{ width: "65%", height: "65%", backgroundColor: "rgb(90,182,255)", borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 20 }}>OK</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>QR/Bar Code Scanner</Text>
      </View>
      <View style={styles.cameraView}>
        {
          Loading &&
          <QRCodeScanner
            reactivate={true}
            reactivateTimeout={3000}
            onRead={(e) => onSuccess(e)}
            flashMode={Flash}
            cameraStyle={styles.camera}
            showMarker={true}
          />
        }
      </View>
      <TouchableOpacity onPress={() => onFlashButtonPress()}>
        <Image source={Icon} style={{ width: 70, height: 70 }} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(90,182,255)",
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "12%",
    backgroundColor: "rgb(90,182,255)"
  },
  cameraView: {
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    height: "100%",
  },
  modalMainView: {
    backgroundColor: "white",
    borderRadius: 20,
    height: "45%",
    justifyContent: "center",
    alignItems: "center"
  },
});

export default App;
