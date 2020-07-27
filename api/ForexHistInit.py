#from cassandra.io.libevreactor import LibevConnection
from cassandra.cluster import Cluster
from datetime import  date
from datetime import  timedelta
from Utilities import verifyWeekendAndBackdate
from Utilities import verifyWeekendAndPostdate
import datetime
import requests
import sys

cluster = Cluster()
session = cluster.connect('forexapi')

class ForexHistInit:
    def __init__(self):
        self.lastLoadDate = None
        self.response = None

    def getLastLoadDate(self):
        print('Obtain the lastloaddate from database')
        try:
            rows = session.execute("SELECT lastloaddate FROM lastloadinfo")

            for row in rows:
                self.lastLoadDate = row.lastloaddate.date()
        except Exception as e:
            print("getLastLoadDate() Exception : {}".format(e))
            raise


    def fetchCurrencies(self):
        print('Fetching Currency Information from database')
        try:
            rows = session.execute("SELECT * FROM currencies")
            currencies = []
            for row in rows:
                currencies.append(row.currency_name)
            cur_str = ",".join(currencies)
            print(cur_str)
            return cur_str
        except Exception as e:
            print("fetchCurrencies() Exception : {}".format(e))
            raise

    def fetchHistData(self, sdate, edate):
        try:
            currencies = self.fetchCurrencies()
            print("Fetching data between {} and {}".format(sdate, edate))
            # Make a call to API URL and fetch data
            url = 'https://fxmarketapi.com/apitimeseries?api_key=API_KEY&currency={}&start_date={}&end_date={}&format=close'.format(currencies, sdate, edate)
            print(url)
            self.response = requests.get(url)
            if self.response.status_code is requests.codes.ok:
                print('All good response')
                #print(self.response.headers['content-type'])
                jsonresp = self.response.json()

                for date, currlist in jsonresp['price'].items():
                    for curr, rate in currlist.items():
                        basecurr=curr[:3]
                        targetcurr=curr[-3:]
                        #print(basecurr, ":", date, ":",targetcurr, ":",rate)
                        insertquery = session.prepare("INSERT INTO histdata(base_curr,target_curr,rate_date,rate) "
                                                      "values(?,?,?,?)")
                        session.execute(insertquery, [basecurr, targetcurr, date, rate]);

                        session.execute("TRUNCATE TABLE lastloadinfo");
                        insertloaddatequery = session.prepare("INSERT INTO lastloadinfo(lastloaddate) values(?)")
                        session.execute(insertloaddatequery, [edate]);
            else:
                print('Error in fetching data')
        except Exception as e:
            print("fetchHistData() Exception : {}".format(e))
            raise

    def Initialize(self):
        try:
            # Fetch the date when the Historic data was last fetched
            self.getLastLoadDate()

            today_date = date.today()
            # The Data is never loaded in database
            if self.lastLoadDate is None:
                print("lastLoadDate is NULL. Let's pull historical records of one year for API" )
                # Pull the data in From and To duration
                # Get yesterday's date. This is TO Date
                to_date = today_date - timedelta(days=1)
                to_date = verifyWeekendAndBackdate(to_date)
                # Get a date a year before yesterday. This is From Date
                start_date = today_date - timedelta(days=365)
                print("start_date.weekday() {}".format(start_date.weekday()))
                start_date = verifyWeekendAndBackdate(start_date)

                self.fetchHistData(start_date, to_date)
            else:
                print("lastLoadDate is Not NULL")
                # Get yesterday's date. The data was fetched before.
                # Get the missing data only
                yest_date = today_date - timedelta(days=1)
                yest_date = verifyWeekendAndBackdate(yest_date)

                if(yest_date != self.lastLoadDate):
                    next_date = self.lastLoadDate
                    # Fetch the data from the next day of the last loaded date
                    next_date += timedelta(days=1)
                    next_date = verifyWeekendAndPostdate(next_date)

                    print("Updating missing data from last loaded date")
                    self.fetchHistData(next_date, yest_date)
                else:
                    print("Data is up to date") # If the data is up to date, no need to reload
        except Exception:
            print("Initialize() Exception: Error Occured while loading historical data")
