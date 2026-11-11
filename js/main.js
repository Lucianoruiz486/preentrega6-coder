// ===================================================
// Pre-Entrega 6: Interactuando con Funciones de Orden Superior
// Simulador: Validador de Stock de un negocio de indumentaria deportiva
// Continuación de las Pre-Entregas 2 a 5: ciclos, funciones, arrays y clase Producto
// ===================================================

// ===================================================
// 1. CLASE (Pre-Entrega 5): la "fábrica" de productos del simulador
// ===================================================
class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  // INFORMA: indica si hay unidades suficientes para el pedido
  hayStock(cantidad) {
    return cantidad <= this.stock;
  }

  // MODIFICA el estado: descuenta las unidades vendidas del stock
  // Solo vende cantidades enteras mayores a 0 que alcancen el stock (así el stock nunca queda negativo ni decimal)
  // Retorna true si la venta se realizó y false si no
  vender(cantidad) {
    if (Number.isInteger(cantidad) && cantidad > 0 && this.hayStock(cantidad)) {
      this.stock = this.stock - cantidad;
      return true;
    }
    return false;
  }

  // MODIFICA el estado: baja el precio según el porcentaje indicado
  // Solo aplica porcentajes entre 0 y 100 (sin incluirlos); si no, el precio no cambia
  // Retorna el precio resultante
  aplicarDescuento(porcentaje) {
    if (porcentaje > 0 && porcentaje < 100) {
      this.precio = Math.round(this.precio - (this.precio * porcentaje) / 100);
    }
    return this.precio;
  }

  // CALCULA: precio final con IVA (21%), sin modificar el precio base
  calcularPrecioConIva() {
    return Math.round(this.precio * 1.21);
  }

  // INFORMA: devuelve una descripción legible del estado actual del producto
  describir() {
    return `Producto #${this.id}: ${this.nombre} | Precio: $${this.precio} (con IVA: $${this.calcularPrecioConIva()}) | Stock: ${this.stock} unidades`;
  }
}

// ===================================================
// 2. ARRAY DE OBJETOS: el catálogo del negocio
// ===================================================
// Cada elemento es una instancia de Producto (id, nombre, precio y stock).
// La Botella Térmica arranca agotada (stock 0) para poder consultar faltantes.
const productosEnStock = [
  new Producto(1, "Zapatillas Running", 85000, 10),
  new Producto(2, "Remera Deportiva", 22000, 15),
  new Producto(3, "Short Deportivo", 18000, 12),
  new Producto(4, "Medias", 6000, 30),
  new Producto(5, "Mochila", 35000, 8),
  new Producto(6, "Botella Térmica", 9000, 0),
];

// ===================================================
// 3. FUNCIONES GENERALES
// ===================================================

// SALIDA (flecha): centraliza cómo se comunican los mensajes (consola + alert)
const mostrarMensaje = (mensaje) => {
  console.log(mensaje);
  alert(mensaje);
};

// CÁLCULO (flecha con retorno implícito): porcentaje vendido del stock inicial
const calcularPorcentajeVendido = (vendidas, inicial) => Math.round((vendidas / inicial) * 100);

// VALIDACIÓN (flechas con retorno implícito): comprueban los datos que llegan desde prompt
// Un entero mayor a 0 (cantidades e IDs). Number("abc") da NaN y Number.isInteger(NaN) es false
const esEnteroPositivo = (valor) => Number.isInteger(valor) && valor > 0;
// Un número mayor a 0 (presupuestos)
const esNumeroPositivo = (valor) => !isNaN(valor) && valor > 0;

// ===================================================
// 4. FUNCIONES DE ORDEN SUPERIOR: BÚSQUEDA (forEach, find, filter, some)
// ===================================================

// forEach: recorre el catálogo y muestra cada producto en la consola
function listarStock(lista) {
  console.log("--- Catálogo ---");
  lista.forEach((producto) => console.log(producto.describir()));
  console.log(`Total: ${lista.length} productos`);
}

// find: captura UN producto por su id (retorna el objeto, o undefined si no existe)
function buscarPorId(lista, id) {
  return lista.find((producto) => producto.id === id);
}

// filter: se queda con los productos que hay en stock y entran en el presupuesto
// (se compara contra el precio final, con IVA, que es el que paga el cliente)
function filtrarDisponiblesHastaPrecio(lista, precioMaximo) {
  return lista.filter(
    (producto) => producto.stock > 0 && producto.calcularPrecioConIva() <= precioMaximo
  );
}

// some: responde true/false si al menos un producto está agotado
function hayAgotados(lista) {
  return lista.some((producto) => producto.stock === 0);
}

// filter: arma la lista de productos agotados
function obtenerAgotados(lista) {
  return lista.filter((producto) => producto.stock === 0);
}

