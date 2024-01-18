import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import colors from '../../../../../../../colors';

const ProductRegistration: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.oval}
        onPress={() => navigation.navigate('Scan Code', {type: 'SCAN_IN'})}>
        <Image
          style={styles.imageArrow}
          source={require('../../../../../../assets/images/ic_back_arrow.png')}
          resizeMode="contain"
        />
        <View style={[{alignItems: 'center'}]}>
          <Text style={styles.text}>Scan-In</Text>
          <Text style={styles.text}>(Retailer Purchase)</Text>
        </View>
        <Image
          source={require('../../../../../../assets/images/qr_code.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.oval}
        onPress={() => navigation.navigate('Product Registration Form')}>
        <Image
          source={require('../../../../../../assets/images/qr_code.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={[{alignItems: 'center'}]}>
          <Text style={styles.text}>Scan-Out</Text>
          <Text style={styles.text}>(Customer Sale)</Text>
        </View>
        <Image
          source={require('../../../../../../assets/images/ic_back_arrow.png')}
          style={styles.imageArrowRight}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: colors.black,
  },
  oval: {
    height: responsiveHeight(10),
    backgroundColor: colors.white,
    width: '90%',
    borderRadius: 100,
    marginBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    flex: 1,
    width: responsiveHeight(5),
    height: responsiveHeight(5),
  },
  imageArrow: {
    flex: 1,
    width: responsiveHeight(2),
    height: responsiveHeight(2),
  },
  imageArrowRight: {
    flex: 1,
    width: responsiveHeight(2),
    height: responsiveHeight(2),
    transform: [{rotate: '180deg'}],
  },
});

export default ProductRegistration;
