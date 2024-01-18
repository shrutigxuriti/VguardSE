import React from 'react';
import { View, Image, ImageBackground, StyleSheet } from 'react-native';

const BottomTabLogo: React.FC = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        resizeMethod="resize"
        source={require('../assets/images/ic_home_logo_bg2.png')}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoImage}
            resizeMode="contain"
            source={require('../assets/images/rishta_retailer_logo.webp')}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '20%',
  },
  imageBackground: {
    marginTop: 'auto',
    height: 80,
    width: 100,
  },
  logoContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-around',
  },
  logoImage: {
    height: '50%',
    width: '50%',
    marginLeft: '10%',
  },
});

export default BottomTabLogo;
