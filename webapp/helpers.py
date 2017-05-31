from datetime import date
from operator import eq
def convertToLB(kg):
    return kg * 2.20462

def convertToKG(lb):
    return lb / 2.20462

def getMER(weight, metric):
	if eq(metric, 'lb'):
		return 110 * pow(convertToKG(weight), 0.75)
	return 110 * pow(weight, 0.75)

def get_date(string):
    return date(int(string[4:]), int(string[:2]), int(string[2:4])) 