import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import colors from '../../../../../../colors';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { getBonusRewards } from '../../../../../utils/apiservice';
import { useTranslation } from 'react-i18next';

const YourRewards = () => {
    const { t } = useTranslation();

    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        getBonusRewards()
            .then((response) => response.data)
            .then((responseData) => {
                setRewards(responseData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const pairedRewards = [];
    for (let i = 0; i < rewards.length; i += 2) {
        pairedRewards.push(rewards.slice(i, i + 2));
    }

    return (
        <ScrollView contentContainerStyle={styles.mainWrapper}>
            <View style={styles.subWrapper}>
                {rewards.length === 0 ? (
                    <Text style={styles.noDataText}>{t('strings:no_data')}</Text>
                ) : (
                    pairedRewards.map((pair, rowIndex) => (
                        <View key={rowIndex} style={styles.rowContainer}>
                            {pair.map((reward, index) => (
                                <View key={index} style={styles.card}>
                                    <Image
                                        style={{ flex: 1, width: '100%', height: '100%' }}
                                        resizeMode="contain"
                                        source={require('../../../../../assets/images/ic_rewards_gift.png')}
                                    />
                                    <Text style={styles.cardText}>You have won {reward.promotionPoints} points</Text>
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        padding: 15,
        backgroundColor: colors.white,
    },
    header: {
        fontSize: responsiveFontSize(2.5),
        textAlign: 'center',
        marginBottom: 15,
        color: colors.black,
        fontWeight: 'bold',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    subWrapper: {
        marginBottom: 20,
    },
    card: {
        width: responsiveWidth(45),
        aspectRatio: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        elevation: 5,
        borderRadius: 10,
    },
    cardText: {
        fontSize: responsiveFontSize(2),
        color: colors.black,
        textAlign: 'center',
    },
    noDataText: {
        color: colors.grey,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: responsiveFontSize(2)
    }
});

export default YourRewards;
