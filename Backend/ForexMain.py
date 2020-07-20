from flask import Flask
from ForexHistInit import  ForexHistInit
from flask import request,jsonify
from datetime import  date
from ForexHistQuery import ForexHistQuery
import datetime

app=Flask(__name__)

@app.route('/hello')
def onHello():
    return {'React' : "Hello"}

@app.route('/')
def onLoad():
    try:
        finit = ForexHistInit()
        finit.Initialize()
    except Exception as e:
        return "onLoad(): Exception Occured while loading data"
    else:
        return "Hello"

@app.route('/histReq', methods=['GET','POST'])
def onHistRequest():
    try:
        #if(request.method == 'GET'):
            args = request.args

            histQueryObj = ForexHistQuery()
            resultset = histQueryObj.fetchQueryDataFromDB(args)
            return jsonify(resultset)
    except Exception as e:
        return "onHistRequest(): Exception Occured while serving request"

@app.route('/rateChange', methods=['GET','POST'])
def onRateChangeRequest():
    try:
        #if(request.method == 'GET'):
            args = request.args
            histQueryObj = ForexHistQuery()
            resultset = histQueryObj.fetchRateChangeFromDB(args)
            return jsonify(resultset)
    except Exception as e:
        return "onRateChangeRequest(): Exception Occured while serving request"

@app.route('/currencies', methods=['GET','POST'])
def onCurrencyRequest():
    try:
        #if(request.method == 'GET'):
            args = request.args
            finit = ForexHistInit()
            resultset = finit.fetchCurrencies()
            print(resultset)
            return jsonify(resultset)
    except Exception as e:
        return "onCurrencyRequest(): Exception Occured while fetching currencies"

if __name__=="__main__":
    app.run(debug=True)
