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

def updateOnMortality(country_name, mortality, structure, metric):
    for row in data["HEALTH_MORTALITY"]:
        row_ad_dict = dict(row)
        row_ad_dict_country_name = row_ad_dict["Country"].strip()
        if mortality != "NaN" and country_name == row_ad_dict_country_name:
            if row_ad_dict[metric] == "Yes":
                structure["mortality_yes"] += mortality
                structure["mortality_yes_n_countries"] += 1
            elif row_ad_dict[metric] == "No":
                structure["mortality_no"] += mortality
                structure["mortality_no_n_countries"] += 1

            break

#  ----------------------------------------------------------------------

data = dict()

final_inspection = list()
final_assessment = list()

final_inspection_n_countries = 0
final_assessment_n_countries = 0

with open("../data/final.csv") as csvfile:
    data["FINAL"] = list(csv.DictReader(csvfile))

with open("../data/healt_assessment_WHO.csv") as csvfile:
    data["HEALTH_MORTALITY"] = list(csv.DictReader(csvfile))

# filtering null char from dirty file
# cleanFile("../data/_prison_mortality.csv", "../data/prison_mortality.csv")

# headers = ["year", "mortality_yes", "mortality_no", "mortality_yes_n_countries", "mortality_no_n_countries", "mortality_yes_tot", "mortality_no_tot"]
headers = ["year", "mortality_yes", "mortality_no"]

for row in data["FINAL"]:
    row_as_dict_tot = dict(row)
    inspection = dict()
    assessment = dict()

    country_name = row_as_dict_tot["country_name"].strip()
    year = row_as_dict_tot["year"].strip()
    mortality = tryParseToNumber(row_as_dict_tot["total_mortality"])

    inspection_found = False
    for insp in final_inspection:
        if insp["year"] == year:
            inspection_found = True
            final_inspection_n_countries += 1
            updateOnMortality(country_name, mortality, insp, "Medical document inspections")
            break

    if not inspection_found:
        inspection["year"] = year
        inspection["mortality_yes"] = 0
        inspection["mortality_no"] = 0
        inspection["mortality_yes_n_countries"] = 0
        inspection["mortality_no_n_countries"] = 0
        updateOnMortality(country_name, mortality, inspection, "Medical document inspections")
        final_inspection.append(inspection)

    # -------------------------------------------------------------------------

    assessment_found = False
    for ass in final_assessment:
        if ass["year"] == year:
            assessment_found = True
            final_assessment_n_countries += 1
            updateOnMortality(country_name, mortality, ass, "Assessment of prison health services")
            break

    if not assessment_found:
        assessment["year"] = year
        assessment["mortality_yes"] = 0
        assessment["mortality_no"] = 0
        assessment["mortality_yes_n_countries"] = 0
        assessment["mortality_no_n_countries"] = 0
        updateOnMortality(country_name, mortality, assessment, "Assessment of prison health services")
        final_assessment.append(assessment)

    # -------------------------------------------------------------------------
    
# filter zero values
final_assessment_filtered = list()
final_inspection_filtered = list()
for x in final_assessment:
    if x["mortality_yes"] != 0 or x["mortality_no"] != 0:
        temp_ass = dict()
        temp_ass["year"] = x["year"]
        temp_ass["mortality_yes"] = x["mortality_yes"]/x["mortality_yes_n_countries"]
        temp_ass["mortality_no"] = x["mortality_no"]/x["mortality_no_n_countries"]
        # temp_ass["mortality_yes_n_countries"] = x["mortality_yes_n_countries"]
        # temp_ass["mortality_no_n_countries"] = x["mortality_no_n_countries"]
        # temp_ass["mortality_yes_tot"] = x["mortality_yes"]
        # temp_ass["mortality_no_tot"] = x["mortality_no"]
        final_assessment_filtered.append(temp_ass)
for x in final_inspection:
    if x["mortality_yes"] != 0 or x["mortality_no"] != 0:
        temp_insp = dict()
        temp_insp["year"] = x["year"]
        temp_insp["mortality_yes"] = x["mortality_yes"]/x["mortality_yes_n_countries"]
        temp_insp["mortality_no"] = x["mortality_no"]/x["mortality_no_n_countries"]
        # temp_insp["mortality_yes_n_countries"] = x["mortality_yes_n_countries"]
        # temp_insp["mortality_no_n_countries"] = x["mortality_no_n_countries"]
        # temp_insp["mortality_yes_tot"] = x["mortality_yes"]
        # temp_insp["mortality_no_tot"] = x["mortality_no"]
        final_inspection_filtered.append(temp_insp)



with open("./visualizzazione_4/visualition4.csv", "w", newline="") as csvfile:
    dict_writer = csv.DictWriter(csvfile, headers)
    dict_writer.writeheader()
    dict_writer.writerows(final_inspection_filtered)

with open("./visualizzazione_5/visualition5.csv", "w", newline="") as csvfile:
    dict_writer = csv.DictWriter(csvfile, headers)
    dict_writer.writeheader()
    dict_writer.writerows(final_assessment_filtered)


