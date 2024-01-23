import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Modal, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../../../../../../colors'
import { useTranslation } from 'react-i18next';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Buttons from '../../../../../components/Buttons';
import arrowIcon from '../../../../../assets/images/arrow.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopupWithButton from '../../../../../components/PopupWithButton';
import Popup from '../../../../../components/Popup';
import { checkVPA, verifyVPA } from '../../../../../utils/apiservice';

const UpiTransfer = () => {
    const { t } = useTranslation();
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [isNormalPopupVisible, setNormalPopupVisible] = useState(false);
    const [isUpiFound, setUpiFound] = useState(false);
    const [isUpiNotFound, setUpiNotFound] = useState(false);
    const [upiSelected, setUpiSelected] = useState(true);
    const [popupContent, setPopupContent] = useState("");
    const [upiId, setUpiId] = useState("");
    const [points, setPoints] = useState(0);

    const handleUpiPress = () => {
        setUpiSelected(!upiSelected);
    }
    const handleProceed = async () => {
        if (!upiSelected) {
            setNormalPopupVisible(true);
            setPopupContent("Please select Wallet");
        }
        else if (upiId == "") {
            setNormalPopupVisible(true);
            setPopupContent("No UPI-VPA linked. Please Contact Admin.");
        }
        else if (points == 0 || points < 250 || points > 5000) {
            console.log("POINTS", points)
            setNormalPopupVisible(true);
            setPopupContent("Kindly enter points between 250-5000");
        }
        else if (upiId != "" && upiSelected && points != 0 && points >= 250 && points <= 5000) {
            console.log("YOU CAN PROCEED");
        }
    }
    const [pointData, setPointData] = useState({
        pointsBalance: '',
        redeemedPoints: '',
        numberOfScan: '',
    });

    useEffect(() => {
        AsyncStorage.getItem('USER').then(r => {
            const user = JSON.parse(r);
            const data = {
                pointsBalance: user.pointsSummary.pointsBalance,
                redeemedPoints: user.pointsSummary.redeemedPoints,
                numberOfScan: user.pointsSummary.numberOfScan,
            };
            setPointData(data);
        });
        checkVPA()
            .then(response => response.data)
            .then(res => {
                const result = res;
                if (result.code == 404) {
                    setPopupVisible(true);
                }
                else if (result.code == 200) {
                    setUpiId(result.upi);
                }
            })
    }, []);

    const findUpi = async () => {
        verifyVPA()
            .then(response => response.data)
            .then(res => {
                const result = res;
                setPopupVisible(false);
                if (result.code == 200) {
                    setUpiFound(true);
                    setUpiId(result.upi)
                }
                else {
                    setUpiNotFound(true);
                }
            })
    }


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.mainWrapper}>
                <View style={styles.points}>
                    <View style={styles.leftPoint}>
                        <Text style={styles.greyText}>{t('strings:points_balance')}</Text>
                        <Text style={styles.point}>{pointData.pointsBalance ? pointData.pointsBalance : 0}</Text>
                    </View>
                    <View style={styles.rightPoint}>
                        <Text style={styles.greyText}>{t('strings:points_redeemed')}</Text>
                        <Text style={styles.point}>{pointData.redeemedPoints ? pointData.redeemedPoints : 0}</Text>
                    </View>
                </View>
                <View style={styles.rightTextView}>
                    <Text style={styles.rightText}>* 1 Point = 1 INR</Text>
                </View>
                <View style={styles.enterCode}>
                    <View style={styles.topContainer}>
                        <Text style={styles.smallText}>
                            UPI ID Linked with your mobile number
                        </Text>
                    </View>
                    <View style={styles.bottomContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="UPI ID"
                            placeholderTextColor={colors.grey}
                            textAlign="center"
                            value={upiId}
                            editable={false}
                        />
                    </View>
                </View>
                <View style={styles.enterCode}>
                    <View style={styles.topContainer}>
                        <Text style={styles.smallText}>
                            {t('strings:enter_points_to_be_redeemed')}
                        </Text>
                    </View>
                    <View style={styles.bottomContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('strings:enter_points')}
                            placeholderTextColor={colors.grey}
                            textAlign="center"
                            value={points}
                            onChangeText={(text) => setPoints(text)}
                            keyboardType='numeric'
                        />
                    </View>
                </View>
                <Text style={styles.chooseWallet}>{t('strings:choose_wallet')}</Text>
                <TouchableOpacity onPress={handleUpiPress} style={styles.wallet}>
                    <Image resizeMode="contain" style={{ flex: 1, width: '100%', height: '100%' }} source={require('../../../../../assets/images/upi_transfer.webp')} />
                    {
                        (upiSelected == true) && (
                            <Image resizeMode="contain" style={{ flex: 1, width: '100%', height: '100%' }} source={require('../../../../../assets/images/tick_1.png')} />
                        )
                    }
                    {
                        (upiSelected == false) && (
                            <Image resizeMode="contain" style={{ flex: 1, width: '100%', height: '100%' }} source={require('../../../../../assets/images/tick_1_notSelected.png')} />
                        )
                    }
                </TouchableOpacity>
                <Buttons
                    style={styles.button}
                    label={t('strings:proceed')}
                    variant="filled"
                    onPress={() => handleProceed()}
                    width="100%"
                    iconHeight={10}
                    iconWidth={30}
                    iconGap={30}
                    icon={arrowIcon}
                />
            </View>
            <PopupWithButton buttonText="Find UPI ID" isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} onConfirm={() => findUpi()}>
                Please click on find to get UPI id linked with your registered mobile.
            </PopupWithButton>
            <PopupWithButton buttonText="Proceed" isVisible={isUpiFound} onClose={() => setUpiFound(false)} onConfirm={() => setUpiFound(false)}>
                Below UPI-VPA found linked. {'\n'}
                <Text style={styles.italics}>{upiId}</Text>
            </PopupWithButton>
            <PopupWithButton buttonText="Ok" isVisible={isUpiNotFound} onClose={() => setUpiNotFound(false)} onConfirm={() => setUpiNotFound(false)}>
                No UPI-VPA linked found. Please Contact Admin.
            </PopupWithButton>
            <Popup isVisible={isNormalPopupVisible} onClose={() => setNormalPopupVisible(false)}>
                {popupContent}
            </Popup>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    italics: {
        fontWeight: "200",
        fontStyle: 'italic'
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: colors.white
    },
    mainWrapper: {
        padding: 15,
    },
    points: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 30
    },
    leftPoint: {
        width: '50%',
        height: 100,
        backgroundColor: colors.lightYellow,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },

    rightPoint: {
        width: '50%',
        height: 100,
        backgroundColor: colors.lightYellow,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greyText: {
        width: '80%',
        color: colors.grey,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: responsiveFontSize(1.7),
        marginBottom: 10
    },
    point: {
        fontWeight: 'bold',
        color: colors.black,
        fontSize: responsiveFontSize(1.7),
    },
    rightText: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(1.5)
    },
    rightTextView: {
        display: 'flex',
        width: '100%',
        alignItems: 'flex-end',
        marginTop: 5
    },
    smallText: {
        textAlign: 'center',
        color: colors.black,
        fontSize: responsiveFontSize(1.8),
        fontWeight: 'bold'
    },
    enterCode: {
        marginTop: 20,
        width: '100%',
        borderColor: colors.lightGrey,
        borderWidth: 2,
        borderRadius: 10,
        height: 100,
        display: 'flex',
        flexDirection: 'column'
    },
    chooseWallet: {
        marginTop: 20,
        color: colors.black,
        fontSize: responsiveFontSize(2),
        textAlign: 'center',
        fontWeight: 'bold'
    },
    wallet: {
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: colors.lightGrey,
        padding: 10,
        height: 50,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    topContainer: {
        borderBottomWidth: 2,
        borderColor: colors.lightGrey,
        padding: 10,
        height: 50,
        flexGrow: 1
    },
    bottomContainer: {
        flexGrow: 1,
        height: 50,
    },
    input: {
        padding: 10,
        fontSize: responsiveFontSize(2),
        textAlign: 'center',
        color: colors.black,
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        height: '30%',
        width: '80%',
        padding: 30,
        backgroundColor: colors.yellow,
        borderRadius: 10,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: responsiveHeight(8),
        height: responsiveHeight(8),
    },
    closeButtonText: {
        color: 'blue',
    },
    popupText: {
        color: colors.black,
        fontSize: responsiveFontSize(2.2),
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: responsiveHeight(3),
        width: '70%',
    },
    buttonText: {
        color: colors.black,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: colors.white,
        position: 'absolute',
        bottom: 20,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 25,
        elevation: 10
    }
})

export default UpiTransfer