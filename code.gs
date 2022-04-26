function myFunction() {
  function importData(proj_index, proj)
  {
    var ss = SpreadsheetApp.getActive();
    var url = 'https://api.cryptorank.io/v0/coins/'+ proj +'/holders';
    var response = UrlFetchApp.fetch(url); // get feed
    var p_data = JSON.parse(response.getContentText());
    var sheet = ss.getSheetByName(proj);

    var total = p_data["data"]["tokenStat"]["circulating_supply"];
    var holders = p_data["data"]["holders"];

    var rows = [["Holder Address", "Holder Balance", "Holder Percentage"]];
    for (var h = 0; h < holders.length; h++) {
      var r = [holders[h]["address"], holders[h]["balance"], ((holders[h]["balance"] / total) * 100)];
      rows.push(r); // Retrieve values.
    }
    sheet.getRange(1,1,rows.length,rows[0].length).setValues(rows); // Put values to Spreadsheet.

    //Update total values in combined sheet
    var url2 = 'https://api.cryptorank.io/v0/coins/'+ proj;
    var response2 = UrlFetchApp.fetch(url2); // get feed
    var p2_data = JSON.parse(response2.getContentText());

    var sheet2 = ss.getSheetByName("COMBINED");
    sheet2.getRange(proj_index+2, 3).setValue(p_data["data"]["tokenStat"]["circulating_supply"]);
    sheet2.getRange(proj_index+2, 4).setValue(p_data["data"]["tokenStat"]["holders_count"]);
    sheet2.getRange(proj_index+2, 5).setValue(p2_data["data"]["volume24h"]*p2_data["data"]["price"]["USD"]);
    sheet2.getRange(proj_index+2, 6).setValue(p2_data["data"]["marketCap"]);
  }
  
  var projects = ["butterflydao", "convex-finance", "dopex", "alchemix", "tokemak", "olympus", "spell-token", "ampleforth", "rari-governance-token", "gelato"]

  for (var p = 0; p < projects.length; p++) {
    importData(p, projects[p]);
  }

  //projects without token info
  var projects2 = ["rome", "klima-dao"]

  for (var p = 0; p < projects2.length; p++) {
    proj_index = projects.length + p;
    var ss = SpreadsheetApp.getActive();

    var url2 = 'https://api.cryptorank.io/v0/coins/'+ projects2[p];
    var response2 = UrlFetchApp.fetch(url2); // get feed
    var p2_data = JSON.parse(response2.getContentText());
    var sheet2 = ss.getSheetByName("COMBINED");
    
    sheet2.getRange(proj_index+2, 5).setValue(p2_data["data"]["volume24h"]*p2_data["data"]["price"]["USD"]);
    sheet2.getRange(proj_index+2, 6).setValue(p2_data["data"]["marketCap"]);
  }




}
