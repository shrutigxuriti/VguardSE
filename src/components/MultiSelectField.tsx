// MultiSelectField.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import colors from '../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { height, width } from '../utils/dimensions';

interface PickerItem {
    label: string;
    value: string;
}

interface MultiSelectFieldProps {
    label: string;
    errorMessage?: string;
    disabled?: boolean;
    selectedValues: string[];
    onValuesChange: (values: string[]) => void;
    items: PickerItem[];
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
    label,
    errorMessage,
    disabled,
    selectedValues = [], // Ensure selectedValues is initialized as an array
    onValuesChange,
    items,
}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedValuesText, setSelectedValuesText] = useState('');

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleToggleValue = (value: string) => {
        const updatedValues = selectedValues?.includes(value)
            ? selectedValues.filter((item) => item !== value)
            : [...selectedValues, value];
        onValuesChange(updatedValues);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        console.log("selectedValues", selectedValues);

        if (Array.isArray(selectedValues) && selectedValues.length > 0) {
            setSelectedValuesText(selectedValues.join(', '));
        } else {
            setSelectedValuesText('');
        }
    }, [selectedValues]);



    return (
        <View style={[styles.container, isModalVisible ? styles.focusedContainer : null]}>
            <TouchableOpacity onPress={toggleModal}>
                <Text style={[styles.label, isModalVisible ? styles.focusedLabel : null]}>{label}</Text>
                <TextInput
                    style={styles.selectedValuesTextInput}
                    value={selectedValuesText}
                    editable={false}
                />
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                onRequestClose={closeModal}
                animationType="slide"
                transparent={true}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPressOut={closeModal}
                >
                    <View style={styles.modalContent}>
                        {items.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                onPress={() => handleToggleValue(item.value)}
                                disabled={disabled}
                                style={styles.checkboxContainer}
                            >
                                <View style={styles.checkbox}>
                                    {selectedValues?.includes(item.value) ? (
                                        <Image
                                            source={require('../assets/images/tick_1.png')}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <Image
                                            source={require('../assets/images/tick_1_notSelected.png')}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="contain"
                                        />
                                    )}
                                </View>
                                <Text style={{ color: colors.black }}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}

                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    checkbox: {
        width: 20,
        height: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedValuesTextInput: {
        color: colors.black
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: width / 1.8,
        borderRadius: 5,
        alignSelf: 'center',
        minHeight: height / 8,
        margin: 20,
        backgroundColor: colors.white,
        padding: 10,
        elevation: 10,
    },
    
});

export default MultiSelectField;
