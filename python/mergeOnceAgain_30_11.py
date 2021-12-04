import csv

# utility functions --------------------------------------------------------

def tryParseToNumber(s):
    result = s
    try:
        if len(s) > 0:
            result = int(float(str(s).strip().replace(",","")))
        else: 
            result = "NaN"    
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

def cleanFile(filename, new_file_name):
    new_filtered = ""
    with open(filename, encoding="utf8", errors='ignore') as file_opened:
        for line in file_opened:
            new_filtered += line.replace('\0', '')
    new_file = open(new_file_name, "w")
    new_file.write(new_filtered)
    new_file.close()   

#  ----------------------------------------------------------------------

final = list()
data = dict()

with open("../data/pre_final_02_12.csv") as csvfile:
    data["PRE_FINAL"] = list(csv.DictReader(csvfile))

with open("../data/nat_for_unece.csv") as csvfile:
    data["NAT_FOR_UNECE"] = list(csv.DictReader(csvfile))

# filtering null char from dirty file
cleanFile("../data/_prison_mortality.csv", "../data/prison_mortality.csv")
    
with open("../data/prison_mortality.csv") as csvfile:
    data["PRIS_MORTALITY"] = list(csv.DictReader(csvfile))


with open("../data/prison_staff_WHO.csv") as csvfile:
    data["PRIS_STAFF_WHO"] = list(csv.DictReader(csvfile))

# filtering null char from dirty file
cleanFile("../data/_prison_staff_UNODC.csv", "../data/prison_staff_UNODC.csv")

with open("../data/prison_staff_UNODC.csv") as csvfile:
    data["PRIS_STAFF_UNODC"] = list(csv.DictReader(csvfile))


# mandatory
fixed_columns_to_consider = ["country_name", "country_code", "year"]

columns_to_consider = ["country_name", "country_code","total","adults_male","adults_female", \
    "juvenile_male", "juvenile_female", "tot_juvenile", "tot_male", "tot_female", "foreign", "nationals", \
    "unsentenced", "sentenced", "actual", "official", "total_mortality", "suicide_mortality", "homicide_mortality"]

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
    # print("extracting info from parison NAT_FOR_UNECE row_" + str(index))
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
    # print("extracting info from parison PRIS_MORTALITY row_" + str(index))
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
    
    # extracting info from NAT_FOR_UNECE
    # print("extracting info from parison PRIS_STAFF_WHO row_" + str(index))
    for row_pris_staff_who in data["PRIS_STAFF_WHO"]:
        row_as_dict_pris_staff_who = dict(row_pris_staff_who)
        country_name_pris_staff_who = row_as_dict_pris_staff_who["Country"].strip()
        if country_name == country_name_pris_staff_who:
            # pris_staff_who - indicator in file is "Number of psychiatrists"
            if row_as_dict_pris_staff_who["Year"].strip() == year:
                filtered_dict["psychiatrists_staff"] = tryParseToNumber(row_as_dict_pris_staff_who["Number of psychiatrists"])
            # pris_staff_who - indicator in file is "Number of psychologists"
            if row_as_dict_pris_staff_who["Year"].strip() == year:
                filtered_dict["psychologists_staff"] = tryParseToNumber(row_as_dict_pris_staff_who["Number of psychologists"])

    # extracting info from PRIS_STAFF_UNODC
    # print("extracting info from parison PRIS_STAFF_UNODC row_" + str(index))
    for row_pris_staff_unodc in data["PRIS_STAFF_UNODC"]:
        row_as_dict_pris_staff_unodc = dict(row_pris_staff_unodc)
        country_name_pris_staff_unodc = row_as_dict_pris_staff_unodc["Country"].strip()
        if country_name == country_name_pris_staff_unodc:
            # pris_staff_unodc - indicator in file is "Personnel responsible for Education/Training/Health"
            if row_as_dict_pris_staff_unodc["Indicator"].strip() == "Personnel responsible for Education/Training/Health" and row_as_dict_pris_staff_unodc["Year"] == year:
                filtered_dict["education_training_health_staff"] = tryParseToNumber(row_as_dict_pris_staff_unodc["Count"])
            # pris_staff_unodc - indicator in file is "Total prison staff Males & Females"
            elif row_as_dict_pris_staff_unodc["Indicator"].strip() == "Total prison staff Males & Females" and row_as_dict_pris_staff_unodc["Year"] == year:
                filtered_dict["total_staff"] = tryParseToNumber(row_as_dict_pris_staff_unodc["Count"])

    final.append(filtered_dict)
    index += 1

# # this new metrics has to be added at the end (psychiatrists_staff, psychologists_staff)
headers.append("psychiatrists_staff")
headers.append("psychologists_staff")
headers.append("education_training_health_staff")
headers.append("total_staff")


with open("../data/final/final.csv", "w", newline="") as csvfile:
    dict_writer = csv.DictWriter(csvfile, headers)
    dict_writer.writeheader()
    dict_writer.writerows(final)


