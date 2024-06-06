import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Todo {
  text: string;
  editing?: boolean; // Added property for editing mode
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  apiUrl = 'https://todolist-97525-default-rtdb.firebaseio.com/todos.json';
  todos: { [key: string]: Todo } = {};
  newTodo: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTodos();
  }

  fetchTodos() {
    this.http.get<{ [key: string]: Todo }>(this.apiUrl).subscribe((data) => {
      this.todos = data || {};
      Object.keys(this.todos).forEach(key => this.todos[key].editing = false);
    });
  }

  addTodo() {
    if (this.newTodo.trim()) {
      const newTodo: Todo = { text: this.newTodo.trim() };
      this.http.post<{ name: string }>(this.apiUrl, newTodo).subscribe(() => {
        this.newTodo = '';
        this.fetchTodos();
      });
    }
  }

  updateTodo(id: string, newText: string) {
    const updateUrl = `https://todolist-97525-default-rtdb.firebaseio.com/todos/${id}.json`;
    this.http.put(updateUrl, { text: newText }).subscribe(() => {
      this.todos[id].editing = false;
    });
  }

  deleteTodo(id: string) {
    const deleteUrl = `https://todolist-97525-default-rtdb.firebaseio.com/todos/${id}.json`;
    this.http.delete(deleteUrl).subscribe(() => {
      this.fetchTodos();
    });
  }

  toggleEditMode(id: string) {
    this.todos[id].editing = true;
  }

  saveEdit(id: string) {
    const newText = this.todos[id].text;
    const updateUrl = `https://todolist-97525-default-rtdb.firebaseio.com/todos/${id}.json`;
    this.http.put(updateUrl, { text: newText }).subscribe(() => {
      this.todos[id].editing = false;
    });
  }

  cancelEdit(todo: { key: string, editing?: boolean }) {
    if (todo.editing !== undefined) {
      todo.editing = false;
    }
  }

  isEditing(todo: Todo): boolean {
    return todo.editing || false;
  }
}
