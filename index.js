import cheerio from "cheerio";
import json2csv from "json2csv";
import * as fsp from "fs/promises";
import axios from "axios";
const getPremierLeagueData = async () => {
  const keys = [];
  try {
    const response = await axios.get("https://www.premierleague.com/stats");

    const $ = cheerio.load(response.data);
    let results = {};
    let cleaned = {}
    $("div.statsCard").each((idx, result) => {
      if (idx === 0) {
        $(result)
          .find("ul.statsList")
          .each((id, data) => {
            results = $(data).text().replace(/\s+/g, " ").trim();

          let newData = results.split(".")

          for(let p = 1; p < newData.length;p++){
            cleaned[p] = newData[p]
            keys.push(cleaned)
          }
 
        
          });
      }
    });
// clean data further
// console.info(keys)
let transformed = {}
let newEl = []
keys.forEach((element,id)=>{
    let el = String(element[id]); 
     let removed = el.split(" ").pop()
     let cleaned = el.split(" ").filter(el => el !== removed)
     let converted = cleaned.join(" ")
    transformed[id] = converted
})
newEl.push(transformed)


    return newEl;
  } catch (error) {
    console.log(error);
  }
};

getPremierLeagueData().then((res) => saveCsv(res));

const saveCsv = async (data) => {
  const j2cp = new json2csv.Parser();
  const csv = j2cp.parse(data);

  await fsp.writeFile("./output.csv", csv, { encoding: "utf-8" });
};
