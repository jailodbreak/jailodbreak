import pandas as pd
import csv

final = list()
data = dict()

european_country_codes = list(pd.read_csv("../data/europe_country_codes.csv")["country_code"])

with open("../data/final.csv") as csvfile:
    data["FINAL"] = list(csv.DictReader(csvfile))

with open("../data/prison_capacity.csv") as csvfile:
    data["PRIS_CAP"] = list(csv.DictReader(csvfile))

years_to_consider = ["2003", "2004", "2005","2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"]
country_codes_to_consider = european_country_codes

# mandatory
fixed_columns_to_consider = ["country_name", "country_code", "year"]

columns_to_consider = ["country_name", "country_code","year","total","adults_male","adults_female", \
    "juvenile_male", "juvenile_female", "tot_juvenile", "tot_male", "tot_female", "foreign", "nationals", \
    "unsentenced", "sentenced"]


def tryParseToNumber(s):
    result = s
    try:
        if len(s) > 0:
            result = int(float(str(s).strip().replace(",","")))
    except:
        result = "NaN"
    return result

def tryToSum(v1, v2):
    result = ""
    if len(str(v1)) > 0 and len(str(v2)) > 0:
        result = int(float(str(v1).strip().replace(",",""))) + int(float(str(v2).strip().replace(",","")))
    return result

def tryToDiff(v1, v2):
    result = ""
    if len(str(v1)) > 0 and len(str(v2)) > 0:
        result = int(float(str(v1).strip().replace(",",""))) - int(float(str(v2).strip().replace(",","")))
    return result


# totals

# foreigns
# nationals

# adults male
# adults female
# juvenile male
# juvenile female
# tot male 
# tot female
# tot juvenile

# sentenced 
# unsentenced


headers = []

index = 0
for row in data["FINAL"]:
    row_as_dict_tot = dict(row)
    filtered_dict = dict()

    country_code = row_as_dict_tot["country_code"].strip()
    year = row_as_dict_tot["year"].strip()

    # taking selected info from prefinal : filtering according with year/country_code  
    if year in years_to_consider and country_code in country_codes_to_consider:

        # extract selected columns from prefinal
        for metric in row_as_dict_tot.keys():
            if metric in fixed_columns_to_consider or metric in columns_to_consider:
                filtered_dict[metric] = row_as_dict_tot[metric]
                if metric not in headers:
                    headers.append(metric)

        # extracting info from capacity
        print("extracting info from parison capacity row_" + str(index))
        for row_pris_cap in data["PRIS_CAP"]:
            row_as_dict_pris_cap = dict(row_pris_cap)
            country_code_pris_cap = row_as_dict_pris_cap["country_code"].strip()
            # print("hello", row_as_dict_pris_cap.keys())
            if country_code in country_codes_to_consider and country_code == country_code_pris_cap and year in row_as_dict_pris_cap.keys():
                # actual prisoners
                if row_as_dict_pris_cap["indicator"] == "PRIS_ACT_CAP":
                    filtered_dict["actual"] = tryParseToNumber(row_as_dict_pris_cap[year])
                # official prisoners
                elif row_as_dict_pris_cap["indicator"] == "PRIS_OFF_CAP":
                    filtered_dict["official"] = tryParseToNumber(row_as_dict_pris_cap[year])
     
        final.append(filtered_dict)
        index += 1

# this new metrics has to be added at the end
headers.append("actual")
headers.append("official")

with open("../data/final/final.csv", "w", newline="") as csvfile:
    # headers = ["country_name", "country_code","year","total","adults_male","adults_female", \
    # "juvenile_male", "juvenile_female", "tot_juvenile", "tot_male", "tot_female", "foreign", "nationals", \
    # "unsentenced", "sentenced", "official", "actual"]

    dict_writer = csv.DictWriter(csvfile, headers)
    dict_writer.writeheader()
    dict_writer.writerows(final)


