import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import colors from '../../colors';

interface CarouselItem {
  imageUrl: string;
}

interface ReusableUrlCarouselProps {
  data: CarouselItem[];
  autoChangeInterval?: number;
  carouselHeight?: number;
}

const ReusableUrlCarousel: React.FC<ReusableUrlCarouselProps> = ({
  data,
  autoChangeInterval = 5000,
  carouselHeight = 200,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item, index }: { item: CarouselItem; index: number }) => {

  const url = item.imageUrl;

  return (
    <View style={[styles.carouselItem, { height: carouselHeight }]}>
      <Image
        source={{ uri: url }}
        containerStyle={styles.carouselImageContainer}
        style={styles.carouselImage}
        parallaxFactor={0.4}
        showSpinner={true}
        spinnerColor={colors.primary}
        spinnerSize={15}
        resizeMode="contain"
      />
    </View>
  );
};

  

  const screenWidth = Dimensions.get('window').width;

  const changeImage = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  useEffect(() => {
    const timer = setInterval(changeImage, autoChangeInterval);

    return () => {
      clearInterval(timer);
    };
  }, [activeIndex]);

  return (
    <View style={{ height: carouselHeight }}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        loop={true}
        onSnapToItem={(index) => setActiveIndex(index)}
        firstItem={activeIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImageContainer: {
    flex: 1,
    borderRadius: 8,
  },
  carouselImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8
  },
});

export default ReusableUrlCarousel;