// ===================================================
// 5. FUNCIONES DE ORDEN SUPERIOR: TRANSFORMACIÓN (map, reduce)
// ===================================================

// map: transforma cada producto en una línea "id - nombre" para mostrar en el prompt
function armarListadoParaPrompt(lista) {
  return lista.map((producto) => `${producto.id} - ${producto.nombre}`).join("\n");
}

// map: transforma cada producto en un texto con su precio final (IVA incluido)
function crearListaDePrecios(lista) {
  return lista.map(
    (producto) => `${producto.nombre}: $${producto.calcularPrecioConIva()} (IVA incluido)`
  );
}

// reduce: acumula el valor total del inventario (precio base x unidades de cada producto)
function calcularValorInventario(lista) {
  return lista.reduce((acumulado, producto) => acumulado + producto.precio * producto.stock, 0);
}

// ===================================================
// 6. VENTA DE UN PRODUCTO (Pre-Entrega 5)
// ===================================================

// ENTRADA: pide la cantidad de unidades y la retorna como number
function pedirCantidad(producto) {
  const entrada = prompt(
    `Producto: ${producto.nombre}\nPrecio con IVA: $${producto.calcularPrecioConIva()}\nStock actual: ${producto.stock} unidades.\n¿Cuántas unidades querés comprar?`
  );
  return Number(entrada);
}

// PROCESAMIENTO: valida el pedido y, si corresponde, le pide al objeto que venda
function procesarCompra(producto, cantidadPedida) {
  if (!esEnteroPositivo(cantidadPedida)) {
    mostrarMensaje("Entrada inválida. Ingresá un número entero mayor a 0.");
  } else if (!producto.hayStock(cantidadPedida)) {
    mostrarMensaje(`No hay stock suficiente. Solo quedan ${producto.stock} unidades.`);
  } else {
    producto.vender(cantidadPedida);
    const total = cantidadPedida * producto.calcularPrecioConIva();
    mostrarMensaje(
      `Compra realizada: ${cantidadPedida} unidad/es de ${producto.nombre}. Total: $${total} (IVA incluido).`
    );
  }
}

// CICLO DE VENTAS: repite compras hasta que se agote el stock o el cliente termine
// Retorna las unidades vendidas
function simularVentas(producto) {
  const stockInicial = producto.stock;
  let seguirComprando = true;

  while (producto.stock > 0 && seguirComprando) {
    const cantidadPedida = pedirCantidad(producto);
    procesarCompra(producto, cantidadPedida);

    if (producto.stock > 0) {
      seguirComprando = confirm(`¿Querés seguir comprando ${producto.nombre}?`);
    }
  }

  return stockInicial - producto.stock;
}

// SALIDA FINAL: resumen coherente según cómo terminó la venta
function mostrarResumen(producto, unidadesVendidas, stockInicial) {
  const porcentajeVendido = calcularPorcentajeVendido(unidadesVendidas, stockInicial);
  const totalFacturado = unidadesVendidas * producto.calcularPrecioConIva();

  let mensajeFinal;
  if (producto.stock === 0) {
    mensajeFinal = `Se agotó el stock de ${producto.nombre}. Se vendieron ${unidadesVendidas} unidades (${porcentajeVendido}% del stock inicial). Total facturado: $${totalFacturado}.`;
  } else {
    mensajeFinal = `Venta finalizada. Se vendieron ${unidadesVendidas} unidades de ${producto.nombre} (${porcentajeVendido}% del stock inicial). Quedan ${producto.stock} en stock. Total facturado: $${totalFacturado}.`;
  }

  mostrarMensaje(mensajeFinal);
}

// ===================================================
// 7. OPCIONES DEL MENÚ: cada una usa los métodos de arriba según lo que pida el usuario
// ===================================================

// Opción 1 (forEach): ver el catálogo completo
function verCatalogo(lista) {
  listarStock(lista);
  mostrarMensaje(`El catálogo tiene ${lista.length} productos. Mirá el detalle en la consola.`);
}

// ENTRADA reutilizable: pide el ID de un producto mostrando el listado (retorna un number)
function pedirIdProducto(lista, accion) {
  const entrada = prompt(`¿Qué producto querés ${accion}? Ingresá el ID:\n${armarListadoParaPrompt(lista)}`);
  return Number(entrada);
}

// Opción 2 (find): buscar un producto por su id
function buscarProductoPorId(lista) {
  const id = pedirIdProducto(lista, "buscar");

  if (!esEnteroPositivo(id)) {
    mostrarMensaje("ID inválido. Ingresá un número entero mayor a 0.");
  } else {
    const producto = buscarPorId(lista, id);

    if (producto !== undefined) {
      console.log(producto.describir());
      mostrarMensaje(`Encontré: ${producto.nombre} (stock: ${producto.stock} unidades).`);
    } else {
      mostrarMensaje(`No existe un producto con el ID ${id}.`);
    }
  }
}

