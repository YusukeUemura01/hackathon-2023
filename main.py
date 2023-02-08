from fastapi import FastAPI,Depends
from starlette.templating import Jinja2Templates 
from starlette.requests import Request
from fastapi.staticfiles import StaticFiles
import json
import random
import sqlite3
import schemas

app = FastAPI()

dbname = 'item_data.db'

def get_item_length():
    conn = sqlite3.connect(dbname)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM name_pic")
    result = cur.fetchone()[0]
    cur.close()
    conn.close()
    return result


def get_name_and_image(index:int):
    conn = sqlite3.connect(dbname)
    cur = conn.cursor()
    cur.execute(f'SELECT * FROM name_pic WHERE "index" = {index}')
    list = [row for row in cur]
    cur.close()
    conn.close()
    return list


def get_reviews(id :str):
    conn = sqlite3.connect(dbname)
    cur = conn.cursor()
    cur.execute("SELECT * FROM review WHERE id like ?",('%'+id+'%',))
    list = [row for row in cur]
    cur.close()
    conn.close()
    return list




def rand_ints_nodup(a : int, b : int, k : int = 4):#重複しないランダム数字を4つ作成
  ns = []
  while len(ns) < k:
    n = random.randint(a, b)
    if not n in ns:
      ns.append(n)
  return ns


def getRank(score : float):
    if score >= 5.5:
        return "S"
    if score >= 5.0:
        return "A"
    if score >= 4.0:
        return "B"
    if score >= 3.0:
        return "C"
    return "D"

    



templates = Jinja2Templates(directory="templates")




app.mount(
    '/templates/static', 
    StaticFiles(directory="templates/static"), 
    name='static'
)



@app.get("/")
async def start(request:Request):
    return templates.TemplateResponse("start_screen.html",{"request":request})


@app.get("/game")
async def start_game(request:Request):
    return templates.TemplateResponse("game.html",{"request":request})


@app.get("/result")
async def show_result(request:Request,time : int,correctNum : int):
    score : float = round(correctNum + (60 - time) / 60, 2)
    rank : str = getRank(score)
    return templates.TemplateResponse(
        "result.html",
        {
         "request" : request,
         "time" : time,
         "correctNum" : correctNum,
         "score": score,
         "rank": rank
        }
    )




@app.get("/quiz_data",response_model=schemas.QuizData)
async def provide_quiz_data():

    index_list = rand_ints_nodup(0,get_item_length() - 1)
    item_list = []
    for index in index_list:
        name_and_image = get_name_and_image(index)
        id = name_and_image[0][1]
        reviewData = get_reviews(id)
        item = schemas.Item(
            id = id,
            name = name_and_image[0][2],
            image_path = name_and_image[0][3],
            reviews = [review[2] for review in reviewData]
        )
        item_list.append(item)
        
    
    data = schemas.QuizData(
        items=item_list,
        correct_ans_index=random.randint(0, 3)
    )
    
    return data