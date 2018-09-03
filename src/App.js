import React, { Component } from "react";
import { Router, Route, Link } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import "./App.css";
import "./dnd.css";
// Module requires
import AddItem from "./addItem";
import About from "./about";
import TodoItem from "./TodoItem";
import CompletedItem from "./completedItem";
import BrowserDetection from "react-browser-detection";
const browserHandler = {
  chrome: () => <div className="cover-bar" />,
  firefox: () => <div className="cover-bar width-15" />
};

const history = createBrowserHistory();
class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <Route exact path={"/"} component={TodoComponent} />
          <Route path={"/about"} component={About} />
        </div>
      </Router>
    );
  }
}

// Create component
class TodoComponent extends Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.onDeleteCompleted = this.onDeleteCompleted.bind(this);
    this.onReAdded = this.onReAdded.bind(this);
    this.state = {
      data: [],
      completed: []
    };
  } //constructor

  render() {
    var completed = this.state.completed;
    completed = completed.map(
      function(data, index) {
        return (
          <CompletedItem
            item={data.item}
            id={data.id}
            data-index={index}
            key={index}
            onDelete={this.onDeleteCompleted}
            onComplete={this.onComplete}
          />
        );
      }.bind(this)
    );

    return (
      <div id="todo-list" className="container">
        <AddItem onAdd={this.onAdd} ref="add" />
        <nav className="cl-effect">
          <Link to={"/about"}>About</Link>
        </nav>
        <p>The busiest people have the most leisure...</p>
        <div className="row">
          {/* Uncompleted tasks  */}
          <div className="col-md-6">
            <TodoItem
              todos={this.state.data}
              onDelete={this.onDelete}
              onComplete={this.onComplete}
            />
          </div>
          {/* Completed tasks */}
          <div className="col-md-6">
            <ul className="todo scroll-bar-wrap" id="completed">
              <div className="scroll-box">{completed}</div>
              <BrowserDetection>{browserHandler}</BrowserDetection>
            </ul>
          </div>
        </div>
      </div>
    );
  } // render
  //custom functions
  onDelete(item) {
    var updatedTodos = this.state.todos.filter(function(val, index) {
      return item !== val;
    });
    this.setState({
      todos: updatedTodos
    });
    // update localStorage
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }
  onAdd(item) {
    fetch(`http://localhost/ReactTodolist/todo-app/src/server.php`, {
      method: "POST",
      headers: new Headers(),
      body: JSON.stringify({ todo: item }) // body data type must match "Content-Type" header
    })
      .then(response => response.json()) // parses response to JSON
      .then((data) => // update state
        this.setState({
          data: data.todos
        })
      );
  }
  onComplete(id, type) {
    fetch(`http://localhost/ReactTodolist/todo-app/src/complete.php`, {
      method: "POST",
      headers: new Headers(),
      body: JSON.stringify({ id: id, type: type }) // body data type must match "Content-Type" header
    })
      .then(response => response.json()) // parses response to JSON
      .then((data) => // update state
        this.setState({
          data: data.todos,
          completed: data.completed
        })
      );
  }
  onDeleteCompleted(item) {
    var updatedTodos = this.state.completed.filter(function(val, index) {
      return item !== val;
    });
    this.setState({
      completed: updatedTodos
    });
    // update localStorage
    localStorage.setItem("completed", JSON.stringify(updatedTodos));
  }
  onReAdded(item) {
    var updatedTodos = this.state.todos;
    updatedTodos.push(item);
    var updatedTodosCompleted = this.state.completed.filter(function(
      val,
      index
    ) {
      return item !== val;
    });
    this.setState({
      todos: updatedTodos,
      completed: updatedTodosCompleted
    });
  }

  fetchAll() {
    fetch(`http://localhost/ReactTodolist/todo-app/src/server.php`)
      // We get the API response and receive data in JSON format...
      .then(response => response.json())
      // ...then we update the todos state
      .then(data =>
        this.setState({
          data: data.todos,
          completed: data.completed
        })
      )
      // Catch any errors we hit and update the app
      .catch(error => console.error(error));
  }

  // lifcylce functions
  /* componentWillMount(){
          console.log('componentWillMount');
        }
        componentDidMount(){
          console.log('componentDidMount');
          // any grabbing of external data
        }
        componentWillUpdate(){
         console.log('componentWillUpdate');
          console.log(localStorage.getItem("todos"));

        }*/

  componentDidMount() {
    this.fetchAll();
  }
}

export default App;
