type GlobalState = {
    encendido?: boolean;
    convOff?: Record<string, string>;
};

type CtxFn = {
    globalState: {
        getMyState: () => Promise<GlobalState>;
        update: (state: GlobalState) => Promise<void>;
    };
    flowDynamic: (message: string) => Promise<void>;
};

export const menuConjuntos = 
`🏘️ ¿Desde qué conjunto residencial nos estás escribiendo?

1. *Balcones de Gratamira*
2. *Buganviles*
3. *Centauros A*
4. *Emaús*
5. *Mi Finca en el Llano*
6. *Montearroyo*
7. *Nueva Esperanza 2*
8. *Parques de Castillas*
9. *Quintas de Morelia*
10. *Quintas de San Souuci*
11. *Santamaria 2*
12. *Senderos 1*
13. *Torres de Mediterraneo*
14. *Torres de San Juan*

💬 Responde con el número correspondiente. 😊`;

export const conjuntos = [
    { '1': 'Balcones de Gratamira' },
    { '2': 'Buganviles' },
    { '3': 'Centauros A' },
    { '4': 'Emaús' },
    { '5': 'Mi Finca en el Llano' },
    { '6': 'Montearroyo' },
    { '7': 'Nueva Esperanza 2' },
    { '8': 'Parques de Castillas' },
    { '9': 'Quintas de Morelia' },
    { '10': 'Quintas de San Souuci' },
    { '11': 'Santamaria 2' },
    { '12': 'Senderos 1' },
    { '13': 'Torres de Mediterraneo' },
    { '14': 'Torres de San Juan' }
];

