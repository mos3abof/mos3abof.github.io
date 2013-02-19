---
layout: post
title: "Simple Guide to Reading Data from Excel Sheets in Python"
date: 2013-02-19 13:18
comments: true
categories: Python, XLRD, Excel
---

On May 22nd 2012 I was approached by the official campaign of the presidential candidate "[Abolfotoh](http://www.abolfotoh.net/)".
They needed help setting up a Google App Engine project. 
It was originally created by "[e-space](http://www.espace.com.eg)" -an awesome Egyptian company- and published on [Google Code](https://code.google.com/p/egypt-election-2012-demo/). 
I helped them with he setup, but that is another story.

The application was an interactive map that uses Google Maps to plot data about voters and polling stations. 
What they wanted further was to create another application to collect data from their official representatives on the ground and use this tool 
to feed the Google App Engine application with data.

The first task was to import the polling stations meta data -if we may call it so- like the Governorate it belonged to, the city, 
the number of voter, the police station it belongs to, address, etc. 
This data was provided to me in an excel sheet so I had to find an automated way to import it.

For the sake of simplicity, lets assume we have an excel sheet that looks like this:

```
+-------------------+------------+------------------------+
| Polling Station   | City       | Total Number of Voters |
+-------------------+------------+------------------------+
| polling_station_1 | Cairo      | 7734                   |
+-------------------+------------+------------------------+
| polling_station_2 | Giza       | 13332                  |
+-------------------+------------+------------------------+
| polling_station_3 | Alexandria | 10901                  |
+-------------------+------------+------------------------+
```
As in most spreadsheets, the first row is the header row that describes the data, and the actual data is in the rows to follow.

I did a quick search and found several libraries that deal with excel in Python, 
there is even a website dedicated to listing them  [http://www.python-excel.org](http://www.python-excel.org). 
I chose to go with [XLRD](http://pypi.python.org/pypi/xlrd), and you can find it in [PyPi](http://www.lexicon.net/sjmachin/xlrd.htm) as well.

We need to install it first by running this command :

```
$ pip install xlrd
```

or 

```
$ easy_install xlrd
```

Let's start coding.

XLRD calls the whole excel document a "Workbook", to open we can do this in an interactive python shell from the same path as the file:

```python
>>> from xlrd import open_workbook
>>> book = open_workbook('data.xls')
```

Now we can manipulate the excel document using this "book" object we created. Remember the book has all the document. 
An excel document can  have one or multiple sheets inside it that hold the data. 
The first sheet has an index of 0, the second has an index of 1 and so on.

To open the first sheet which holds the sample data above we do this :

```python
>>> first_sheet = book.sheet_by_index(0)
```
Now we are ready to manipulate the sheet, get information about it and extract data from it. 
For example to know the number of "effective columns" in the sheet we can print the `ncols` attribute of the sheet, 
or to know the number of "effective rows", the rows that contain data, we can use the `nrows` attribute.

```python
>>> print first_sheet.ncols
3
>>> print first_sheet.nrows
4
```

We now know how many rows contain actual data in the first sheet of our excel document. Time to loop over the rows and extract data.

```python
>>> for i in range(1, first_sheet.nrows):
        row = first_sheet.row_slice(i)
        station = row[0].value
        city = row[1].value
        voters = row[2].value
        print "Polling Station : {} in {} has {} voter".format(station, city, voters)

Polling station polling_station_1 in Cairo has 7734.0 voters
Polling station polling_station_2 in Giza has 13332.0 voters
Polling station polling_station_3 in Alexandria has 10901.0 voters
```
In the previous snippet of code we started to loop over the rows skipping the first row `range(1, first_sheet.nrows)` 
Then we sliced every row out of the sheet with `row_slice()` and then accessed it by column index to extract data from columns `row[]` 
and then we accessed the value of the cell by calling the `row[].value`.

This is a very simple usage of the library, I suggest you read its documentation, you will find many great stuff :

```python
>>> import xlrd
>>> help(xlrd)
>>> help(xlrd.sheet)
```
Finally check my answer on a question about the issue on [StackOverflow](http://stackoverflow.com/questions/13805274/have-no-idea-with-python-excel-read-data-file/13805734#13805734).

That's it for now.

