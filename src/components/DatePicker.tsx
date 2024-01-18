import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import colors from '../../colors';

interface DatePickerProps {
    date: Date | null;
    onDateChange: (event: Event, selectedDate?: Date) => void;
    showDatePicker: boolean;
    onShowDatePicker: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ date, onDateChange, showDatePicker, onShowDatePicker }) => {
    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="Select date"
                value={date ? date.toLocaleDateString() : ''}
                onFocus={onShowDatePicker}
            />
            {showDatePicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="calendar"
                    onChange={onDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderColor: "transparent",
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 10,
        color: colors.black,
    },
});

export default DatePicker;
