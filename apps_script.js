/**
 * Sync Supabase insights to Google Sheets via Apps Script.
 *
 * Setup:
 *   1. Ejecutar create_insights_view.sql en Supabase SQL Editor
 *   2. Abrir Google Sheets > Extensiones > Apps Script
 *   3. Pegar este código completo
 *   4. Reemplazar SUPABASE_URL y SUPABASE_KEY con tus valores
 *   5. Guardar y ejecutar "syncInsights" (la primera vez pide permisos)
 *   6. Opcional: agregar trigger automático con "setupDailyTrigger"
 */

// ── CONFIGURACIÓN ──
const SUPABASE_URL = "https://TU_PROJECT.supabase.co";   // Reemplazar
const SUPABASE_KEY = "TU_ANON_KEY";                       // Reemplazar
const VIEW_NAME = "v_insights_display";
const SHEET_NAME = "Insights";
const PAGE_SIZE = 1000;

// Columnas a mostrar (en orden)
const COLUMNS = [
  "transcript_id", "transcript_chunk",
  "deal_id", "deal_name", "company_name", "region", "country",
  "industry", "company_size", "deal_stage", "deal_owner",
  "segment", "amount", "call_date",
  "insight_type", "insight_type_display",
  "insight_subtype", "insight_subtype_display",
  "module", "module_display", "module_status",
  "hr_category", "hr_category_display",
  "summary", "verbatim_quote", "confidence",
  "competitor_name", "competitor_relationship", "competitor_relationship_display",
  "feature_name", "feature_name_display",
  "gap_description", "gap_priority", "gap_priority_display",
  "faq_topic",
  "processed_at"
];

/**
 * Función principal: sincroniza insights de Supabase al Sheet.
 */
function syncInsights() {
  const startTime = new Date();
  Logger.log("Starting sync at " + startTime.toISOString());

  // Fetch all data from Supabase (paginated)
  const allRows = fetchAllFromSupabase();
  Logger.log("Fetched " + allRows.length + " rows from Supabase");

  if (allRows.length === 0) {
    Logger.log("No data to sync");
    return;
  }

  // Get or create the worksheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ws;
  try {
    ws = ss.getSheetByName(SHEET_NAME);
    if (!ws) throw new Error("not found");
  } catch (e) {
    ws = ss.insertSheet(SHEET_NAME);
  }

  // Clear existing data
  ws.clear();

  // Build data array: header + rows
  const header = COLUMNS;
  const data = [header];

  for (const row of allRows) {
    const values = COLUMNS.map(col => {
      const val = row[col];
      if (val === null || val === undefined) return "";
      return String(val);
    });
    data.push(values);
  }

  // Write to sheet in one batch
  Logger.log("Writing " + (data.length - 1) + " rows to sheet...");
  const range = ws.getRange(1, 1, data.length, COLUMNS.length);
  range.setValues(data);

  // Format header
  const headerRange = ws.getRange(1, 1, 1, COLUMNS.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#4a86c8");
  headerRange.setFontColor("#ffffff");
  ws.setFrozenRows(1);

  // Auto-resize columns (first 15 only to save time)
  for (let i = 1; i <= Math.min(15, COLUMNS.length); i++) {
    ws.autoResizeColumn(i);
  }

  // Add last sync timestamp
  const elapsed = ((new Date() - startTime) / 1000).toFixed(1);
  Logger.log("Sync complete: " + (data.length - 1) + " rows in " + elapsed + "s");

  // Write sync info to a separate cell
  const infoSheet = ss.getSheetByName("_sync_info") || ss.insertSheet("_sync_info");
  infoSheet.getRange("A1").setValue("Última sincronización");
  infoSheet.getRange("B1").setValue(new Date().toISOString());
  infoSheet.getRange("A2").setValue("Total filas");
  infoSheet.getRange("B2").setValue(data.length - 1);
  infoSheet.getRange("A3").setValue("Tiempo (s)");
  infoSheet.getRange("B3").setValue(elapsed);
}

/**
 * Fetch all rows from Supabase view with pagination.
 */
function fetchAllFromSupabase() {
  const allData = [];
  let offset = 0;

  while (true) {
    const url = SUPABASE_URL + "/rest/v1/" + VIEW_NAME
      + "?select=*"
      + "&offset=" + offset
      + "&limit=" + PAGE_SIZE;

    const options = {
      method: "get",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json",
        "Prefer": "count=exact"
      },
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();

    if (code !== 200 && code !== 206) {
      Logger.log("Error " + code + ": " + response.getContentText().substring(0, 500));
      break;
    }

    const rows = JSON.parse(response.getContentText());
    allData.push(...rows);

    Logger.log("  Fetched page: offset=" + offset + ", rows=" + rows.length + ", total=" + allData.length);

    if (rows.length < PAGE_SIZE) {
      break;  // Last page
    }

    offset += PAGE_SIZE;
  }

  return allData;
}

/**
 * Crear trigger para sync diario automático (ejecutar una vez).
 */
function setupDailyTrigger() {
  // Eliminar triggers existentes
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "syncInsights") {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // Crear nuevo trigger: todos los días a las 7am
  ScriptApp.newTrigger("syncInsights")
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();

  Logger.log("Daily trigger created: syncInsights at 7am");
}

/**
 * Eliminar todos los triggers automáticos.
 */
function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "syncInsights") {
      ScriptApp.deleteTrigger(trigger);
    }
  }
  Logger.log("All syncInsights triggers removed");
}

/**
 * Menú personalizado en el Sheet.
 */
function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu("🔄 Supabase Sync", [
    { name: "Sincronizar ahora", functionName: "syncInsights" },
    { name: "Activar sync diario", functionName: "setupDailyTrigger" },
    { name: "Desactivar sync diario", functionName: "removeTriggers" },
  ]);
}
