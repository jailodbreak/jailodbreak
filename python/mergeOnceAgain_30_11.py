import pandas as pd
import csv

final = list()
data = dict()

european_country_codes = list(pd.read_csv("../data/europe_country_codes.csv")["country_code"])

with open("../data/pre_final_30_11.csv") as csvfile:
    data["PRE_FINAL"] = list(csv.DictReader(csvfile))

with open("../data/nat_for_unece.csv") as csvfile:
    data["NAT_FOR_UNECE"] = list(csv.DictReader(csvfile))


# filtering null char from dirty file
myfile = open("../data/_prison_mortality.csv", "r")
myline = myfile.readline()
new_filtered = ""
while myline:
    myline = myfile.readline()
    new_filtered += myline.replace('\0', '')
myfile.close()   

f = open("../data/prison_mortality.csv", "a")
f.write(new_filtered)
f.close()
    
with open("../data/prison_mortality.csv") as csvfile:
    data["PRIS_MORTALITY"] = list(csv.DictReader(csvfile))

# mandatory
fixed_columns_to_consider = ["country_name", "country_code", "year"]

columns_to_consider = ["country_name", "country_code","year","total","adults_male","adults_female", \
    "juvenile_male", "juvenile_female", "tot_juvenile", "tot_male", "tot_female", "foreign", "nationals", \
    "unsentenced", "sentenced", "actual", "official"]


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

headers = []

index = 0
for row in data["PRE_FINAL"]:
    row_as_dict_tot = dict(row)
    filtered_dict = dict()

    country_code = row_as_dict_tot["country_code"].strip()
    country_name = row_as_dict_tot["country_name"].strip()
    year = row_as_dict_tot["year"].strip()

    # extract selected columns from prefinal
    for metric in row_as_dict_tot.keys():
        if metric in fixed_columns_to_consider or metric in columns_to_consider:
            filtered_dict[metric] = row_as_dict_tot[metric]
            if metric not in headers:
                headers.append(metric)

    # extracting info from NAT_FOR_UNECE
    print("extracting info from parison NAT_FOR_UNECE row_" + str(index))
    for row_nat_for_unece in data["NAT_FOR_UNECE"]:
        row_as_dict_nat_for_unece = dict(row_nat_for_unece)
        country_name_nat_for_unece = row_as_dict_nat_for_unece["Country"].strip()
        if country_name == country_name_nat_for_unece and year in row_as_dict_nat_for_unece.keys():
            # totals - indicator in file is "All Prisoners"
            if row_as_dict_nat_for_unece["Citizenship"] == "All Prisoners" and row_as_dict_nat_for_unece["Sex"] == "Both sexes":
                filtered_dict["total"] = tryParseToNumber(row_as_dict_nat_for_unece[year])
            # foreigns - indicator in file is "Foreigners"
            elif row_as_dict_nat_for_unece["Citizenship"] == "Foreigners" and row_as_dict_nat_for_unece["Sex"] == "Both sexes":
                filtered_dict["foreign"] = tryParseToNumber(row_as_dict_nat_for_unece[year])
            # nationals - indicator in file is "Foreigners"
            elif row_as_dict_nat_for_unece["Citizenship"] == "Nationals" and row_as_dict_nat_for_unece["Sex"] == "Both sexes":
                filtered_dict["nationals"] = tryParseToNumber(row_as_dict_nat_for_unece[year])

    # extracting info from NAT_FOR_UNECE
    print("extracting info from parison PRIS_MORTALITY row_" + str(index))
    for row_pris_mortality in data["PRIS_MORTALITY"]:
        row_as_dict_pris_mortality = dict(row_pris_mortality)
        country_name_pris_mortality = row_as_dict_pris_mortality["Country"].strip()
        if country_name == country_name_pris_mortality:
            # total_mortality - indicator in file is "Mortality: Total deaths"
            if row_as_dict_pris_mortality["Indicator"] == "Mortality: Total deaths" and row_as_dict_pris_mortality["Year"] == year:
                filtered_dict["total_mortality"] = tryParseToNumber(row_as_dict_pris_mortality["Count"])
            # suicide_mortality - indicator in file is "Mortality: Death by intentional homicide"
            elif row_as_dict_pris_mortality["Indicator"] == "Mortality: Death by intentional homicide" and row_as_dict_pris_mortality["Year"] == year:
                filtered_dict["homicide_mortality"] = tryParseToNumber(row_as_dict_pris_mortality["Count"])
            # homicide_mortality - indicator in file is "Foreigners"
            elif row_as_dict_pris_mortality["Indicator"] == "Mortality: Death by suicide" and row_as_dict_pris_mortality["Year"] == year:
                filtered_dict["suicide_mortality"] = tryParseToNumber(row_as_dict_pris_mortality["Count"])
    
    final.append(filtered_dict)
    index += 1

# # this new metrics has to be added at the end (total, suicide, homicide)
headers.append("total_mortality")
headers.append("suicide_mortality")
headers.append("homicide_mortality")

with open("../data/final/final.csv", "w", newline="") as csvfile:
    dict_writer = csv.DictWriter(csvfile, headers)
    dict_writer.writeheader()
    dict_writer.writerows(final)


