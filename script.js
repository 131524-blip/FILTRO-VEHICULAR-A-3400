const licencia =
"FV-A3400-2026";

const clave =
prompt("Ingrese licencia:");

if(clave !== licencia){

    alert("Licencia inválida");

    

}
/* =====================================================
   FILTRADO VEHICULAR PRO
   MODULO 4 - JS PARTE 1
===================================================== */

/* ==========================================
   VARIABLES GLOBALES
========================================== */

let contadorInformes = 1;
let imagenesPDF = [];


/* ==========================================
   INICIO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    generarCodigo();
    actualizarFecha();

    iniciarMenu();
    iniciarTabs();
    iniciarBotones();

    calcularRiesgo();

});

/* ==========================================
   MENU LATERAL
========================================== */

function iniciarMenu(){

    const botones =
    document.querySelectorAll(".menu-btn");

    const secciones =
    document.querySelectorAll(".content-section");

    botones.forEach(btn => {

        btn.addEventListener("click", () => {

            botones.forEach(b =>
                b.classList.remove("active")
            );

            btn.classList.add("active");

            const destino =
            btn.dataset.section;

            secciones.forEach(sec =>
                sec.classList.remove("active")
            );

            document
            .getElementById(destino)
            .classList.add("active");

        });

    });

}

/* ==========================================
   TABS CONSULTAS
========================================== */

function iniciarTabs(){

    const tabs =
    document.querySelectorAll(".tab-btn");

    const categorias =
    document.querySelectorAll(".link-category");

    tabs.forEach((tab,index)=>{

        tab.addEventListener("click",()=>{

            tabs.forEach(t=>
                t.classList.remove("active")
            );

            tab.classList.add("active");

            categorias.forEach(cat=>
                cat.style.display="none"
            );

            if(categorias[index]){
                categorias[index].style.display="block";
            }

        });

    });

    categorias.forEach((cat,index)=>{

        if(index===0){
            cat.style.display="block";
        }else{
            cat.style.display="none";
        }

    });

}

/* ==========================================
   CODIGO AUTOMATICO
========================================== */

function generarCodigo(){

    const hoy = new Date();

    const anio =
    hoy.getFullYear();

    const mes =
    String(hoy.getMonth()+1)
    .padStart(2,"0");

    const dia =
    String(hoy.getDate())
    .padStart(2,"0");

    const correlativo =
    String(contadorInformes)
    .padStart(3,"0");

    const codigo =
    `FV-${anio}${mes}${dia}-${correlativo}`;

    document
    .getElementById("codigoInforme")
    .value = codigo;

}

/* ==========================================
   FECHA ACTUAL
========================================== */

function actualizarFecha(){

    const fecha = new Date();

    document
    .getElementById("fechaActual")
    .value =
    fecha.toLocaleString("es-PE");

}

/* ==========================================
   BOTONES
========================================== */

function iniciarBotones(){

    const btnLimpiar =
    document.getElementById("btnLimpiar");

    if(btnLimpiar){

        btnLimpiar.addEventListener(
            "click",
            limpiarFormulario
        );

        const inputImagenes =
        document.getElementById("imagenesDiagnostico");

        if(inputImagenes){
            inputImagenes.addEventListener(
                "change",
                cargarImagenes
            );
        } 
    }

    // Todos los campos que ahora influyen en el riesgo de compra
    const camposRiesgo = [
        "captura",
        "garantia",
        "siniestro",
        "duenos",
        "kilometraje",
        "deudaPapeletas",
        "deudaImpuesto"
    ];

    camposRiesgo.forEach(id => {
        const campo = document.getElementById(id);
        if(campo){
            // Usamos 'input' para cajas de texto/números para capturar el cambio mientras escriben
            const tipoEvento = (campo.tagName === "INPUT") ? "input" : "change";
            campo.addEventListener(tipoEvento, calcularRiesgo);
        }
    });
}
/* ==========================================
   LIMPIAR FORMULARIO
========================================== */

function limpiarFormulario(){

    const inputs =
    document.querySelectorAll(
        "input:not([readonly])"
    );

    inputs.forEach(input=>{

        input.value="";

    });

    const selects =
    document.querySelectorAll("select");

    selects.forEach(select=>{

        select.selectedIndex=0;

    });

    document
    .getElementById("riskNumber")
    .textContent = "0";

    document
    .getElementById("riskText")
    .textContent = "BAJO";

    document
    .getElementById("riskFill")
    .style.width = "0%";
 // Limpiar imágenes cargadas
imagenesPDF = [];

const inputImagenes =
document.getElementById(
"imagenesDiagnostico"
);

if(inputImagenes){
    inputImagenes.value = "";
}

// Limpiar vista previa
const preview =
document.getElementById(
"previewImagenes"
);

if(preview){
    preview.innerHTML = "";
}

// Reiniciar contador
const contador =
document.getElementById(
"contadorImagenes"
);

if(contador){
    contador.textContent =
    "0 imágenes seleccionadas";
} 

}

