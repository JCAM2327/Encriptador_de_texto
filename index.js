const REGLAS_ENCRIPTAR = {
  e: "enter",
  i: "imes",
  a: "ai",
  o: "ober",
  u: "ufat",
};

const REGLAS_DESENCRIPTAR = {
  enter: "e",
  imes: "i",
  ai: "a",
  ober: "o",
  ufat: "u",
};

const PATRON_ENCRIPTAR = /[aeiou]/g;
const PATRON_DESENCRIPTAR = /enter|imes|ai|ober|ufat/g;
const PATRON_CARACTER_VALIDO = /^[a-zñ\s]$/;

const elementos = {
  texto: document.getElementById("texto"),
  contador: document.getElementById("contador"),
  normalizar: document.getElementById("normalizar"),
  encriptar: document.getElementById("encriptar"),
  desencriptar: document.getElementById("desencriptar"),
  limpiar: document.getElementById("limpiar"),
  copiar: document.getElementById("copiar"),
  resultado: document.getElementById("resultado"),
  textoResultado: document.getElementById("textoResultado"),
  estado: document.getElementById("estado"),
};

let resultadoActual = "";

function normalizarTexto(texto) {
  const protegido = texto.toLowerCase().replace(/ñ/g, "__ENIE__");
  return protegido
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/__ENIE__/g, "ñ");
}

function obtenerCaracteresInvalidos(texto) {
  return [...new Set([...texto].filter((caracter) => !PATRON_CARACTER_VALIDO.test(caracter)))];
}

function actualizarContador() {
  elementos.contador.textContent = String(elementos.texto.value.length);
}

function mostrarEstado(texto, tipo = "") {
  elementos.estado.textContent = texto;
  elementos.estado.className = tipo ? `status is-${tipo}` : "status";
}

function limpiarResultado() {
  resultadoActual = "";
  elementos.resultado.dataset.state = "empty";
  elementos.textoResultado.hidden = true;
  elementos.textoResultado.textContent = "";
  elementos.copiar.disabled = true;
  elementos.copiar.textContent = "Copiar";
}

function mostrarResultado(texto) {
  resultadoActual = texto;
  elementos.resultado.dataset.state = "filled";
  elementos.textoResultado.hidden = false;
  elementos.textoResultado.textContent = texto;
  elementos.copiar.disabled = false;
  elementos.copiar.textContent = "Copiar";
}

function validarTexto(texto) {
  if (texto.trim() === "") {
    return "Escribe un texto antes de continuar.";
  }

  const invalidos = obtenerCaracteresInvalidos(texto);
  if (invalidos.length > 0) {
    const lista = invalidos.slice(0, 6).map((caracter) => `"${caracter}"`).join(", ");
    const extra = invalidos.length > 6 ? " y otros" : "";
    return `Solo se permiten minúsculas sin acentos. Revisa: ${lista}${extra}.`;
  }

  return null;
}

function encriptarTexto(texto) {
  return texto.replace(PATRON_ENCRIPTAR, (letra) => REGLAS_ENCRIPTAR[letra]);
}

function desencriptarTexto(texto) {
  return texto.replace(PATRON_DESENCRIPTAR, (secuencia) => REGLAS_DESENCRIPTAR[secuencia]);
}

function procesar(accion) {
  const texto = elementos.texto.value;
  const error = validarTexto(texto);

  if (error) {
    limpiarResultado();
    mostrarEstado(error, "error");
    elementos.texto.focus();
    return;
  }

  const resultado = accion === "encriptar" ? encriptarTexto(texto) : desencriptarTexto(texto);
  mostrarResultado(resultado);
  mostrarEstado(
    accion === "encriptar" ? "Texto encriptado correctamente." : "Texto desencriptado correctamente.",
    "success",
  );
}

function normalizarEntrada() {
  const normalizado = normalizarTexto(elementos.texto.value);
  elementos.texto.value = normalizado;
  actualizarContador();

  if (normalizado.trim() === "") {
    limpiarResultado();
    mostrarEstado("Escribe un texto antes de continuar.", "error");
    elementos.texto.focus();
    return;
  }

  limpiarResultado();
  const invalidos = obtenerCaracteresInvalidos(normalizado);
  if (invalidos.length > 0) {
    mostrarEstado("Texto normalizado. Aún hay caracteres no permitidos.", "error");
  } else {
    mostrarEstado("Texto normalizado: minúsculas y sin acentos.", "success");
  }

  elementos.texto.focus();
}

function limpiarTodo() {
  elementos.texto.value = "";
  actualizarContador();
  limpiarResultado();
  mostrarEstado("Listo para empezar.");
  elementos.texto.focus();
}

async function copiarResultado() {
  if (!resultadoActual) {
    return;
  }

  try {
    await navigator.clipboard.writeText(resultadoActual);
    elementos.copiar.textContent = "Copiado";
    mostrarEstado("Resultado copiado al portapapeles.", "success");
    window.setTimeout(() => {
      elementos.copiar.textContent = "Copiar";
    }, 1600);
  } catch {
    mostrarEstado("No se pudo copiar automáticamente. Selecciona el resultado manualmente.", "error");
  }
}

elementos.encriptar.addEventListener("click", () => procesar("encriptar"));
elementos.desencriptar.addEventListener("click", () => procesar("desencriptar"));
elementos.normalizar.addEventListener("click", normalizarEntrada);
elementos.limpiar.addEventListener("click", limpiarTodo);
elementos.copiar.addEventListener("click", copiarResultado);

elementos.texto.addEventListener("input", () => {
  actualizarContador();

  if (resultadoActual) {
    limpiarResultado();
    mostrarEstado(
      elementos.texto.value.trim() === "" ? "Listo para empezar." : "Texto modificado. Vuelve a procesar.",
    );
    return;
  }

  if (elementos.estado.classList.contains("is-error")) {
    mostrarEstado("Listo para empezar.");
  }
});

elementos.texto.addEventListener("keydown", (evento) => {
  if ((evento.ctrlKey || evento.metaKey) && evento.key === "Enter") {
    evento.preventDefault();
    procesar(evento.shiftKey ? "desencriptar" : "encriptar");
  }
});

actualizarContador();
