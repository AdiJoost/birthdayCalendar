'''This utilities-package is for all models to prevent circular import.
It shares some methods from normal utilities-package.
'''
import datetime

def is_in_range(present, start_date, end_date):
    if not start_date:
        start_date = datetime.date(2000, 1, 1)
    if not end_date:
        end_date = datetime.date(3000, 1, 1)
    presents_day = present.kid.birthday
    presents_day = presents_day.replace(year=present.year)
    if presents_day > start_date and presents_day < end_date:
        return True
    else:
        return False

def get_date(string):
    try:
        year = int(string[0:4])
        month = int(string[5:7])
        day = int(string[8:])
        date = datetime.date(year, month, day)
        return date
    except:
        return None