/* ==========================================
   CÁLCULO DE RIESGO CON CONDICIONAL ESTRICTO
========================================== */

function calcularRiesgo(){

    const captura = document.getElementById("captura");
    const garantia = document.getElementById("garantia");
    const siniestro = document.getElementById("siniestro");
    const gas = document.getElementById("gas");
    const duenos = document.getElementById("duenos");
    const kilometraje = document.getElementById("kilometraje");
    const deudaPapeletas = document.getElementById("deudaPapeletas");
    const deudaImpuesto = document.getElementById("deudaImpuesto");

    const limpiarNumero = (el) => {
        if(!el || !el.value) return 0;
        return parseFloat(
            el.value.replace(/[^0-9.]/g,"")
        ) || 0;
    };

    const papeletas = limpiarNumero(deudaPapeletas);
    const impuesto = limpiarNumero(deudaImpuesto);
    const totalDeuda = papeletas + impuesto;
    const km = parseFloat(kilometraje?.value || 0);
    const nDuenos = parseInt(duenos?.value || 0);

    let riesgo = "BAJO";

    // ===== RIESGO ALTO =====

    if(
        papeletas > 3000 ||
        impuesto > 3000 ||
        totalDeuda > 3000 ||
        km > 200000 ||
        nDuenos > 4 ||
        (garantia && garantia.value === "Sí") ||
        (siniestro && siniestro.value === "Sí") ||
        (captura && captura.value === "Sí")
    ){
        riesgo = "ALTO";
    }

    // ===== RIESGO MEDIO =====

    else if(
        papeletas > 500 ||
        impuesto > 500 ||
        totalDeuda > 500 ||
        km > 100000 ||
        (gas && gas.value !== "No")
    ){
        riesgo = "MEDIO";
    }

    actualizarPanelRiesgo(riesgo);
}

/* ==========================================
   ACTUALIZAR PANEL
========================================== */

function actualizarPanelRiesgo(riesgo){

    const numero =
    document.getElementById("riskNumber");

    const texto =
    document.getElementById("riskText");

    const barra =
    document.getElementById("riskFill");

    if(riesgo === "BAJO"){

        numero.textContent = "3";
        texto.textContent = "BAJO";

        barra.style.width = "30%";
        barra.style.background = "#16a34a";

        texto.style.color = "#16a34a";
    }

    else if(riesgo === "MEDIO"){

        numero.textContent = "6";
        texto.textContent = "MEDIO";

        barra.style.width = "60%";
        barra.style.background = "#f59e0b";

        texto.style.color = "#f59e0b";
    }

    else{

        numero.textContent = "10";
        texto.textContent = "ALTO";

        barra.style.width = "100%";
        barra.style.background = "#dc2626";

        texto.style.color = "#dc2626";
    }
}
/* ==========================================
   AUTO REFRESH FECHA
========================================== */

setInterval(() => {

    actualizarFecha();

},60000);
function cargarImagenes(event){

    const preview =
    document.getElementById(
    "previewImagenes"
    );

    [...event.target.files].forEach(file=>{

        const reader =
        new FileReader();

        reader.onload = function(e){

            imagenesPDF.push(
                e.target.result
            );

            const img =
            document.createElement("img");

            img.src =
            e.target.result;

            img.style.width =
            "180px";

            img.style.margin =
            "10px";

            img.style.borderRadius =
            "10px";

            preview.appendChild(img);

            document.getElementById(
            "contadorImagenes"
            ).textContent =
            imagenesPDF.length +
            " imágenes seleccionadas";

        };

        reader.readAsDataURL(file);

    });

    event.target.value = "";
}
/* =====================================================
   MODULO 5
   HISTORIAL Y LOCALSTORAGE
===================================================== */

const STORAGE_KEY =
"filtradoVehicularPro";

let historial =
JSON.parse(
localStorage.getItem(STORAGE_KEY)
) || [];

