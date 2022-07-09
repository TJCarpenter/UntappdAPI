from base64 import b64encode
from requests import get
from json import loads
import pprint
import re

API_KEY_RW = "kHzx73wJBb1_ZANoif_R"
API_KEY_R = "Kgjk8gfh4mBys-1pf_Br"
EMAIL = "tom@2tomsbrewing.com"
TOKEN = 'Basic dG9tQDJ0b21zYnJld2luZy5jb206a0h6eDczd0pCYjFfWkFOb2lmX1I='
BREWERY_ID = 229502

INDY_LOCATION = 0
FORTWAYNE_LOCATION = 1



def getLocationId():
  endpoint = "https://business.untappd.com/api/v1/locations";

  headers = { 'Authorization': TOKEN }
  response = get(endpoint, headers=headers)
  
  json = loads(response.text)

  return json["locations"][FORTWAYNE_LOCATION]["id"]

def getResults(endpoint):
  headers = { 'Authorization': TOKEN }
  response = get(endpoint, headers=headers)
  json = loads(response.text)
  
  return json["historical_items"]


def getMenuHistory():
  locationId = getLocationId()

  numResults = 14
  page = 1
  items = []

  while numResults == 14:
    endpoint = "https://business.untappd.com/api/v1/locations/{}/historical_items?page={}".format(locationId, page)

    results = getResults(endpoint)

    numResults = len(results)

    for result in results:
      item = parseObject(result)
      if item == None:
        continue
      items.append(parseObject(result))

    page = page + 1

  for item in items:
    item["name"] = re.sub(r'\([^)]*\)|(?i)(nitro)', '', item["name"])
    item["name"] = re.sub(r'\-$', '', item["name"])

  filtered = set()
  result = []
  for d in items:
      if d['name'] not in filtered:
          filtered.add(d['name'])  # note it down for further iterations
          result.append(d)

  pprint.pp(result)





def parseObject(object):
  if object["item"]["untappd_brewery_id"] == BREWERY_ID:

    data = dict()
    data["brewery"]=  object["item"]["brewery"]
    data["item_id"]=  object["id"]
    data["unappd_id"]=  object["item"]["untappd_id"]
    data["beer_id"]=  object["item"]["id"]
    data["date_created"]=  object["created_at"]
    data["abv"]=  object["item"]["abv"]
    data["calories"]=  object["item"]["calories"]
    data["ibu"]=  object["item"]["ibu"]
    data["in_production"]=  object["item"]["in_production"]
    data["label_image"]=  object["item"]["label_image"]

    try:
      data["label_image_hd"]=  object["item"]["label_image_hd"]
    except:
      data["label_image_hd"]= False

    data["name"]=  object["item"]["name"]
    data["description"]=  object["item"]["description"]
    data["style"]=  object["item"]["style"]

    try:
      data["type"]=  object["item"]["type"]
    except:
      data["type"] = False

    return data


getMenuHistory()