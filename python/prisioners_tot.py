import pandas as pd
import csv, json

prisoners_new = list()

with open("../data/labour.csv") as csvfile:
    country_codes = list(csv.DictReader(csvfile))

with open("../data/world_total_prisoners_cleaned.csv") as csvfile:
    prisoners = list(csv.DictReader(csvfile))

years = list()
index = 0

for row in prisoners:
    row_as_dict = dict(row)
    if index == 0:
        for key in row_as_dict.keys():
            if key.isnumeric():
                years.append(key)
    for year in years:
        new_row_as_dict = dict()
        # inserisco country
        new_row_as_dict["country_name"] =  row_as_dict["country_name"]
        # insrisco il country code
        found = False
        for row_coutry in country_codes:
            row_as_dict_country = dict(row_coutry)

            if row_as_dict_country["country_name"].strip() == row_as_dict["country_name"].strip():
                new_row_as_dict["country_code"] = row_as_dict_country["country_code"].strip()
                found = True
                break

        if not found:
            new_row_as_dict["country_code"] = "Not found"
        # if row_as_dict["country_name"] in country_codes.keys():
        #     new_row_as_dict["country_code"] = country_codes[row_as_dict["country_name"].strip()]
        # else:
        #     new_row_as_dict["country_code"] = "Not found"

        # inserisco l'anno
        new_row_as_dict["year"] = year
        # inserisco il valore per questo year
        tot = row_as_dict[year]
        if len(tot) > 0:
            tot = int(float(str(row_as_dict[year]).strip().replace(",","")))
        new_row_as_dict["tot"] = tot
        # inserie qui nuova metrica
        prisoners_new.append(new_row_as_dict)
    index += 1


with open("../data/new_prisoners.csv", "w", newline="") as csvfile:
    dict_writer = csv.DictWriter(csvfile, prisoners_new[0].keys())
    dict_writer.writeheader()
    dict_writer.writerows(prisoners_new)
