// PickerField.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Picker } from '@react-native-picker/picker';

const PickerField: React.FC<PickerFieldProps> = ({
    label,
    errorMessage,
    disabled,
    selectedValue,
    onValueChange,
    items,
}) => {
    const [isFocused, setIsFocused] = useState(true);
    const [hasValue, setHasValue] = useState(Boolean(selectedValue));

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(Boolean(selectedValue)); // Update focus based on whether a value is selected
    };

    const handleValueChange = (value: string) => {
        setHasValue(Boolean(value));
        onValueChange(value);
    };

    return (
        <View style={[styles.container, isFocused || hasValue ? styles.focusedContainer : null]}>
            <Text style={[styles.label, isFocused || hasValue ? styles.focusedLabel : null]}>
                {label}
            </Text>
            <View style={styles.flexbox}>
                <Picker
                    style={[styles.picker, disabled && styles.disabledPicker]}
                    enabled={!disabled}
                    onValueChange={handleValueChange}
                    selectedValue={selectedValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                >
                    {items?.map((item) => (
                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                </Picker>
            </View>
            {/* {errorMessage && <Text style={styles.error}>{errorMessage}</Text>} */}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        height: 50,
        marginBottom: 20,
        borderColor: colors.lightGrey,
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    focusedContainer: {
        borderColor: colors.grey,
    },
    label: {
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold',
        color: colors.black,
        backgroundColor: colors.white,
        paddingHorizontal: 3,
    },
    focusedLabel: {
        position: 'absolute',
        top: -8,
        left: 10,
        fontSize: responsiveFontSize(1.5),
        color: colors.black,
    },
    picker: {
        color: colors.black,
        // backgroundColor: colors.yellow,
        flex: 1
    },
    disabledPicker: {
        color: colors.grey,
    },
    error: {
        color: 'red',
        marginTop: 5,
    },
    flexbox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        top: -10,
    },
    
});

export default PickerField;
