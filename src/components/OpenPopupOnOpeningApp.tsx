import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, Linking, Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popup from './Popup';
import colors from '../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const OpenPopupOnOpeningApp = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [userData, setUserData] = useState({
        videoPath: "",
        imgPath: "",
        vdoText: "",
        textMessage: "",
    });

    useEffect(() => {
        setPopupVisible(true);
        AsyncStorage.getItem('USER').then(r => {
            const value = JSON.parse(r);
            const welcomeBanner = value?.welcomeBanner || {};
            setUserData({
                videoPath: welcomeBanner.videoPath || "",
                imgPath: welcomeBanner.imgPath || "",
                vdoText: welcomeBanner.vdoText || "",
                textMessage: welcomeBanner.textMessage || "Welcome!",
            });
        });
    }, []);

    const handlePress = () => {
        Linking.openURL(userData.videoPath);
    };

    const imageUrl = "https://www.vguardrishta.com/" + userData.imgPath;

    return (
        <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
            <View style={styles.popupContent}>
                <Text style={styles.blackText}>{userData.textMessage}</Text>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <TouchableOpacity onPress={handlePress}>
                    <Text style={styles.linkText}>{userData.vdoText}</Text>
                </TouchableOpacity>
            </View>
        </Popup>
    );
};

const styles = StyleSheet.create({
    linkText: {
        color: colors.black,
        textDecorationLine: 'underline'
    },
    image: {
        width: 100,
        height: 100,
    },
    blackText: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2.2),
        textAlign: 'center'
    },
    popupContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default OpenPopupOnOpeningApp;
