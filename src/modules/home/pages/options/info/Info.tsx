import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import ReusableCarousel from '../../../../../components/ReusableCarousel';
import colors from '../../../../../../colors';
import CustomTouchableOption from '../../../../../components/CustomTouchableOption';
import NeedHelp from '../../../../../components/NeedHelp';
import { useTranslation } from 'react-i18next';
import { getInfoDeskBanners } from '../../../../../utils/apiservice';
import ReusableUrlCarousel from '../../../../../components/ReusableUrlCarousel';
const Info: React.FC = () => {
  const { t } = useTranslation();

  const imageUrl = "https://vguardrishta.com/";

  const carouselData = [
    { imageUrl: require('../../../../../assets/images/banner_redeem_ppoints.webp') },
    { imageUrl: require('../../../../../assets/images/banner.webp') },
    { imageUrl: require('../../../../../assets/images/banner_redeem_ppoints.webp') },
  ];

  const [imageArray, setImageArray] = useState(null);

  useEffect(() => {
    console.log("Image loading");
    getInfoDeskBanners()
      .then(response => response.data
        .then(result => {
          console.log("Result:", result)
          var ar = [];
          result.map(r => ar.push({ imageUrl: imageUrl + r.imgPath }));
          setImageArray(ar)
          const image = imageArray;
          console.log("Image Array", image)
        }))
  }, [])


  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        {imageArray &&
          <ReusableUrlCarousel data={imageArray} />
        }
      </View>
      <View style={styles.mainWrapper}>
        <View style={styles.options}>
          <CustomTouchableOption
            text="strings:v_guard_info"
            iconSource={require('../../../../../assets/images/ic_vguard_info.webp')}
            screenName="V-Guard Info"
          />
          <CustomTouchableOption
            text="strings:downloads_small"
            iconSource={require('../../../../../assets/images/ic_downloads_.webp')}
            screenName="Downloads"
            disabled={true}
          />
          <CustomTouchableOption
            text="strings:v_guard_product_catalog"
            iconSource={require('../../../../../assets/images/ic_vguard_product_catalog.webp')}
            screenName="Product Catalogue"
            disabled={true}
          />
        </View>
        <NeedHelp />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  carousel: {
    backgroundColor: colors.white,
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  mainWrapper: {
    padding: 15,
  },
});

export default Info;
