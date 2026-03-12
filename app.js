let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

const tabla = document.getElementById("tablaMovimientos");

let chartCategoria;
let chartPrincipal;
let chartMes;

function formatearDinero(valor){
return "$ " + Number(valor).toLocaleString("es-CO");
}

/* ABRIR Y CERRAR FORM */

function abrirForm(){

const overlay = document.getElementById("overlay");
const form = document.getElementById("formContainer");

overlay.style.display="block";
overlay.style.pointerEvents="auto";

form.style.display="block";

setTimeout(()=>{
form.classList.add("active");
},10);

}

function cerrarForm(){

document.getElementById("movForm").reset();

const overlay = document.getElementById("overlay");
const form = document.getElementById("formContainer");

overlay.style.display="none";
overlay.style.pointerEvents="none";

form.classList.remove("active");

setTimeout(()=>{
form.style.display="none";
},300);

}

/* GUARDAR MOVIMIENTO */

document.getElementById("movForm").addEventListener("submit",function(e){

e.preventDefault();

let mov={

fecha:fecha.value,
tipo:tipo.value,
categoria:categoria.value,
concepto:concepto.value,
monto:Number(monto.value.replace(/\./g,""))

};

movimientos.push(mov);

localStorage.setItem("movimientos",JSON.stringify(movimientos));

render();

this.reset();

cerrarForm();

});


/* RENDER PRINCIPAL */

function render(){

tabla.innerHTML="";

let ingresos=0;
let egresos=0;

let categorias = {
Gastos:0,
Servicios:0,
Deudas:0,
Ahorro:0
};

let filtroMes = document.getElementById("filtroMes")?.value || "todos";

movimientos.forEach((m,index)=>{

let mesMovimiento = new Date(m.fecha).getMonth()+1;

if(filtroMes !== "todos" && mesMovimiento != filtroMes){
return;
}

tabla.innerHTML+=`

<tr>

<td>${m.fecha}</td>
<td>${m.tipo}</td>
<td>${m.categoria}</td>
<td>${m.concepto}</td>
<td>${formatearDinero(m.monto)}</td>

<td>

<button onclick="editarMovimiento(${index})">✏</button>

<button onclick="eliminarMovimiento(${index})">🗑</button>

</td>

</tr>

`;

if(m.tipo==="Ingreso"){
ingresos+=m.monto;
}else{
egresos+=m.monto;
}

if(m.tipo === "Egreso"){
if(categorias[m.categoria] !== undefined){
categorias[m.categoria] += m.monto;
}
}

});

document.getElementById("ingresos").innerText=formatearDinero(ingresos);
document.getElementById("egresos").innerText=formatearDinero(egresos);
document.getElementById("saldo").innerText=formatearDinero(ingresos-egresos);

grafico(ingresos,egresos);

graficoCategorias(categorias);

graficoMensual();

estadisticasDashboard();

function estadisticasDashboard(){

let mayorIngreso = 0;
let mayorGasto = 0;
let totalGastos = 0;
let cantidadGastos = 0;

movimientos.forEach(m => {

if(m.tipo === "Ingreso"){
if(m.monto > mayorIngreso){
mayorIngreso = m.monto;
}
}

if(m.tipo === "Egreso"){
if(m.monto > mayorGasto){
mayorGasto = m.monto;
}

totalGastos += m.monto;
cantidadGastos++;
}

});

let promedio = cantidadGastos ? totalGastos / cantidadGastos : 0;

let html = `

<div class="stat-card">
<div class="stat-title">Mayor ingreso</div>
<div class="stat-value">${formatearDinero(mayorIngreso)}</div>
</div>

<div class="stat-card">
<div class="stat-title">Mayor gasto</div>
<div class="stat-value">${formatearDinero(mayorGasto)}</div>
</div>

<div class="stat-card">
<div class="stat-title">Promedio gasto</div>
<div class="stat-value">${formatearDinero(promedio)}</div>
</div>

<div class="stat-card">
<div class="stat-title">Movimientos</div>
<div class="stat-value">${movimientos.length}</div>
</div>

`;

document.getElementById("estadisticasResumen").innerHTML = html;

}

let resumenHTML = "";

for(let cat in categorias){

resumenHTML += `
<p>${cat}: ${formatearDinero(categorias[cat])}</p>
`;

}

document.getElementById("resumenCategorias").innerHTML = resumenHTML;

}


