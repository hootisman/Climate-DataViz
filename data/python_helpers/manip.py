# separate data into 5 year groups
import csv

filename = 'new_tornadoes_data.csv'
states = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' , 'DC', 'PR'];
arr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
total = 0
print(len(states))
print(len(arr))
def m(i):
    arr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    with open(filename, 'r') as csvfile:
        datareader = csv.reader(csvfile)
        for row in datareader:
                if (row[1] == 'yr'):
                    print()

                elif (int(row[1]) >= (1950+i*5) and int(row[1]) <= (1954+i*5)):
                    #arr[int(row[1])-1950] = arr[int(row[1])-1950] + 1 # total events per year
                    #arr[int(row[5])-1] += 1    # per state
                    if (states.index(row[4]) < 52) : 
                        #total+=1
                        arr[states.index(row[4])] += 1

                    else: print(row[4])
        print(1950+i*5)
        print(arr)
        return(arr)

for i in range(13):
    m(i)


    
    
