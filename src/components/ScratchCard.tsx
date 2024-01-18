import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { ScratchCard } from 'rn-scratch-card';

interface ScratchCardProps {
  color?: string;
  fontWeight?: string;
  fontSize?: number;
  textContent: string;
}

interface RewardImageProps {
  resourceLocation?: number;
  resourceUrl?: string;
}

interface ButtonProps {
  buttonText?: string;
  buttonAction?:Function;
}

interface ScratchCardComponentProps {
  visible: boolean;
  onClose: () => void;
  scratchCardProps: {
    textInput?: boolean;
    rewardImage: RewardImageProps;
    rewardResultText: ScratchCardProps;
    text1: ScratchCardProps;
    text2: ScratchCardProps;
    text3: ScratchCardProps;
    button: ButtonProps;
  };
  scratchable?: boolean;
}

const RewardBox: React.FC<ScratchCardComponentProps> = ({
  visible,
  onClose,
  scratchCardProps,
  scratchable = true,
}) => {
  const [text, onChangeText] = useState('');
  const [show, setShow] = React.useState(scratchable);

  function handleScratch(scratchPercentage: number) {
    if (scratchPercentage > 30) {
        setShow(false);
    }
  }

  const styles = StyleSheet.create({
    scratch_card: {
      height: '100%',
      width: '100%',
      // display:"none"
    },

    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    buttonClose: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      height: 60,
      width: 60,
    },
    modalImage: {
      width: 100,
      height: 100,
      marginVertical: 10,
    },
    modalButton: {
      padding: 10,
      marginVertical: 10,
      backgroundColor: '#F0C300',
    },
    textInputWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    text: {
      color: scratchCardProps?.rewardResultText?.color || 'blue',
      fontWeight: scratchCardProps?.rewardResultText?.fontWeight || '500',
      fontSize: scratchCardProps?.rewardResultText?.fontSize || 16,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    textInputAlign: {
      color: 'black',
      borderColor: 'black',
      borderWidth: 1,
      width: '80%',
      borderRadius: 10,
      placeholderTextColor: 'black',
      paddingLeft: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    rewardImage: { height: 100, width: 100, alignSelf: 'center' },
    text1: {
      color: scratchCardProps?.text1?.color || 'blue',
      fontWeight: scratchCardProps?.text1?.fontWeight || '500',
      fontSize: scratchCardProps?.text1?.fontSize || 16,
      marginTop: 5,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    text2: {
      color: scratchCardProps?.text2?.color || 'blue',
      fontWeight: scratchCardProps?.text2?.fontWeight || '500',
      fontSize: scratchCardProps?.text2?.fontSize || 16,
      marginTop: 5,
      textAlign: 'center',
    },
    text3: {
      color: scratchCardProps?.text3?.color || 'blue',
      fontWeight: scratchCardProps?.text3?.fontWeight || '500',
      fontSize: scratchCardProps?.text3?.fontSize || 16,
      textAlign: 'center',
      marginTop: 5,
    },
    regWarButton: { textAlign: 'center', color: 'black' },
  });

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(217, 217, 217, 0.5)'
        }}>
        <View style={{ width: 350, height: 320 }}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose}>
                <Image
                  style={styles.buttonClose}
                  source={require('../assets/images/ic_close.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.textInputWrapper}>
              {scratchCardProps?.textInput && (
                <TextInput
                  style={styles.textInputAlign}
                  onChangeText={onChangeText}
                  value={text}
                  placeholder="Enter text here"
                  placeholderTextColor="grey"
                />
              )}
            </View>

            {scratchCardProps?.rewardImage?.resourceLocation && (
              <Image
                style={styles.rewardImage}
                source={scratchCardProps?.rewardImage?.resourceLocation}
              />
            )}

            {scratchCardProps?.rewardImage?.resourceUrl && (
              <Image
                style={styles.rewardImage}
                source={{
                  uri:
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
                }}
              />
            )}

            <Text style={styles.text}>
              {scratchCardProps?.rewardResultText?.textContent}
            </Text>
            <Text style={styles.text1}>
              {scratchCardProps?.text1?.textContent}
            </Text>
            <Text style={styles.text2}>
              {scratchCardProps?.text2?.textContent}
            </Text>
            <Text style={styles.text3}>
              {scratchCardProps?.text3?.textContent}
            </Text>

            {scratchCardProps?.button?.buttonText && (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={scratchCardProps?.button?.buttonAction}>
                <Text style={styles.regWarButton}>
                  {scratchCardProps?.button?.buttonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {show && (
            <ScratchCard
              source={require('../assets/images/ic_scratch_card_greeting_2.webp')}
              brushWidth={40}
              style={[styles.scratch_card, show]}
              onScratch={handleScratch}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default RewardBox;

// const scratchCardProps = {
//   rewardImage : { width:100, height:100, resourceLocation:require("../../../assets/images/ic_rewards_gift.png"), /*resourceUrl:"https://www.leavesofgrassnewyork.com/cdn/shop/products/gift-card_612x.jpg?v=1614324792"*/ },
//   rewardResultText:{ color:"black", fontSize:16, textContent:"YOU WON",fontWeight:"700" },
//   text1:{ color:"black", fontSize:16, textContent:"20.00", fontWeight:"700" },
//   text2:{ color:"black", fontSize:16, textContent:"POINTS", fontWeight:"700" },
//   text3:{ color:"#9c9c9c", fontSize:12, textContent:"Base Points: 20.00", fontWeight:"700" },
//   button:{ buttonColor :"#F0C300", buttonTextColor:"black", buttonText:"Register Warranty", buttonAction:"", fontWeight:"400" },
//   textInput:false
// }