import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

const Todos = () => {
    const { userId } = useParams();
    const [todos, setTodos] = useState([]);
    const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd } = useForm();
    const { register: registerEdit, handleSubmit: handleSubmitEdit, watch: watchEdit, reset: resetEdit } = useForm();
    const [filtering, setFiltering] = useState("");
    const [filterBtn, setFilterBtn] = useState("all");
    const [sorting, setSorting] = useState('default');
    const [editingMode, setEditingMode] = useState(-1);
    const [editText, setEditText] = useState(``);

    useEffect(() => {
        fetch(`http://localhost:4000/todos?userId=${userId}`)
            .then(response => response.json())
            .then(todosArr => setTodos(todosArr))
            .catch(error => alert(`Error: ${error.message}`));
    }, []);

    const handleFilteringChange = event => {
        setFiltering(event.target.value)
    };

    const handleFilterBtn = () => {
        if (filterBtn === "all") {
            setFilterBtn("completed")
        }
        else if (filterBtn === "completed") {
            setFilterBtn("not complete")
        }
        else if (filterBtn === "not complete") {
            setFilterBtn("all")
        }
    };

    const filteredTodos = () => {
        let filteredArr = [...todos];
        if (filterBtn === "completed") {
            filteredArr = filteredArr.filter(todo => todo.completed);
        }
        else if (filterBtn === "not complete") {
            filteredArr = filteredArr.filter(todo => (!todo.completed))
        }
        return filteredArr.filter(todo => todo.title.includes(filtering))
    };

    const handleSortingChange = event => {
        setSorting(event.target.value);
    };

    const sortedTodos = () => {
        const filteredArr = filteredTodos();
        if (sorting === "default") {
            return filteredArr.sort((a, b) => a.id - b.id);
        }
        if (sorting === "random") {
            const sortedArr = [...filteredArr];
            const randomArr = [];
            while (sortedArr.length > 0) {
                const max = sortedArr.length - 1;
                const randomIdx = Math.floor(Math.random() * (max + 1));
                randomArr.push(sortedArr[randomIdx]);
                sortedArr.splice(randomIdx, 1);
            }
            return randomArr
        }
        if (sorting === "lexicographic") {
            return filteredArr.sort((a, b) => a.title.localeCompare(b.title));
        }
        if (sorting === "completed") {
            let sortedArr = filteredArr.filter(todo => !todo.completed);
            sortedArr = [...sortedArr, ...filteredArr.filter(todo => todo.completed)];
            return sortedArr;
        }
    };

    const handleCheckboxChange = async (todoId) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => {
                if (todo.id === todoId) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            })
        );
        try {
            await fetch(`http://localhost:4000/todos/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...todos.find((todo) => todo.id === todoId), completed: !todos.find((todo) => todo.id === todoId).completed }),
            });
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const onSubmitAdd = async (data) => {
        const newTodo = {
            "userId": parseInt(userId),
            "title": data.newTodo,
            "completed": false
        };
        try {
            setTodos([...todos, newTodo])
            const response = await fetch(`http://localhost:4000/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });
            const updatedTodo = await response.json();
            setTodos((prevTodos) =>
                prevTodos.map((todo) => (todo.id === newTodo.id ? updatedTodo : todo))
            );
        } catch (error) {
            console.error('Error updating todo:', error);
        }
        resetAdd();
    };

    const handleEditClick = (todo) => {
        if (todo.id === editingMode) {
            setEditingMode(-1)
        }
        else {
            setEditingMode(todo.id);
            setEditText(todo.title);
        }
    };

    const onSubmitEdit = async (data) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => {
                if (todo.id === editingMode) {
                    return { ...todo, title: data.editedText };
                }
                return todo;
            })
        );
        try {
            await fetch(`http://localhost:4000/todos/${editingMode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...todos.find((todo) => todo.id === editingMode), title: data.editedText }),
            });
        } catch (error) {
            console.error('Error updating todo:', error);
        }
        setEditingMode(-1);
        resetEdit();
    };

    useEffect(resetEdit, [editingMode]);

    const deleteTodo = async (todoId) => {
        setTodos(todos => todos.filter(todo => todo.id !== todoId));
        try {
            await fetch(`http://localhost:4000/todos/${todoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    return (
        <div>
            <h1>Your todos:</h1>
            <label>
                filtering:
                <input type="text" placeholder='enter a todo or part of it' onChange={handleFilteringChange} />
                <button onClick={handleFilterBtn}>{filterBtn}</button>
            </label>
            <br />
            <label>
                Sorting:
                <select value={sorting} onChange={handleSortingChange}>
                    <option value="default">default order</option>
                    <option value="random">random order</option>
                    <option value="lexicographic">lexicographic order</option>
                    <option value="completed">By Completion</option>
                </select>
            </label>
            <br />
            <form onSubmit={handleSubmitAdd(onSubmitAdd)}>
                <label>
                    add todo:
                    <input
                        type="text"
                        placeholder='enter a todo'
                        {...registerAdd('newTodo', { required: true })}
                    />
                </label>
                <button type="submit">add</button>
            </form>
            <ol>
                {sortedTodos().map(todo => (
                    <li key={todo.id}>
                        <label>
                            <button type='button' onClick={() => deleteTodo(todo.id)}><MdDelete /></button>
                            <button type='button' onClick={() => { handleEditClick(todo); }}><CiEdit /></button>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleCheckboxChange(todo.id)}
                            />
                            {todo.id === editingMode && <form onSubmit={handleSubmitEdit(onSubmitEdit)} style={{ display: "inline" }}>
                                <label>
                                    <input
                                        type="text"
                                        value={watchEdit('editedText') !== undefined ? watchEdit('editedText') : editText}
                                        {...registerEdit('editedText', { required: true })}
                                    />
                                </label>
                                <button type="submit">update</button>
                            </form>
                            }
                            {todo.id !== editingMode && <span className={todo.completed ? 'completed' : ''}>
                                {todo.title}
                            </span>}
                        </label>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Todos;