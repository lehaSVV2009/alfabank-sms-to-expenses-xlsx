# Alfa-bank SMS Expenses to Google Sheets

## Getting started

```
brew install node
npm install
```

## How to use

1. Use [SMS Backup & Restore](https://play.google.com/store/apps/details?id=com.riteshsahu.SMSBackupRestore&hl=ru&gl=US) Android mobile app to export messages from `Alfa-bank` to `sms-....xml` (probably to Google Drive)
2. Download this `sms-...xml` file
3. Put this file to `files` folder
4. Rename it to `expenses.csv`
5. Go to application root path.
```
cd .../expenses-xml-to-google-sheets
```
6. Run the following command to convert xml to formatted `expenses.xlsx`
```
node index.js -year=2021 -month=Apr
``` 
P.S. `2021 Apr` means take all the Alfa-bank messages from April 2021 and convert them to xlsx file. e.g. for November 2022 it will be `node index.js -year=2022 -month=Nov`
7. Upload `expenses.xlsx` to google sheets
