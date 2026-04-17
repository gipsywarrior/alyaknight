document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-tab");

            // Remover clase activa de todos los links
            tabs.forEach(t => t.classList.remove("active"));
            
            // Remover clase activa de todos los contenidos
            contents.forEach(c => c.classList.remove("active"));

            // Añadir clase activa al link ejecutado
            tab.classList.add("active");
            
            // Añadir clase activa al bloque de contenido que corresponde
            document.getElementById(targetId).classList.add("active");
        });
    });
});