/* GRAFICO INGRESOS VS EGRESOS */

function grafico(i,e){

let ctx = document.getElementById("grafico");

if(chartPrincipal){
chartPrincipal.destroy();
}

chartPrincipal = new Chart(ctx,{
type:'doughnut',
data:{
labels:["Ingresos","Egresos"],
datasets:[{
data:[i,e]
}]
}
});

}


/* GRAFICO POR CATEGORIA */

function graficoCategorias(data){

let ctx = document.getElementById("graficoCategoria");

if(chartCategoria){
chartCategoria.destroy();
}

chartCategoria = new Chart(ctx,{
type:'doughnut',
data:{
labels:Object.keys(data),
datasets:[{
data:Object.values(data)
}]
}
});

}

/* GRAFICO BALANCE MENSUAL */

function graficoMensual(){

let meses = new Array(12).fill(0);

movimientos.forEach(m => {

let mes = new Date(m.fecha).getMonth();

if(m.tipo === "Ingreso"){
meses[mes] += m.monto;
}else{
meses[mes] -= m.monto;
}

});

let ctx = document.getElementById("graficoMes");

if(!ctx) return;

if(chartMes){
chartMes.destroy();
}

chartMes = new Chart(ctx,{
type:'line',
data:{
labels:[
"Ene","Feb","Mar","Abr","May","Jun",
"Jul","Ago","Sep","Oct","Nov","Dic"
],
datasets:[{
label:"Balance mensual",
data:meses,
borderColor:"#3b82f6",
backgroundColor:"rgba(59,130,246,0.2)",
tension:0.3,
fill:true
}]
}
});

}


/* NAVEGACION */

function mostrarSeccion(id){

document.querySelectorAll(".seccion").forEach(sec=>{
sec.style.display="none";
});

document.getElementById(id).style.display="block";

if(id === "estadisticas"){
render();
}

}

mostrarSeccion("dashboard");


/* CATEGORIAS DINAMICAS */

const categoriasIngreso = ["Sueldo","Otros"];
const categoriasEgreso = ["Gastos","Ahorro","Servicios","Deudas"];

function actualizarCategorias(){

let tipo = document.getElementById("tipo").value;

let select = document.getElementById("categoria");

select.innerHTML="";

let lista = tipo === "Ingreso" ? categoriasIngreso : categoriasEgreso;

lista.forEach(cat=>{

let option = document.createElement("option");

option.value = cat;
option.textContent = cat;

select.appendChild(option);

});

}

document.getElementById("tipo").addEventListener("change",actualizarCategorias);

actualizarCategorias();

const montoInput = document.getElementById("monto");

montoInput.addEventListener("input", formatearMonto);

function formatearMonto(e){

let valor = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");

if(valor === "") return;

valor = Number(valor).toLocaleString("es-CO");

e.target.value = valor;

}


/* FILTRO POR MES */

document.getElementById("filtroMes")?.addEventListener("change",render);


/* INICIAR APP */

render();


function eliminarMovimiento(index){

if(confirm("¿Deseas eliminar este movimiento?")){

movimientos.splice(index,1);

localStorage.setItem("movimientos",JSON.stringify(movimientos));

render();

}

}

function editarMovimiento(index){

let m = movimientos[index];

fecha.value = m.fecha;
tipo.value = m.tipo;
categoria.value = m.categoria;
concepto.value = m.concepto;
monto.value = Number(m.monto).toLocaleString("es-CO");

abrirForm();

movimientos.splice(index,1);

}

tsParticles.load("particles-bg", {
    
    background: {
        color: "#0b0f19"
    },

    particles: {
        number: {
            value: 60
        },

        color: {
            value: "#3b82f6"
        },

        links: {
            enable: true,
            distance: 150,
            color: "#3b82f6",
            opacity: 0.3,
            width: 1
        },

        move: {
            enable: true,
            speed: 1
        },

        size: {
            value: 2
        },

        opacity: {
            value: 0.5
        }

    }

});

if("serviceWorker" in navigator){

navigator.serviceWorker.register("service-worker.js")
.then(()=>{
console.log("Service Worker registrado");
});

}
