// #----------------------------Books Front end linking back to main.py backend-------------------------------------------------

import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_year: ''
  })
  const [editingId, setEditingId] = useState(null)

  const API_URL = 'http://localhost:8000'

  // GET Request:
  const fetchAllBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/books`)
      setBooks(response.data)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  useEffect(() => {
    fetchAllBooks()
  }, []) // Empty dependency array means this runs once after the initial render.

  // POST Request:
  const createBook = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/books`, {
        title: formData.title,
        author: formData.author,
        // Ensure published_year is an integer if required by your backend
        published_year: parseInt(formData.published_year)
      })
      // Reset form data and re-fetch the list
      setFormData({ title: '', author: '', published_year: '' })
      fetchAllBooks()
    } catch (error) {
      console.error('Error creating book:', error)
      alert('Error adding book')
    }
  }

  // PUT Request:
  const updateBook = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${API_URL}/books/${editingId}`, {
        title: formData.title,
        author: formData.author,
        // Ensure published_year is an integer if required by your backend
        published_year: parseInt(formData.published_year)
      })
      // Reset form, editing state, and re-fetch the list
      setFormData({ title: '', author: '', published_year: '' })
      setEditingId(null)
      fetchAllBooks()
    } catch (error) {
      console.error('Error updating book:', error)
      alert('Error updating book')
    }
  }

  // DELETE Request:
  const deleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`${API_URL}/books/${bookId}`)
        // Re-fetch the list
        fetchAllBooks()
      } catch (error) {
        console.error('Error deleting book:', error)
        alert('Error deleting book')
      }
    }
  }

  const startEdit = (book) => {
    setEditingId(book.id)
    setFormData({
      title: book.title,
      author: book.author,
      // Convert year to string for the input field value
      published_year: String(book.published_year) 
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ title: '', author: '', published_year: '' })
  }

  return (
    <>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '10px' }}>Book Management System</h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        alignItems: 'flex-start',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 20px',
        height: 'calc(100vh - 100px)',
        boxSizing: 'border-box'
      }}>
        
        {/* Form Container */}
        <div className="card" style={{ 
          flex: '0 0 380px',
          minWidth: '300px',
          maxWidth: '380px',
          border: '1.5px solid #000000',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '70vh',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>
            {editingId ? 'Update Book' : 'Add New Book'}
          </h3>
          <form onSubmit={editingId ? updateBook : createBook} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            flex: 1,
            overflow: 'auto'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left' }}>
                Title
              </label>
              <input
                type="text"
                placeholder="Enter book title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left' }}>
                Author
              </label>
              <input
                type="text"
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left' }}>
                Published Year
              </label>
              <input
                type="number"
                placeholder="Enter publication year"
                value={formData.published_year}
                onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                required
                min="1801"
                max="2025"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <button type="submit" style={{ flex: '1', padding: '10px' }}>
                {editingId ? 'Update Book' : 'Add Book'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} style={{ flex: '1', padding: '10px' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Container */}
        <div className="card" style={{ 
          flex: '1',
          minWidth: '700px',
          maxWidth: '1200px',
          border: '1.5px solid #000000',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '70vh',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Books List</h3>
          {books.length === 0 ? (
            <p>No book available</p>
          ) : (
            <div style={{ 
              overflowY: 'auto',
              overflowX: 'hidden',
              flex: 1
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                tableLayout: 'fixed'
              }}>
                <thead style={{ 
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  zIndex: 1
                }}>
                  <tr>
                    <th style={{ 
                      borderLeft: '1px solid #000000', 
                      padding: '8px', 
                      width: '35%' 
                    }}>Title</th>
                    <th style={{ 
                      borderLeft: '1px solid #000000', 
                      padding: '8px', 
                      width: '25%' 
                    }}>Author</th>
                    <th style={{ 
                      borderLeft: '1px solid #000000', 
                      padding: '8px', 
                      width: '15%' 
                    }}>Year</th>
                    <th style={{ 
                      borderLeft: '1px solid #000000', 
                      borderRight: '1px solid #000000', 
                      padding: '8px', 
                      width: '25%' 
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td 
                        style={{ 
                          border: '1px solid #000000',
                          borderTop: '1px solid #ffffff',
                          padding: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          wordBreak: 'break-all'
                        }}
                        title={book.title}
                      >
                        {book.title}
                      </td>
                      <td 
                        style={{ 
                          border: '1px solid #000000', 
                          borderTop: '1px solid #ffffff',
                          padding: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={book.author}
                      >
                        {book.author}
                      </td>
                      <td style={{ 
                        border: '1px solid #000000', 
                        borderTop: '1px solid #ffffff', 
                        padding: '8px', 
                        textAlign: 'center' }}>
                        {book.published_year}
                      </td>
                      <td style={{ 
                        border: '1px solid #000000', 
                        borderTop: '1px solid #ffffff',
                        padding: '8px', 
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                      }}>
                        <button 
                          onClick={() => startEdit(book)} 
                          style={{ 
                            marginRight: '8px',
                            padding: '6px 12px',
                            minWidth: '60px'
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteBook(book.id)}
                          style={{ 
                            padding: '6px 12px',
                            minWidth: '60px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App


// //----------------------------------------------------------------
// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import './App.css'

// function App() {
//     // State is updated to hold 'todos' instead of 'books'
//     const [todos, setTodos] = useState([]) 
    
//     // Form data fields are updated to match the backend model
//     const [formData, setFormData] = useState({ 
//         task: '',
//         dateline: '',
//         notes: ''
//     })
//     const [editingId, setEditingId] = useState(null)
//     const [loading, setLoading] = useState(false) // Added loading state for better UX
//     const [error, setError] = useState(null) // Added error state
    
//     // API_URL remains the same
//     const API_URL = 'http://localhost:8000'

//     // GET Request: fetchAllTodos
//     const fetchAllTodos = async () => {
//         setLoading(true)
//         setError(null)
//         try {
//             // Updated endpoint to /todos
//             const response = await axios.get(`${API_URL}/todos`) 
//             setTodos(response.data) // Setting todos
//         } catch (error) {
//             console.error('Error fetching todos:', error)
//             setError('Failed to fetch tasks. Ensure the backend is running.')
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchAllTodos()
//     }, [])

//     // Handler for all input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // POST Request: createTodo
//     const createTodo = async (e) => {
//         e.preventDefault()
//         setError(null)
//         try {
//             // POST request body uses the new formData fields
//             await axios.post(`${API_URL}/todos`, formData) 
            
//             // Reset form data and re-fetch the list
//             setFormData({ task: '', dateline: '', notes: '' })
//             fetchAllTodos() 
//         } catch (error) {
//             console.error('Error creating todo:', error.response ? error.response.data : error)
//             setError('Error adding task. Check form data and server logs.')
//         }
//     }

//     // PUT Request: updateTodo
//     const updateTodo = async (e) => {
//         e.preventDefault()
//         setError(null)
//         try {
//             // Updated endpoint structure: /todos/{id}
//             await axios.put(`${API_URL}/todos/${editingId}`, formData) 
            
//             // Reset form, editing state, and re-fetch the list
//             setFormData({ task: '', dateline: '', notes: '' })
//             setEditingId(null)
//             fetchAllTodos() 
//         } catch (error) {
//             console.error('Error updating todo:', error.response ? error.response.data : error)
//             setError('Error updating task. Check form data and server logs.')
//         }
//     }

//     // DELETE Request: deleteTodo
//     const deleteTodo = async (todoId) => {
//         if (window.confirm('Are you sure you want to delete this task?')) {
//             setError(null)
//             try {
//                 // Updated endpoint to /todos/{id}
//                 await axios.delete(`${API_URL}/todos/${todoId}`) 
//                 // Re-fetch the list
//                 fetchAllTodos()
//             } catch (error) {
//                 console.error('Error deleting todo:', error)
//                 setError('Error deleting task.')
//             }
//         }
//     }

//     const startEdit = (todo) => {
//         setEditingId(todo.id)
//         // Load existing todo data into the form
//         setFormData({
//             task: todo.task,
//             dateline: todo.dateline,
//             notes: todo.notes
//         })
//     }

//     const cancelEdit = () => {
//         setEditingId(null)
//         setFormData({ task: '', dateline: '', notes: '' })
//     }

//     return (
//         <>
//             <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '10px' }}>
//                 Todo List Management System
//             </h2>
            
//             {/* Display error message */}
//             {error && (
//                 <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
//                     {error}
//                 </p>
//             )}

//             <div style={{ 
//                 display: 'flex', 
//                 gap: '20px', 
//                 alignItems: 'flex-start',
//                 maxWidth: '1600px',
//                 margin: '0 auto',
//                 padding: '0 20px',
//                 height: 'calc(100vh - 100px)',
//                 boxSizing: 'border-box'
//             }}>
                
//                 {/* Form Container (Remains mostly the same structure) */}
//                 <div className="card" style={{ 
//                     flex: '0 0 380px',
//                     minWidth: '300px',
//                     maxWidth: '380px',
//                     border: '1.5px solid #000000',
//                     borderRadius: '10px',
//                     padding: '20px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     height: '100%',
//                     maxHeight: '70vh',
//                     boxSizing: 'border-box',
//                     overflow: 'hidden'
//                 }}>
//                     <h3 style={{ margin: '0 0 15px 0' }}>
//                         {editingId ? 'Update Task' : 'Add New Task'}
//                     </h3>
//                     <form onSubmit={editingId ? updateTodo : createTodo} style={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: '15px',
//                         flex: 1,
//                         overflow: 'auto'
//                     }}>
                        
//                         {/* Task Input (formerly Title) */}
//                         <div>
//                             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left' }}>
//                                 Task
//                             </label>
//                             <input
//                                 type="text"
//                                 name="task"
//                                 placeholder="Enter task name"
//                                 value={formData.task}
//                                 onChange={handleInputChange}
//                                 required
//                                 style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//                             />
//                         </div>
                        
//                         {/* Dateline Input (formerly Author) */}
//                         <div>
//                             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left' }}>
//                                 Dateline
//                             </label>
//                             <input
//                                 type="text"
//                                 name="dateline"
//                                 placeholder="Enter deadline or dateline"
//                                 value={formData.dateline}
//                                 onChange={handleInputChange}
//                                 required
//                                 style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//                             />
//                         </div>
                        
//                         {/* Notes Input (formerly Published Year) */}
//                         <div>
//                             <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left' }}>
//                                 Notes
//                             </label>
//                             <textarea
//                                 name="notes"
//                                 placeholder="Enter additional notes"
//                                 value={formData.notes}
//                                 onChange={handleInputChange}
//                                 required
//                                 rows="3"
//                                 style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//                             />
//                         </div>
                        
//                         <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
//                             <button type="submit" style={{ flex: '1', padding: '10px' }}>
//                                 {editingId ? 'Update Task' : 'Add Task'}
//                             </button>
//                             {editingId && (
//                                 <button type="button" onClick={cancelEdit} style={{ flex: '1', padding: '10px' }}>
//                                     Cancel
//                                 </button>
//                             )}
//                         </div>
//                     </form>
//                 </div>

//                 {/* Table Container */}
//                 <div className="card" style={{ 
//                     flex: '1',
//                     minWidth: '700px',
//                     maxWidth: '1200px',
//                     border: '1.5px solid #000000',
//                     borderRadius: '10px',
//                     padding: '20px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     height: '100%',
//                     maxHeight: '70vh',
//                     boxSizing: 'border-box',
//                     overflow: 'hidden'
//                 }}>
//                     <h3 style={{ margin: '0 0 15px 0' }}>Tasks List</h3>
                    
//                     {loading ? (
//                         <p>Loading tasks...</p>
//                     ) : todos.length === 0 ? (
//                         <p>No tasks available</p>
//                     ) : (
//                         <div style={{ 
//                             overflowY: 'auto',
//                             overflowX: 'hidden',
//                             flex: 1
//                         }}>
//                             <table style={{ 
//                                 width: '100%', 
//                                 borderCollapse: 'collapse',
//                                 tableLayout: 'fixed'
//                             }}>
//                                 <thead style={{ 
//                                     position: 'sticky',
//                                     top: 0,
//                                     backgroundColor: '#000000',
//                                     color: '#ffffff',
//                                     zIndex: 1
//                                 }}>
//                                     <tr>
//                                         {/* Updated Headers */}
//                                         <th style={{ borderLeft: '1px solid #000000', padding: '8px', width: '30%' }}>Task</th>
//                                         <th style={{ borderLeft: '1px solid #000000', padding: '8px', width: '20%' }}>Dateline</th>
//                                         <th style={{ borderLeft: '1px solid #000000', padding: '8px', width: '30%' }}>Notes</th>
//                                         <th style={{ borderLeft: '1px solid #000000', borderRight: '1px solid #000000', padding: '8px', width: '20%' }}>Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {todos.map((todo) => (
//                                         // Key remains the same (id)
//                                         <tr key={todo.id}>
//                                             <td style={{ 
//                                                 border: '1px solid #000000',
//                                                 borderTop: '1px solid #ffffff',
//                                                 padding: '8px',
//                                                 overflow: 'hidden',
//                                                 textOverflow: 'ellipsis',
//                                                 whiteSpace: 'nowrap',
//                                                 wordBreak: 'break-all'
//                                             }}
//                                             title={todo.task}
//                                             >
//                                                 {todo.task}
//                                             </td>
//                                             <td style={{ 
//                                                 border: '1px solid #000000', 
//                                                 borderTop: '1px solid #ffffff',
//                                                 padding: '8px',
//                                                 overflow: 'hidden',
//                                                 textOverflow: 'ellipsis',
//                                                 whiteSpace: 'nowrap'
//                                             }}
//                                             title={todo.dateline}
//                                             >
//                                                 {todo.dateline}
//                                             </td>
//                                             <td style={{ 
//                                                 border: '1px solid #000000', 
//                                                 borderTop: '1px solid #ffffff', 
//                                                 padding: '8px', 
//                                                 overflow: 'hidden',
//                                                 textOverflow: 'ellipsis',
//                                                 whiteSpace: 'nowrap'
//                                             }}
//                                             title={todo.notes}
//                                             >
//                                                 {todo.notes}
//                                             </td>
//                                             {/* Actions cell (Remains the same logic) */}
//                                             <td style={{ 
//                                                 border: '1px solid #000000', 
//                                                 borderTop: '1px solid #ffffff',
//                                                 padding: '8px', 
//                                                 textAlign: 'center',
//                                                 whiteSpace: 'nowrap'
//                                             }}>
//                                                 <button 
//                                                     onClick={() => startEdit(todo)} // Pass todo object
//                                                     style={{ 
//                                                         marginRight: '8px',
//                                                         padding: '6px 12px',
//                                                         minWidth: '60px'
//                                                     }}
//                                                 >
//                                                     Edit
//                                                 </button>
//                                                 <button 
//                                                     onClick={() => deleteTodo(todo.id)}
//                                                     style={{ 
//                                                         padding: '6px 12px',
//                                                         minWidth: '60px'
//                                                     }}
//                                                 >
//                                                     Delete
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     )
// }

// export default App