let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

const tabla = document.getElementById("tablaMovimientos");

let chartCategoria;
let chartPrincipal;

function formatearDinero(valor){
return "$ " + Number(valor).toLocaleString("es-CO");
}

/* ABRIR Y CERRAR FORM */

function abrirForm(){

document.getElementById("overlay").style.display="block";

const form = document.getElementById("formContainer");

form.style.display="block";

setTimeout(()=>{
form.classList.add("active");
},10);

}

function cerrarForm(){

document.getElementById("movForm").reset();

document.getElementById("overlay").style.display="none";

const form = document.getElementById("formContainer");

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

function eliminarMovimiento(index){

movimientos.splice(index,1);

localStorage.setItem("movimientos",JSON.stringify(movimientos));

render();

}

function editarMovimiento(index){

let m = movimientos[index];

fecha.value = m.fecha;
tipo.value = m.tipo;
concepto.value = m.concepto;
monto.value = m.monto;

abrirForm();

movimientos.splice(index,1);

}

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


/* NAVEGACION */

function mostrarSeccion(id){

document.querySelectorAll(".seccion").forEach(sec=>{
sec.style.display="none";
});

document.getElementById(id).style.display="block";

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

let resumenHTML="";

for(let cat in categorias){

resumenHTML+=`

<p>${cat}: ${formatearDinero(categorias[cat])}</p>

`;

}

document.getElementById("resumenCategorias").innerHTML=resumenHTML;

render();







