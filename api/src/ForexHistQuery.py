from Utilities import toDate
from cassandra.cluster import Cluster
from datetime import  date
from datetime import  timedelta
from Utilities import verifyWeekendAndBackdate
from Utilities import verifyWeekendAndPostdate
import datetime

cluster = Cluster()
session = cluster.connect('forexapi')

class ForexHistQuery:
    def __init__(self):
        pass

    def fetchQueryDataFromDB(self, args):
        # Fetch the query parameters, Duration and Currencies

        from_date = args.get('FROM_DATE', type=toDate)
        to_date = args.get('TO_DATE', type=toDate)

        from_curr = args['FROM_CURR']
        to_curr = args['TO_CURR']

        # Fix the weekend dates
        from_date = verifyWeekendAndBackdate(from_date)
        to_date = verifyWeekendAndBackdate(to_date)

        str = from_curr+to_curr
        print("Fetching data for currency pair {} From {} To {}".format(str, from_date, to_date))

        try:
            selectQuery = session.prepare("select * from histdata where base_curr=? and target_curr=? and rate_date>=? and rate_date<=?")
            rows = session.execute(selectQuery, [from_curr, to_curr, from_date, to_date])
            all_rows_dict = {}
            #curr_key = rows[0].base_curr + rows[0].target_curr

            for row in rows:
                rate_date = row.rate_date.date()
                new_dict = dict({rate_date.isoformat() : row.rate})
                all_rows_dict.update(new_dict)

            all_rates_dict={}
            curr_key = from_curr + to_curr
            all_rates_dict[curr_key] = all_rows_dict

            hist_data={}
            hist_data["data"] = all_rates_dict

            return hist_data
        except Exception as e:
            print("fetchQueryDataFromDB() Exception : {}".format(e))
            raise

    def fetchRateChangeFromDB(self, args):
        # Fetch the query parameters, Duration and Currencies
        from_date = args.get('FROM_DATE', type=toDate)
        to_date = args.get('TO_DATE', type=toDate)

        from_curr = args['FROM_CURR']
        to_curr = args['TO_CURR']

        print(from_curr + to_curr)

        # Fix the weekend dates
        from_date = verifyWeekendAndBackdate(from_date)
        to_date = verifyWeekendAndBackdate(to_date)

        try:
            # Extract Start Date Rate
            startrate_selectQuery = session.prepare("select * from histdata where base_curr=? and target_curr=? and rate_date=?")
            rows = session.execute(startrate_selectQuery, [from_curr, to_curr, from_date])

            start_date = rows[0].rate_date.date()
            start_rate = rows[0].rate

            # Extract End Date Rate
            endrate_selectQuery = session.prepare(
                "select * from histdata where base_curr=? and target_curr=? and rate_date=?")
            rows = session.execute(endrate_selectQuery, [from_curr, to_curr, to_date])

            end_date = rows[0].rate_date.date()
            end_rate = rows[0].rate

            # Calculate rate change
            rate_change = round(abs(end_rate - start_rate),5)
            pct_change = round((end_rate - start_rate)/start_rate * 100, 5)

            new_dict = dict({"start_date": start_date.isoformat(),
                            "end_date": end_date.isoformat(),
                            "start_rate": start_rate,
                            "end_rate" : end_rate,
                            "change" : rate_change,
                            "pct_change" : pct_change},)

            # Final JSON
            rate_change_dict={}
            curr_key = from_curr + to_curr
            rate_change_dict[curr_key] = new_dict

            return rate_change_dict
        except Exception as e:
            print("fetchRateChangeFromDB() Exception : {}".format(e))
            raise

