import { Platform, StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    ...(Platform.OS === "web" ? { height: "100vh" } : {}),
  },

  header: {
    height: 70,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  listWrapper: {
  flex: 1,
  minHeight: 0,
  flexBasis: 0,                 // ✅ web flex bug fix
  ...(Platform.OS === "web" ? { overflow: "hidden" } : {}),
},
loadMoreButton: {
  marginTop: 12,
  marginBottom: 12,
  alignSelf: "center",
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#ccc",
  flexDirection: "row",
  alignItems: "center",
},
loadMoreText: {
  marginRight: 6,
  color: "#333",
  fontSize: 14,
},


  list: {
    flex: 1,
  },

  webScroll: {
    flex: 1,
    height: "100%",
    ...(Platform.OS === "web" ? { overflowY: "auto" } : {}),
  },

  listContent: {
  paddingVertical: 10,
  paddingHorizontal: 16,  
},

  messageWrapper: {
    width: "100%",
    marginBottom: 10,
  },

  timestamp: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
    alignSelf: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 20,
  },
  bubbleMe: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
  },
  textMe: {
    color: "#fff",
  },
  textOther: {
    color: "#333",
  },

  inputContainer: {
  height: 70,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
  borderTopWidth: 1,
  borderColor: "#ddd",
  backgroundColor: "#fff",
  ...(Platform.OS === "web"
    ? { position: "sticky", bottom: 0, zIndex: 999 }
    : {}),
},

  input: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
})



export default styles
