from fastapi import FastAPI
from starlette.templating import Jinja2Templates 
from starlette.requests import Request
from fastapi.staticfiles import StaticFiles
import schemas
import json


app = FastAPI()

templates = Jinja2Templates(directory="templates")

app.mount(
    '/templates/static', 
    StaticFiles(directory="templates/static"), 
    name='static'
    )

@app.get("/")
async def index(request:Request):
    return templates.TemplateResponse("index.html",{"request":request})




@app.get("/quiz_data",response_model=schemas.QuizData)
async def fetch_quiz_data():
    smp_itme = schemas.Item(
        id="i302108",
        name="イヤホン",
        image_path= "https://image.rakuten.co.jp/livelylife/cabinet/i/i302108.jpg",
        reviews=["娘が使用するのに購入しました。とくに問題なく使用できています。商品の発送も早くて良かったです　",
                 "注文してわずか数日で手元に届きました。迅速なご対応、ありがとうございました。",
                 "お値段以上に 音が良いです！",
                 "娘が使用しています。リーズナブルで、使いやすいです。",
                 "初めてのイヤホン購入でしたが、音質も良く、音ズレもなくとても快適に使用出来てます！お値段以上でした！",
                 "すぐに届きました！タッチパネル操作が少し不安ですが、使ってみようと思います。",
                 "コンパクトでかわいい色でした！通学で音楽を楽しみたいです。",
                 "すぐに届きました。気に入って頂きました。コスパが良く気に入っています。",
                 "注文してわずか数日で手元に届きました。迅速なご対応、ありがとうございました。",
                 "初めてのワイヤレスイヤホン購入でしたが、問題なく使用できました。お値段も安くて助かります。"
                ]
    )
    
    smp_data = schemas.QuizData(
        items=[smp_itme],
        correct_ans_index=0
    )
    
    
    return smp_data