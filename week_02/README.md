# Data Colections
This is a description for collecting data for final project as week2 assignment. 

## Data source: Title, Agency, Location, Link
* `migration.csv` : Number of Net-migration by Age and Sex for Prefectures from [Report on Internal Migration in Japan](https://www.e-stat.go.jp/en/stat-search/files?page=1&layout=datalist&toukei=00200523&tstat=000000070001&cycle=7&year=20210&month=0&tclass1=000001148746&stat_infid=000032163826&result_back=1&tclass2val=0)
* `demographic.csv` : Statistical Observations of Municipalities/Population and Households from [System of Social and Demographic Statistics](https://www.e-stat.go.jp/en/stat-search/files?page=1&layout=datalist&toukei=00200502&tstat=000001162826&cycle=0&year=20220&month=0&tclass1=000001162827&stat_infid=000032169052&tclass2val=0)
* `labor.csv` : Statistical Observations of Prefectures/Economic Base from [System of Social and Demographic Statistics](https://www.e-stat.go.jp/en/stat-search/files?page=1&layout=datalist&toukei=00200502&tstat=000001162826&cycle=0&year=20220&month=0&tclass1=000001162827&stat_infid=000032169054&tclass2val=0)
* `economics.csv` : Statistical Observations of Prefectures/Labor from [System of Social and Demographic Statistics](https://www.e-stat.go.jp/en/stat-search/files?page=1&layout=datalist&toukei=00200502&tstat=000001162826&cycle=0&year=20220&month=0&tclass1=000001162827&stat_infid=000032169057&tclass2val=0)
* `fertility.csv` : Trends in total fertility rates by each prefecture from [Vital Statistics](https://www.e-stat.go.jp/en/stat-search/files?page=1&layout=datalist&toukei=00450011&tstat=000001028897&cycle=7&year=20200&month=0&tclass1=000001053058&tclass2=000001053061&tclass3=000001053064&stat_infid=000032118531&result_back=1&tclass4val=0)
* `prediction.csv` : Regional Population Projections for Japan: 2015–2045 from [The National Institute of Population and Social Security Research](https://www.ipss.go.jp/pp-shicyoson/j/shicyoson18/t-page.asp) 

## Description of data

## Why you are interested in this topic

## Thoughts on how you would hope to use this data

## Potential data points

## Any concerns about the data
* Some Japanese may require translation to English.
* Need further investigation of each feature and choose the important ones. 
* Whether should be prefecture level (47 data points) or municiple level (1300 data points).

## Identify if source is primary or secondary
`migration.csv` is the primary data source. I will use other data sources to observe the consequences of population concentration. 

## If secondary data, how you envision this data working with the primary source?
From `demographic.csv`, I will mainly use population density data and plot them into a map. From `economic.csv` and `labor.csv`, I will extract some interesting features that are related to overpopulation. Especially, low fertility rate is one of the known consequences of population concentration, so I will use total fertility rate from `fertility.csv` to compare among time and regions. `prediction.csv` is also an interesting data source to show how the phenomenon has a long lasting influence. 
  