/* ==========================================
   INICIAR HISTORIAL
========================================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

    cargarHistorial();

    const btnGuardar =
    document.getElementById(
    "btnGuardarInforme"
    );

    if(btnGuardar){

        btnGuardar.addEventListener(
        "click",
        guardarInforme
        );

    }

    const btnEliminarTodo =
    document.getElementById(
    "btnEliminarHistorial"
    );

    if(btnEliminarTodo){

        btnEliminarTodo.addEventListener(
        "click",
        eliminarHistorialCompleto
        );

    }

    const buscador =
    document.getElementById(
    "buscarInforme"
    );

    if(buscador){

        buscador.addEventListener(
        "keyup",
        filtrarHistorial
        );

    }

});

/* ==========================================
   GUARDAR INFORME
========================================== */

function guardarInforme(){

    if(historial.length >= 50){

        alert(
        "Máximo de 50 informes alcanzado."
        );

        return;

    }

    const informe = {

        codigo:
        document.getElementById(
        "codigoInforme"
        ).value,

        fecha:
        document.getElementById(
        "fechaActual"
        ).value,

        placa:
        document.getElementById(
        "placa"
        ).value,

        marca:
        document.getElementById(
        "marca"
        ).value,

        modelo:
        document.getElementById(
        "modelo"
        ).value,

        version:
        document.getElementById(
        "version"
        ).value,

        anioFab:
        document.getElementById(
        "anioFab"
        ).value,

        anioModelo:
        document.getElementById(
        "anioModelo"
        ).value,

        color:
        document.getElementById(
        "color"
        ).value,

        transmision:
        document.getElementById(
        "transmision"
        ).value,

        combustible:
        document.getElementById(
        "combustible"
        ).value,

        ubicacion:
        document.getElementById(
        "ubicacion"
        ).value,

        kilometraje:
        document.getElementById(
        "kilometraje"
        ).value,

        duenos:
        document.getElementById(
        "duenos"
        ).value,

        deudaPapeletas:
        document.getElementById(
        "deudaPapeletas"
        ).value,

        deudaImpuesto:
        document.getElementById(
        "deudaImpuesto"
        ).value,

        soat:
        document.getElementById(
        "soat"
        ).value,

        revision:
        document.getElementById(
        "revision"
        ).value,

        captura:
        document.getElementById(
        "captura"
        ).value,

        garantia:
        document.getElementById(
        "garantia"
        ).value,

        siniestro:
        document.getElementById(
        "siniestro"
        ).value,

        gas:
        document.getElementById(
        "gas"
        ).value,

        precio:
document.getElementById(
"precio"
).value,

observaciones:
document.getElementById(
"observaciones"
).value,

riesgo:
document.getElementById(
"riskText"
).textContent

    };

    historial.push(informe);

    localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(historial)
    );

    cargarHistorial();
    actualizarEstadisticas();

    contadorInformes++;
    generarCodigo();

    alert(
    "Informe guardado correctamente."
    );

}



/* ==========================================
   CARGAR HISTORIAL
========================================== */

function cargarHistorial(){

    const tabla =
    document.getElementById(
    "tablaHistorial"
    );

    if(!tabla) return;

    tabla.innerHTML = "";

    historial.forEach(
    (item,index)=>{

        const colorRiesgo =
item.riesgo === "ALTO"
? "#dc2626"
: item.riesgo === "MEDIO"
? "#f59e0b"
: "#16a34a";

tabla.innerHTML += `

<tr>

    <td>${item.codigo}</td>
    <td>${item.placa}</td>
    <td>${item.marca}</td>
    <td>${item.fecha}</td>

    <td>
        <span
        style="
        color:${colorRiesgo};
        font-weight:bold;
        ">
        ${item.riesgo}
        </span>
    </td>

    <td>

        <button
        class="btn-view"
        onclick="verInforme(${index})">
        Ver
        </button>

        <button
        class="btn-delete"
        onclick="eliminarInforme(${index})">
        Eliminar
        </button>

    </td>

</tr>

`;

    });

    actualizarEstadisticas();

}

/* ==========================================
   VER RESUMEN
========================================== */

