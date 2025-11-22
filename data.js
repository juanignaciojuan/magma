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
    img: "img/magma1.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Signal flesh",
    artist: "Nombre Apellido",
    desc: "Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial.",
    roomTag: "colectivo",
    tags: ["performance", "sonido", "instalacion"]
  },
  {
    img: "img/magma2.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Memoria encarnada",
    artist: "Nombre Apellido",
    desc: "Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental.",
    roomTag: "colectivo",
    tags: ["narrativa", "color", "video"]
  },
  {
    img: "img/magma3.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Sacrificio",
    artist: "Nombre Apellido",
    desc: "Videoarte inmersivo",
    roomTag: "colectivo",
    tags: ["sonido", "vr", "video"]
  },
  {
    img: "img/magma1.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "CONAN",
    artist: "Nombre Apellido",
    desc: "Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial.",
    roomTag: "colectivo",
    tags: ["performance", "sonido", "instalacion"]
  },
  {
    img: "img/magma2.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Aluda",
    artist: "Nombre Apellido",
    desc: "Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental.",
    roomTag: "colectivo",
    tags: ["narrativa", "color", "video"]
  },
  {
    img: "img/magma3.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Verdad en Frecuencia",
    artist: "Nombre Apellido",
    desc: "Videoarte inmersivo",
    roomTag: "colectivo",
    tags: ["sonido", "vr", "video"]
  },
  {
    img: "img/magma3.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Requiem por la privacía",
    artist: "Nombre Apellido",
    desc: "Videoarte inmersivo",
    roomTag: "colectivo",
    tags: ["sonido", "vr", "video"]
  },
  {
    img: "img/magma4.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "IN-MÓVILES",
    artist: "Nombre Apellido",
    desc: "Performance audiovisual",
    roomTag: "circo",
    tags: ["vr", "narrativa", "instalacion"]
  },
  {
    img: "img/magma5.png",
    video: "video/video5.mp4",
    volume: 0.1,
    title: "¿REVOLUCIÓN DE MAYO?",
    artist: "Nombre Apellido",
    desc: "Instalación interactiva",
    roomTag: "circo",
    tags: ["animación", "videojuegos", "sonido"]
  },
  {
    img: "img/magma6.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Private Cardozo",
    artist: "Nombre Apellido",
    desc: "Película experimental",
    roomTag: "circo",
    tags: ["vr", "animación", "videojuegos"]
  },
  {
    img: "img/magma4.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Cabezas y Ombligos",
    artist: "Nombre Apellido",
    desc: "Performance audiovisual",
    roomTag: "circo",
    tags: ["vr", "narrativa", "instalacion"]
  },
  {
    img: "img/magma5.png",
    video: "video/video5.mp4",
    volume: 0.1,
    title: "Retrato Negatoscópico",
    artist: "Nombre Apellido",
    desc: "Instalación interactiva",
    roomTag: "circo",
    tags: ["animación", "videojuegos", "sonido"]
  },
  {
    img: "img/magma6.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Sehnsucht",
    artist: "Nombre Apellido",
    desc: "Película experimental",
    roomTag: "circo",
    tags: ["vr", "animación", "videojuegos"]
  },
  {
    img: "img/magma4.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Quiero verte en el cielo",
    artist: "Nombre Apellido",
    desc: "Performance audiovisual",
    roomTag: "circo",
    tags: ["vr", "narrativa", "instalacion"]
  },
  {
    img: "img/magma5.png",
    video: "video/video5.mp4",
    volume: 0.1,
    title: "Atte. tus vecinos",
    artist: "Nombre Apellido",
    desc: "Instalación interactiva",
    roomTag: "circo",
    tags: ["animación", "videojuegos", "sonido"]
  },
  {
    img: "img/magma6.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: ".micra",
    artist: "Nombre Apellido",
    desc: "Película experimental",
    roomTag: "circo",
    tags: ["vr", "animación", "videojuegos"]
  },
  {
    img: "img/magma17.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "La resistencia de los sentidos",
    artist: "Nombre Apellido",
    desc: "Estudio de vínculos entre la tecnología y el cuerpo humano",
    roomTag: "tecnico",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma17.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Gravedad y la fuerza visible: Poéticas del esfuerzo en el pole sport.",
    artist: "Nombre Apellido",
    desc: "Estudio de vínculos entre la tecnología y el cuerpo humano",
    roomTag: "tecnico",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma17.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Cuando Estaba",
    artist: "Nombre Apellido",
    desc: "Estudio de vínculos entre la tecnología y el cuerpo humano",
    roomTag: "taller",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma10.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Presencia Impersonal",
    artist: "Nombre Apellido",
    desc: "Exploración de color y sonido",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "video"]
  },
  {
    img: "img/magma11.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Infierno en vida",
    artist: "Nombre Apellido",
    desc: "Estudio de formas y texturas",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/magma12.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "IN-MÓVILES",
    artist: "Nombre Apellido",
    desc: "Análisis de movimiento y ritmo",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "vr"]
  },
  {
    img: "img/magma10.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Manifestación",
    artist: "Nombre Apellido",
    desc: "Exploración de color y sonido",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "video"]
  },
  {
    img: "img/magma11.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "La caja de cristal",
    artist: "Nombre Apellido",
    desc: "Estudio de formas y texturas",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/magma12.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Partitura de Hormigas",
    artist: "Nombre Apellido",
    desc: "Análisis de movimiento y ritmo",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "vr"]
  },
  {
    img: "img/magma13.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Chemise",
    artist: "Nombre Apellido",
    desc: "Transformación digital",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma14.png",
    video: "video/video5.mp4",
    /*volume: 0.5,*/
    title: "Caché Personal",
    artist: "Nombre Apellido",
    desc: "Errorismo visual",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma15.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Tierras raras, el desgaste de mirar",
    artist: "Nombre Apellido",
    desc: "Pixel art contemporáneo",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma16.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "El rumor",
    artist: "Nombre Apellido",
    desc: "Limites de la percepción",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/magma17.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Vestigio",
    artist: "Nombre Apellido",
    desc: "Estudio de vínculos entre la tecnología y el cuerpo humano",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma13.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Payé",
    artist: "Nombre Apellido",
    desc: "Transformación digital",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma14.png",
    video: "video/video5.mp4",
    /*volume: 0.5,*/
    title: "Intersticio: expositor en el silencio",
    artist: "Nombre Apellido",
    desc: "Errorismo visual",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma15.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Ruptura",
    artist: "Nombre Apellido",
    desc: "Pixel art contemporáneo",
    roomTag: "planetario",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma14.png",
    video: "video/video5.mp4",
    /*volume: 0.5,*/
    title: "www.pueblodevizcacheras.com.ar",
    artist: "Nombre Apellido",
    desc: "",
    roomTag: "caldera",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma16.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Candilejas",
    artist: "Nombre Apellido",
    desc: "Limites de la percepción",
    roomTag: "tatrajo",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/magma7.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Sinantropia",
    artist: "Nombre Apellido",
    desc: "Experiencia sonora",
    roomTag: "tapete",
    tags: ["videojuegos", "sonido", "instalacion"]
  },
  {
    img: "img/magma8.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Fenotypicos",
    artist: "Nombre Apellido",
    desc: "Realidad aumentada",
    roomTag: "tapete",
    tags: ["instalacion", "narrativa", "vr"]
  },
  {
    img: "img/magma9.png",
    video: "video/video5.mp4",
    /*volume: 0.1,*/
    title: "Habitar",
    artist: "Nombre Apellido",
    desc: "Virtualidad inmersiva",
    roomTag: "tapete",
    tags: ["videojuegos", "video", "performance"]
  },
    {
    img: "img/magma7.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "CRUCES",
    artist: "Nombre Apellido",
    desc: "Experiencia sonora",
    roomTag: "tapete",
    tags: ["videojuegos", "sonido", "instalacion"]
  },
  {
    img: "img/magma8.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Diáspora",
    artist: "Nombre Apellido",
    desc: "Realidad aumentada",
    roomTag: "tapete",
    tags: ["instalacion", "narrativa", "vr"]
  },
  {
    img: "img/magma9.png",
    video: "video/video5.mp4",
    /*volume: 0.1,*/
    title: "5 altares de tierra y luz",
    artist: "Nombre Apellido",
    desc: "Virtualidad inmersiva",
    roomTag: "tapete",
    tags: ["videojuegos", "video", "performance"]
  },
  {
    img: "img/magma16.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Sinfonía de quiebres",
    artist: "Nombre Apellido",
    desc: "Limites de la percepción",
    roomTag: "tapete",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/magma17.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Loop obsolescente",
    artist: "Nombre Apellido",
    desc: "Estudio de vínculos entre la tecnología y el cuerpo humano",
    roomTag: "tapete",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma17.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Ecdisis",
    artist: "Nombre Apellido",
    desc: "Estudio de vínculos entre la tecnología y el cuerpo humano",
    roomTag: "tapete",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma1.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "PASAROTUS",
    artist: "Nombre Apellido",
    desc: "Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial.",
    roomTag: "cyber",
    tags: ["performance", "sonido", "instalacion"]
  },
  {
    img: "img/magma2.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "La vuelta al perro",
    artist: "Nombre Apellido",
    desc: "Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental.",
    roomTag: "cyber",
    tags: ["narrativa", "color", "video"]
  },
  {
    img: "img/magma3.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "La Isla del Último Sol",
    artist: "Nombre Apellido",
    desc: "Videoarte inmersivo",
    roomTag: "cyber",
    tags: ["sonido", "vr", "video"]
  },
  {
    img: "img/magma4.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "minutodesilencio",
    artist: "Nombre Apellido",
    desc: "Performance audiovisual",
    roomTag: "cyber",
    tags: ["vr", "narrativa", "instalacion"]
  },
  {
    img: "img/magma5.png",
    video: "video/video5.mp4",
    volume: 0.1,
    title: "Signal Flesh",
    artist: "Nombre Apellido",
    desc: "Instalación interactiva",
    roomTag: "cyber",
    tags: ["animación", "videojuegos", "sonido"]
  },
  {
    img: "img/magma6.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "ÁNGELA",
    artist: "Nombre Apellido",
    desc: "Película experimental",
    roomTag: "cyber",
    tags: ["vr", "animación", "videojuegos"]
  },
  {
    img: "img/magma6.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Canal Magdalena",
    artist: "Nombre Apellido",
    desc: "Película experimental",
    roomTag: "subsuelo",
    tags: ["vr", "animación", "videojuegos"]
  },
  {
    img: "img/magma2.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Bajo Sur",
    artist: "Nombre Apellido",
    desc: "Película experimental",
    roomTag: "subsuelo",
    tags: ["vr", "animación", "videojuegos"]
  },
  {
    img: "img/magma1.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Respirar con dificultad",
    artist: "Nombre Apellido",
    desc: "Película experimental",
    roomTag: "subsuelo",
    tags: ["vr", "animación", "videojuegos"]
  },
  // add more objects freely - keep the same fields for bulk edits
];
