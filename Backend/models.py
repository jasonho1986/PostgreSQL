# from database import Base
# from sqlalchemy import Column, Integer, String

# class Books(Base):
#     __tablename__ = "books"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String)
#     author = Column(String)
#     published_year = Column(Integer)








#---------------------------BOOKS--------------------------------

from database import Base
from sqlalchemy import Column, Integer, String



class Books(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    published_year = Column(Integer)



#--------------------TO DO LIST EXERCISE 1--------------------------

# from database import Base
# from sqlalchemy import Column, Integer, String

# class Todos(Base):
#     __tablename__ = "todos"  # <-- **FIXED: Must be __tablename__**

#     id = Column(Integer, primary_key=True, index=True)
#     task = Column(String)
#     dateline = Column(String)
#     notes = Column(String)



#--------------------TO DO LIST EXERCISE 2 LINKING BACK TO APP.JSX--------------------------

