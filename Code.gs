function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = sheet.getSheets();
  let infoSheet = null;
  let historialSheet = null;

  for (let i = 0; i < sheets.length; i++) {
    let name = sheets[i].getName().toLowerCase().trim();
    // Busca variaciones de informacion (con o sin tilde, mayúsculas, etc)
    if (name.indexOf("info") !== -1) {
      infoSheet = sheets[i];
    }
    if (name.indexOf("historial") !== -1) {
      historialSheet = sheets[i];
    }
  }
  
  let payload = {
    Info: {},
    Historial: []
  };

  if (infoSheet) {
    const data = infoSheet.getDataRange().getValues();
    const getValue = (row, col) => {
        try {
            return data[row] ? (data[row][col] || 0) : 0;
        } catch(e) { return 0; }
    };
    
    payload.Info = {
      Rango: getValue(0, 5) || "I",   
      Nivel: getValue(0, 6) || 10,   
      VIT: getValue(0, 7) || 400,     
      PM: getValue(0, 8) || 40,      
      VEL: getValue(0, 9) || 4,     
      VOL: getValue(0, 10) || 1,    
      ExpGanado: getValue(1, 1),   
      ExpGastado: getValue(2, 1),  
      ExpActual: getValue(3, 1),    
      GalGanado: getValue(1, 2),   
      GalGastado: getValue(2, 2),  
      GalActual: getValue(3, 2),    
      LlaGanado: getValue(1, 3),   
      LlaGastado: getValue(2, 3),  
      LlaActual: getValue(3, 3),    
      Conocimiento: getValue(5, 1) 
    };
  }

  if (historialSheet) {
    const range = historialSheet.getDataRange();
    const strData = range.getDisplayValues();
    const rawData = range.getValues();
    const richData = range.getRichTextValues();
    
    for (let i = 1; i < strData.length; i++) {
        if(strData[i][0] || strData[i][1]) {
            let descRichText = richData[i] && richData[i][1] ? richData[i][1] : null;
            let link = descRichText ? descRichText.getLinkUrl() : null;
            
            payload.Historial.push({
                fecha: strData[i][0],
                desc: strData[i][1],
                link: link,
                exp: Number(rawData[i][2]) || 0,
                galeones: Number(rawData[i][3]) || 0,
                conocimiento: Number(rawData[i][4]) || 0,
                llaves: Number(rawData[i][5]) || 0
            });
        }
    }
  }

  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
