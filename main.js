// Verificar si hay datos almacenados en el LocalStorage y cargarlos
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// Función para agregar una tarea
const agregarTarea = () => {
  const nuevaTareaInput = document.getElementById("nuevaTarea");
  const nuevaTarea = nuevaTareaInput.value.trim();

  if (nuevaTarea) {
    const tarea = { tarea: nuevaTarea, completada: false };

    // Agregar tarea al principio del arreglo
    tareas.unshift(tarea);

    // Actualizar la lista en el DOM
    actualizarLista();

    // Actualizar el LocalStorage
    actualizarLocalStorage();

    // Limpiar el campo de entrada
    nuevaTareaInput.value = "";

    // Llamar a la función para obtener información del clima
    obtenerClima();
  }
};

// Función para eliminar una tarea
const eliminarTarea = (indice) => {
  if (indice >= 0 && indice < tareas.length) {
    Swal.fire({
      title: "¿Desear eliminar la tarea?",
      text: "Recuerda que esta acción no la podrás deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si borrar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar la tarea del arreglo
        tareas.splice(indice, 1);

        Swal.fire({
          title: "¡Borrada!",
          text: "Tu tarea ha sido eliminada",
          icon: "success"
        });

        // Actualizar la lista en el DOM
        actualizarLista();

        // Actualizar el LocalStorage
        actualizarLocalStorage();
      }
    });
  }
};

// Función para marcar una tarea como hecha
const marcarComoHecha = (indice) => {
  if (indice >= 0 && indice < tareas.length) {
    // Marcar la tarea como completada
    tareas[indice].completada = true;

    Swal.fire({
      icon: 'success',
      title: 'Tarea completada',
      text: 'Estas a un paso de ser Elon Musk',
      showConfirmButton: false,
      timer: 1000
    });

    // Mover la tarea al final de la lista
    const tareaCompleta = tareas.splice(indice, 1)[0];
    tareas.push(tareaCompleta);

    // Actualizar la lista en el DOM
    actualizarLista();

    // Actualizar el LocalStorage
    actualizarLocalStorage();
  }
};

// Función para mostrar las tareas
const mostrarTareas = () => {
  if (tareas.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Oops...',
      text: 'Aún no has ingresado ninguna tarea.'
    });
  } else {
    // Actualizar la lista en el DOM
    actualizarLista();

    // Llamar a la función para obtener información del clima
    obtenerClima();
  }
};

// Función para actualizar la lista en el DOM
const actualizarLista = () => {
  const listaTareas = document.getElementById("listaTareas");
  listaTareas.innerHTML = "";

  const ul = document.createElement("ul");

  tareas.forEach((tarea, indice) => {
    const li = document.createElement("li");

    li.textContent = `${tarea.tarea}`;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("delete");
    botonEliminar.onclick = () => eliminarTarea(indice);

    const botonHecha = document.createElement("button");
    botonHecha.textContent = "Hecha";
    botonHecha.classList.add("done");
    botonHecha.onclick = () => {
      marcarComoHecha(indice);
      li.classList.add("completed");
      actualizarMensajes();
    };

    buttonContainer.appendChild(botonEliminar);
    buttonContainer.appendChild(botonHecha);

    li.appendChild(buttonContainer);

    if (tarea.completada) {
      li.classList.add("completed");
    }

    ul.appendChild(li);
  });

  listaTareas.appendChild(ul);

  actualizarMensajes();
};

// Función para actualizar los mensajes
const actualizarMensajes = () => {
  const mensajeContainer = document.getElementById("mensajeContainer");
  mensajeContainer.innerHTML = "";

  const tareasHechas = tareas.filter((tarea) => tarea.completada).length;

  const mensaje = document.createElement("p");

  if (tareasHechas > 0) {
    mensaje.textContent = `¡Buena! Ya has completado ${tareasHechas} tarea${tareasHechas !== 1 ? 's' : ''} hoy.`;
  } else {
    mensaje.textContent = "¡Lo siento! Aún no has hecho nada útil.";
  }

  mensajeContainer.appendChild(mensaje);
};

// Función para actualizar el LocalStorage
const actualizarLocalStorage = () => {
  localStorage.setItem("tareas", JSON.stringify(tareas));
};

// Función para obtener información del clima desde la API
const obtenerClima = async () => {
  const ciudad = "Santiago";
  const apiKey = "0b3c7e64935d3dd076bc9778b5d9c87c";

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}`);
    const data = await response.json();

    // Convertir de Kelvin a Celsius
    const temperaturaCelsius = data.main.temp - 273.15;

    // Redondear la temperatura a dos decimales
    const temperaturaRedondeada = temperaturaCelsius.toFixed(2);

    // Actualizar la temperatura en el HTML
    const temperaturaTexto = document.getElementById("temperatura");
    temperaturaTexto.textContent = `${temperaturaRedondeada} °C`;

    // Actualizar el icono del clima
    const iconoClima = document.getElementById("climaIcon");
    const iconoId = data.weather[0].icon;
    const iconoUrl = `https://openweathermap.org/img/w/${iconoId}.png`;
    iconoClima.src = iconoUrl;

    // Mostrar la temperatura actual en la consola
    console.log(`La temperatura actual en ${ciudad} es ${temperaturaRedondeada} grados Celsius.`);
  } catch (error) {
    console.error("Error al obtener datos del clima:", error.message);
  }
};

// Llamar a obtenerClima al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
  obtenerClima();
  actualizarMensajes();
});