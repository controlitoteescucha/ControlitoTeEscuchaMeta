import { addKeyword, EVENTS } from '@builderbot/bot'

import { altaPrioridadFlow } from './altaPrioridadFlow';
import { listadoMorososFlow } from './listadoMorosos';
import { mantenimientoPreventivoFlow } from './mantenimientoPreventivo';
import { pqrsFlow } from './PQRS';
import { flujoPedidoInsumosAdministrador } from './solicitudInsumos';


const menuAdministradorOpciones = `🤖 ¿Cómo quieres que te ayude?

1️⃣ 🛠️ Reporte de mantenimiento preventivo
2️⃣ 📣 PQRS Controlito te escucha
3️⃣ 📦 Solicitud de suministros
4️⃣ 🚨 Instrucción de prioridad alta
5️⃣ 📋 Listado (PDF) personas en mora
0️⃣ ❌ Salir

💬 Responde con el número de la opción que deseas. 😊`;

export const menuAdministrador = addKeyword(EVENTS.ACTION)
    .addAnswer(menuAdministradorOpciones, 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const opciones = ["1", "2", "3", "4" , "5" ,"0"];
            if (!opciones.includes(ctx.body)) {
                return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
            }
            if (ctx.body === "0") {
                return ctxFn.endFlow("👋 ¡Gracias por usar el servicio! Hasta luego.");
            }
        }, 
        [ mantenimientoPreventivoFlow, pqrsFlow, flujoPedidoInsumosAdministrador, altaPrioridadFlow, listadoMorososFlow ]
    );