import * as dotenv from 'dotenv'
import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowDirector } from './flows/director/flowDirector'
import { menuTodero } from './flows/todero/menuTodero'
import { menuCliente } from './flows/cliente/menuCliente'
import { menuAdministrador } from './flows/administrador/menuAdmi'
import { menuServiciosGenerales } from './flows/servicios-generales/menuServiciosGenerales'
import { menuSalvavidas } from './flows/salvavidas/menuSalvavidas'
import { menuSupervisor } from './flows/supervisor/menuSupervisor'
import { arregloNumeros, isActive, obtenerNombreYRolYConjunto } from 'scripts/utils'

dotenv.config()

const PORT = process.env.PORT ?? 3008

const bienvenida = `¡Hola! Soy Controlito, tu asistente virtual de Control S.A.S.. 
Estoy aquí para ayudarte con lo que necesites, siempre dispuesto a escucharte. 🌟`;


const flowPrincipal = addKeyword(EVENTS.ACTION)
    .addAnswer(bienvenida, {
        media: 'https://github.com/GabrielMalpicaC/ControlitoTeEscucha/blob/main/imgs/controlito.jpg?raw=true'
    }, async (ctx, ctxFn) => {

        const persona = obtenerNombreYRolYConjunto(arregloNumeros, ctx.from);
        await ctxFn.state.update({ nombreCompleto: persona.nombre, rol: persona.rol, conjunto: persona.conjunto });
        const userInfo = ctxFn.state.getMyState();
        await ctxFn.flowDynamic(`Hola *${userInfo.nombreCompleto}*\nEstas en el menú de *${userInfo.rol.toUpperCase()}*`);

        const rolesFlujos = {
            'Administrador': menuAdministrador,
            'Supervisor': menuSupervisor,
            'Todero': menuTodero,
            'ServiciosGenerales': menuServiciosGenerales,
            'Salvavidas': menuSalvavidas,
            'Cliente': menuCliente,
        };

        const flujo = rolesFlujos[persona.rol] || rolesFlujos['Cliente'];

        return ctxFn.gotoFlow(flujo);
    });

    const flowRouter = addKeyword(EVENTS.WELCOME).addAction(async (ctx, ctxFn) => {
        const isUserActive = await isActive(ctx, ctxFn)
    
        if (!isUserActive) {
            console.log('Usuario no activo, finalizando flujo.')
            return ctxFn.endFlow()
        }
        return ctxFn.gotoFlow(flowPrincipal)
    })


const main = async () => {
    const adapterFlow = createFlow([
        flowRouter,
        flowDirector,
        flowPrincipal,
        menuTodero,
        menuCliente,
        menuAdministrador,
        menuServiciosGenerales,
        menuSalvavidas,
        menuSupervisor,
    ])

    const adapterProvider = createProvider(Provider, {
        jwtToken: process.env.jwtToken,
        numberId: process.env.numberId,
        verifyToken: process.env.verifyToken,
        version: 'v22.0'
    })
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    httpServer(+PORT)
}

main()
