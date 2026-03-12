let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

const tabla = document.getElementById("tablaMovimientos");

function abrirForm(){

document.getElementById("formContainer").style.display="block";

}

document.getElementById("movForm").addEventListener("submit",function(e){

e.preventDefault();

let mov={

fecha:fecha.value,
tipo:tipo.value,
categoria:categoria.value,
concepto:concepto.value,
monto:Number(monto.value)

};

movimientos.push(mov);

localStorage.setItem("movimientos",JSON.stringify(movimientos));

render();

this.reset();

});

function render(){

tabla.innerHTML="";

let ingresos=0;
let egresos=0;

movimientos.forEach(m=>{

tabla.innerHTML+=`

<tr>

<td>${m.fecha}</td>
<td>${m.tipo}</td>
<td>${m.categoria}</td>
<td>${m.concepto}</td>
<td>$${m.monto}</td>

</tr>

`;

if(m.tipo==="Ingreso"){

ingresos+=m.monto;

}else{

egresos+=m.monto;

}

});

document.getElementById("ingresos").innerText="$"+ingresos;
document.getElementById("egresos").innerText="$"+egresos;
document.getElementById("saldo").innerText="$"+(ingresos-egresos);

grafico(ingresos,egresos);

}

function grafico(i,e){

let ctx=document.getElementById("grafico");

new Chart(ctx,{

type:'doughnut',

data:{

labels:["Ingresos","Egresos"],

datasets:[{

data:[i,e]

}]

}

});

}

function mostrarSeccion(id){

document.querySelectorAll(".seccion").forEach(sec=>{
sec.style.display="none";
});

document.getElementById(id).style.display="block";

}

mostrarSeccion("dashboard");

function abrirForm(){

document.getElementById("formContainer").style.display="block";

}

function cerrarForm(){

document.getElementById("formContainer").style.display="none";

}


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

render();

