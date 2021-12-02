const fsp = require("fs/promises");
const xml2js = require("xml2js");
const moment = require("moment");
const XLSX = require("xlsx");
const json2csv = require("json2csv");

const EXPENSES_XML_PATH = __dirname + "/files/expenses.xml";
const EXPENSES_CSV_PATH = __dirname + "/files/expenses.csv";
const EXPENSES_XLSX_PATH = __dirname + "/files/expenses.xlsx";

const EXPENSE_TYPES = {
  INCOME: "INCOME",
  OUTCOME: "OUTCOME",
  UNKNOWN: "UNKNOWN",
};

(async function (year, month) {
  const parser = new xml2js.Parser();

  try {
    const expensesXmlFile = await fsp.readFile(EXPENSES_XML_PATH);
    const expensesData = await parser.parseStringPromise(expensesXmlFile);
    const formattedExpenses = formatExpenses(expensesData, year, month);
    const { rows, columns } = expensesToRowsAndColumns(formattedExpenses);
    // await writeExpensesToCsv(rows, columns, EXPENSES_CSV_PATH);
    writeExpensesToXlsx(rows, EXPENSES_XLSX_PATH);
  } catch (e) {
    console.error(e);
  }
})(2021, "Apr");

const formatExpenses = (expensesData, year = 2021, month = "Jan") => {
  return expensesData.smses.sms
    .map((sms) => {
      const expense = parseSmsBody(sms.$.body);
      const date = moment(new Date(parseInt(sms.$.date))).format("YYYY-MM-DD");

      return {
        ...expense,
        date,
      };
    })
    .filter(({ type }) => type !== EXPENSE_TYPES.UNKNOWN)
    .filter(
      // ignore huge transfer income from wife
      ({ type, sum }) => type !== EXPENSE_TYPES.INCOME || parseInt(sum) < 1000
    )
    .filter(({ date }) => {
      const firstDayOfMonth = moment().year(year).month(month).startOf("month");
      const lastDayOfMonth = moment().year(year).month(month).endOf("month");
      return moment(date).isBetween(
        firstDayOfMonth,
        lastDayOfMonth,
        null,
        "[]"
      );
    });
};

const parseSmsBody = (body) => {
  const result = {
    type: EXPENSE_TYPES.UNKNOWN,
    body,
  };

  if (
    !body ||
    typeof body !== "string" ||
    !body.includes("Uspeshno") ||
    !body.includes("Summa")
  ) {
    return result;
  }

  if (body.includes("Oplata tovarov") || body.includes("Spisanie")) {
    result.type = EXPENSE_TYPES.OUTCOME;
  }

  if (body.includes("Postuplenie")) {
    result.type = EXPENSE_TYPES.INCOME;
  }

  const sumMatches = body.match(/Summa:([.\d]+) (\w+)[\n ]/i);
  if (
    !sumMatches ||
    sumMatches.length < 2 ||
    !sumMatches[1] ||
    !sumMatches[2]
  ) {
    throw new Error(
      `Failed to find price and currency. ${JSON.stringify({
        body,
        sumMatches,
      })}`
    );
  }

  result.sum = sumMatches[1];
  result.currency = sumMatches[2];

  const descriptionMatches = body.match(/Na vremya:.*[\n](.*)[\n]/i);
  if (descriptionMatches && descriptionMatches.length > 0) {
    result.description = descriptionMatches[1];
  }

  return result;
};

const expensesToRowsAndColumns = (expenses) => {
  const rows = expenses.map(({ type, sum, currency, description, date }) => {
    const row = {
      kind: "Еда",
      description,
      outcome: type === EXPENSE_TYPES.OUTCOME ? formatMoney(sum, currency) : "",
      income: type === EXPENSE_TYPES.INCOME ? formatMoney(sum, currency) : "",
      date: moment(date).format("DD.MM.YYYY"),
      who: "Лёша",
    };
    return row;
  });

  const columns = ["kind", "description", "outcome", "income", "date", "who"];

  return { rows, columns };
};

const formatMoney = (sum, currency) => {
  const formattedSum = sum.replaceAll(".", ",");
  if (currency === "BYN") {
    return formattedSum;
  }
  if (currency === "USD") {
    return `=${formattedSum}*Доллар`;
  }
  return `${formattedSum} ${currency}`;
};

const writeExpensesToCsv = async (rows, columns, path) => {
  const parser = new json2csv.Parser({ columns });
  const csv = parser.parse(rows);
  await fsp.writeFile(path, csv);
};

const writeExpensesToXlsx = (rows, path) => {
  console.log(rows);
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: true });
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet");
  XLSX.writeFile(workbook, path);
};
