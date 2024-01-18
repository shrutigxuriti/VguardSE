import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../../../../../../colors';
import Buttons from '../../../../../components/Buttons';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
// Import the DatePicker component
import DatePicker from '../../../../../components/DatePicker';

const AddAddress = ({ navigation }) => {
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [state, setState] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [pinCode, setPinCode] = useState('');

    // State and functions related to DatePicker
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleShowDatePicker = () => {
        setShowDatePicker(true);
    };

    const handleSaveAddress = () => {
        const newAddress = {
            addressLine1,
            addressLine2,
            state,
            city,
            landmark,
            pinCode,
        };

        saveAddress(newAddress);

        navigation.navigate('View Cart');
    };

    const saveAddress = (newAddress: any) => {
        console.log(newAddress);
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.header}>Please Fill the below details to get the redeemed products on the new delivery address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="House Flat/Block No."
                    placeholderTextColor="gray"
                    value={addressLine1}
                    onChangeText={(text) => setAddressLine1(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Street/Colony/Locality"
                    placeholderTextColor="gray"
                    value={addressLine2}
                    onChangeText={(text) => setAddressLine2(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="State"
                    placeholderTextColor="gray"
                    value={state}
                    onChangeText={(text) => setState(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    placeholderTextColor="gray"
                    value={city}
                    onChangeText={(text) => setCity(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Landmark"
                    placeholderTextColor="gray"
                    value={landmark}
                    onChangeText={(text) => setLandmark(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Pin Code"
                    placeholderTextColor="gray"
                    value={pinCode}
                    onChangeText={(text) => setPinCode(text)}
                />

                {/* Include the DatePicker component */}
                <DatePicker
                    date={date}
                    onDateChange={handleDateChange}
                    showDatePicker={showDatePicker}
                    onShowDatePicker={handleShowDatePicker}
                />
            </View>

            <View style={styles.button}>
                <Buttons
                    label={'Confirm New Address'}
                    variant="filled"
                    onPress={handleSaveAddress}
                    width="100%"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        color: colors.black,
        fontSize: responsiveFontSize(2.2),
        textAlign: 'center',
        marginBottom: 20
    },
    container: {
        padding: 20,
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between'
    },
    wrapper: {
        height: '100%',

    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black
    },
    input: {
        borderColor: colors.lightGrey,
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        color: colors.black,
        marginBottom: 10,
    },
    button: {
        marginBottom: 30
    }
});

export default AddAddress;
