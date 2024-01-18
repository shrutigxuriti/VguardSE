import { ScrollView, Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import colors from '../../../../../../colors'
import { responsiveFontSize } from 'react-native-responsive-dimensions'
import CartProductCard from '../../../../../components/CartProductCard'
import { useTranslation } from 'react-i18next';
import arrowIcon from '../../../../../assets/images/arrow.png';
import whiteTickImage from '../../../../../assets/images/tick_1_notSelected.png';
import blackTickImage from '../../../../..//assets/images/tick_1.png';
import Buttons from '../../../../../components/Buttons'

const ViewCart = ({navigation}) => {
    const { t } = useTranslation();
    const totalItems = 1;
    const totalPoint = 100;
    const productData = [
        {
            name: 'Product 1',
            price: 50,
            image: require('../../../../../assets/images/tv.jpg'), // Replace with the correct image path
        },
        {
            name: 'Product 2',
            price: 30,
            image: require('../../../../../assets/images/tv.jpg'), // Replace with the correct image path
        },
        // Add more product objects with image sources as needed
    ];
    const address = [
        {
            label: 'Home',
            address: 'Pacific Mall Khyala Road Opp. Metro Pillar 464, Subhash Nagar, New Delhi, Delhi 110027'
        },
        {
            label: 'Work',
            address: 'Pacific Mall Khyala Road Opp. Metro Pillar 464, Subhash Nagar, New Delhi, Delhi 110027'
        },
    ]
    const [selectedOption, setSelectedOption] = useState('Home');
    const handleSelectOption = (label) => {
        if (selectedOption === 'Others' && label !== 'Others') {
            return;
        }
        if (label === 'Others') {
            navigation.navigate('Add Address');
        } else {
            setSelectedOption(label);
        }
    };
    
    return (
        <ScrollView style={styles.mainWrapper}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Sub Total ({totalItems} Item)</Text>
                <Text style={styles.points}>{totalPoint} Points</Text>
            </View>
            <View style={styles.paddedBox}>
                <View style={styles.container}>
                    {productData.map((product, index) => (
                        <CartProductCard key={index} product={product} />
                    ))}
                </View>
                <Text style={styles.deliveryHeader}>Confirm Your Delivery Address</Text>
                <View style={styles.containerAddress}>
                    {address.map((address, index) => (
                        <TouchableOpacity style={styles.addresses} key={index} onPress={() => handleSelectOption(address.label)}>
                            <Image
                                source={selectedOption === address.label ? blackTickImage : whiteTickImage}
                                style={styles.tick}
                            />
                            <View style={styles.blockContainer}>
                                <Text style={[styles.addressLabel, { color: selectedOption === address.label ? colors.black : colors.grey }]}>{address.label}</Text>
                                <Text style={[styles.address, { color: selectedOption === address.label ? colors.black : colors.grey }]}>{address.address}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.flexBox} key="Others" onPress={() => handleSelectOption("Others")}>
                        <Image
                            source={selectedOption === address.label ? blackTickImage : whiteTickImage}
                            style={styles.tick}
                        />
                        <Text  style={[styles.addressLabel, { color: selectedOption === "Others" ? colors.black : colors.grey }]}>Others</Text>
                        <Text style={[styles.other, { color: selectedOption === "Others" ? colors.black : colors.grey }]}>Add a new delivery address</Text>
                    </TouchableOpacity>
                </View>
                <Buttons
                    style={styles.button}
                    label={'Submit'}
                    variant="filled"
                    onPress={() => handleProceed()}
                    width="100%"
                    iconHeight={10}
                    iconWidth={30}
                    iconGap={30}
                    icon={arrowIcon}
                />
            </View>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: colors.white
    },
    headerContainer: {
        backgroundColor: colors.black,
        width: '100%',
        paddingVertical: 30,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    header: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2.2)
    },
    points: {
        color: colors.yellow,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2.2)
    },
    deliveryHeader: {
        color: colors.black,
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold'

    },
    paddedBox: {
        padding: 15
    },
    container: {
        gap: 20,
        marginVertical: 20
    },
    containerAddress: {
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        gap: 20,
        marginVertical: 10,
        marginBottom: 30
    },
    address: {
        color: colors.black,
    },
    addressLabel: {
        fontWeight: 'bold'
    },
    tick: {
        height: 15,
        width: 15,
        marginTop: 5
    },
    blockContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    flexBox: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    addresses: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start'
    }
})
export default ViewCart