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
node index.js --year=2021 --month=Dec
``` 
P.S. `2021 Apr` means take all the Alfa-bank messages from April 2021 and convert them to xlsx file. e.g. for November 2022 it will be `node index.js --year=2022 --month=Nov`
7. Upload `expenses.xlsx` to google sheets

## Expenses-40a

1. Import spreadsheet for specific month (`File` -> `Import` -> `Upload` -> `Choose file` -> `Replace Spreadsheet` -> `Import data`)
2. Expand "B" column
3. Remove all pairs of "BLR/ONLINE SERVICE/TRANSFERS AK AM" (e.g. 2 sequential rows: BYN outcome and USD income)
4. Check that the number of rows is less than left in Expenses-40a (if more -> add ~100 rows)
5. Copy all (`Cmd + A` -> `Cmd + C`)
6. Go to Expenses-40a
7. Click on last free row (1st column cell)
8. Paste values
9. Click on appeared paste options icon
10. Choose `Paste values only`
11. Select money columns (`D` and `E`)
12. Click `Format` -> `Number` -> `Belarussian Ruble`

That's it!
