
const plazosDisponibles = [6, 12, 24, 36, 48];


const calcularTasaMensual = (tasaAnual) => tasaAnual / 12 / 100;

const esNumeroValido = (valor, minimo, maximo) =>
  !isNaN(valor) && valor >= minimo && valor <= maximo;

const formatearPlazo = (plazo) => `Plazo: ${plazo} cuotas`;

function solicitarNumero(mensaje, minimo, maximo) {
  let valor;
  do {
    valor = parseFloat(prompt(mensaje));
    if (!esNumeroValido(valor, minimo, maximo)) {
      alert(`Dato inválido. Ingresá un número entre ${minimo} y ${maximo}.`);
    }
  } while (!esNumeroValido(valor, minimo, maximo));
  return valor;
}

function solicitarPlazo(plazos) {
  let plazo;
  let plazoValido = false;

  while (!plazoValido) {
    plazo = parseInt(
      prompt(`Elegí la cantidad de cuotas.\nPlazos disponibles: ${plazos.join(", ")}`)
    );

    if (plazos.includes(plazo)) {
      const posicion = plazos.indexOf(plazo);
      alert(`El plazo de ${plazo} cuotas está disponible (posición ${posicion} de la lista).`);
      console.log(`Plazo ${plazo} encontrado en el índice ${posicion}.`);
      plazoValido = true;
    } else {
      alert(`El plazo "${plazo}" no está disponible. Elegí uno de la lista.`);
    }
  }

  return plazo;
}

function actualizarOfertaDePlazos(plazos, plazoLargoNuevo, plazoCortoNuevo) {
  const plazoEliminado = plazos.pop();
  alert(`Se ha eliminado el elemento: ${plazoEliminado}`);
  console.log(`Se ha eliminado el elemento: ${plazoEliminado}`);

  plazos.push(plazoLargoNuevo);
  plazos.unshift(plazoCortoNuevo);
  console.log(`Se agregó ${plazoLargoNuevo} al final y ${plazoCortoNuevo} al inicio.`);

  return plazoEliminado;
}

function reemplazarPlazo(plazos, plazoActual, plazoNuevo) {
  const indice = plazos.indexOf(plazoActual);

  if (indice === -1) {
    alert(`El plazo ${plazoActual} no existe, no se puede reemplazar.`);
    return false;
  }
  if (plazos.includes(plazoNuevo)) {
    alert(`El plazo ${plazoNuevo} ya existe en la lista.`);
    return false;
  }

  plazos.splice(indice, 1, plazoNuevo);
  console.log(`Plazo ${plazoActual} reemplazado por ${plazoNuevo} en el índice ${indice}.`);
  return true;
}

function calcularPlanDePagos(monto, tasaAnual, cantidadCuotas) {
  const tasaMensual = calcularTasaMensual(tasaAnual);
  let cuotaFija;

  if (tasaMensual === 0) {
    cuotaFija = monto / cantidadCuotas; 
  } else {
    cuotaFija =
      (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cantidadCuotas));
  }

  const plan = [];
  let saldo = monto;

  for (let numero = 1; numero <= cantidadCuotas; numero++) {
    const interes = saldo * tasaMensual;
    const capital = cuotaFija - interes;
    saldo = saldo - capital;

    plan.push({
      cuota: numero,
      pago: cuotaFija,
      interes: interes,
      capital: capital,
      saldo: saldo > 0.005 ? saldo : 0,
    });
  }

  return plan;
}

function mostrarPlazosDisponibles(plazos) {
  console.log("===== PLAZOS DISPONIBLES =====");
  for (const plazo of plazos) {
    console.log(formatearPlazo(plazo));
  }
}

function mostrarResultados(plan, monto) {
  console.log("===== PLAN DE PAGOS =====");
  for (const fila of plan) {
    console.log(
      `Cuota ${fila.cuota} | Pago: $${fila.pago.toFixed(2)} | ` +
        `Interés: $${fila.interes.toFixed(2)} | ` +
        `Capital: $${fila.capital.toFixed(2)} | ` +
        `Saldo: $${fila.saldo.toFixed(2)}`
    );
  }

  const totalPagado = plan.reduce((acumulado, fila) => acumulado + fila.pago, 0);
  const totalIntereses = totalPagado - monto;

  alert(
    `Resumen del préstamo\n\n` +
      `Monto solicitado: $${monto.toFixed(2)}\n` +
      `Cuotas: ${plan.length}\n` +
      `Valor de cada cuota: $${plan[0].pago.toFixed(2)}\n` +
      `Total a pagar: $${totalPagado.toFixed(2)}\n` +
      `Total de intereses: $${totalIntereses.toFixed(2)}\n\n` +
      `Mirá el detalle completo en la consola (F12).`
  );
}


function iniciarSimulador() {
  alert("¡Bienvenido al simulador de préstamos!");

  mostrarPlazosDisponibles(plazosDisponibles);

  actualizarOfertaDePlazos(plazosDisponibles, 60, 3);
  mostrarPlazosDisponibles(plazosDisponibles);

  let continuar = true;

  while (continuar) {
    const monto = solicitarNumero("Monto a solicitar ($1.000 - $10.000.000):", 1000, 10000000);
    const tasaAnual = solicitarNumero("Tasa de interés anual en % (0 - 200):", 0, 200);
    const cuotas = solicitarPlazo(plazosDisponibles);


    const plan = calcularPlanDePagos(monto, tasaAnual, cuotas);

    mostrarResultados(plan, monto);

    if (confirm("¿Querés reemplazar uno de los plazos disponibles por otro?")) {
      const plazoActual = solicitarNumero(
        `¿Qué plazo querés reemplazar?\nDisponibles: ${plazosDisponibles.join(", ")}`,
        1,
        120
      );
      const plazoNuevo = solicitarNumero("¿Por cuál plazo lo reemplazás? (1 - 120)", 1, 120);

      if (reemplazarPlazo(plazosDisponibles, plazoActual, plazoNuevo)) {
        alert(`Plazo ${plazoActual} reemplazado por ${plazoNuevo}.`);
        mostrarPlazosDisponibles(plazosDisponibles);
      }
    }

    continuar = confirm("¿Querés simular otro préstamo?");
  }

  alert("Gracias por usar el simulador. ¡Hasta pronto!");
  console.log("Simulador finalizado.");
}

iniciarSimulador();