export const arregloNumeros = [
    { nombre: "Frank Rojas", numero: "573192578670", rol: "Supervisor" },
    { nombre: "Jaivert Matias", numero: "573187140247", rol: "Supervisor" },
    { nombre: "Mayra Balladales", numero: "573106781958", rol: "Supervisor" },
    { nombre: "Michael Andres Caliman", numero: "573112192786", rol: "Supervisor" },
    { conjunto: "Balcones de gratamira", nombre: "Olga Gutierrez", numero: "573112397741", rol: "Administrador" },
    { conjunto: "Balcones de gratamira", nombre: "Elkin Dario Torres Calderon", numero: "573214616922", rol: "Todero" },
    { conjunto: "Quintas de morelia", nombre: "Yenni Rocio Yace Arias", numero: "573202755027", rol: "Administrador" },
    { conjunto: "Quintas de morelia", nombre: "Orlando Asprilla", numero: "573102215009", rol: "Todero" },
    { conjunto: "Quintas de morelia", nombre: "David Sebastian Poblador Ramos", numero: "573044116818", rol: "Todero" },
    { conjunto: "Quintas de morelia", nombre: "Luis Angel Ballesteros Molano", numero: "573208866985", rol: "Salvavidas" },
    { conjunto: "Parques de castilla", nombre: "Carmen Eugenia Benito Bermudez", numero: "573046647834", rol: "Administrador" },
    { conjunto: "Parques de castilla", nombre: "Fernando Camargo Bedoya", numero: "573213327155", rol: "Todero" },
    { conjunto: "Buganviles", nombre: "Glacidia Vasquez Quijano", numero: "573203085992", rol: "Administrador" },
    { conjunto: "Buganviles", nombre: "Jhon Ospina", numero: "573227140147", rol: "Todero" },
    { conjunto: "Sansoucci", nombre: "Camilo Vega", numero: "573112298950", rol: "Administrador" },
    { conjunto: "Sansoucci", nombre: "Jhon Ospina", numero: "573227140147", rol: "Todero" },
    { conjunto: "Nueva esperanza ii", nombre: "Oscar Miguel Vigoya Rodrigue", numero: "573222518567", rol: "Administrador" },
    { conjunto: "Nueva esperanza ii", nombre: "Edicson Alexander Valeriano Sanchez", numero: "573219619405", rol: "Todero-salvavidas" },
    { conjunto: "Nueva esperanza ii", nombre: "German Rodriguez Babativa Gomez", numero: "573209789304", rol: "Todero" },
    { conjunto: "Torres de san juan", nombre: "Carmen Julia Amaya", numero: "573144603942", rol: "Administrador" },
    { conjunto: "Torres de san juan", nombre: "Elena Maria Babativa Gomez", numero: "573219791545", rol: "Operaria aseo" },
    { conjunto: "Torres de san juan", nombre: "Luis Esteban Diaz Alejo", numero: "573206185156", rol: "Salvavidas" },
    { conjunto: "Torres de san juan", nombre: "Juan Alberto Montañez Leguizamo", numero: "573222957838", rol: "Todero" },
    { conjunto: "Torres de san juan", nombre: "Carmen Cecilia Moreno Benitez", numero: "573204408817", rol: "ServiciosGenerales" },
    { conjunto: "Torres de san juan", nombre: "Nestor Herrera Medina", numero: "573227291260", rol: "Todero" },
    { conjunto: "Torres de san juan", nombre: "Jhon Sebastian Hernadez Bernal", numero: "573132009566", rol: "Todero" },
    { conjunto: "Montearroyo reservado", nombre: "Hever Martinez", numero: "573106455233", rol: "Administrador" },
    { conjunto: "Montearroyo reservado", nombre: "Ingrid Pureza Gutierrez Rodriguez", numero: "573108036180", rol: "Operaria aseo" },
    { conjunto: "Montearroyo reservado", nombre: "Noe Niño Quintero", numero: "573003707553", rol: "Todero" },
    { conjunto: "Montearroyo reservado", nombre: "Rubby Idalith Duran Rivera", numero: "573204133729", rol: "ServiciosGenerales" },
    { conjunto: "Montearroyo reservado", nombre: "Oscar Fabian Apache Forero", numero: "573207704524", rol: "Todero" },
    { conjunto: "Montearroyo reservado", nombre: "Carlos Alberto Paez Valdez", numero: "573208934355", rol: "Salvavidas" },
    { conjunto: "Centauros a", nombre: "Olga Lucia Castañeda", numero: "573202336479", rol: "Administrador" },
    { conjunto: "Centauros a", nombre: "Claudia Banquet Acosta", numero: "573224368528", rol: "ServiciosGenerales" },
    { conjunto: "Centauros a", nombre: "Ferley Antonio Hernandez Hernandez", numero: "573224745516", rol: "Asistente tecnico" },
    { conjunto: "Centauros a", nombre: "Stella Ortega Valencia", numero: "573215428265", rol: "Operaria de aseo" },
    { conjunto: "Balcones de emaus", nombre: "Dulys Guzman Bonilla", numero: "573114923689", rol: "Administrador" },
    { conjunto: "Balcones de emaus", nombre: "Luz Elbira Parrado", numero: "573105840363", rol: "Operaria aseo" },
    { conjunto: "Mi finca en el llano", nombre: "Constanza", numero: "573504500392", rol: "Administrador" },
    { conjunto: "Mi finca en el llano", nombre: "Jairo Roldan Endo", numero: "57322290727", rol: "Todero" },
    { conjunto: "Mi finca en el llano", nombre: "Cristian Camilo Rocha Diaz", numero: "573245613787", rol: "Todero" },
    { conjunto: "Mi finca en el llano", nombre: "Yoan Alfonso Lizcano Lozada", numero: "573024481429", rol: "Todero" },
    { conjunto: "Mi finca en el llano", nombre: "Fredy Ruiz Perdomo", numero: "573232464390", rol: "Todero" },
    { conjunto: "Mi finca en el llano", nombre: "Juan David Tinjaca Capera", numero: "573124326437", rol: "Todero" },
    { conjunto: "Mi finca en el llano", nombre: "Victor Daniel Bustamante Espid", numero: "573178037509", rol: "Todero" },
    { conjunto: "Mi finca en el llano", nombre: "Luis Felipe Hernandez Hernandez", numero: "573147961931", rol: "Todero" },
    { conjunto: "Mi finca en el llano", nombre: "Jorge Luis Cubillos Capera", numero: "573042794224", rol: "Todero" },
    { conjunto: "Mi finca en el llano", nombre: "Flor Marina Capera Hernandez", numero: "573208500101", rol: "Operaria aseo" },
    { conjunto: "Mi finca en el llano", nombre: "Blanca Yanet Castañeda Dueñas", numero: "573166768772", rol: "Operaria aseo" },
    { conjunto: "Mi finca en el llano", nombre: "Erika Edith Lopez Marquez", numero: "573238974631", rol: "Salvavidas" },
    { conjunto: "Mi finca en el llano", nombre: "Yeny Paola Neque", numero: "573102907702", rol: "Salvavidas" },
    { conjunto: "Mi finca en el llano", nombre: "Jakeline Suarez Bravo", numero: "573102784768", rol: "Salvavidas" },
    { conjunto: "Santamaria 2", nombre: "Edicson Valeriano", numero: "573219619405", rol: "Todero" },
    { conjunto: "Santamaria 2", nombre: "Harlem", numero: "573238032305", rol: "Todero" },
    { conjunto: "Santamaria 2", nombre: "Jennifer", numero: "573203077431", rol: "Operaria aseo" },
    { conjunto: "Santamaria 2", nombre: "Sebastian Rozo", numero: "573108879485", rol: "Salvavidas" },
    { conjunto: "Senderos 1", nombre: "David Mahecha", numero: "573024105440", rol: "Todero" },
  ];