function verInforme(index){

    const i = historial[index];

    const contenido = `

    <div class="resumen-container">

        <h2>FILTRO VEHICULAR A 3400</h2>

        <hr>

        <h3>DATOS GENERALES</h3>

        <p><b>Código:</b> ${i.codigo}</p>
        <p><b>Fecha:</b> ${i.fecha}</p>

        <h3>DATOS DEL VEHÍCULO</h3>

        <p><b>Placa:</b> ${i.placa}</p>
        <p><b>Marca:</b> ${i.marca}</p>
        <p><b>Modelo:</b> ${i.modelo}</p>
        <p><b>Versión:</b> ${i.version}</p>
        <p><b>Año Fabricación:</b> ${i.anioFab}</p>
        <p><b>Año Modelo:</b> ${i.anioModelo}</p>
        <p><b>Color:</b> ${i.color}</p>
        <p><b>Transmisión:</b> ${i.transmision}</p>
        <p><b>Combustible:</b> ${i.combustible}</p>
        <p><b>Ubicación:</b> ${i.ubicacion}</p>
        <p>
<b>Kilometraje:</b>
<span style="
font-weight:bold;
color:
${
(parseFloat(i.kilometraje) || 0) > 200000
? '#dc2626'
:
(parseFloat(i.kilometraje) || 0) > 100000
? '#f59e0b'
: '#16a34a'
};
">
${i.kilometraje}
</span>
</p>
        <p>
<b>Número de Dueños:</b>
<span style="
font-weight:bold;
color:
${(parseInt(i.duenos) || 0) > 4
? '#dc2626'
: '#16a34a'};
">
${i.duenos}
</span>
</p>

        <h3>DEUDAS Y DOCUMENTACIÓN</h3>

        <p>
<b>Deuda Papeletas:</b>
<span style="
font-weight:bold;
color:
${
(parseFloat(String(i.deudaPapeletas).replace(/[^0-9.]/g,'')) || 0) > 3000
? '#dc2626'
:
(parseFloat(String(i.deudaPapeletas).replace(/[^0-9.]/g,'')) || 0) > 500
? '#f59e0b'
: '#16a34a'
};
">
${i.deudaPapeletas}
</span>
</p>

<p>
<b>Deuda Impuesto:</b>
<span style="
font-weight:bold;
color:
${
(parseFloat(String(i.deudaImpuesto).replace(/[^0-9.]/g,'')) || 0) > 3000
? '#dc2626'
:
(parseFloat(String(i.deudaImpuesto).replace(/[^0-9.]/g,'')) || 0) > 500
? '#f59e0b'
: '#16a34a'
};
">
${i.deudaImpuesto}
</span>
</p>
        <p><b>SOAT:</b> ${i.soat}</p>
        <p><b>Revisión Técnica:</b> ${i.revision}</p>

        <h3>RIESGOS</h3>

<p>
<b>Orden de Captura:</b>
<span style="color:${i.captura === "Sí" ? "#dc2626" : "#16a34a"}">
${i.captura}
</span>
</p>

<p>
<b>Garantía Mobiliaria:</b>
<span style="color:${i.garantia === "Sí" ? "#dc2626" : "#16a34a"}">
${i.garantia}
</span>
</p>

<p>
<b>Siniestro:</b>
<span style="color:${i.siniestro === "Sí" ? "#dc2626" : "#16a34a"}">
${i.siniestro}
</span>
</p>

<p>
<b>Gas Vehicular:</b>
<span style="color:${i.gas !== "No" ? "#f59e0b" : "#16a34a"}">
${i.gas}
</span>
</p>

        <h3>VALOR COMERCIAL</h3>

        <p><b>Costo Referencial:</b> ${i.precio}</p>
        
        <h3>OBSERVACIONES</h3>

<p>${i.observaciones}</p>

        <h3>RIESGO DE COMPRA</h3>

        <p class="riesgo-final">${i.riesgo}</p>

    </div>

    `;

    const ventana = window.open(
        "",
        "_blank",
        "width=900,height=800"
    );

    ventana.document.write(`

        <html>

        <head>

            <title>Resumen Vehicular</title>

            <style>

                body{

                    font-family:Arial;
                    padding:30px;
                    background:#f5f5f5;

                }

                .resumen-container{

                    background:white;
                    padding:30px;
                    border-radius:15px;

                }

                h2{

                    color:#0f172a;
                    text-align:center;

                }

                h3{

                    color:#2563eb;
                    margin-top:20px;

                }

                p{

                    margin:8px 0;

                }

                .riesgo-final{

                    font-size:28px;
                    font-weight:bold;
                    color:#dc2626;

                }

            </style>

        </head>

        <body>

            ${contenido}

        </body>

        </html>

    `);

}
/* ==========================================
   ELIMINAR INFORME
========================================== */

function eliminarInforme(index){

    if(
    !confirm(
    "¿Eliminar este informe?"
    )
    ){
        return;
    }

    historial.splice(index,1);

    localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(historial)
    );

    cargarHistorial();

}

