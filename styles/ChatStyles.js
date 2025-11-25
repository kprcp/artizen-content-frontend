import { Dimensions, Platform, StyleSheet } from "react-native"

const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    ...(Platform.OS === "web" ? { height: "100vh" } : {}),
  },

  header: {
    width: "100%",
    height: 70,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: "contain",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // ----- thread list styles -----
  threadList: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 20,
    width: "100%",
    flexGrow: 1, // ✅ important for RN-web scrolling
  },

  threadCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    marginHorizontal: 15, // matches SearchScreen spacing
  },
  threadImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#aaa",
    marginRight: 12,
  },
  noPicContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#aaa",
    marginRight: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  noPicText: {
    textAlign: "center",
    color: "#444",
    fontSize: 10,
    lineHeight: 14,
  },
  threadCenter: {
    flex: 1,
    minWidth: 0, // allows ellipsis
  },
  threadName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  threadSnippet: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  threadRight: {
    marginLeft: 10,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  threadDate: {
    fontSize: 11,
    color: "#666",
    textAlign: "right",
    maxWidth: 140, // wrap onto 2 lines if needed
  },

  // placeholder styles
  chatPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.1,
  },
  chatPlaceholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },

  // card style kept for consistency
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    marginHorizontal: 15,
  },

  // ✅ NEW: wrapper + list styles for scrolling
  listWrapper: {
    flex: 1,
    minHeight: 0, // allow FlatList to overflow & scroll
  },
  list: {
    flex: 1,
    ...(Platform.OS === "web" ? { overflowY: "auto" } : {}),
  },
})
