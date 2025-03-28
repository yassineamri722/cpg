// Background.js
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

const Background = ({ children, overlayColor = 'rgba(0, 0, 0, 0.5)', image }) => {
  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Background;
