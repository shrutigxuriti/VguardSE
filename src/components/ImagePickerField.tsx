import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import colors from '../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { getFile, sendFile } from '../utils/apiservice';
import Popup from './Popup';
import { getImageUrl } from '../utils/FileUtils';

const { width, height } = Dimensions.get('window');

interface ImagePickerFieldProps {
    label: string;
    onImageChange?: (image: string, type: string, imageName: string, label: string) => void;
    imageRelated: string;
    initialImage?: string;
    getImageRelated?: string;
    editable?: boolean;
}


const ImagePickerField: React.FC<ImagePickerFieldProps> = ({ label, onImageChange, imageRelated, initialImage, getImageRelated, editable = true }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
    const [showImagePickerModal, setShowImagePickerModal] = useState(false);
    const [select, setSelect] = useState('');
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [entityUid, setEntityUid] = useState<string>('');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [showImageModal, setShowImageModal] = useState(false);
    useEffect(() => {
        const fetchImage = async () => {
            if (initialImage) {
                try {
                    // const image = await getFile(initialImage, imageRelated, "2");
                    const image = await getImageUrl(initialImage, getImageRelated);
                    setIsImageSelected(true);
                    setSelectedImage(image);
                    setSelectedImageName(initialImage);
                    console.log(image, "<><><URL<><><")
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            }
        };

        fetchImage();
    }, [initialImage]);

    const handleImagePickerPress = () => {
        setShowImagePickerModal(true);
    };

    const handleImageModalToggle = () => {
        setShowImageModal(!showImageModal);
    };

    const handleCameraUpload = () => {
        setShowImagePickerModal(false);
        launchCamera(
            {
                mediaType: 'photo',
                includeBase64: false,
            },
            (response: ImagePickerResponse) => {
                handleImageResponse(response);
            },
        );
    };

    const handleGalleryUpload = () => {
        setShowImagePickerModal(false);
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
            },
            (response: ImagePickerResponse) => {
                handleImageResponse(response);
            },
        );
    };

    const handleImageResponse = async (response: ImagePickerResponse) => {
        const fileData = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
        };

        if (response.didCancel) {
            console.log('Image picker was canceled');
        } else if (response.error) {
            console.error('Image picker error: ', response.error);
        } else {
            setSelectedImage(response?.assets[0]?.uri);
            setSelectedImageName(response?.assets[0]?.fileName || 'Image');
            setIsImageSelected(true);

            try {
                // const apiResponse = await triggerApiWithImage(fileData);
                onImageChange(response?.assets[0]?.uri, response?.assets[0]?.type, response?.assets[0]?.fileName, label);
            } catch (error) {
                console.log('Error triggering API with image in ImagePickerField:', error);
                throw error;
            }
        }
    };
    return (
        <View style={styles.container}>
            <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
                <Text>{popupContent}</Text>
            </Popup>
            <TouchableOpacity style={[styles.input, isImageSelected && styles.selectedContainer]}
                onPress={editable ? handleImagePickerPress : undefined}
            >
                <View style={[styles.labelContainer, !selectedImage && styles.notSelectedLabelContainer]}>
                    <Text style={[styles.notfocusedLabel, isImageSelected && styles.focusedLabel]} >
                        {label}
                    </Text>
                </View>
                {selectedImage ? (

                    <View style={styles.imageContainer}>
                        <Text style={styles.imageName}>{label}</Text>
                        <TouchableOpacity onPress={handleImageModalToggle}>
                            <ImageBackground
                                source={require('../assets/images/no_image.webp')}
                                style={styles.image}
                                resizeMode="cover"
                            >
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            </ImageBackground>
                            {/* <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" /> */}
                        </TouchableOpacity>
                    </View>

                ) : (
                    <View style={styles.cameraContainer}>
                        <Text style={styles.label}>
                            {label}
                        </Text>
                        <Image
                            source={require('../assets/images/photo_camera.png')}
                            style={styles.cameraImage}
                            resizeMode="contain"
                        />
                    </View>
                )}
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showImageModal}
                onRequestClose={handleImageModalToggle}

            >
                <View style={styles.modalcontainer}>
                    <TouchableOpacity
                        onPress={handleImageModalToggle}>
                        <Image resizeMode='contain' style={{ width: 50, height: 50 }} source={require('../assets/images/ic_close.png')} />
                    </TouchableOpacity>
                    <Image source={{ uri: selectedImage }} style={{ width: '70%', height: '70%' }} resizeMode="contain" />
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showImagePickerModal}
                hardwareAccelerated={true}
                opacity={0.3}
            >
                <View style={styles.modalContent}>
                    <Picker
                        mode="dropdown"
                        style={{ color: 'black' }}
                        selectedValue={select}
                        onValueChange={(itemValue, itemIndex) => {
                            if (itemValue === 'Open camera') {
                                handleCameraUpload();
                            } else if (itemValue === 'Open Image picker') {
                                handleGalleryUpload();
                            }
                        }}
                    >
                        <Picker.Item label="Select Action" value="" />
                        <Picker.Item label="Select Photo from gallery" value="Open Image picker" />
                        <Picker.Item label="Capture Photo from camera" value="Open camera" />
                    </Picker>
                    <Button mode="text" onPress={() => setShowImagePickerModal(false)}>
                        Close
                    </Button>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderColor: colors.lightGrey,
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        position: 'relative',
    },
    labelContainer: {
        position: 'absolute',
        top: 0,
        left: 10,
        right: 0,
        justifyContent: 'center',
        zIndex: 1,
    },
    label: {
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold',
        color: colors.black,
        width: '92%',
    },
    focusedLabel: {
        position: 'absolute',
        top: -10,
        left: 0,
        fontSize: responsiveFontSize(1.5),
        fontWeight: 'bold',
        color: colors.black,
        // backgroundColor: colors.white,
        paddingHorizontal: 3,
    },
    notfocusedLabel: {
        display: 'none'
    },
    cameraContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cameraImage: {
        width: 25,
        height: 20,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: 25,
        height: 20,
        marginRight: 10,
        backgroundColor: colors.lightGrey
    },
    modalContent: {
        width: width / 1.8,
        alignSelf: 'center',
        height: height / 8,
        top: height / 2.8,
        margin: 20,
        backgroundColor: '#D3D3D3',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 100,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    imageName: {
        color: colors.black,
        fontSize: responsiveFontSize(1.5),
        width: '92%'
    },
    selectedContainer: {
        borderColor: colors.grey,
    },
    modalcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalImageContent: {
        backgroundColor: 'white',
        padding: 20,
        gap: 10,
        borderRadius: 10,
        alignItems: 'center',
    }
});

export default ImagePickerField;
