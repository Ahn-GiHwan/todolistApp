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
  Alert,
} from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { Feather } from "@expo/vector-icons";

export default function App() {
  LogBox.ignoreLogs(["Remote debugger"]);

  const [working, setWorking] = useState(false);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  const STORAGE_TODO_KEY = "@todos";
  const STORAGE_WORKING_KEY = "@working";

  useEffect(() => {
    getStorage();
    getTodos();
  }, []);

  useEffect(() => {
    setText("");
  }, [working]);

  const setStorage = async (str) => {
    try {
      await AsyncStorage.setItem(STORAGE_WORKING_KEY, JSON.stringify(str));
    } catch (error) {
      alert(error);
    }
  };
  const getStorage = async () => {
    try {
      const getWorking = await AsyncStorage.getItem(STORAGE_WORKING_KEY);
      if (getWorking) setWorking(JSON.parse(getWorking));
    } catch (error) {
      alert("error: ", e);
    }
  };

  const work = async () => {
    setWorking(true);
    await setStorage(true);
  };

  const travel = async () => {
    setWorking(false);
    await setStorage(false);
  };
  const onChangeText = (payload) => {
    setText(payload);
  };

  const saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem(STORAGE_TODO_KEY, JSON.stringify(todos));
    } catch (e) {
      alert("error: ", e);
    }
  };

  const getTodos = async () => {
    try {
      const todos = await AsyncStorage.getItem(STORAGE_TODO_KEY);
      if (todos) setTodos(JSON.parse(todos));
    } catch (e) {
      alert("error: ", e);
    }
  };

  const addTodo = async (data) => {
    if (!text) return;
    const newTodos = {
      ...data,
      [Date.now()]: { text, working, isChecked: false },
    };
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  const deleteTodo = (id, text) => {
    Alert.alert(`[${text}] 삭제`, "정말 삭제하겠습니까?", [
      { text: "Cancel" },
      {
        text: "OK",
        onPress: async () => {
          const newTodos = { ...todos };
          delete newTodos[id];
          setTodos(newTodos);
          await saveTodos(newTodos);
        },
      },
    ]);
  };

  const setChecked = async (id) => {
    const newTodos = { ...todos };
    newTodos[id].isChecked = !newTodos[id].isChecked;
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  const setTodoText = async (id, value) => {
    const newTodos = { ...todos };
    newTodos[id].text = value;
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  const editTodo = (key, text) => {
    Alert.prompt(
      `[${text}] 수정`,
      "바꿀 내용을 입력하세요",
      (e) => {
        setTodoText(key, e);
      },
      "plain-text",
      text
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
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
        onSubmitEditing={() => addTodo(todos)}
        value={text}
      />
      <ScrollView>
        {Object.keys(todos).map(
          (key) =>
            todos[key].working === working && (
              <View key={key} style={styles.todo}>
                <View style={styles.todoLeft}>
                  <Checkbox
                    style={styles.checkbox}
                    value={todos[key].isChecked}
                    onValueChange={() => setChecked(key)}
                    color={todos[key].isChecked ? theme.grey : "white"}
                  />
                  {todos[key].isChecked ? (
                    <Text style={styles.todoTextCheck}>{todos[key].text}</Text>
                  ) : (
                    <Text style={styles.todoText}>{todos[key].text}</Text>
                  )}
                </View>
                <View style={styles.icons}>
                  <TouchableOpacity
                    onPress={() => editTodo(key, todos[key].text)}
                  >
                    <Feather name="edit" size={18} color="#2BF603" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteTodo(key, todos[key].text)}
                  >
                    <Feather name="x" size={24} color="red" />
                  </TouchableOpacity>
                </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 17,
    borderRadius: 15,
  },
  todoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  todoTextCheck: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "line-through",
    color: theme.grey,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: 50,
  },
});
