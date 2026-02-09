import { LinearGradient } from "expo-linear-gradient";
import { router, type Href } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useTheme } from "../../providers/ThemeProvider";
import { PrimaryButton } from "../PrimaryButton";
// import { bgImage } from "../../assets/images/auth/bg.png";

export default function WelcomeScreen() {
  const { colors } = useTheme();

  const [showButton, setShowButton] = useState(false);

  const welcomeOpacity = useRef(new Animated.Value(1)).current;
  const welcomeTranslateY = useRef(new Animated.Value(0)).current;

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(welcomeOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowButton(true);
        Animated.parallel([
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(buttonTranslateY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      });

      Animated.timing(welcomeTranslateY, {
        toValue: -6,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, [buttonOpacity, buttonTranslateY, welcomeOpacity, welcomeTranslateY]);

  const handleLoginPress = () => {
    router.push("/(auth)/login" as Href);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/auth/bg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }} />
      <LinearGradient
        colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: "#FFFFFF" }]}>PartFinder</Text>
          <Text style={[styles.subtitle, { color: "#B8B8B8" }]}>
            The Visual Search Engine for Industrial Hardware
          </Text>

          {!showButton ? (
            <Animated.Text
              style={[
                styles.welcome,
                { color: colors.primary, opacity: welcomeOpacity },
                { transform: [{ translateY: welcomeTranslateY }] },
              ]}
            >
              Welcome
            </Animated.Text>
          ) : (
            <Animated.View
              style={{
                opacity: buttonOpacity,
                transform: [{ translateY: buttonTranslateY }],
                alignSelf: "stretch",
              }}
            >
              <PrimaryButton
                title="Login with PartFinder"
                onPress={handleLoginPress}
              />
            </Animated.View>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  content: {
    gap: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  welcome: {
    fontSize: 48,
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});
