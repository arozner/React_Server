// // Todos.jsx

// import React, { useState, useEffect } from 'react';


// const Todos = () => {
//   const [todos, setTodos] = useState([]);
//   const [sorting, setSorting] = useState(0); // שינוי לסוג המיון

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let endpoint = 'http://localhost:3000/todos?userId=5';

//         if (sorting !== 0) {
//           endpoint += `&sort=${sorting}`;
//         }

//         const response = await fetch(endpoint);
//         const data = await response.json();
//         setTodos(data);
//       } catch (error) {
//         console.error('Error fetching todos:', error);
//       }
//     };

//     fetchData();
//   }, [sorting]);

//   const handleCheckboxChange = (taskId) => {
//     // שינוי בלקוח בלבד, לא שינוי בשרת
//     setTodos(prevTodos =>
//       prevTodos.map(todo =>
//         todo.id === taskId
//           ? { ...todo, completed: !todo.completed }
//           : todo
//       )
//     );
//   };

//   const handleSortingChange = (event) => {
//     setSorting(Number(event.target.value)); // שינוי למספר
//   };

//   return (
//     <div>
//       <h1>Todos for User ID: 5</h1>
//       <label>
//         Sorting:
//         <select value={sorting} onChange={handleSortingChange}>
//           <option value={0}>Default Order</option>
//           <option value={1}>Random Order</option>
//           <option value={2}>Alphabetical Order</option>
//           <option value={3}>By Completion</option>
//         </select>
//       </label>
//       <ul>
//         {todos.map(todo => (
//           <li key={todo.id}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={todo.completed}
//                 onChange={() => handleCheckboxChange(todo.id)}
//               />
//               <span className={todo.completed ? 'completed' : ''}>
//                 {todo.title}
//               </span>
//             </label>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Todos;





// Todos.jsx

import React, { useState, useEffect } from 'react';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [sorting, setSorting] = useState('default'); // סוג המיון
  const [showCompleted, setShowCompleted] = useState(true); // האם להציג משימות שהושלמו

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = `http://localhost:3000/todos?userId=5`;

        const response = await fetch(endpoint);
        const data = await response.json();

        // עדכון מערך ה-memos על פי המיון וההצגה
        let sortedTodos = [...data];
        if (sorting === 'random') {
          sortedTodos = shuffleArray(sortedTodos);
        } else if (sorting === 'alphabetical') {
          sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sorting === 'completed') {
          sortedTodos.sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return 0;
          });
        }

        setTodos(sortedTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchData();
  }, [sorting]);

  const handleCheckboxChange = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${taskId}`);
      const existingTodo = await response.json();

      // עדכון בשרת בלבד
      await fetch(`http://localhost:3000/todos/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...existingTodo, completed: !existingTodo.completed }),
      });

      // עדכון במערך ה-memos
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === taskId
            ? { ...existingTodo, completed: !existingTodo.completed }
            : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleSortingChange = (event) => {
    setSorting(event.target.value);
  };

  const handleShowCompletedChange = (event) => {
    setShowCompleted(event.target.checked);
  };

  // פונקציה שמערבבת את המערך
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div>
      <h1>Todos for User ID: 5</h1>
      <label>
        Sorting:
        <select value={sorting} onChange={handleSortingChange}>
          <option value="default">Default Order</option>
          <option value="random">Random Order</option>
          <option value="alphabetical">Alphabetical Order</option>
          <option value="completed">By Completion</option>
        </select>
      </label>
      <label>
        Show Completed:
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={handleShowCompletedChange}
        />
      </label>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleCheckboxChange(todo.id)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;










// Todos.jsx

// import React, { useState, useEffect } from 'react';
// // import './styles.css';

// const Todos = () => {
//   const [todos, setTodos] = useState([]);
//   const [sorting, setSorting] = useState('default'); // סוג המיון
//   const [showCompleted, setShowCompleted] = useState(true); // האם להציג משימות שהושלמו

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let endpoint = `http://localhost:3000/todos?userId=5`;

//         // הוספת פרמטרים לכתובת בהתאם לסוג המיון וההשגחה
//         if (sorting !== 'default') {
//           endpoint += `&sort=${sorting}`;
//         }
//         if (!showCompleted) {
//           endpoint += `&completed=false`;
//         }

//         const response = await fetch(endpoint);
//         const data = await response.json();
//         setTodos(data);
//       } catch (error) {
//         console.error('Error fetching todos:', error);
//       }
//     };

//     fetchData();
//   }, [sorting, showCompleted]);

//   const handleCheckboxChange = async (taskId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/todos/${taskId}`);
//       const existingTodo = await response.json();

//       await fetch(`http://localhost:3000/todos/${taskId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...existingTodo, completed: !existingTodo.completed }),
//       });

