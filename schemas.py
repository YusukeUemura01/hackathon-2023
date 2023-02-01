from pydantic import BaseModel,Field
from typing import Optional,List



class Item(BaseModel):
    id : str
    name : str
    image_path : str
    reviews : Optional[List[str]] = None
    

class QuizData(BaseModel):
    items : List[Item]
    correct_ans_index : int #0〜3
    
    
    

