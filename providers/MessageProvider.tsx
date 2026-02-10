import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "./ThemeProvider";

type MessageType = "success" | "error" | "info";

type MessagePayload = {
  message: string;
  type?: MessageType;
  durationMs?: number;
};

type MessageContextValue = {
  showMessage: (payload: MessagePayload | string) => void;
  hideMessage: () => void;
};

const MessageContext = createContext<MessageContextValue | undefined>(
  undefined,
);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<MessageType>("info");

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const hideMessage = useCallback(() => {
    clearTimer();

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -12,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  }, [opacity, translateY]);

  const showMessage = useCallback(
    (payload: MessagePayload | string) => {
      const normalized: MessagePayload =
        typeof payload === "string" ? { message: payload } : payload;

      clearTimer();

      setMessage(normalized.message);
      setType(normalized.type ?? "info");
      setVisible(true);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();

      const durationMs =
        normalized.durationMs ?? (normalized.type === "error" ? 4500 : 2800);
      hideTimerRef.current = setTimeout(() => {
        hideMessage();
      }, durationMs);
    },
    [hideMessage, opacity, translateY],
  );

  const themeStyles = useMemo(() => {
    const byType: Record<
      MessageType,
      { backgroundColor: string; borderColor: string; textColor: string }
    > = {
      success: {
        backgroundColor: colors.lightgreen,
        borderColor: colors.green,
        textColor: colors.black,
      },
      error: {
        backgroundColor: colors.danger,
        borderColor: colors.danger,
        textColor: colors.background,
      },
      info: {
        backgroundColor: colors.lightblue,
        borderColor: colors.blue,
        textColor: colors.black,
      },
    };

    return byType[type];
  }, [colors, type]);

  const value = useMemo<MessageContextValue>(
    () => ({
      showMessage,
      hideMessage,
    }),
    [hideMessage, showMessage],
  );

  return (
    <MessageContext.Provider value={value}>
      {children}

      {visible ? (
        <View pointerEvents="box-none" style={styles.overlay}>
          <Animated.View
            style={[
              styles.toast,
              {
                backgroundColor: themeStyles.backgroundColor,
                borderColor: themeStyles.borderColor,
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            <Pressable onPress={hideMessage} style={styles.pressable}>
              <Text style={[styles.text, { color: themeStyles.textColor }]}>
                {message}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      ) : null}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within MessageProvider");
  }
  return context;
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  toast: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
  },
  pressable: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
