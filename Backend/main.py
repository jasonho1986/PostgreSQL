
# from fastapi import FastAPI, Depends, Path, HTTPException
# import models
# from models import Books
# from database import engine, SessionLocal
# from typing import Annotated
# from sqlalchemy.orm import Session
# from pydantic import BaseModel, StrictInt, Field

# app = FastAPI()
# models.Base.metadata.create_all(bind=engine)

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# db_dependency = Annotated[Session, Depends(get_db)]


# class BookRequest(BaseModel):
#     title: str = Field(min_length=3, max_length=1000)
#     author: str = Field(min_length=3, max_length=1000)
#     published_year: StrictInt = Field(gt=1800, lt=2026)




#     #To read book data:
# @app.get("/books")
# async def read_all(db: db_dependency):
#     return db.query(Books).all()

# @app.get("/books/{book_id}")
# async def get_book_by_id(db: db_dependency, book_id: int = Path(gt=0)):
#     book_result = db.query(Books).filter(Books.id == book_id).first()

#     if book_result is not None:
#         return book_result
    
#     raise HTTPException(status_code=404, detail="Book not found")


# #To create book data:
# @app.post("/books")
# async def create_book(db: db_dependency, book_request: BookRequest):
#     new_book = Books(title=book_request.title, author=book_request.author, published_year=book_request.published_year)
#     db.add(new_book)
#     db.commit()
#     db.refresh(new_book)
#     return {"message": "Book successfully added"}


# #To update book data:
# @app.put("/books/{book_id}")
# async def update_book(db: db_dependency,
#                       book_id: int,
#                       book_request: BookRequest):
#     book_result = db.query(Books).filter(Books.id == book_id).first()

#     if book_result is None:
#         raise HTTPException(status_code=404, detail="Book not found")

#     book_result.title = book_request.title
#     book_result.author = book_request.author
#     book_result.published_year = book_request.published_year

#     db.add(book_result)
#     db.commit()
#     return {"message": "Book successfully updated"}


# #To delete book data:
# @app.delete("/books/{book_id}")
# async def delete_book(db: db_dependency, book_id: int = Path(gt=0)):
#     book_result = db.query(Books).filter(Books.id == book_id).first()

#     if book_result is None:
#         raise HTTPException(status_code=404, detail="Book not found")
#     else:
#         db.delete(book_result)
#         db.commit()
#         return {"message": "Book successfully deleted"}
    

#-----------Books linking back to Front End APP.jsx and PGadmin database-----------------------




from fastapi import FastAPI, Depends, Path, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models
from models import Books
from database import engine, SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel, StrictInt, Field

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


class BookRequest(BaseModel):
    title: str = Field(min_length=3, max_length=1000)
    author: str = Field(min_length=3, max_length=1000)
    published_year: StrictInt = Field(gt=1800, lt=2026)




    #To read book data:
@app.get("/books")
async def read_all(db: db_dependency):
    return db.query(Books).all()

@app.get("/books/{book_id}")
async def get_book_by_id(db: db_dependency, book_id: int = Path(gt=0)):
    book_result = db.query(Books).filter(Books.id == book_id).first()

    if book_result is not None:
        return book_result
    
    raise HTTPException(status_code=404, detail="Book not found")


#To create book data:
@app.post("/books")
async def create_book(db: db_dependency, book_request: BookRequest):
    new_book = Books(title=book_request.title, author=book_request.author, published_year=book_request.published_year)
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return {"message": "Book successfully added"}


#To update book data:
@app.put("/books/{book_id}")
async def update_book(db: db_dependency,
                      book_id: int,
                      book_request: BookRequest):
    book_result = db.query(Books).filter(Books.id == book_id).first()

    if book_result is None:
        raise HTTPException(status_code=404, detail="Book not found")

    book_result.title = book_request.title
    book_result.author = book_request.author
    book_result.published_year = book_request.published_year

    db.add(book_result)
    db.commit()
    return {"message": "Book successfully updated"}


#To delete book data:
@app.delete("/books/{book_id}")
async def delete_book(db: db_dependency, book_id: int = Path(gt=0)):
    book_result = db.query(Books).filter(Books.id == book_id).first()

    if book_result is None:
        raise HTTPException(status_code=404, detail="Book not found")
    else:
        db.delete(book_result)
        db.commit()
        return {"message": "Book successfully deleted"}
    
#----------------------------------------------------



# --------------------To do list--------------------------------
# from fastapi import FastAPI, Depends, Path, HTTPException
# import models
# from models import Todos
# from database import engine, SessionLocal
# from typing import Annotated
# from sqlalchemy.orm import Session
# from pydantic import BaseModel, StrictInt, Field
# from fastapi.middleware.cors import CORSMiddleware



# app = FastAPI ()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# models.Base.metadata.create_all(bind=engine)

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# db_dependency = Annotated [Session, Depends(get_db)]

# class TodoRequest(BaseModel):
#     task: str = Field (min_length=3, max_length=1000)
#     dateline: str = Field (min_length=3, max_length=1000)
#     notes: str = Field (min_length=3, max_length=1000)

# #To read book data:
# @app.get("/todos")
# async def read_all(db: db_dependency):
#     return db.query(Todos).all()

# @app.get("/todos/{todo_id}")
# async def get_todo_by_id (db:db_dependency, todo_id:int = Path(gt=0)):
#     todo_result = db.query(Todos).filter(Todos.id == todo_id).first()

#     if todo_result is not None:
#         return todo_result
    
#     raise HTTPException(status_code=404, detail="Task not found!")

# #To create todo data:
# @app.post("/todos")
# async def create_todo(db:db_dependency, todo_request:TodoRequest):
#     new_todo = Todos(task=todo_request.task, dateline=todo_request.dateline, notes=todo_request.notes)
#     db.add(new_todo)
#     db.commit()
#     db.refresh(new_todo)
#     return{"message":"Task successfully added!"}

# #To update todo data:
# @app.put ("/todo/{todo_id}")
# async def update_todo(db:db_dependency,
#                       todo_id: int,
#                       todo_request: TodoRequest):
#     todo_result = db.query(Todos).filter(Todos.id == todo_id).first ()

#     if todo_request is None:
#         raise HTTPException(status_code=404, detail="Task not found!")
    
#     todo_result.task = todo_request.task
#     todo_result.dateline = todo_request.dateline
#     todo_result.notes = todo_request.notes

#     db.add(todo_result)
#     db.commit()
#     return {"message":"Task successfully updated!"}

# #To delete todo data:
# @app.delete("/todos/{todo_id}")
# async def delete_todo(db:db_dependency, todo_id:int=Path(gt=0)):
#     todo_result = db.query(Todos).filter(Todos.id == todo_id).first ()

#     if todo_result is None:
#         raise HTTPException(status_code=404, detail="Task not found")
#     else:
#         db.delete(todo_result)
#         db.commit()
#         return {"message":"Task successfully deleted!"}


