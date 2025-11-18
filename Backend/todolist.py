from fastapi import FastAPI, Depends, Path, HTTPException
import models
from models import Todos
from database import engine, SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel, StrictInt, Field

app = FastAPI ()
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated [Session, Depends(get_db)]

class TodoRequest(BaseModel):
    task: str = Field (min_length=3, max_length=1000)
    dateline: str = Field (min_length=3, max_length=1000)
    notes: str = Field (min_length=3, max_length=1000)

#To read book data:
@app.get("/todos")
async def read_all(db: db_dependency):
    return db.query(Todos).all()

@app.get("/todos/{todo_id}")
async def get_todo_by_id (db:db_dependency, todo_id:int = Path(gt=0)):
    todo_result = db.query(Todos).filter(Todos.id == todo_id).first()

    if todo_result is not None:
        return todo_result
    
    raise HTTPException(status_code=404, detail="Task not found!")

#To create todo data:
@app.post("/todos")
async def create_todo(db:db_dependency, todo_request:TodoRequest):
    new_todo = Todos(task=todo_request.task, dateline=todo_request.dateline, notes=todo_request.notes)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return{"message":"Task successfully added!"}

#To update todo data:
@app.put ("/todo/{todo_id}")
async def update_todo(db:db_dependency,
                      todo_id: int,
                      todo_request: TodoRequest):
    todo_result = db.query(Todos).filter(Todos.id == todo_id).first ()

    if todo_request is None:
        raise HTTPException(status_code=404, detail="Task not found!")
    
    todo_result.task = todo_request.task
    todo_result.dateline = todo_request.dateline
    todo_result.notes = todo_request.notes

    db.add(todo_result)
    db.commit()
    return {"message":"Task successfully updated!"}

#To delete todo data:
@app.delete("/todos/{todo_id}")
async def delete_todo(db:db_dependency, todo_id:int=Path(gt=0)):
    todo_result = db.query(Todos).filter(Todos.id == todo_id).first ()

    if todo_result is None:
        raise HTTPException(status_code=404, detail="Task not found")
    else:
        db.delete(todo_result)
        db.commit()
        return {"message":"Task successfully deleted!"}
