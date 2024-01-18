// DatePickerField.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import colors from '../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

interface DatePickerFieldProps {
    label: string;
    date: string | undefined;
    onDateChange: (date: string) => void;
}


const DatePickerField: React.FC<DatePickerFieldProps> = ({ label, date, onDateChange }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate: Date) => {
        hideDatePicker();
        const formattedDate = selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        onDateChange(formattedDate);
    };

    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity onPress={showDatePicker}>
                <View style={styles.container}>
                    <Text style={styles.input}>{date}</Text>
                </View>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        height: 50,
        marginBottom: 20,
        borderColor: colors.grey,
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    label: {
        position: 'absolute',
        top: -8,
        left: 10,
        fontSize: responsiveFontSize(1.5),
        color: colors.black,
        backgroundColor: colors.white,
        paddingHorizontal: 3,
        fontWeight: 'bold',
        zIndex: 999
    },
    input: {
        color: colors.black,
        paddingTop: 10,
    },
});

export default DatePickerField;
