/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";

function AddNoteForm() {
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteDescription, setNewNoteDescription] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");
  const [newTodoList, setNewTodoList] = useState([
    { title: "", isComplete: false },
  ]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigateBack = useNavigate();
  const { loggedInUser } = useContext(AuthContext);
  const { toast } = useToast();

  function goBack() {
    navigateBack(-1);
  }

  function handleTodoChange(index, field, value) {
    const updatedTodoList = newTodoList.map((todo, i) =>
      i === index ? { ...todo, [field]: value } : todo
    );
    setNewTodoList(updatedTodoList);
  }

  function addTodo() {
    setNewTodoList([...newTodoList, { title: "", isComplete: false }]);
  }

  function removeTodo(index) {
    const updatedTodos = newTodoList.filter((_, i) => i !== index);
    setNewTodoList(updatedTodos);
  }

  async function createNewNote(ev) {
    ev.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newNoteTitle);
      formData.append("description", newNoteDescription);
      formData.append("body", newNoteBody);
      formData.append("user", loggedInUser.userId);
      formData.append("isPinned", false);
      formData.append("image", image);

      newTodoList.forEach((todo, index) => {
        formData.append(`todoList[${index}][title]`, todo.title);
        formData.append(`todoList[${index}][isComplete]`, todo.isComplete);
      });

      setLoading(true);
      await api.post("/notes/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewNoteTitle("");
      setNewNoteDescription("");
      setNewNoteBody("");
      setNewTodoList([{ title: "", isComplete: false }]);
      setImage(null);

      toast({
        title: "Note added",
        description: "Your new note has been successfully added.",
        status: "success",
      });

      setTimeout(() => {
        navigateBack(`/notes/${loggedInUser.userId}`);
      }, 1000);
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loggedInUser === null) {
    return <p>You must be logged in to add notes.</p>;
  }

  return (
    <div className="flex justify-center items-center w-full mt-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createNewNote} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Add title..."
                value={newNoteTitle}
                onChange={(ev) => setNewNoteTitle(ev.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Add description..."
                value={newNoteDescription}
                onChange={(ev) => setNewNoteDescription(ev.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <Input
                id="body"
                type="text"
                placeholder="Add body..."
                value={newNoteBody}
                onChange={(ev) => setNewNoteBody(ev.target.value)}
                required
              />
            </div>
            <div>
              <Label>Todo List</Label>
              {newTodoList.map((todo, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 space-y-2"
                >
                  <Input
                    type="text"
                    placeholder="Todo title..."
                    value={todo.title}
                    onChange={(ev) =>
                      handleTodoChange(index, "title", ev.target.value)
                    }
                    required
                  />
                  <Input
                    type="checkbox"
                    checked={todo.isComplete}
                    onChange={(ev) =>
                      handleTodoChange(index, "isComplete", ev.target.checked)
                    }
                  />
                  <Button
                    type="button"
                    onClick={() => removeTodo(index)}
                    className="bg-red-500 hover:bg-red-700 text-white"
                  >
                    X
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addTodo} className="mt-2">
                Add Todo
              </Button>
            </div>
            <div>
              <Label>Image</Label>
              <Input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <div className="loader"></div> : "Add Note"}
            </Button>
          </form>
          <Toaster />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={goBack}
            className="bg-gray-500 hover:bg-gray-700 text-white w-full "
          >
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AddNoteForm;
