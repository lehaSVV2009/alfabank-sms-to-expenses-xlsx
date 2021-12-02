# Alfa-bank SMS Expenses to Google Sheets

## Getting started

```
brew install node
npm install
```

## How to use

1. Use `SMS Backup & Restore` Android mobile app to export messages from `Alfa-bank` to `sms-....xml` (probably to Google Drive)
2. Download this `sms-...xml` file
3. Put this file to `files` folder
4. Rename it to `expenses.csv`
5. Go to application root path.
```
cd .../expenses-xml-to-google-sheets
```
6. Run the following command to convert xml to formatted `expenses.xlsx`
```
node index.js 2021 Apr
``` 
P.S. `2021 Apr` means take all the Alfa-bank messages from April 2021 and convert them to xlsx file. e.g. for November 2022 it will be `node index.js 2022 Nov`
7. Upload `expenses.xlsx` to google sheets
