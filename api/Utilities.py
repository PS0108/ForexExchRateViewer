from datetime import  date
from datetime import  timedelta
import datetime

def verifyWeekendAndBackdate(check_date):
    # If the date falls on weekend, data can't be pulled.
    # So, change the date to last working day.
    print("check_date.weekday() {}".format(check_date.weekday()))
    if check_date.weekday() > 4:
        if check_date.weekday() == 5:
            check_date = check_date - timedelta(days=1)
        else:
            check_date = check_date - timedelta(days=2)
    return check_date

def verifyWeekendAndPostdate(check_date):
    # If the date falls on weekend, data can't be pulled.
    # So, change the date to last working day.
    print("check_date.weekday() {}".format(check_date.weekday()))
    if check_date.weekday() > 4:
        if check_date.weekday() == 5:
            check_date = check_date + timedelta(days=2)
        else:
            check_date = check_date + timedelta(days=1)
    return check_date

def toDate(dateString):
    return datetime.datetime.strptime(dateString, "%Y-%m-%d").date()