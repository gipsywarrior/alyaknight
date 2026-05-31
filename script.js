document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-tab");
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(targetId).classList.add("active");
        });
    });

    const SHEET_URL = "https://script.google.com/macros/s/AKfycbwIQd6Ja6TxMuHWnz4asc_zEgKvtClpDlsQV-fXDar1So9qlyGjSYZIPsJZsG-j1LWp/exec"; 

    const CACHE_KEY = "alya_knight_data_cache";
    let hadCache = false;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        try {
            renderDynamicData(JSON.parse(cached));
            hadCache = true;
        } catch (e) {
            localStorage.removeItem(CACHE_KEY);
        }
    }

    if (SHEET_URL !== "PEGAR_AQUI_LA_URL_DE_APPS_SCRIPT") {
        fetch(SHEET_URL, { redirect: "follow" })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                renderDynamicData(data);
            })
            .catch(err => {
                console.error("Error al cargar datos del Excel:", err);
                if (!hadCache) {
                    showHistorialMessage(
                        "No se pudieron cargar los datos. Revisa que la URL de Apps Script esté activa y sea pública (acceso: Cualquiera).",
                        true
                    );
                }
            });
    } else {
        showHistorialMessage("Configura la URL de Apps Script en script.js.", true);
    }
});

function showHistorialMessage(text, isError) {
    const historialDiv = document.getElementById("historial");
    if (!historialDiv) return;
    const color = isError ? "var(--primary, #c9a96e)" : "inherit";
    historialDiv.innerHTML = `<p style="text-align: center; opacity: 0.7; color: ${color};"><em>${text}</em></p>`;
}

function renderDynamicData(data) {
    if(data.Info) {
        const d = data.Info;

        const setVal = (id, text) => {
            let el = document.getElementById(id);
            if(el) el.innerText = text;
        }

        setVal('val-rango', `Rango ${d.Rango}`);
        setVal('val-nivel', `Nivel ${d.Nivel}`);
        setVal('val-vit', `${d.VIT} VIT`);
        setVal('val-pm', `${d.PM} PM`);
        setVal('val-vel', `${d.VEL} VEL`);
        setVal('val-vol', `${d.VOL} VOL`);

        setVal('val-exp', `${d.ExpGanado} / ${d.ExpGastado} / ${d.ExpActual}`);
        setVal('val-galeones', `${d.GalGanado} / ${d.GalGastado} / ${d.GalActual}`);
        setVal('val-llaves', `${d.LlaGanado} / ${d.LlaGastado} / ${d.LlaActual}`);

        setVal('val-conocimiento', d.Conocimiento);
    }

    const historialDiv = document.getElementById("historial");
    if (!historialDiv) return;

    if (!data.Historial || data.Historial.length === 0) {
        showHistorialMessage("Sin entradas en el historial.", false);
        return;
    }

    let html = "<ul class='capacidades-list'>";
    data.Historial.forEach(h => {
        let eParts = [];
        if(h.exp !== 0) eParts.push(`${h.exp > 0 ? '+'+h.exp : h.exp} EXP`);
        if(h.galeones !== 0) eParts.push(`${h.galeones > 0 ? '+'+h.galeones : h.galeones} ${Math.abs(h.galeones) === 1 ? 'Galeón' : 'Galeones'}`);
        if(h.conocimiento !== 0) eParts.push(`${h.conocimiento > 0 ? '+'+h.conocimiento : h.conocimiento} CO`);
        if(h.llaves !== 0) eParts.push(`${h.llaves > 0 ? '+'+h.llaves : h.llaves} ${Math.abs(h.llaves) === 1 ? 'Llave' : 'Llaves'}`);

        let statsStr = eParts.length > 0 ? ` (${eParts.join(', ')})` : '';
        let fechaStr = h.fecha ? `<span style="letter-spacing: 1px; font-weight: bold;">${h.fecha}.</span> ` : '';
        let descStr = h.link ? `<a href="${h.link}" target="_blank" style="color: var(--primary); text-decoration: none">${h.desc}</a>` : h.desc;

        html += `<li>${fechaStr}${descStr}${statsStr}</li>`;
    });
    html += "</ul>";
    historialDiv.innerHTML = html;
}
