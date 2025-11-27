/* Embed the original schedule2.js data directly so this file is
   self-contained. We'll convert the structured `programming.spaces`
   into the legacy `SCHEDULE_DATA` array (one object per date) so the
   rest of the app (which expects `SCHEDULE_DATA`) can consume it.

   Both listed dates will receive the same events/times as requested. */
const SOURCE_SCHEDULE = {
  dates: [
    'Jueves 27 de Noviembre',
    'Viernes 28 de Noviembre'
  ],
  programming: {
    spaces: [
      {
        space: 'AUDITORIO',
        blocks: [
          { block: 'BLOQUE 1', time: '20:00', titles: [ 'La patria duerme en la basura', 'Cañáreda', 'Sol de noche', 'Desyugo', 'Las muchachas' ] },
          { block: 'BLOQUE 2', time: '21:00', titles: [ 'La Flandes', 'Sálvese quien crea', 'Culo de Botella', 'Arrabal', 'Honkey Tonk', 'Villars', 'Madreselva' ] },
          { block: 'BLOQUE 3', time: '22:00', titles: [ 'Las visitas de Camilo', 'Peligro de derrumbe', 'Ni una sola flor' ] },
          { block: 'BLOQUE 4', time: '22:30', titles: [ 'Túnel', 'La condená', 'Eviterna', 'Sueño del niño', 'Blatta', 'Resbalosas', 'Lo que quiero que sepas' ] },
          { block: 'BLOQUE 5', time: '23:30', titles: [ 'Las dimensiones conocidas', 'Ecosenterventanas', 'Opereta andamios', 'Tu águila guerrera' ] }
        ]
      },
      {
        space: 'PATIO',
        blocks: [
          { block: 'BLOQUE 1', time: '20:00', titles: [ 'Las dimensiones conocidas', 'Ecosenterventanas', 'Opereta andamios', 'Tu águila guerrera' ] },
          { block: 'BLOQUE 2', time: '20:30', titles: [ 'Las visitas de Camilo', 'Peligro de derrumbe', 'Ni una sola flor' ] },
          { block: 'BLOQUE 3', time: '21:00', titles: [ 'La patria duerme en la basura', 'Cañáreda', 'Sol de noche', 'Desyugo' ] },
          { block: 'BLOQUE 4', time: '22:00', titles: [ 'La Flandes', 'Sálvese quien crea', 'Culo de Botella', 'Arrabal', 'Honkey Tonk', 'Villars', 'Madreselva' ] },
          { block: 'BLOQUE 5', time: '23:00', titles: [ 'Túnel', 'La condená', 'Eviterna', 'Sueño del niño', 'Blatta', 'Resbalosas', 'Lo que quiero que sepas' ] }
        ]
      },
      {
        space: 'CRISIS',
        blocks: [
          { block: 'ÚNICO BLOQUE (EN LOOP)', time: '23:00',titles: [ 'Purificación', 'Aciogamí', 'El corazón del mundo', 'Arboreus', 'La flor del ceibo', 'El aroma', 'Vestigio', 'Nexo azul' ] }
        ]
      }
    ]
  }
};

function buildEventsFromSource(src) {
  const events = [];
  const spaces = src && src.programming && Array.isArray(src.programming.spaces) ? src.programming.spaces : [];
  spaces.forEach(sp => {
    const spaceName = sp.space || '';
    const blocks = Array.isArray(sp.blocks) ? sp.blocks : [];
    blocks.forEach(b => {
      const blockName = b.block || '';
      const time = b.time || '';
      const titles = Array.isArray(b.titles) ? b.titles : [];
      titles.forEach(title => {
        // Only include the space name in the legacy description. Block names
        // (e.g. "BLOQUE 1") are intentionally omitted per request.
        events.push({ time, title, description: `${spaceName}` });
      });
    });
  });
  return events;
}

// Build events once and duplicate for each listed date so both days show the same program
const __GENERATED_EVENTS = buildEventsFromSource(SOURCE_SCHEDULE);

// Helper to convert "HH:MM" (24h) to minutes since midnight for robust sorting
function timeToMinutes(t) {
  if (!t || typeof t !== 'string') return Number.POSITIVE_INFINITY;
  const m = t.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return Number.POSITIVE_INFINITY;
  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return Number.POSITIVE_INFINITY;
  return hh * 60 + mm;
}

// Sort generated events ascending by time (earliest first). Uses minutes to
// ensure '8:30' and '08:30' both sort correctly. Events without a valid
// time are pushed to the end.
__GENERATED_EVENTS.sort((a, b) => {
  return timeToMinutes(a.time) - timeToMinutes(b.time);
});

const SCHEDULE_DATA = SOURCE_SCHEDULE.dates.map(d => ({ date: d, events: __GENERATED_EVENTS.slice() }));

// Keep a global var name `SCHEDULE_DATA` for compatibility with existing code
