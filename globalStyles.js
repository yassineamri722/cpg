import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3f51b5",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 15,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  primaryBtn: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelBtn: {
    backgroundColor: "#9CA3AF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  editBtn: {
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
});


export default styles;
