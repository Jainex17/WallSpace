import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const FullImage = () => {
  const params = useLocalSearchParams();

  return (
    <>
      <View style={{ flex: 1, zIndex: 20 }}>
        <Image
          style={{ flex: 1 }}
          source={{
            uri: params.imageuri ? String(params.imageuri) : undefined,
          }}
          resizeMode="cover"
        />
      </View>
    </>
  );
};

export default FullImage;
