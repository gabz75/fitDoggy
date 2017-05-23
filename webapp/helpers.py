import json

def convertToLB(kg):
    return kg * 2.20462

def convertToKG(lb):
    return lb / 2.20462

def getMER(kg):
    return 110 * pow(kg, 0.75)

def createJsonResponse(data):
	return json.dumps(data)
	