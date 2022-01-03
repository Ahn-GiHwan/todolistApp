import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  LogBox,
} from "react-native";
import { theme } from "./color";

export default function App() {
  LogBox.ignoreLogs(["Remote debugger"]);

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  useEffect(() => {
    setText("");
  }, [working]);

  const work = () => setWorking(true);
  const travel = () => setWorking(false);
  const onChangeText = (payload) => {
    setText(payload);
  };

  const addTodo = () => {
    if (!text) return;

    const newTodos = { ...todos, [Date.now()]: { text, working } };

    setTodos(newTodos);
    setText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnsText,
              color: working ? "white" : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnsText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        returnKeyType="done"
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
        value={text}
      />
      <ScrollView>
        {Object.keys(todos).map(
          (key) =>
            todos[key].working === working && (
              <View key={key} style={styles.todo}>
                <Text style={styles.todoText}>{todos[key].text}</Text>
              </View>
            )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnsText: {
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  todo: {
    backgroundColor: theme.todoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
