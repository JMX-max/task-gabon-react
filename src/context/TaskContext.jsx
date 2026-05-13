import { createContext, useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setTasks(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, authLoading]);

  const addTask = async (task) => {
    if (!user) return;

    await addDoc(collection(db, "users", user.uid, "tasks"), {
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      completed: false,
      createdAt: Date.now(),
    });
  };

  const updateTask = async (taskId, updatedTask) => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "tasks", taskId), {
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      category: updatedTask.category,
    });
  };

  const toggleTask = async (taskId, completed) => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "tasks", taskId), {
      completed: !completed,
    });
  };

  const deleteTask = async (taskId) => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}