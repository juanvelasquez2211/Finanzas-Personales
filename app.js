let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

const tabla = document.getElementById("tablaMovimientos");

let chartCategoria;

/* ABRIR Y CERRAR FORM */

function abrirForm(){
document.getElementById("formContainer").style.display="block";
}

function cerrarForm(){
document.getElementById("formContainer").style.display="none";
}


/* GUARDAR MOVIMIENTO */

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

cerrarForm();

this.reset();

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

movimientos.forEach(m=>{

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
<td>$${m.monto}</td>

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

document.getElementById("ingresos").innerText="$"+ingresos;
document.getElementById("egresos").innerText="$"+egresos;
document.getElementById("saldo").innerText="$"+(ingresos-egresos);

grafico(ingresos,egresos);

graficoCategorias(categorias);

}


/* GRAFICO INGRESOS VS EGRESOS */

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


/* FILTRO POR MES */

document.getElementById("filtroMes")?.addEventListener("change",render);


/* INICIAR APP */

render();