export function getFormattedTime() {
    const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

// Verificar si el bot global está activo
export const isActive = async (_, { globalState }) => {
    // Obtener el estado actual de 'encendido' desde el estado global
    const encendido = await globalState.get('encendido');

    // Si 'encendido' no está definido, inicializarlo como `true` (por defecto)
    if (encendido === undefined) {
        await globalState.update({ encendido: true }); // Establecer el valor predeterminado
        return true; // Devolver `true` porque el bot está encendido por defecto
    }

    // Devolver el valor actual de 'encendido'
    return encendido;
};


// Verificar si una conversación está activa
export const isConvActive = async (number: string, { globalState }): Promise<boolean> => {
    // Obtener el estado de conversaciones desactivadas desde el estado global
    const convOff = await globalState.get('convOff') || {};

    // Verificar si el número está en el objeto convOff
    if (convOff[number]) {
        const deactivationDate = new Date(convOff[number]); // Fecha de desactivación
        const currentDate = new Date(); // Fecha actual
        const hoursDiff = (currentDate.getTime() - deactivationDate.getTime()) / (1000 * 60 * 60); // Diferencia en horas

        // Si han pasado más de 48 horas, la conversación se reactiva
        return hoursDiff >= 48;
    }

    // Si el número no está en convOff, la conversación está activa
    return true;
};

// Activar / Desactivar conversación
export const toggleActive = async (number: string, ctxFn: CtxFn): Promise<boolean> => {
    const currentGlobalState = await ctxFn.globalState.getMyState();
    const convOff = currentGlobalState.convOff ?? {};
    const isActive = await isConvActive(number, ctxFn);

    if (isActive) {
        // Si está activa, desactivarla
        convOff[number] = new Date().toISOString(); // Guardar la fecha actual en formato ISO
        await ctxFn.flowDynamic("Conversación desactivada.");
    } else {
        // Si está desactivada, activarla
        delete convOff[number]; // Remover el número de convOff
        await ctxFn.flowDynamic("Conversación reactivada.");
    }

    // Actualizar el estado global con el nuevo convOff
    currentGlobalState.convOff = convOff;
    await ctxFn.globalState.update(currentGlobalState);

    return !isActive; // Devolver el nuevo estado
};

// Listar conversaciones desactivadas
export const conversationsOff = async (ctxFn: CtxFn): Promise<[string, string][]> => {
    const currentGlobalState = await ctxFn.globalState.getMyState();
    const convOff = currentGlobalState.convOff ?? {};
    const result: [string, string][] = [];

    for (const number in convOff) {
        if (Object.prototype.hasOwnProperty.call(convOff, number)) {
            const deactivationDate = new Date(convOff[number]);
            const currentDate = new Date();
            const timeDiff = 48 * 60 * 60 * 1000 - (currentDate.getTime() - deactivationDate.getTime()); // Tiempo restante en ms

            if (timeDiff > 0) {
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                result.push([number, `Tiempo restante para reactivarse - ${hours}hs ${minutes}minutos`]);
            } else {
                // El tiempo ya ha pasado, lo removemos
                delete convOff[number];
            }
        }
    }

    // Actualizar el estado global si hemos removido números desactivados
    currentGlobalState.convOff = convOff;
    await ctxFn.globalState.update(currentGlobalState);

    return result;
};


export const definirConjunto = (conjuntos, input) => {
    // Convertir el input a entero y calcular el índice
    const conjuntoIndex = parseInt(input) - 1;

    // Validar si el índice está dentro del rango del arreglo
    if (conjuntoIndex >= 0 && conjuntoIndex < conjuntos.length) {
        // Acceder al valor correspondiente
        return conjuntos[conjuntoIndex][input];
    } else {
        // Si el índice está fuera de rango, manejar el error
        return "El conjunto no existe o el input es inválido.";
    }
};

export function obtenerNombreYRolYConjunto(
    arreglo: { numero: string; nombre: string; rol: string; conjunto?: string }[],
    numero: string
): { nombre: string; rol: string; conjunto?: string } {
    // Buscar el objeto en el arreglo
    const encontrado = arreglo.find(objeto => objeto.numero === numero);

    // Si no se encuentra, retornar el rol de "Cliente" y conjunto vacío
    if (!encontrado) {
        return { nombre: '', rol: 'Cliente', conjunto: '' };
    }

    // Verificar si el rol es uno de los casos especiales
    if (encontrado.rol.includes('Todero') && encontrado.rol.includes('Salvavidas')) {
        // Obtener el día de la semana (0 = Domingo, 6 = Sábado)
        const diaDeLaSemana = new Date().getDay();

        // Determinar si es fin de semana (Sábado o Domingo)
        const esFinDeSemana = diaDeLaSemana === 0 || diaDeLaSemana === 6;

        // Asignar el rol según el día
        if (esFinDeSemana) {
            return { 
                nombre: encontrado.nombre, 
                rol: 'Salvavidas', 
                conjunto: encontrado.conjunto 
            };
        } else {
            return { 
                nombre: encontrado.nombre, 
                rol: 'Todero', 
                conjunto: encontrado.conjunto 
            };
        }
    }

    // Si el rol es "Supervisor", no devolver el conjunto
    if (encontrado.rol === 'Supervisor') {
        return { 
            nombre: encontrado.nombre, 
            rol: encontrado.rol 
        };
    }

    // Si no es un caso especial, retornar el rol y conjunto normal
    return { 
        nombre: encontrado.nombre, 
        rol: encontrado.rol, 
        conjunto: encontrado.conjunto 
    };
}

const utils = { 
    isActive, 
    isConvActive, 
    toggleActive,
    conversationsOff, 
    definirConjunto,
};

export default utils;