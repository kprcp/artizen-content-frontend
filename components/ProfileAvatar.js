import { Image, StyleSheet, Text, View } from "react-native";

const ProfileAvatar = ({ name, imageUrl, size = 60, borderRadius = 12, style }) => {
  const initial = (name?.trim()?.charAt(0) || "?").toUpperCase();
  const dimStyle = { width: size, height: size, borderRadius };
  const fontSize = Math.round(size * 0.35); // scales the letter with size

  return (
    <View style={[styles.container, dimStyle, style]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={[styles.image, { borderRadius }]} />
      ) : (
        <View style={[styles.initialContainer, { borderRadius }]}>
          <Text style={[styles.initialText, { fontSize }]}>{initial}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  initialContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  initialText: {
    fontWeight: "bold",
    color: "#555",
  },
});

export default ProfileAvatar;
