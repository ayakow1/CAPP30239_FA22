import requests 
import pandas as pd
import numpy as np
import time
import pathlib

url = 'http://dataservices.imf.org/REST/SDMX_JSON.svc/'


revenue_cats={  'W0_S1_G1': 'Revenue',
    'W0_S1_G11': 'Tax revenue',
     'W0_S1_G111': 'Taxes on income, profits, & capital gains',
    'W0_S1_G1151': 'Customs & other import duties',
     'W0_S1_G112': 'Taxes on payroll & workforce',
     'W0_S1_G113': 'Taxes on property',
     'W0_S1_G114': 'Taxes on goods & services',
     'W0_S1_G115': 'Taxes on int trade & transactions',
     'W0_S1_G12': 'Social contributions',
    'W0_S1_G13': 'Grants revenue',
    'W1_S13_G13': 'Grants revenue from foreign govts',
     '1A_S1_G13': 'Grants revenue from int orgs',
      'W2_S13_G13': 'Grants revenue from other gen govt',
     'W0_S1_G14': 'Other revenue'
}

expense_cats={
 '_T': 'Expenditure',
 'GF01': 'Expenditure on general public services',
 'GF02': 'Expenditure on defense',
 'GF0201': 'Expenditure on military defense',
 'GF0202': 'Expenditure on civil defense',
 'GF0203': 'Expenditure on foreign military aid',
 'GF03': 'Expenditure on public order & safety',
 'GF0301': 'Expenditure on police services',
 'GF0302': 'Expenditure on fire protection services',
 'GF0303': 'Expenditure on law courts',
 'GF0304': 'Expenditure on prisons',
 'GF04': 'Expenditure on economic affairs',
 'GF0401': 'Expenditure on economic, commercial, & labour affairs',
 'GF0402': 'Expenditure on agriculture, fishing, forestry, & hunting',
 'GF0403': 'Expenditure on fuel & energy',
 'GF0404': 'Expenditure on mining, manufacturing, & construction',
 'GF0405': 'Expenditure on transport',
 'GF0406': 'Expenditure on communication',
 'GF05': 'Expenditure on environment protection',
 'GF0501': 'Expenditure on waste management',
 'GF0502': 'Expenditure on waste water management',
 'GF0503': 'Expenditure on pollution abatement',
 'GF0504': 'Expenditure on biodiversity & landscape protection',
 'GF06': 'Expenditure on housing & community amenities',
 'GF0601': 'Expenditure on housing development',
 'GF0602': 'Expenditure on community development',
 'GF0603': 'Expenditure on water supply',
 'GF0604': 'Expenditure on street lighting',
 'GF07': 'Expenditure on health',
 'GF0701': 'Expenditure on medical products, appliances, & equip',
 'GF0702': 'Expenditure on outpatient services',
 'GF0703': 'Expenditure on hospital services',
 'GF0704': 'Expenditure on public health services',
 'GF08': 'Expenditure on recreation, culture, & religion',
 'GF0801': 'Expenditure on recreational & sporting services',
 'GF0802': 'Expenditure on cultural services',
 'GF0803': 'Expenditure on broadcasting & publishing ',
 'GF0804': 'Expenditure on religious & community services',
 'GF09': 'Expenditure on education',
 'GF0901': 'Expenditure on pre-primary & primary education',
 'GF0902': 'Expenditure on secondary education',
 'GF0903': 'Expenditure on post-secondary non-tertiary education',
 'GF0904': 'Expenditure on tertiary education',
 'GF0905': 'Expenditure on education not definable by level',
 'GF0906': 'Expenditure on subsidiary services to education',
 'GF10': 'Expenditure on social protection',
 'GF1001': 'Expenditure on sickness  & disability',
 'GF1002': 'Expenditure on old age',
 'GF1003': 'Expenditure on survivors',
 'GF1004': 'Expenditure on family & children',
 'GF1005': 'Expenditure on unemployment',
 'GF1006': 'Expenditure on housing',
}


def search_dataset(query):
    """
    Given a search query, 
    print the search result of datasets. 
    Inputs:
        query(str): terms to search for (ex. 'Government Finance Statistics')
    """
    key = 'Dataflow'  # Method with series information
    search_term = query  # Term to find in series names
    series_list = requests.get(f'{url}{key}').json()\
                ['Structure']['Dataflows']['Dataflow']
    # Use dict keys to navigate through results:
    for series in series_list:
        if search_term in series['Name']['#text']:
            print(f"{series['Name']['#text']}: {series['KeyFamilyRef']['KeyFamilyID']}")