//       setTodos(prevTodos =>
//         prevTodos.map(todo =>
//           todo.id === taskId
//             ? { ...existingTodo, completed: !existingTodo.completed }
//             : todo
//         )
//       );
//     } catch (error) {
//       console.error('Error updating todo:', error);
//     }
//   };

//   const handleSortingChange = (event) => {
//     setSorting(event.target.value);
//   };

//   const handleShowCompletedChange = (event) => {
//     setShowCompleted(event.target.checked);
//   };

//   return (
//     <div>
//       <h1>Todos for User ID: 5</h1>
//       <label>
//         Sorting:
//         <select value={sorting} onChange={handleSortingChange}>
//           <option value="default">Default Order</option>
//           <option value="random">Random Order</option>
//           <option value="alphabetical">Alphabetical Order</option>
//           <option value="completed">By Completion</option>
//         </select>
//       </label>
//       <label>
//         Show Completed:
//         <input
//           type="checkbox"
//           checked={showCompleted}
//           onChange={handleShowCompletedChange}
//         />
//       </label>
//       <ul>
//         {todos.map(todo => (
//           <li key={todo.id}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={todo.completed}
//                 onChange={() => handleCheckboxChange(todo.id)}
//               />
//               <span className={todo.completed ? 'completed' : ''}>
//                 {todo.title}
//               </span>
//             </label>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Todos;





// import React, { useState, useEffect } from 'react';
// // import './styles.css';

// const Todos = () => {
//   const [todos, setTodos] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/todos?userId=5');
//         const data = await response.json();
//         setTodos(data);
//       } catch (error) {
//         console.error('Error fetching todos:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleCheckboxChange = async (taskId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/todos/${taskId}`);
//       const existingTodo = await response.json();

//       await fetch(`http://localhost:3000/todos/${taskId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...existingTodo, completed: !existingTodo.completed }),
//       });

//       setTodos(prevTodos =>
//         prevTodos.map(todo =>
//           todo.id === taskId
//             ? { ...existingTodo, completed: !existingTodo.completed }
//             : todo
//         )
//       );
//     } catch (error) {
//       console.error('Error updating todo:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Todos for User ID: 5</h1>
//       <ul>
//         {todos.map(todo => (
//           <li key={todo.id}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={todo.completed}
//                 onChange={() => handleCheckboxChange(todo.id)}
//               />
//               <span className={todo.completed ? 'completed' : ''}>
//                 {todo.title}
//               </span>
//             </label>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Todos;



// import React, { useState, useEffect } from 'react';

// const Todos = () => {
//   const [todos, setTodos] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/todos?userId=5');
//         const data = await response.json();
//         setTodos(data);
//       } catch (error) {
//         console.error('Error fetching todos:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleCheckboxChange = async (taskId) => {
//     try {
//       // שלוף את המשימה הקיימת מהשרת
//       const response = await fetch(`http://localhost:3000/todos/${taskId}`);
//       const existingTodo = await response.json();

//       // בצע שינוי רק בערך של completed ושלח בקשת PUT
//       await fetch(`http://localhost:3000/todos/${taskId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...existingTodo, completed: !existingTodo.completed }),
//       });

//       // אם יש צורך, עדכן את המערך לפי התוצאה המעודכנת מהשרת
//       setTodos(prevTodos =>
//         prevTodos.map(todo =>
//           todo.id === taskId
//             ? { ...existingTodo, completed: !existingTodo.completed }
//             : todo
//         )
//       );
//     } catch (error) {
//       console.error('Error updating todo:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Todos for User ID: 5</h1>
//       <ol>
//         {todos.map(todo => (
//           <li key={todo.id}>
//             <input
//               type="checkbox"
//               checked={todo.completed}
//               onChange={() => handleCheckboxChange(todo.id)}
//             />
//             {todo.title}
//           </li>
//         ))}
//       </ol>
//     </div>
//   );
// };

// export default Todos;










// import React, { useState, useEffect } from 'react';

// const Todos = () => {
//   const [todos, setTodos] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/todos?userId=5');
//         const data = await response.json();
//         setTodos(data);
//       } catch (error) {
//         console.error('Error fetching todos:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleCheckboxChange = (taskId) => {
//     // העדכון של מערך ה-Memos כאשר יש שינוי ב-Checkbox
//     setTodos(prevTodos =>
//       prevTodos.map(todo =>
//         todo.id === taskId
//           ? { ...todo, completed: !todo.completed }
//           : todo
//       )
//     );
//   };

//   return (
//     <div>
//       <h1>Todos for User ID: 5</h1>
//       <ul>
//         {todos.map(todo => (
//           <li key={todo.id}>
//             <input
//               type="checkbox"
//               checked={todo.completed}
//               onChange={() => handleCheckboxChange(todo.id)}
//             />
//             {todo.title}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Todos;
