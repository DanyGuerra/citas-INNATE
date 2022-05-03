/**
 * Descripción de variables
 * @mes es para guardar el mes en que se seleccionó la cita y así obtener el precio de ese mes
 * @fecha es para guardar la fecha de la cita
 * @horariosLlenos si es true se borran todos los divs de los horarios para agregar los nuevos horarios, dependiendo del día seleccionado, y así evitar que se vayan acumulando
 * @btnAgregar para saber si el botón existe o no. Solo se agrega cuando, al seleccionar una fecha, regresa horarios.
 * Al dar click en el botón solo permite avanzar si se ha seleccionado un horario disponible.
 * Solo se puede seleccionar un horario si está disponible.
 * @setAnimationInterval y @deleteAnimationInterval para guardar los id del intervalo que ejecuta la animación de carga y después poder eliminarlo.
 */

// para que el calendario aparezca en español
(function () {
  Datepicker.locales.es = {
    days: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    monthsShort: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    today: "Hoy",
    monthsTitle: "Meses",
    clear: "Borrar",
    weekStart: 1,
    format: "dd/mm/yyyy",
  };
})();

// configuración del date picker
const calendario = document.querySelector('input[name="foo"]');
const datepicker = new Datepicker(calendario, {
  autohide: true,
  clearBtn: true,
  todayBtn: true,
  language: "es",
});

const HOST = location.protocol + "//" + location.host;
let mes = "";
let fecha = "";
let sucursal = "";
let horariosLlenos = false;
let btnAgregar = false;
let animation = false;
let setAnimationInterval = null;
let deleteAnimationInterval = null;

const sucursalSelect = document.getElementById("sucursal");
const selectSelected = document.getElementsByClassName("select-selected")[0];

selectSelected.addEventListener("click", () => {
  sucursal = selectSelected.innerHTML;
});

calendario.addEventListener("changeDate", () => {
  fecha = datepicker.getDate("dd/mm/yyyy");
  mes = parseInt(datepicker.getDate("mm"));

  document.getElementById("preloader_container").style.display = "flex";
  setAnimation();
  /**
   * Tuve que hacerlo así porque si agregaba el infinite a las animaciones, en la segunda iteración se descuadraban los tiempos de espera;
   * entonces solo se anima una vez, se eliminan las animaciones de cada uno, y se vuelven a agregar.
   * Cuando obtenemos la información se eliminan los intervalos.
   */
  deleteAnimationInterval = setInterval(deleteAnimation, 1100);
  setAnimationInterval = setInterval(setAnimation, 2200);

  if (horariosLlenos) deleteHorarios();
  setHorarios();
  // if (!btnAgregar) addButtonAgendar();
});

function setAnimation() {
  document.getElementById("_1").style.animation = "bloque 0.5s";
  document.getElementById("_2").style.animation = "disco 0.5s 0.1s";
  document.getElementById("_3").style.animation = "bloque 0.5s 0.2s";
  document.getElementById("_4").style.animation = "disco 0.5s 0.3s";
  document.getElementById("_5").style.animation = "bloque 0.5s 0.4s";
  document.getElementById("_6").style.animation = "disco 0.5s 0.5s";
  document.getElementById("_7").style.animation = "bloque 0.5s 0.6s";
}

function deleteAnimation() {
  document.getElementById("_1").style.animation = "";
  document.getElementById("_2").style.animation = "";
  document.getElementById("_3").style.animation = "";
  document.getElementById("_4").style.animation = "";
  document.getElementById("_5").style.animation = "";
  document.getElementById("_6").style.animation = "";
  document.getElementById("_7").style.animation = "";
}

// agrega los horarios
function setHorarios() {
  const horariosContainer = document.getElementById("horarios");

  console.log(fecha);
  // para entonces la variable fecha ya tiene un valor
  fetch(`${HOST}/citas/api/horarios?fecha=${fecha}`)
    .then((response) => response.json())
    .then((horariosData) => {
      // console.log(horariosData.length)
      if (horariosData.length != 0) {
        horariosData.forEach((horario) => {
          let key = Object.keys(horario).toString();
          let hora = key.slice(0, -6);
          // corto los últimos seis carácteres porque el resultado de obtener las keys es "N,fecha", donde N es la hora

          const titleHour = document.getElementById("title-hora");
          titleHour.style.display = "block   ";

          const opcHorario = document.createElement("div");

          // horario_inactive son los horarios que pueden ser seleccionados, pero es inactive porque no está seleccionado
          if (horario[hora]) opcHorario.classList = "horario_inactive";
          else opcHorario.classList = "disable";
          // y disable son los que no están disponibles

          // creo que esto se eliminará por lo que habíamos acordado que es mejor que nos manden la información con el formato deseado
          hora = amPm(parseInt(hora));
          opcHorario.innerText = hora;

          document.getElementById("horarios").appendChild(opcHorario);
        });
        if (!btnAgregar) addButtonAgendar();
      } else deleteButtonAgendar();

      setListeners();
      document.getElementById("preloader_container").style.display = "none";
      clearInterval(setAnimationInterval, deleteAnimationInterval);
    });

  horariosLlenos = true;
}

// borra los horarios
function deleteHorarios() {
  const horarios = document.getElementById("horarios");
  let horario = horarios.lastElementChild;

  // esta fue la única manera con la que pude eliminar los horarios
  while (horario) {
    horarios.removeChild(horario);
    horario = horarios.lastElementChild;
  }

  horariosLlenos = false;
}

// da formto a la hora
function amPm(hora) {
  if (hora < 12) hora = hora + ":00 AM";
  else if (hora > 12) {
    hora = hora - 12;
    hora = "0" + hora + ":00 PM";
  }
  if (hora < 10) hora = "0" + hora;
  if (hora == 12) hora = hora + ":00 PM";

  return hora;
}

// agrega eventlisteners para que solo haya un horario elegido
function setListeners() {
  const horarios = document.getElementById("horarios").children;

  for (let i = 0; i < horarios.length; i++) {
    const horario = horarios[i];

    if (horario.classList != "disable") {
      horario.addEventListener("click", () => {
        const active = document.getElementById("horario_active");

        if (active) {
          active.removeAttribute("class");
          active.removeAttribute("id");
          active.classList = "horario_inactive";
        }

        horario.classList = "horario_active";
        horario.setAttribute("id", "horario_active");
      });
    }
  }
}

function addButtonAgendar() {
  const btn = document.createElement("button");
  btn.setAttribute("id", "agendar_btn");
  btn.innerText = "SIGUIENTE";

  const container = document.getElementById("container");
  container.appendChild(btn);

  btn.addEventListener("click", () => {
    const horarios = document.getElementsByClassName("horario_active");
    if (horarios.length == 0) console.log("no se ha seleccionado un horario");
    // creo que debe haber una mejor opción para pasar el parámetro de mes a la siguiente página, porque se podría sustituir el mes fácilmente.
    else
      window.location.href = `${HOST}/citas/pagos?fecha=${fecha}&sucursal=${sucursal}`;
  });

  btnAgregar = true;
}

function deleteButtonAgendar() {
  const btn = document.getElementById("agendar_btn");
  btn.remove();
  btnAgregar = false;
}