def get_dimensions(dataset):
    """
    Given a dataset code, print the dimension in the dataset. 
    Inputs:
        dataset(str): name code of dataset. (ex. Revenue: GFSR, Expenditure: GFSCOFOG)
    """
    key = f'DataStructure/{dataset}'  # Method / series
    dimension_list = requests.get(f'{url}{key}').json()\
                ['Structure']['KeyFamilies']['KeyFamily']\
                ['Components']['Dimension']
    for n, dimension in enumerate(dimension_list):
        print(f'Dimension {n+1}: {dimension["@codelist"]}')

def find_country_codes(dataset):
    """
    Find every country code in the dataset.
    Inputs:
        dataset(str): name code of dataset. (ex. Revenue: GFSR, Expenditure: GFSCOFOG)
    Returns:
        country_codes: every country code in the target dataset.
    """
    key = f'DataStructure/{dataset}'
    dimension_list = requests.get(f'{url}{key}').json()\
                ['Structure']['KeyFamilies']['KeyFamily']\
                ['Components']['Dimension']

    key = f'CodeList/{dimension_list[1]["@codelist"]}'
    code_list_d2 = requests.get(f'{url}{key}').json()\
            ['Structure']['CodeLists']['CodeList']['Code']
    country_codes = []
    for code in code_list_d2:
        country_codes.append(code['@value'])

    return country_codes

def find_category_codes(dataset):
    """
    Find revenue/expenditure category code in the dataset.
    Inputs:
        dataset(str): namecode of dataset. (ex. Revenue: GFSR, Expenditure: GFSCOFOG)
    Returns:
        country_codes: every country code in the target dataset.
    """
    key = f'DataStructure/{dataset}'
    dimension_list = requests.get(f'{url}{key}').json()\
                ['Structure']['KeyFamilies']['KeyFamily']\
                ['Components']['Dimension']

    key = f'CodeList/{dimension_list[4]["@codelist"]}'
    code_list_d2 = requests.get(f'{url}{key}').json()\
            ['Structure']['CodeLists']['CodeList']['Code']
    cat_codes = {}
    for code in code_list_d2:
        cat_codes[code['@value']] = code['Description']['#text']

    return cat_codes


def get_imf_data(dataset, country_code, cat_codes):
    '''
    Get one country's government fiscal data
    by IMF API. 
    Inputs:
        dataset(str): namecode of dataset. (ex. Revenue: GFSR, Expenditure: GFSCOFOG)
        country_code(str): country code
        cat_codes(dict): category codes
    Outputs:
        df(pd.DataFrame): fiscal data of one country.
    '''

    output = {}
    if dataset == "GFSR":
        lookup = '@CLASSIFICATION'
    else:
        lookup = '@COFOG_FUNCTION'
    for cat_code in cat_codes:
        # Central government (incl. social security funds): S1321
        # Percent of GDP: XDC_R_B1GQ
        key = f'CompactData/{dataset}/A.{country_code}.S13.XDC_R_B1GQ.{cat_code}\
            ?startPeriod=2016&endPeriod=2020'
        try:
            data = requests.get(f'{url}{key}').json()['CompactData']['DataSet']
        except:
            continue
        if 'Series' not in data.keys():
            continue
        data = data['Series']
        df_dict_col = {}
        if 'Obs' not in data.keys() or not isinstance(data['Obs'], list):
            continue
        for i in data['Obs']:
            if "@OBS_VALUE" not in i:
                continue
            else:
                df_dict_col[i['@TIME_PERIOD']] = round(
                    float(i["@OBS_VALUE"]), 4
                )

        output[cat_codes[data[lookup]]] = df_dict_col
        time.sleep(10)

    df = pd.DataFrame(output).T
    df.insert(0, 'Country', f'{country_code}')
    print(df)
    return df

def main(dataset, country_codes, cat, name):
    df = pd.DataFrame()
    for i, country_code in enumerate(country_codes):
        print(f"Getting {i} {country_code}'s data...")
        country_df = get_imf_data(dataset, country_code, cat)
        country_df.to_csv(f"/content/drive/My Drive/Dataviz/{name}_{i}_{country_code}.csv", index=True)   
        time.sleep(10)

def combine_df(input_path, output_path):
    """
    Combine separate dataframe into one csv. 
    Inputs:
        input_path(str): directory of input files
        output_path(str): file name of output csv
    """
    csv_path = pathlib.Path(path)
    file_lst = sorted([str(path) for path in csv_path.glob('*.csv')])
    df = pd.DataFrame()
    for file in file_lst:
        current_df = pd.read_csv(file, header=0)
        if len(current_df.columns) == 1:
            continue
        df = pd.concat([df, current_df])
    df.columns = ["categories"] + list(df.columns)[1:]
    df = df.set_index(["Country", "categories"])
    df = df.sort_index()
    df.to_csv("/content/drive/My Drive/Dataviz/all_expense.csv")