import pandas as pd
import csv

final = list()
data = dict()

with open("../data/tot.csv") as csvfile:
    data["TOT"] = list(csv.DictReader(csvfile))

with open("../data/sex.csv") as csvfile:
    data["SEX"] = list(csv.DictReader(csvfile))

with open("../data/foreigns.csv") as csvfile:
    data["FOREIGNS"] = list(csv.DictReader(csvfile))

with open("../data/unsentenced.csv") as csvfile:
    data["UNSENTENCED"] = list(csv.DictReader(csvfile))

def tryParseToNumber(s):
    result = s
    if len(s) > 0:
        result = int(float(str(s).strip().replace(",","")))
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

index = 0
for row in data["TOT"]:
    row_as_dict_tot = dict(row)
    region_tot = row_as_dict_tot["country_name"].strip()
    tot_tot = tryParseToNumber(row_as_dict_tot["tot"])
    year = row_as_dict_tot["year"].strip()

    tot_male = 0
    tot_female = 0

    # extracting info from sex
    print("extracting info from sex row_" + str(index))
    for row_sex in data["SEX"]:
        row_as_dict_sex = dict(row_sex)
        region_sex = row_as_dict_sex["country_name"].strip()
        if region_tot == region_sex and year in row_as_dict_sex.keys():
            # adults male
            if row_as_dict_sex["Indicator"] == "Adults Male":
                row_as_dict_tot["adults_male"] = tryParseToNumber(row_as_dict_sex[year])
                tot_male = tryToSum(tot_male, row_as_dict_sex[year])
            # adults female
            if row_as_dict_sex["Indicator"] == "Adults Female":
                row_as_dict_tot["adults_female"] = tryParseToNumber(row_as_dict_sex[year])
                tot_female = tryToSum(tot_female, row_as_dict_sex[year])
            # juvenile male
            if row_as_dict_sex["Indicator"] == "Juveniles Male":
                row_as_dict_tot["juvenile_male"] = tryParseToNumber(row_as_dict_sex[year])
                tot_male = tryToSum(tot_male, row_as_dict_sex[year])
            # juvenile female
            if row_as_dict_sex["Indicator"] == "Juveniles Female":
                row_as_dict_tot["juvenile_female"] = tryParseToNumber(row_as_dict_sex[year])
                tot_female = tryToSum(tot_female, row_as_dict_sex[year])
            # tot juvenile
            if row_as_dict_sex["Indicator"] == "Total Juveniles":
                row_as_dict_tot["tot_juvenile"] = tryParseToNumber(row_as_dict_sex[year]) 
            #  tot male
            row_as_dict_tot["tot_male"] = tot_male
            #  tot female
            row_as_dict_tot["tot_female"] = tot_female
    
    # extracting info from foreign
    print("extracting info from foreign row_" + str(index))
    for row_foreign in data["FOREIGNS"]:
        row_as_dict_foreign = dict(row_foreign)
        region_foreign = row_as_dict_foreign["country_name"].strip()
        if region_tot == region_foreign and year in row_as_dict_foreign.keys():
            # foreign and nationals
            if row_as_dict_foreign["Indicator"].strip() == "Foreign":
                foreign_temp = tryParseToNumber(row_as_dict_foreign[year])
                row_as_dict_tot["foreign"] = foreign_temp
                row_as_dict_tot["nationals"] = tryToDiff(tot_tot, foreign_temp)
                break

    # extracting info from unsentenced
    print("extracting info from unsentenced row_" + str(index))
    for row_unsentenced in data["UNSENTENCED"]:
        row_as_dict_unsentenced = dict(row_unsentenced)
        region_unsentenced = row_as_dict_unsentenced["country_name"].strip()
        if region_tot == region_unsentenced and year in row_as_dict_unsentenced.keys():
            # sentenced and unsentenced
            if row_as_dict_unsentenced["Indicator"].strip() == "Total unsentenced":
                unsentenced_temp = tryParseToNumber(row_as_dict_unsentenced[year])
                row_as_dict_tot["unsentenced"] = unsentenced_temp
                row_as_dict_tot["sentenced"] = tryToDiff(tot_tot, unsentenced_temp)
                break

    final.append(row_as_dict_tot)
    index += 1

with open("../data/final/final.csv", "w", newline="") as csvfile:
    headers = ["country_name", "country_code","year","tot","adults_male","adults_female", \
    "juvenile_male", "juvenile_female", "tot_juvenile", "tot_male", "tot_female", "foreign", "nationals", \
    "unsentenced", "sentenced"]
    dict_writer = csv.DictWriter(csvfile, headers)
    dict_writer.writeheader()
    dict_writer.writerows(final)