/* ==========================================
   ELIMINAR TODO
========================================== */

function eliminarHistorialCompleto(){

    if(
    !confirm(
    "¿Eliminar historial completo?"
    )
    ){
        return;
    }

    historial = [];

    localStorage.removeItem(
    STORAGE_KEY
    );

    cargarHistorial();

}

/* ==========================================
   FILTRO BUSCADOR
========================================== */

function filtrarHistorial(){

    const texto =
    document
    .getElementById(
    "buscarInforme"
    )
    .value
    .toLowerCase();

    const filas =
    document.querySelectorAll(
    "#tablaHistorial tr"
    );

    filas.forEach(fila=>{

        const contenido =
        fila.textContent
        .toLowerCase();

        fila.style.display =
        contenido.includes(texto)
        ? ""
        : "none";

    });

}

/* ==========================================
   ESTADISTICAS
========================================== */

function actualizarEstadisticas(){

    const total =
    historial.length;

    const bajo =
    historial.filter(
    i => i.riesgo === "BAJO"
    ).length;

    const medio =
    historial.filter(
    i => i.riesgo === "MEDIO"
    ).length;

    const alto =
    historial.filter(
    i => i.riesgo === "ALTO"
    ).length;

    const totalEl =
    document.getElementById(
    "totalInformes"
    );

    const bajoEl =
    document.getElementById(
    "riesgoBajo"
    );

    const medioEl =
    document.getElementById(
    "riesgoMedio"
    );

    const altoEl =
    document.getElementById(
    "riesgoAlto"
    );

    if(totalEl) totalEl.textContent = total;
    if(bajoEl) bajoEl.textContent = bajo;
    if(medioEl) medioEl.textContent = medio;
    if(altoEl) altoEl.textContent = alto;

}
/* =====================================================
   MODULO 6
   PDF + RESPALDOS
===================================================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

    iniciarModuloPDF();

});

/* ==========================================
   INICIAR
========================================== */

function iniciarModuloPDF(){

    const btnPDF =
    document.getElementById(
    "btnPDF"
    );

    if(btnPDF){

        btnPDF.addEventListener(
        "click",
        generarPDF
        );

    }

}

/* ==========================================
   GENERAR PDF
========================================== */

