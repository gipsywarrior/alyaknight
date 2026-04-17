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

    const SHEET_URL = "https://script.google.com/macros/s/AKfycbyO6p3mKaARrynL27mb7EuqT0qte9Pa6uuo2iivs-Ed9vBGkqekGvm4GK457dT8q4RH/exec"; 

    const CACHE_KEY = "alya_knight_data_cache";
    const cached = localStorage.getItem(CACHE_KEY);
    if(cached) {
        try { renderDynamicData(JSON.parse(cached)); } catch(e) {}
    }

    if(SHEET_URL !== "PEGAR_AQUI_LA_URL_DE_APPS_SCRIPT") {
        fetch(SHEET_URL)
            .then(res => res.json())
            .then(data => {
                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                renderDynamicData(data);
            })
            .catch(console.error);
    }
});

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

    if(data.Historial && data.Historial.length > 0) {
        let html = "<ul class='capacidades-list'>";
        data.Historial.forEach(h => {
            let eParts = [];
            if(h.exp !== 0) eParts.push(`${h.exp > 0 ? '+'+h.exp : h.exp} EXP`);
            if(h.galeones !== 0) eParts.push(`${h.galeones > 0 ? '+'+h.galeones : h.galeones} ${Math.abs(h.galeones) === 1 ? 'Galeón' : 'Galeones'}`);
            if(h.conocimiento !== 0) eParts.push(`${h.conocimiento > 0 ? '+'+h.conocimiento : h.conocimiento} CO`);
            if(h.llaves !== 0) eParts.push(`${h.llaves > 0 ? '+'+h.llaves : h.llaves} ${Math.abs(h.llaves) === 1 ? 'Llave' : 'Llaves'}`);
            
            let statsStr = eParts.length > 0 ? ` (${eParts.join(', ')})` : '';
            let fechaStr = h.fecha ? h.fecha + '. ' : '';
            let descStr = h.link ? `<a href="${h.link}" target="_blank" style="color: var(--primary); text-decoration: none">${h.desc}</a>` : h.desc;
            
            html += `<li>${fechaStr}${descStr}${statsStr}</li>`;
        });
        html += "</ul>";
        
        const historialDiv = document.getElementById('historial');
        if(historialDiv) historialDiv.innerHTML = html;
    }
}
