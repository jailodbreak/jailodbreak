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

final_inspection = list()
final_assessment = list()

with open("../data/final/final.csv") as csvfile:
    data["FINAL"] = list(csv.DictReader(csvfile))

with open("../data/healt_assessment_WHO.csv") as csvfile:
    data["HEALTH_MORTALITY"] = list(csv.DictReader(csvfile))

# filtering null char from dirty file
# cleanFile("../data/_prison_mortality.csv", "../data/prison_mortality.csv")

headers = ["year", "mortality_yes", "mortality_no"]

for row in data["FINAL"]:
    row_as_dict_tot = dict(row)
    inspection = dict()

    country_name = row_as_dict_tot["country_name"].strip()
    year = row_as_dict_tot["year"].strip()
    mortality = tryParseToNumber(row_as_dict_tot["total_mortality"])

    found = False
    for i in final_inspection:
        if i["year"] == year:
            found = True
            break
    
    if not found:
        inspection["year"] = year
        inspection["mortality_yes"] = 0
        inspection["mortality_no"] = 0

    for row in data["HEALTH_MORTALITY"]:
        row_ad_dict = dict(row)
        row_ad_dict_country_name = row_ad_dict["Country"].strip()
        if country_name == row_ad_dict_country_name:
            
            if row_ad_dict["Assessment of prison health services"] == "Yes":
                inspecton_mort_yes += mortality
            elif row_ad_dict["Assessment of prison health services"] == "No":
                inspecton_mort_no += mortality

            if row_ad_dict["Inspection of prison hygiene"] == "Yes":
                assessment_mort_yes += mortality
            elif row_ad_dict["Inspection of prison hygiene"] == "No":
                assessment_mort_no += mortality

            
    final_inspection.append(inspection)
    final_assessment.append(assessment)



with open("../data/final/final.csv", "w", newline="") as csvfile:
    dict_writer = csv.DictWriter(csvfile, headers)
    dict_writer.writeheader()
    dict_writer.writerows(final)


