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
    title: "Proyecto 1",
    desc: "Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial.",
    roomTag: "colectivo",
    tags: ["performance", "sonido", "instalacion"]
  },
  {
    img: "img/magma2.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 2",
    desc: "Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental.",
    roomTag: "colectivo",
    tags: ["narrativa", "color", "video"]
  },
  {
    img: "img/magma3.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 3",
    desc: "Videoarte inmersivo",
    roomTag: "colectivo",
    tags: ["sonido", "vr", "video"]
  },
  {
    img: "img/magma4.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 4",
    desc: "Performance audiovisual",
    roomTag: "circo",
    tags: ["vr", "narrativa", "instalacion"]
  },
  {
    img: "img/magma5.png",
    video: "video/video5.mp4",
    volume: 0.1,
    title: "Proyecto 5",
    desc: "Instalación interactiva",
    roomTag: "circo",
    tags: ["animación", "videojuegos", "sonido"]
  },
  {
    img: "img/magma6.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 6",
    desc: "Película experimental",
    roomTag: "circo",
    tags: ["vr", "animación", "videojuegos"]
  },
  {
    img: "img/magma7.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 7",
    desc: "Experiencia sonora",
    roomTag: "tapete",
    tags: ["videojuegos", "sonido", "instalacion"]
  },
  {
    img: "img/magma8.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 8",
    desc: "Realidad aumentada",
    roomTag: "tapete",
    tags: ["instalacion", "narrativa", "vr"]
  },
  {
    img: "img/magma9.png",
    video: "video/video5.mp4",
    /*volume: 0.1,*/
    title: "Proyecto 9",
    desc: "Virtualidad inmersiva",
    roomTag: "tapete",
    tags: ["videojuegos", "video", "performance"]
  },
  {
    img: "img/magma10.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 10",
    desc: "Exploración de color y sonido",
    roomTag: "laboratorio",
    tags: ["narrativa", "sonido", "video"]
  },
  {
    img: "img/magma11.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 11",
    desc: "Estudio de formas y texturas",
    roomTag: "laboratorio",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/magma12.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 12",
    desc: "Análisis de movimiento y ritmo",
    roomTag: "laboratorio",
    tags: ["narrativa", "sonido", "vr"]
  },
  {

    img: "img/magma13.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 13",
    desc: "Transformación digital",
    roomTag: "general",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma14.png",
    video: "video/video5.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 14",
    desc: "Errorismo visual",
    roomTag: "general",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma15.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 15",
    desc: "Pixel art contemporáneo",
    roomTag: "general",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma16.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 16",
    desc: "Limites de la percepción",
    roomTag: "general",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/magma17.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 17",
    desc: "Estudio de vínculos entre la tecnología y el cuerpo humano",
    roomTag: "general",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma1.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 1",
    desc: "Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial. Exploración espacial.",
    roomTag: "colectivo",
    tags: ["performance", "sonido", "instalacion"]
  },
  {
    img: "img/magma2.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 2",
    desc: "Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental. Narrativa experimental.",
    roomTag: "colectivo",
    tags: ["narrativa", "color", "video"]
  },
  {
    img: "img/magma3.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 3",
    desc: "Videoarte inmersivo",
    roomTag: "colectivo",
    tags: ["sonido", "vr", "video"]
  },
  {
    img: "img/magma4.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 4",
    desc: "Performance audiovisual",
    roomTag: "circo",
    tags: ["vr", "narrativa", "instalacion"]
  },
  {
    img: "img/magma5.png",
    video: "video/video5.mp4",
    volume: 0.1,
    title: "Proyecto 5",
    desc: "Instalación interactiva",
    roomTag: "circo",
    tags: ["animación", "videojuegos", "sonido"]
  },
  {
    img: "img/magma6.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 6",
    desc: "Película experimental",
    roomTag: "circo",
    tags: ["vr", "animación", "videojuegos"]
  },
  {
    img: "img/magma7.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 7",
    desc: "Experiencia sonora",
    roomTag: "tapete",
    tags: ["videojuegos", "sonido", "instalacion"]
  },
  {
    img: "img/magma8.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 8",
    desc: "Realidad aumentada",
    roomTag: "tapete",
    tags: ["instalacion", "narrativa", "vr"]
  },
  {
    img: "img/magma9.png",
    video: "video/video5.mp4",
    /*volume: 0.1,*/
    title: "Proyecto 9",
    desc: "Virtualidad inmersiva",
    roomTag: "tapete",
    tags: ["videojuegos", "video", "performance"]
  },
  {
    img: "img/magma10.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 10",
    desc: "Exploración de color y sonido",
    roomTag: "laboratorio",
    tags: ["narrativa", "sonido", "video"]
  },
  {
    img: "img/magma11.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 11",
    desc: "Estudio de formas y texturas",
    roomTag: "laboratorio",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/magma12.png",
    video: "video/video3.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 12",
    desc: "Análisis de movimiento y ritmo",
    roomTag: "laboratorio",
    tags: ["narrativa", "sonido", "vr"]
  },
  {

    img: "img/magma13.png",
    video: "video/video4.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 13",
    desc: "Transformación digital",
    roomTag: "general",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma14.png",
    video: "video/video5.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 14",
    desc: "Errorismo visual",
    roomTag: "general",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma15.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 15",
    desc: "Pixel art contemporáneo",
    roomTag: "general",
    tags: ["narrativa", "sonido", "performance"]
  },
  {
    img: "img/magma16.png",
    video: "video/video2.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 16",
    desc: "Limites de la percepción",
    roomTag: "general",
    tags: ["narrativa", "sonido", "animación"]
  },
  {
    img: "img/magma17.png",
    video: "video/video1.mp4",
    /*volume: 0.5,*/
    title: "Proyecto 17",
    desc: "Estudio de vínculos entre la tecnología y el cuerpo humano",
    roomTag: "general",
    tags: ["narrativa", "sonido", "performance"]
  },
  // add more objects freely - keep the same fields for bulk edits
];
