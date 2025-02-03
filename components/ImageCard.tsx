import React, { useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

interface ImageCardProps {
    imageUrl: string;
    title: string;
    onPress?: () => void;
}

const ImageCard = ({ imageUrl, title, onPress }: ImageCardProps) => {
  const [loading, setLoading] = useState(true);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const memorizedImage = useMemo(() => (
    <Image
      style={styles.image}
      source={{ uri: imageUrl }}
      onLoadStart={handleLoadStart}
      onLoadEnd={handleLoadEnd}
      onLoad={handleLoad}
      resizeMode="cover"
    />
  ), [imageUrl]);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View>
        {loading && (
          <View 
            style={[styles.image, styles.skeleton]}
          />
        )}
        {memorizedImage}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    margin: 10,
    overflow: 'hidden',
  },
  image: {
    height: 250,
    flex: 1
  },
  textContainer: {
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    width: '100%',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  skeleton: {
    backgroundColor: "grey",
    position: 'absolute',
    width: '100%',
    height: 250,
  }
});

export default ImageCard;