// Opción 3 (filter): ver los productos disponibles dentro de un presupuesto
function verDisponiblesPorPrecio(lista) {
  const precioMaximo = Number(prompt("¿Cuál es tu presupuesto máximo por unidad? (precio con IVA)"));

  if (!esNumeroPositivo(precioMaximo)) {
    mostrarMensaje("Presupuesto inválido. Ingresá un número mayor a 0.");
  } else {
    const disponibles = filtrarDisponiblesHastaPrecio(lista, precioMaximo);

    if (disponibles.length > 0) {
      console.log(`--- Disponibles hasta $${precioMaximo} (IVA incluido) ---`);
      disponibles.forEach((producto) => console.log(producto.describir()));
      mostrarMensaje(`Hay ${disponibles.length} producto/s disponibles hasta $${precioMaximo}. Mirá el detalle en la consola.`);
    } else {
      mostrarMensaje(`No hay productos disponibles hasta $${precioMaximo}.`);
    }
  }
}

// Opción 4 (some + filter + map): consultar si hay faltantes y cuáles son
function verAgotados(lista) {
  if (hayAgotados(lista)) {
    const nombresAgotados = obtenerAgotados(lista).map((producto) => producto.nombre);
    mostrarMensaje(`Productos agotados: ${nombresAgotados.join(", ")}.`);
  } else {
    mostrarMensaje("No hay productos agotados.");
  }
}

// Opción 5 (map): ver la lista de precios finales con IVA
function verListaDePrecios(lista) {
  const precios = crearListaDePrecios(lista);
  console.log("--- Lista de precios ---");
  precios.forEach((linea) => console.log(linea));
  mostrarMensaje("Lista de precios generada. Mirá el detalle en la consola.");
}

// Opción 6 (reduce): ver el valor total del inventario
function verValorInventario(lista) {
  const valorTotal = calcularValorInventario(lista);
  mostrarMensaje(`Valor total del inventario: $${valorTotal} (precios sin IVA).`);
}

// Opción 7 (find + ciclo de ventas): comprar un producto
function comprarProducto(lista) {
  const id = pedirIdProducto(lista, "comprar");

  if (!esEnteroPositivo(id)) {
    mostrarMensaje("ID inválido. Ingresá un número entero mayor a 0.");
  } else {
    const producto = buscarPorId(lista, id);

    if (producto === undefined) {
      mostrarMensaje(`No existe un producto con el ID ${id}.`);
    } else if (producto.stock === 0) {
      mostrarMensaje(`${producto.nombre} está agotado.`);
    } else {
      const stockInicial = producto.stock;
      const unidadesVendidas = simularVentas(producto);
      mostrarResumen(producto, unidadesVendidas, stockInicial);
    }
  }
}

// ===================================================
// 8. MENÚ PRINCIPAL
// ===================================================
const textoMenu =
  "=== MENÚ DEL SIMULADOR ===\n" +
  "1 - Ver catálogo completo\n" +
  "2 - Buscar un producto por ID\n" +
  "3 - Ver productos disponibles según mi presupuesto\n" +
  "4 - Ver productos agotados\n" +
  "5 - Ver lista de precios con IVA\n" +
  "6 - Ver valor total del inventario\n" +
  "7 - Comprar un producto\n" +
  "0 - Salir";

// ENTRADA: pide la opción del menú (si el usuario cancela, se interpreta como salir)
function pedirOpcion(menu) {
  const entrada = prompt(menu);

  if (entrada === null) {
    return "0";
  }
  return entrada.trim();
}

// ===================================================
// 9. FLUJO PRINCIPAL DEL SIMULADOR
// ===================================================
console.log("=== Bienvenido al sistema de stock ===");

let opcion = pedirOpcion(textoMenu);

// Ciclo del menú: se repite hasta que el usuario elige salir
while (opcion !== "0") {
  switch (opcion) {
    case "1":
      verCatalogo(productosEnStock);
      break;
    case "2":
      buscarProductoPorId(productosEnStock);
      break;
    case "3":
      verDisponiblesPorPrecio(productosEnStock);
      break;
    case "4":
      verAgotados(productosEnStock);
      break;
    case "5":
      verListaDePrecios(productosEnStock);
      break;
    case "6":
      verValorInventario(productosEnStock);
      break;
    case "7":
      comprarProducto(productosEnStock);
      break;
    default:
      mostrarMensaje("Opción inválida. Elegí un número del menú.");
  }

  opcion = pedirOpcion(textoMenu);
}

// Verificación final: el catálogo refleja los cambios de stock hechos durante la sesión
mostrarMensaje("Gracias por usar el simulador de stock. ¡Hasta pronto!");
console.log("--- Estado final del catálogo ---");
console.table(productosEnStock);
