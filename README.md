# Simulador de Ventas - Validador de Stock

Simulador en JavaScript para un negocio de indumentaria deportiva. Es la **Pre-Entrega 6 (Funciones de orden superior)**: el catálogo es un array de objetos creados con la clase `Producto`, y un menú interactivo le permite al usuario consultar y operar sobre ese catálogo usando `forEach`, `find`, `filter`, `some`, `map` y `reduce`. Continúa el mismo simulador de las pre-entregas anteriores (ciclos, funciones, arrays y clase).

## Estructura del repositorio
```
preentrega6-coder/
├── index.html    # enlaza el script en el <head> con defer
├── README.md     # este archivo
└── js/
    └── main.js   # la clase Producto, el array de objetos y toda la lógica del simulador
```

## Cómo ejecutarlo
1. Descargá o cloná el repositorio.
2. Abrí `index.html` con doble clic (se abre en el navegador, no hace falta instalar nada).
3. Abrí la consola del navegador con **F12 → pestaña Console**.
4. Aparece un menú en un cuadro emergente: escribí el número de la opción y aceptá. Por ejemplo:
   - `1` para ver el catálogo.
   - `2` y luego un ID (por ejemplo `3`) para buscar un producto.
   - `3` y luego un presupuesto (por ejemplo `20000`) para ver qué hay disponible.
   - `7`, un ID y una cantidad para comprar.
   - `0` para salir.
5. Los resultados se muestran en la consola y en cuadros emergentes.

## Menú y funciones de orden superior
Cada opción del menú usa un método con un propósito concreto, no hay métodos asignados sin sentido.

| Opción | Qué hace | Método | Función en `js/main.js` |
|---|---|---|---|
| 1 | Ver el catálogo completo | `forEach` | `listarStock()` |
| 2 | Buscar un producto por ID | `find` | `buscarPorId()` |
| 3 | Ver productos disponibles dentro de un presupuesto | `filter` | `filtrarDisponiblesHastaPrecio()` |
| 4 | Ver si hay productos agotados y cuáles son | `some`, `filter` y `map` | `hayAgotados()`, `obtenerAgotados()` |
| 5 | Ver la lista de precios con IVA | `map` | `crearListaDePrecios()` |
| 6 | Ver el valor total del inventario | `reduce` | `calcularValorInventario()` |
| 7 | Comprar un producto | `find` + ciclo de ventas | `comprarProducto()` |

## Criterios de la consigna y dónde se cumplen
| Criterio de la rúbrica | Dónde está |
|---|---|
| Entrega correcta (15%) | `index.html` en la raíz y `main.js` dentro de `js/`, enlazado en el `head` con `defer` |
| Array de objetos (25%) | `productosEnStock`: 6 instancias de `class Producto` (`id`, `nombre`, `precio` y `stock`) |
| Métodos de búsqueda, mínimo 2 (25%) | `forEach`, `find`, `filter` y `some` (opciones 1, 2, 3, 4 y 7) |
| Método de transformación, mínimo 1 (25%) | `map` (opciones 4 y 5 y listado del prompt) y `reduce` (opción 6) |
| Interacción (10%) | Menú con `prompt` dentro de un `while` con `switch`; cada opción se ejecuta según lo que pide el usuario, y la compra reutiliza el ciclo de ventas de la Pre-Entrega 5 |

## Validaciones y casos borde
Los datos que llegan desde `prompt` se comprueban con funciones reutilizables (`esEnteroPositivo()` y `esNumeroPositivo()`), y la clase `Producto` se protege sola: no depende de que el menú valide antes.

| Caso | Resultado |
|---|---|
| `vender(0)`, `vender(-3)` o `vender(2.5)` | Devuelve `false` y el stock no cambia (nunca queda negativo ni decimal) |
| `vender()` con más unidades de las que hay | Devuelve `false` y el stock no cambia |
| `aplicarDescuento(150)`, `aplicarDescuento(-10)`, `aplicarDescuento(0)` o `aplicarDescuento(100)` | El precio no cambia (solo se aplican porcentajes entre 0 y 100, sin incluirlos) |
| ID vacío, texto o negativo en las opciones 2 y 7 | Mensaje "ID inválido" |
| ID que no existe | Mensaje "No existe un producto con el ID ..." |
| Comprar un producto agotado | Mensaje "... está agotado" |
| Cantidad 0, negativa, decimal o texto al comprar | Mensaje "Entrada inválida" |
| Presupuesto vacío, texto, 0 o negativo en la opción 3 | Mensaje "Presupuesto inválido" |
| Cancelar el menú | Se interpreta como salir |

## Ejemplo de salida en la consola
Extracto de una sesión: ver catálogo (opción 1), buscar el ID 3 (opción 2), presupuesto de `20000` (opción 3), agotados (opción 4), valor del inventario (opción 6) y salir.

```
=== Bienvenido al sistema de stock ===
--- Catálogo ---
Producto #1: Zapatillas Running | Precio: $85000 (con IVA: $102850) | Stock: 10 unidades
...
Producto #6: Botella Térmica | Precio: $9000 (con IVA: $10890) | Stock: 0 unidades
Total: 6 productos
Producto #3: Short Deportivo | Precio: $18000 (con IVA: $21780) | Stock: 12 unidades
Encontré: Short Deportivo (stock: 12 unidades).
--- Disponibles hasta $20000 (IVA incluido) ---
Producto #4: Medias | Precio: $6000 (con IVA: $7260) | Stock: 30 unidades
Productos agotados: Botella Térmica.
Valor total del inventario: $1856000 (precios sin IVA).
Gracias por usar el simulador de stock. ¡Hasta pronto!
--- Estado final del catálogo ---
```
