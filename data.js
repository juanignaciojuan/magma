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
    volume: 0.5, // 0.0 .. 1.0 — adjust per clip
    title: "Proyecto 1",
    desc: "Exploración de color y sonido",
    tags: ["color", "sonido"]
  },
  {
    img: "img/magma2.png",
    video: "video/video2.mp4",
    volume: 0.5, // 0.0 .. 1.0 — adjust per clip
    title: "Proyecto 2",
    desc: "Narrativa experimental",
    tags: ["narrativa", "color"]
  },
  {
    img: "img/magma3.png",
    video: "video/video3.mp4",
    volume: 0.5,
    title: "Proyecto 3",
    desc: "Videoarte inmersiva",
    tags: ["sonido", "vr"]
  },
  {
    img: "img/magma4.png",
    video: "video/video4.mp4",
    volume: 0.5,
    title: "Proyecto 4",
    desc: "Performance audiovisual",
    tags: ["vr", "videojuegos"]
  },
  {
    img: "img/magma5.png",
    video: "video/video5.mp4",
    volume: 0.1,
    title: "Proyecto 5",
    desc: "Instalación interactiva",
    tags: ["animación", "pueblos-originarios"]
  },
  {
    img: "img/magma2.png",
    video: "video/video2.mp4",
    volume: 0.5, // 0.0 .. 1.0 — adjust per clip
    title: "Proyecto 6",
    desc: "Película experimental",
    tags: ["color", "animación"]
  },
  {
    img: "img/magma3.png",
    video: "video/video3.mp4",
    volume: 0.5,
    title: "Proyecto 7",
    desc: "Experiencia sonora",
    tags: ["ruido", "sonido-directo"]
  },
  {
    img: "img/magma4.png",
    video: "video/video4.mp4",
    volume: 0.5,
    title: "Proyecto 8",
    desc: "Realidad aumentada",
    tags: ["instalacion", "eye-tracking"]
  },
  {
    img: "img/magma5.png",
    video: "video/video5.mp4",
    volume: 0.1,
    title: "Proyecto 9",
    desc: "Virtualidad inmersiva",
    tags: ["videojuegos", "vr"]
  },
  // add more objects freely - keep the same fields for bulk edits
];
