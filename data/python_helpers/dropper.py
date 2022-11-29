# drops all columns of data that are unneeded
# import pandas with shortcut 'pd'
import csv
import pandas as pd
  
# read_csv function which is used to read the required CSV file
data = pd.read_csv('Tornadoes_SPC_1950to2015.csv')
  
# display
print("Original 'input.csv' CSV Data: \n")
print(data)
  
# pop function which is used in removing or deleting columns from the CSV files
data.pop('time')
data.pop('stn')
data.pop('mag')
data.pop('inj')
data.pop('fat')
data.pop('loss')
data.pop('closs')
data.pop('slat')
data.pop('slon')
data.pop('elat')
data.pop('elon')
data.pop('len')
data.pop('wid')
data.pop('fc')
data.pop('om')
data.pop('tz')
data.pop('date')

data.to_csv('new_tornadoes_data.csv')

  
# display
print("\nCSV Data after deleting the column 'year':\n")
print(data)