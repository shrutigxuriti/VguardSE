
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ImageBackground } from 'react-native';
import NeedHelp from '../../../../../components/NeedHelp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../../../../colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import CustomTouchableOption from '../../../../../components/CustomTouchableOption';
import { getFile, getAirCoolerPointsSummary } from '../../../../../utils/apiservice';
import Popup from '../../../../../components/Popup';
import { getImageUrl } from '../../../../../utils/FileUtils';

interface User {
    userCode: string;
    name: string;
    selfieImage: string;
    userRole: string;
    pointsBalance: string;
    redeemedPoints: string;
    numberOfScan: string;
}

const AirCooler: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<User | null>(null);
    const [userStarData, setUserStarData] = useState<User | null>(null);
    const [profileImage, setProfileImage] = useState("");
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState('');



    const loadUserDetails = async () => {
        try {
            const userString = await AsyncStorage.getItem('USER');
            if (userString) {
                const user = JSON.parse(userString);
                const shapedUser = {
                    name: user?.name || '',
                    userCode: user?.userCode || '',
                    selfieImage: user?.kycDetails?.selfie || '',
                    userRole: user?.roleId || 0,
                    pointsBalance: user?.pointsSummary?.pointsBalance || 0,
                    redeemedPoints: user?.pointsSummary.redeemedPoints || 0,
                    numberOfScan: user?.pointsSummary.numberOfScan || 0
                };
                setUserData(shapedUser);
            }
        } catch (error) {
            console.error('Error retrieving user details:', error);
        }
    };

    const loadStarDetails = async () => {
        try {
            const response = await getAirCoolerPointsSummary();
            const result = await response.data;
            setUserStarData(result);
            return result;
        }
        catch (error) {
            console.error('Error retrieving star details:', error)
        }
    }



    useEffect(() => {
        loadUserDetails();
        loadStarDetails();
        setPopupContent("Dear member, the Air cooler amount is now added in the main balance. you can redeem it after clicking on redeem points tab.")
    }, []);
    useEffect(() => {
        if (userData?.userRole && userData.selfieImage) {
            const getImage = async () => {
                try {
                    // const profileImageUrl = await getFile(userData.selfieImage, 'PROFILE', 2);
                    const profileImageUrl = await getImageUrl(userData.selfieImage, 'Profile');
                    setProfileImage(profileImageUrl);
                } catch (error) {
                    console.log('Error while fetching profile image:', error);
                }
            };
            getImage();
        }
    }, [userData?.userRole, userData?.selfieImage]);
    return (
        <ScrollView style={styles.mainWrapper}>
            <View style={{ padding: 15 }}>
                <View style={styles.detailContainer}>
                    <View style={styles.ImageProfile}>
                        <ImageBackground
                            source={require('../../../../../assets/images/ic_v_guards_user.png')}
                            style={{ width: '100%', height: '100%', borderRadius: 100 }}
                            resizeMode='contain'
                        >
                            <Image
                                source={{ uri: profileImage }}
                                style={{ width: '100%', height: '100%', borderRadius: 100 }}
                                resizeMode='contain'
                            />
                        </ImageBackground>
                    </View>
                    <View>
                        <Text style={styles.name}>{userData?.name}</Text>
                        <Text style={styles.code}>{userData?.userCode}</Text>
                    </View>
                </View>
                <View style={styles.points}>
                    <View style={styles.leftPoint}>
                        <Text style={styles.greyText}>{t('strings:star_balance')}</Text>

                        <Text style={styles.point}>{userStarData?.pointsBalance ? userStarData?.pointsBalance : 0}</Text>
                    </View>
                    <TouchableOpacity style={styles.middlePoint} onPress={() => navigation.navigate("Redemption History")} >
                        <Text style={styles.greyText}>{t('strings:star_redeemed')}</Text>
                        <Text style={styles.point}>
                            {userStarData?.redeemedPoints ? userStarData?.redeemedPoints : 0}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rightPoint} onPress={() => navigation.navigate("Unique Code History")} >
                        <Text style={styles.greyText}>{t('strings:number_of_scans')}</Text>
                        <Text style={styles.point}>{userStarData?.numberOfScan ? userStarData?.numberOfScan : 0}</Text>

                    </TouchableOpacity>
                </View>
                <View style={styles.dashboard}>
                    <View style={styles.row}>
                        <CustomTouchableOption
                            text="strings:scheme_details"
                            iconSource={require('../../../../../assets/images/ic_scheme_offers.png')}
                            screenName="schemes"
                            disabled={true}
                        />
                        <CustomTouchableOption
                            text="strings:product_registration"
                            iconSource={require('../../../../../assets/images/ic_scan_code.png')}
                            screenName="Scan QR"
                            disabled={true}
                        />
                        <CustomTouchableOption
                            text="strings:redeem_stars"
                            iconSource={require('../../../../../assets/images/ic_redeem_points.webp')}
                            screenName="Redeem Products"
                            disabled={true}
                        />
                    </View>
                    <View style={styles.lastrow}>
                        <TouchableOpacity style={styles.oval} onPress={() => setPopupVisible(true)}>
                            <View>
                                <Image style={styles.optionIcon} source={require('../../../../../assets/images/ic_paytm_transfer.webp')} />
                            </View>
                            <Text style={styles.nav}>{t('strings:paytm_transfer')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <NeedHelp />
            </View>
            {isPopupVisible && (
                <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
                    {popupContent}
                </Popup>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: colors.white
    },
    name: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(1.7)
    },
    code: {
        color: colors.black,
        fontSize: responsiveFontSize(1.7)
    },
    detailContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20
    },
    ImageProfile: {
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    points: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        marginTop: 30,
    },
    leftPoint: {
        width: responsiveWidth(30),
        height: responsiveHeight(15),
        backgroundColor: colors.lightYellow,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    middlePoint: {
        width: responsiveWidth(30),
        height: responsiveHeight(15),
        backgroundColor: colors.lightYellow,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightPoint: {
        width: responsiveWidth(30),
        height: responsiveHeight(15),
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
        marginBottom: 10,
    },
    point: {
        fontWeight: 'bold',
        color: colors.black,
        fontSize: responsiveFontSize(1.7),
    },
    dashboard: {
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        marginTop: 30,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'space-around',
    },
    lastrow: {
        marginLeft: 5,
    },
    oval: {
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: responsiveHeight(18),
        width: responsiveWidth(25),
        maxWidth: responsiveWidth(25),
        flexGrow: 1,
        backgroundColor: colors.white,
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        elevation: 5,
        borderRadius: 100,
    },
    optionIcon: {
        width: responsiveHeight(5),
        height: responsiveHeight(5),
        marginBottom: 20,
    },
    nav: {
        color: colors.black,
        fontSize: responsiveFontSize(1.5),
        fontWeight: 'bold',
        textAlign: 'center',
    },
})

export default AirCooler;
