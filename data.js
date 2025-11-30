// data.js
// Projects array. To add a project, append an object with the following fields:
//  - img: path to thumbnail image (optimize size, e.g., 400–800px wide)
//  - video: path to the video file (mp4/webm). Use consistent relative paths.
//  - volume: OPTIONAL per-clip volume (0.0..1.0). Use this to normalize loud clips.
//  - title: project title
//  - desc: short description
//  - tags: array of string tags for filtering/navigation
// Example:
// {
//   img: "img/thumb1.png",
//   video: "videos/clip1.mp4",
//   volume: 0.8,
//   title: "Mi Proyecto",
//   desc: "Breve nota",
//   tags: ["color","instalacion"]
// }

const projects = [
  {
    img: "img/colectivo_5.png",
    video: "video/video47.mp4",
    /*volume: 0.5,*/
    title: "Signal flesh",
    artist: "Felipe Aguero, Valentina Amado Stoecklin, Miranda Ranne y Paloma Pisaco",
    desc: "Página web interactiva que traduce tu foto en código binario y luego a onda sonora",
    roomTag: "colectivo",
    tags: ["interfaz experimental", "código web", "arte sonoro"]
  },
  {
    img: "img/colectivo_35.png",
    video: "video/video35.mp4",
    /*volume: 0.5,*/
    title: "Habita en mí",
    artist: "Paula Corominas, Milena O'Connor, Candelaria Cruz, Lara Busalacchi y Tadeo Sbert",
    desc: "Cuando una hija es asesinada, la madre se vuelve el lugar donde esa vida persiste. Su cuerpo se transforma en lucha y archivo. El duelo no busca superación sino una forma de habitar el mundo cargando lo que ya no tiene otro sitio. El cuerpo materno resiste al olvido y convierte la ausencia en acción",
    roomTag: "colectivo",
    tags: ["instalación", "documental", "archivo"]
  },
  {
    img: "img/colectivo_36.png",
    video: "video/video36.mp4",
    /*volume: 0.5,*/
    title: "Sacrificio",
    artist: "Nicolás Godoy, Lucas Martínez y Pedro Fernández",
    desc: "¿Qué es el sacrificio? Ofrenda del cuerpo, del alma, del trabajo. No es la matanza, sino la entrega para liberarse.  No se encuentra en la sangre, es el esfuerzo nuestro desyugo",
    roomTag: "colectivo",
    tags: ["instalación", "documental", "escultura"]
  },
  {
    img: "img/colectivo_37.png",
    video: "video/video37.mp4",
    /*volume: 0.5,*/
    title: "Conan",
    artist: "Renata Trombetta, Federica Vallone, Justina Vricella Ricci, Catalina Saenz y Lucio Soruco",
    desc: "Hay algo oculto y a la vez expuesto en nuestra realidad política que lleva a cuestionarnos sobre esta configuración que alguna vez osamos aceptar.  Nos preguntamos ¿quién toma las decisiones por nosotros? A modo de respuesta ahondamos en la fantasía incómoda que determina el rumbo de la Argentina",
    roomTag: "colectivo",
    tags: ["instalación", "ficción", "interfaz experimental"]
  },
  {
    img: "img/colectivo_38.png",
    video: "video/video38.mp4",
    /*volume: 0.5,*/
    title: "Aluda",
    artist: "Martina Montes Cató, Sofia Lage Puerta, Mailen Gonzalez Venazco y GianFranco Turcin",
    desc: "Un allanamiento producido en el domicilio de una jóven a partir de la persecución política que viven muchos activistas sociales. Se retrata la sensación de vulnerabilidad, violencia policial, miedo, amedrentamiento e incertidumbre",
    roomTag: "colectivo",
    tags: ["instalación", "diseño generativo", "electrónica"]
  },
  {
    img: "img/colectivo_39.png",
    video: "video/video39.mp4",
    /*volume: 0.5,*/
    title: "Verdad en Frecuencia",
    artist: "Valentina Andreani, Lucas Soto, Benjamín Such, Malena Pablos y Rocío Pellegrino",
    desc: "Instalación interactiva que cuestiona la pasividad histórica con los relatos de los veteranos de la Guerra de Malvinas, resguardando su historia y exponiendo su verdad a través de objetos de la época: una TV de época y una máquina de escribir",
    roomTag: "colectivo",
    tags: ["instalación", "documental", "interfaz experimental"]
  },
  {
    img: "img/colectivo_40.png",
    video: "video/video40.mp4",
    /*volume: 0.5,*/
    title: "Requiem por la privacía",
    artist: "Eva Moro Cafiero, Sofia Victoria Grimoldi, Laila Mohamed Devoto y Pedro Agustín Pérez",
    desc: "Los dispositivos de vigilancia nos rodean, y hemos hecho de ellos un elemento más de nuestra cotidianeidad. Nos preguntamos entonces; ¿en qué momento realmente estamos en libertad si nos sabemos siempre observados? ¿hemos encontrado comodidad viviendo ante estos ojos?",
    roomTag: "colectivo",
    tags: ["instalación", "control", "sensores"]
  },
  {
    img: "img/colectivo_19.png",
    video: "video/video19.mp4",
    /*volume: 0.1,*/
    title: "Habitar",
    artist: "Florencia Moreno y Lola Quinteros",
    desc: "Habitar el dolor, habitar lo que no fue dado, habitar la falta. La obra propone registrar cómo el cuerpo habita un dolor emocional, las reacciones físicas y cómo los objetos conservan lo no dicho. Un archivo del dolor donde permanecer junto a eso que duele se vuelve también una forma de transformación",
    roomTag: "colectivo",
    tags: ["instalación", "inmersivo", "ensayo"]
  },
  {
    img: "img/planetario_3.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "IN-MÓVILES",
    artist: "Elías Panessi, Bautista Schötz Ubeda y Candela Stagnaro",
    desc: "Tres seres de yeso generan una conexión a través del uso de dispositivos móviles. Una abuela solitaria que intenta mantener el contacto con sus familiares, un hombre de mediana edad que busca conocer a alguien a través de una app de citas, y una niña obsesionada con los tutoriales de maquillaje",
    roomTag: "circo",
    tags: ["instalación", "ficción", "electrónica"]
  },
  {
    img: "img/circo_26.png",
    video: "video/video26.mp4",
    volume: 0.1,
    title: "Revolución de mayo",
    artist: "Benjamín Antonio Romero",
    desc: "Fragmentos del primer film argentino, La Revolución de Mayo (1909), se descomponen en un semicírculo de televisores. Los héroes cruzan de una pantalla a otra, mientras emergen los cuerpos borrados del relato —mujeres, afrodescendientes, pueblos originarios— como presencias espectrales",
    roomTag: "circo",
    tags: ["instalación", "dispositivos", "archivo"]
  },
  {
    img: "img/circo_27.png",
    video: "video/video27.mp4",
    /*volume: 0.5,*/
    title: "Private Cardozo",
    artist: "Iván Cardozo",
    desc: "Dentro de una caja negra donde la luz no entra emerge una imagen. Dentro de la imagen se decantan dos identidades. Dentro de las identidades no hay nada",
    roomTag: "circo",
    tags: ["instalación", "dispositivos", "loop"]
  },
  {
    img: "img/circo_28.png",
    video: "video/video28.mp4",
    /*volume: 0.5,*/
    title: "Cabezas y Ombligos",
    artist: "Ivana Kairiyama y Cecilia Navarra",
    desc: "El ombligo es la parte más única de nuestro cuerpo, tanto morfológica como microbióticamente. En él conviven lo íntimo y lo común, lo singular y lo compartido. Lo que parece propio se disuelve en lo colectivo. La individualidad absoluta es una ficción",
    roomTag: "circo",
    tags: ["instalación", "archivo", "cuerpo"]
  },
  {
    img: "img/circo_29.png",
    video: "video/video29.mp4",
    volume: 0.1,
    title: "Retrato Negatoscópico",
    artist: "Inés Emery",
    desc: "Retrato Negatoscópico es un retrato familiar que se apoya en la yuxtaposición entre el universo clínico y fotográfico en el que residía mi abuelo médico, a través de radiografías intervenidas con imágenes que él tomó de mi abuela",
    roomTag: "circo",
    tags: ["instalación", "familia", "archivo"]
  },
  {
    img: "img/circo_30.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Sehnsucht",
    artist: "Azul Varela, Julian Novarro, Paula Bonsera, Camila Azevedo y Valentin Herman",
    desc: "Norma, la cuidadora de la casa del difunto Jochen Wenzel, te pide que la cuides mientras se ausenta. Al entrar, descubrís una habitación llena de acertijos creados especialmente para vos. Cada pista te da acceso a archivos audiovisuales que revelan la historia de esta familia",
    roomTag: "circo",
    tags: ["multicanal", "archivo", "interactivo"]
  },
  {
    img: "img/circo_31.png",
    video: "video/video31.mp4",
    /*volume: 0.5,*/
    title: "Quiero verte en el cielo",
    artist: "Florencia Gold",
    desc: "Una instalación sobre el deseo de reencontrarse con un fantasma. Surge de un regalo póstumo: antes de ser fantasmas, mis abuelos compraron una película de 16mm y nunca la filmaron. Yo la encontré demasiado tarde y, por su antigüedad, las imágenes que filmé en esa película desaparecieron",
    roomTag: "circo",
    tags: ["archivo", "familia", "loop"]
  },
  {
    img: "img/circo_32.png",
    video: "video/video32.mp4",
    volume: 0.1,
    title: "Atte. tus vecinos",
    artist: "Mia Cabello Alberti, Ariana Sangiuliano y Francisca Graf",
    desc: "En una Buenos Aires enrarecida se hace una radiografía de cada universo particular de los inquilinos, que se oculta detrás de los muros, y así atravesar cada fachada que reviste las singularidades más íntimas de los personajes",
    roomTag: "circo",
    tags: ["escucha expandida", "no lineal", "3D"]
  },
  {
    img: "img/circo_33.png",
    video: "video/video33.mp4",
    /*volume: 0.5,*/
    title: ".micra",
    artist: "Florencia Pappalardo, Francesca Palermo y Romina Cacace",
    desc: "Desde un planeta lejano un grupo de seres observa la Tierra. Fascinados por su belleza, recrean en su propio mundo las formas de vida que contemplan a la distancia",
    roomTag: "circo",
    tags: ["animación", "ficción", "3D"]
  },
  {
    img: "img/tecnico_41.png",
    video: "video/video41.mp4",
    /*volume: 0.5,*/
    title: "La resistencia de los sentidos",
    artist: "Lucía Valencia",
    desc: "Un organismo habita en la pecera central, inspirado en la vida submarina, oscura y sensible: donde el sonido guía, comunica y sostiene la existencia. Pero ese equilibrio es interrumpido por una vibración externa, mecánica e industrial, que lo atraviesa constantemente y lo obliga a resistir",
    roomTag: "tecnico",
    tags: ["inmersivo", "bioarte", "escucha expandida"]
  },
  {
    img: "img/tecnico_42.png",
    video: "video/video42.mp4",
    /*volume: 0.5,*/
    title: "Gravedad y la fuerza visible: Poéticas del esfuerzo en el pole sport.",
    artist: "Oriana Ciraci",
    desc: "El proyecto explora la fuerza, la resistencia y la memoria corporal a través del Pole Sport como práctica física y estética",
    roomTag: "tecnico",
    tags: ["ensayo", "cuerpo", "performance"]
  },
  {
    img: "img/taller_43.jpg",
    video: "video/video43.mp4",
    /*volume: 0.5,*/
    title: "Cuando Estaba",
    artist: "Guido Vanney",
    desc: "Un cuerpo se proyecta sobre el humo: su imagen se fragmenta, se distorsiona y flota en el tiempo. Lo visible y lo no visible tiene relación en esta instalación con el recuerdo y el olvido. El humo como soporte en constante movimiento se vuelve espejo del acto de recordar",
    roomTag: "taller",
    tags: ["instalación", "no lineal", "inmersivo"]
  },
  {
    img: "img/planetario_1.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Presencia Impersonal",
    artist: "Matías Bertó",
    desc: "Una mirada entre lo humano y lo artificial. Una cabeza y un brazo mecánico suspendidos  proyectan, a través de un ojo digital, una secuencia animada en bucle. En ella, distintas formas de mirada se suceden y evocan la percepción y la ambigüedad de lo que observa en espacios de tránsito",
    roomTag: "planetario",
    tags: ["instalación", "animación", "electrónica"]
  },
  {
    img: "img/planetario_2.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Infierno en vida",
    artist: "Rocío Agrasar",
    desc: "INFIERNO EN VIDA trata del proceso de duelo que uno atraviesa al acompañar a una persona querida en sus últimos momentos de vida. Muestra ese lapso en el que comienza la destrucción de la permanencia del objeto y aceptamos que nuestro ser querido ya no está",
    roomTag: "planetario",
    tags: ["VR", "arte sonoro", "interactivo"]
  },
  {
    img: "img/planetario_3.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "IN-MÓVILES",
    artist: "Elías Panessi, Bautista Schötz Ubeda y Candela Stagnaro",
    desc: "Tres seres de yeso generan una conexión a través del uso de dispositivos móviles. Una abuela solitaria que intenta mantener el contacto con sus familiares, un hombre de mediana edad que busca conocer a alguien a través de una app de citas, y una niña obsesionada con los tutoriales de maquillaje",
    roomTag: "planetario",
    tags: ["instalación", "ficción", "electrónica"]
  },
  {
    img: "img/planetario_4.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Manifestación",
    artist: "Lucia Batac, Georgina Bertuccio, Alma Noguera, Melina Minichuk y Catalina Devoto",
    desc: "Este proyecto propone mirar a quienes miran: fotógrafos que registran las manifestaciones. Aislados del entorno; la luz, la ropa, el gesto, conservan la huella de su presencia. En cada imagen se revela la tensión entre mirar y ser mirado, entre registrar y resistir. La fotografía como gesto de lucha y memoria colectiva",
    roomTag: "planetario",
    tags: ["instalación", "documental", "archivo"]
  },
  {
    img: "img/planetario_5.png",
    video: "video/video5.mp4",
    /*volume: 0.5,*/
    title: "La caja de cristal",
    artist: "Renata Castillo, Guadalupe Diaz Herrera, Ivan Dvorsky y Guillermo Lasta",
    desc: "El mundo infinito al que todos pertenecemos. El encanto que viene en 9:16. Atrapado Él quedo, la red lo encerró. Sin embargo te ve a vos, y no se preocupa de más, sabe que están en el mismo lugar",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/planetario_6.png",
    video: "video/video6.mp4",
    /*volume: 0.5,*/
    title: "Partitura de Hormigas",
    artist: "Carlos A. Ramírez",
    desc: "Obra que convierte el movimiento en vivo de hormigas en música. A través de un sistema de seguimiento en tiempo real, sus trayectorias se traducen en señales que activan servomotores montados en una guitarra eléctrica. El resultado es una composición sonora generada por el azar y la naturaleza",
    roomTag: "planetario",
    tags: ["instalación", "bioarte", "sensores"]
  },
  {
    img: "img/planetario_7.png",
    video: "video/video7.mp4",
    /*volume: 0.5,*/
    title: "Chemise",
    artist: "Natalia Marcano",
    desc: "En Venezuela, rayarse la camisa al terminar el colegio es una tradición importante que se realiza en todo el país el último día de clases.  Muchos jóvenes que migraron no pudieron vivir este rito, quedando suspendidos entre dos tiempos. Este proyecto busca revivir la tradición a la distancia",
    roomTag: "planetario",
    tags: ["instalación", "documental", "archivo"]
  },
  {
    img: "img/planetario_8.png",
    video: "video/video8.mp4",
    /*volume: 0.5,*/
    title: "Caché Personal",
    artist: "Camila Polito",
    desc: "Instalación a dos pantallas que a partir de un crawling de datos accede a una base de archivos y genera un ID de la persona",
    roomTag: "planetario",
    tags: ["instalación", "no lineal", "visualización de datos"]
  },
  {
    img: "img/planetario_9.png",
    video: "video/video9.mp4",
    /*volume: 0.5,*/
    title: "Tierras raras, el desgaste de mirar",
    artist: "Ernesto Ismael Álvarez",
    desc: "Escultura cinética que revela el vínculo entre la extracción geológica (minerales críticos como litio o neodimio) y la extracción digital (datos y métricas de atención). A través de un sistema que transforma métricas digitales en movimientos mecánicos sobre una piedra",
    roomTag: "planetario",
    tags: ["instalación", "bioarte", "escultura"]
  },
  {
    img: "img/planetario_10.png",
    video: "video/video10.mp4",
    /*volume: 0.5,*/
    title: "El rumor",
    artist: "Hernán Rego Pacecca",
    desc: "El Rumor es un espacio postindustrial donde los vestigios se vuelven rito. A partir de instrumentos fabricados con llantas de auto, los visitantes pueden interactuar con los cuencos budo-proletarios activando la pieza",
    roomTag: "planetario",
    tags: ["instalación", "interactivo", "escucha expandida"]
  },
  {
    img: "img/planetario_11.png",
    video: "video/video11.mp4",
    /*volume: 0.5,*/
    title: "Vestigio",
    artist: "Leticia Nuñez, Amanda Arzeno, Ana Cura, Catalina ochoa y Marianela ochoa",
    desc: "Monocanal blanco y negro que revela un bosque incendiado: troncos carbonizados, suelo herido, últimos rastros del fuego. La cámara recorre ese paisaje destruido mientras la luz se desplaza entre los árboles descubriendo los cuerpos y su estado",
    roomTag: "planetario",
    tags: ["instalación", "documental", "escucha expandida"]
  },
  {
    img: "img/planetario_12.png",
    video: "video/video12.mp4",
    /*volume: 0.5,*/
    title: "Payé",
    artist: "Genaro González Cinto",
    desc: "Objetos que comienzan a moverse sin servir a nadie: ya no cumplen una función, ahora muestran comportamiento propio. Estos seres intentan escaparse de su destino de herramienta y ahora actúan con autonomía",
    roomTag: "planetario",
    tags: ["instalación", "ficción", "electrónica"]
  },
  {
    img: "img/planetario_14.png",
    video: "video/video14.mp4",
    /*volume: 0.5,*/
    title: "Ruptura",
    artist: "Josefina Rodriguez Petit",
    desc: "Un hogar comienza a quebrarse, y con él, los recuerdos de su protagonista. RUPTURA propone un viaje interactivo donde pequeños objetos y acciones simbólicas guían al jugador por la experiencia emocional de una infancia marcada por el desarraigo",
    roomTag: "planetario",
    tags: ["videojuego", "ficción", "interactivo"]
  },
  {
    img: "img/caldera_15.png",
    video: "video/video15.mp4",
    /*volume: 0.5,*/
    title: "www.pueblodevizcacheras.com.ar",
    artist: "Catalina Scorofitz",
    desc: "En 1998 Jorge Vega prendió su computadora y fundó un pueblo: Vizcacheras. Compiló en una página web su historia, un mapa y 25 cuentos que comparten una misma red de personajes y escenarios. Cuando falleció, la web se perdió. Todo fue recuperado, excepto el mapa",
    roomTag: "caldera",
    tags: ["instalación", "ficción", "archivo"]
  },
  {
    img: "img/tratajo_16.png",
    video: "video/video16.mp4",
    /*volume: 0.5,*/
    title: "Candilejas",
    artist: "Facundo Torga",
    desc: "Video-performance que ejecuta los mecanismos de la industria del espectáculo, el costo de la fama, y la presencia del artista en escena. La obra es interpretada por Normie Jean, una estrella en decadencia en el pico de su juventud",
    roomTag: "tratajo",
    tags: ["performance", "videoarte", "queerness"]
  },
  {
    img: "img/tapete_17.png",
    video: "video/video17.mp4",
    /*volume: 0.5,*/
    title: "Sinantropia",
    artist: "Tomas Salibe, Thomas Stange, Milena Robledo, Jhosten Guzman y Manuel Santamaria",
    desc: "Proyecto que explora el paisaje oculto de la zona abisal del mar, atravesada por cables de internet. Tanto el calor que emanan como la mínima presencia humana alteran el entorno y generan cambios en las especies",
    roomTag: "tapete",
    tags: ["instalación", "interactivo", "medio ambiente"]
  },
  {
    img: "img/tapete_18.png",
    video: "video/video18.mp4",
    /*volume: 0.5,*/
    title: "Fenotypicos",
    artist: "Nicolás Oliveto",
    desc: "Obra cinética que indaga la relación entre lo orgánico y lo artificial a través del movimiento de cables que se tensan en un ritmo constante. El concepto se inspira en la plasticidad fenotípica, entendida como la capacidad de un organismo para modificar su forma en función del entorno",
    roomTag: "tapete",
    tags: ["instalación", "ficción", "escultura"]
  },
  {
    img: "img/tapete_20.png",
    video: "video/video20.mp4",
    /*volume: 0.5,*/
    title: "Cruces",
    artist: "Gerónimo Bocalandro",
    desc: "Una imagen que promete sentido pero no existe sin entrega. CRUCES se activa al arrodillarse frente a una pantalla suspendida. Las escenas, realizadas con fotogrametría, reinterpretan el Vía Crucis y convierten el gesto corporal en la condición de aparición de la imagen",
    roomTag: "tapete",
    tags: ["instalación", "no lineal", "archivo"]
  },
  {
    img: "img/tapete_21.png",
    video: "video/video21.mp4",
    /*volume: 0.5,*/
    title: "Diáspora",
    artist: "Juan Ignacio Gonzalez",
    desc: "En un desierto habitado por seres errantes ocurre una invasión de drones que lanzan cabezas explosivas. El explorador podrá recorrerlo y acceder a artefactos de tecnología esotérica",
    roomTag: "tapete",
    tags: ["VR", "no lineal", "inmersivo"]
  },
  {
    img: "img/tapete_22.png",
    video: "video/video22.mp4",
    /*volume: 0.1,*/
    title: "5 altares de tierra y luz",
    artist: "Astrid Lavalle",
    desc: "Altar piramidal de adobe, escalonado y hueco, que integra materiales rituales y extractivos de América Latina. Una estructura simbólica que cruza territorio, memoria y energía, y que se enciende ante el tacto del observador",
    roomTag: "tapete",
    tags: ["instalación", "no lineal", "escultura"]
  },
  {
    img: "img/tapete_23.png",
    video: "video/video23.mp4",
    /*volume: 0.5,*/
    title: "Sinfonía de quiebres",
    artist: "Clara Grillo y Camila Bunchicoff",
    desc: "Utilizando un sistema interactivo de control físico, se presentará como una instalación performática por parte de las creadoras e interactiva para el espectador que activa fracturas visuales y sonoras sobre la imagen, desafiando la percepción de lo corporal",
    roomTag: "tapete",
    tags: ["instalación", "electrónica", "performance"]
  },
  {
    img: "img/tapete_24.png",
    video: "video/video24.mp4",
    /*volume: 0.5,*/
    title: "Loop obsolescente",
    artist: "Irina del Castillo",
    desc: "Cinco pantallas pequeñas envuelven al usuario y exigen cercanía física pero reaccionan negando el acercamiento. Así se configura una coreografía constante que revela ese loop en el que estamos inmersos que impide la contemplación por la promesa de ver",
    roomTag: "tapete",
    tags: ["instalación", "no lineal", "interactivo"]
  },
  {
    img: "img/tapete_25.png",
    video: "video/video25.mp4",
    /*volume: 0.5,*/
    title: "Ecdisis",
    artist: "Luz Ramírez",
    desc: "Instalación que pone en tensión la noción de hogar a partir del proceso de muda de piel de la serpiente",
    roomTag: "tapete",
    tags: ["ficción", "inmersivo", "loop"]
  },
  {
    img: "img/cyber_1.png",
    video: "video/video_cyber1.mp4",
    /*volume: 0.5,*/
    title: "Pasarotus",
    artist: "Federico Ricardi y Lautaro Baldoma",
    desc: "A través de la exploración del mapa y diálogos, el personaje va a ir desbloqueando habitaciones y descubriendo la historia del bar La Perla, la cuna del rock nacional argentino. Además, vamos a descubrir dónde se juntaban a tocar ciertos jóvenes rebeldes, que luego harían historia en la música",
    roomTag: "app",
    tags: ["videojuego", "música", "ensayo"]
  },
  {
    img: "img/cyber_2.png",
    video: "video/video_cyber2.mp4",
    /*volume: 0.5,*/
    title: "La vuelta al perro",
    artist: "Julián Stoessel",
    desc: "Un joven del barrio de Once se despierta misteriosamente convertido en perro y debe descubrir la forma de volver a la normalidad",
    roomTag: "app",
    tags: ["videojuego", "animales", "loop"]
  },
  {
    img: "img/cyber_3.png",
    video: "video/video_cyber3.mp4",
    /*volume: 0.5,*/
    title: "La Isla del Último Sol",
    artist: "Lucía Belén Vera, María Celeste Guardia Viacava y Ornella Luz Giorgio",
    desc: "Ponete en la piel de Nikki, un joven conejo en el frente de combate contra los zorros. Un día encuentra una tarotista que le profetiza una catástrofe, por lo que Nikki deberá encontrar la manera de escapar",
    roomTag: "app",
    tags: ["videojuego", "no lineal", "animales"]
  },
  {
    img: "img/cyber_4.png",
    video: "video/video_cyber4.mp4",
    /*volume: 0.5,*/
    title: "minutodesilencio",
    artist: "Florencia Perez Duarte",
    desc: "Un minuto de silencio es una página web interactiva sobre el duelo y la memoria en la era digital. El usuario participa de un ritual simbólico de despedida, aludiendo a un minuto de silencio, donde podrá jugar e interactuar en un jardín 3D",
    roomTag: "app",
    tags: ["interfaz experimental", "ficción", "código web"]
  },
  {
    img: "img/cyber_6.png",
    video: "video/video_cyber6.mp4",
    /*volume: 0.5,*/
    title: "Ángela",
    artist: "Camila Torres Rivadeneira Avalos",
    desc: "Videojuego ambientado en una escuela atravesada por la negligencia, donde las historias de reclamos son narradas por los fantasmas de sus propios estudiantes a través de la revista del C.E.B.A.A.P.",
    roomTag: "app",
    tags: ["ficción", "animación", "videojuego"]
  },
  {
    img: "img/sotano_44.png",
    video: "video/video44.mp4",
    /*volume: 0.5,*/
    title: "Canal Magdalena",
    artist: "Tamara Levín y Sol Tanoni",
    desc: "Obra que denuncia el modo en que Argentina se desconecta de su geografía marítima. A partir de información recolectada por boyas en el estuario rioplatense, desarrollamos visuales y sonidos que retratan este espacio y evidencian la pérdida económica que implica su desuso",
    roomTag: "subsuelo",
    tags: ["instalación", "documental", "visualización de datos"]
  },
  {
    img: "img/sotano_45.jpg",
    video: "video/video45.mp4",
    /*volume: 0.5,*/
    title: "Bajo Sur",
    artist: "Wanda Acevedo",
    desc: "Un territorio que resiste ser explicado solo desde la carencia, una invitación a mirar el conurbano sur desde adentro, donde lo contingente revela otros modos posibles de entender y habitar el presente",
    roomTag: "subsuelo",
    tags: ["instalación", "no lineal", "electrónica"]
  },
  {
    img: "img/sotano_46.jpg",
    video: "video/video46.mp4",
    /*volume: 0.5,*/
    title: "Respirar con dificultad",
    artist: "Sofía Gramajo, Sofía Pérez, Leila Ríos, Gabriela Pardo Rojas y Mariana Urquiza",
    desc: "En la espera de un futuro mejor, cinco anhelos congelados en bloques de hielo aguardan a ser concretados, con la amenaza latente del tiempo",
    roomTag: "subsuelo",
    tags: ["instalación", "arte sonoro", "escultura"]
  },
  // add more objects freely - keep the same fields for bulk edits
];