async function generarPDF(){

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF();

    const codigo =
    document.getElementById(
    "codigoInforme"
    ).value;

    const fecha =
    document.getElementById(
    "fechaActual"
    ).value;
    const observaciones =
document.getElementById(
"observaciones"
).value;

    let y = 20;

doc.setFontSize(20);

doc.text(
"FILTRADO A 3400 (A.M.H.)",
15,
y
);

y += 8;

doc.setFontSize(11);

doc.text(
"Servicio Profesional de Evaluacion Vehicular",
15,
y
);

y += 8;

doc.text(
"Informe Tecnico de Diagnostico Vehicular",
15,
y
);

y += 5;

doc.line(
15,
y,
195,
y
);

y += 10;

    doc.setFontSize(10);

    doc.text(
    `Codigo: ${codigo}`,
    15,
    y
    );

    y += 6;

    doc.text(
    `Fecha: ${fecha}`,
    15,
    y
    );

    y += 10;

    doc.setFontSize(14);

    doc.text(
    "DATOS DEL VEHICULO",
    15,
    y
    );

    y += 8;
  const papeletas =
parseFloat(
(document.getElementById("deudaPapeletas").value || "0")
.replace(/[^0-9.]/g,"")
) || 0;

const impuesto =
parseFloat(
(document.getElementById("deudaImpuesto").value || "0")
.replace(/[^0-9.]/g,"")
) || 0;

const km =
parseFloat(
document.getElementById("kilometraje").value || 0
);

    const datos = [

        ["Placa",
        document.getElementById("placa").value],

        ["Marca",
        document.getElementById("marca").value],

        ["Modelo",
        document.getElementById("modelo").value],

        ["Version",
        document.getElementById("version").value],

        ["Año Fabricacion",
        document.getElementById("anioFab").value],

        ["Año Modelo",
        document.getElementById("anioModelo").value],

        ["Color",
        document.getElementById("color").value],

        ["Transmision",
        document.getElementById("transmision").value],

        ["Combustible",
        document.getElementById("combustible").value],

        ["Ubicacion",
        document.getElementById("ubicacion").value],

        ["Kilometraje",
        document.getElementById("kilometraje").value],

        ["Numero Dueños",
        document.getElementById("duenos").value],

        ["Deuda Papeletas",
        document.getElementById("deudaPapeletas").value],

        ["Deuda Impuesto",
        document.getElementById("deudaImpuesto").value],

        ["SOAT",
        document.getElementById("soat").value],

        ["Revision Tecnica",
        document.getElementById("revision").value],

        ["Orden Captura",
        document.getElementById("captura").value],

        ["Garantia",
        document.getElementById("garantia").value],

        ["Siniestro",
        document.getElementById("siniestro").value],

        ["Gas Vehicular",
        document.getElementById("gas").value],

        ["Costo Referencial",
        document.getElementById("precio").value]

    ];

   doc.autoTable({

    startY:y,

    head:[["Campo","Valor"]],

    body:datos,

    didParseCell: function(data){

        if(data.section !== "body") return;

        const campo = data.row.raw[0];

        let color = [22,163,74];

        if(campo === "Deuda Papeletas"){

            if(papeletas > 3000){
                color = [220,38,38];
            }
            else if(papeletas > 500){
                color = [245,158,11];
            }

            data.cell.styles.textColor = color;
        }

        if(campo === "Deuda Impuesto"){

            if(impuesto > 3000){
                color = [220,38,38];
            }
            else if(impuesto > 500){
                color = [245,158,11];
            }

            data.cell.styles.textColor = color;
        }

        if(campo === "Kilometraje"){

            if(km > 200000){
                color = [220,38,38];
            }
            else if(km > 100000){
                color = [245,158,11];
            }

            data.cell.styles.textColor = color;
        }

    }

});

    let finalY =
    doc.lastAutoTable.finalY + 15;

    doc.setFontSize(14);

    doc.text(
    "RIESGO DE COMPRA",
    15,
    finalY
    );

    finalY += 10;

    doc.setFontSize(12);

    const riesgoPDF =
document.getElementById(
"riskText"
).textContent;

if(riesgoPDF === "BAJO"){
    doc.setTextColor(22,163,74);
}
else if(riesgoPDF === "MEDIO"){
    doc.setTextColor(245,158,11);
}
else{
    doc.setTextColor(220,38,38);
}

doc.setFontSize(16);

doc.text(
`RIESGO: ${riesgoPDF}`,
15,
finalY
);

doc.setTextColor(0,0,0);
    finalY += 15;

    doc.text(
"OBSERVACIONES",
15,
finalY
);

finalY += 10;

const lineas =
doc.splitTextToSize(
observaciones,
170
);

doc.text(
lineas,
15,
finalY
);

finalY +=
(lineas.length * 5) + 10;

    finalY += 55;

    doc.setFontSize(10);

    doc.text(
    "FILTRADO A 3400 (A.M.H.)",
    15,
    finalY
    );
  finalY += 6;

doc.text(
"Informe generado por Sistema Profesional de Evaluacion Vehicular",
15,
finalY
);

finalY += 6;

doc.text(
"Responsable: A.M.H.",
15,
finalY
);
for(const img of imagenesPDF){

    doc.addPage();

    doc.setFontSize(14);

    doc.text(
    "EVIDENCIA FOTOGRAFICA",
    15,
    15
    );

    doc.addImage(
    img,
    "JPEG",
    10,
    25,
    180,
    120
    );

}
    
  doc.save(
    `${codigo}.pdf`
    );

}

/* ==========================================
   EXPORTAR HISTORIAL JSON
========================================== */

function exportarJSON(){

    const datos =
    JSON.stringify(
    historial,
    null,
    2
    );

    const blob =
    new Blob(

    [datos],

    {
        type:
        "application/json"
    }

    );

    const url =
    URL.createObjectURL(
    blob
    );

    const a =
    document.createElement(
    "a"
    );

    a.href = url;

    a.download =
    "respaldo_filtrado_vehicular.json";

    a.click();

    URL.revokeObjectURL(
    url
    );

}

/* ==========================================
   IMPORTAR JSON
========================================== */

function importarJSON(event){

    const archivo =
    event.target.files[0];

    if(!archivo) return;

    const reader =
    new FileReader();

    reader.onload =
    function(e){

        try{

            historial =
            JSON.parse(
            e.target.result
            );

            localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(
            historial
            )

            );

            cargarHistorial();

            alert(
            "Respaldo importado."
            );

        }
        catch{

            alert(
            "Archivo inválido."
            );

        }

    };

    reader.readAsText(
    archivo
    );

}






       