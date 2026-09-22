# Web senzilla per planificar-se una rutina setmanal
Una web estàtica feta amb vanilla javascript i css que et permet dissenyar un horari/agenda/rutina a seguir al llarg d'una setmana.

### Coses xules implementades
- Mode fosc i mode clar
- Diferents paletes de colors a triar
- Disseny adaptat per diferents mides de pantalles
- Pots amagar o mostrar el cap de setmana
- Pots seleccionar quina franja horària es mostra
- Pots crear un element d'una duració concreta arrossegant i deixant anar
- Pots duplicar un element amb Alt+Click i arrossegant-lo (similar a com faries a Photoshop, Premiere, Davinci, etc.)
- Pots compartir la teva rutina/agenda setmanal via URL. Les dades es minifiquen, es comprimeixen amb [`lz-string`](https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js) i es passen codificades a la query string.

### JSON intern d'exemple

Internament, a `localStorage` es guarda un JSON amb l'estructura del següent exemple:

```json
{
  "config": {
    "startHour": 8,
    "endHour": 20,
    "hideWeekend": true,
    "cellDesign": "default",
    "palette": "vibrant"
  },
  "events": [
    {
      "id": "1727029876403",
      "title": "FENÒMENS",
      "day": 1,
      "start": "10:45",
      "end": "11:45",
      "color": "blue",
      "desc": "A32M"
    },
    {
      "id": "1727029876404",
      "title": "EFIS",
      "day": 1,
      "start": "11:45",
      "end": "12:45",
      "color": "red"
    }
  ]
}
```

### JSON minificat i codificat

En generar un enllaç per compartir, primier es minifiquen els "keys" del json a 1-2 caràcters i després es comprimeixen amb `lz-string`. També s'elimina l'ID ja que no és necessari, quan s'obre una URL a cada esdeveniment simplement se l'hi assigna un nou ID.

Al final un enllaç d'exemple queda tal que així:
[https://rutina-setmanal.vercel.app/?data=N4Igxg9gdgZglgcxALlAZwBYoBwBoQCmWyATAAz4YDuKALgE4CuB%2BYAJiuAVLQfQR3wAHThDAEAhlBABffAQBu3WmhQBtULU4AxAKIA5AEsBZAwGUQ%2BDqXyrkIAIxlkAFgCslwpwcPXH1pwARgA2zLK4mpy62gCSFlYoFCB2jr7ungTeAMx%2BnmCc-BxykfbRcZ7WWbbeJLny2XXgBQLhJSBl8SDWJNX2DrXp9X05g032ha0gWvYAQjEzADIxAPIVib0gZNjIWWQZ3s6j%2BfYAngTBwRA0xVOcc4srazbJnFs7e0OOh-5jIGcXV0m0xAeiMpn0nWsSRSTkamT6aR%2BxxAITCN2B9yWqwSOw2b12%2Bz6AyRnH%2Bl2uEVu9gA4gAJ-S6ABKuieDg2DjcyDIHy8fQA7FyecihHAoABrIF3eZY1l47YEz6wo6k87kyX2UEmcyyl59b6E1KNZGozLoqUPbFdFBs3WG0bwxwjEmnVWAs32My6BbaAC0ZgAKgBVAAiAE0AAQAQXDAGFI2ZI08XHiAJyCg0ObbcvJBehXaTukCYx446HeABs6cV8qFKoBFLaxlp-uWwd0ZnDxkj-t0xgAA-6YjHIetbRyq7zHJXswF7EJGPQhMFTZTgU2W22O12e-3B8OnlUx5yZ5OHNPa3OF0uV21i5bKuzzxmazmXfX1UXpSWrc8YceeQ6mbvK%2BfyutcAC6MhAA](https://rutina-setmanal.vercel.app/?data=N4Igxg9gdgZglgcxALlAZwBYoBwBoQCmWyATAAz4YDuKALgE4CuB%2BYAJiuAVLQfQR3wAHThDAEAhlBABffAQBu3WmhQBtULU4AxAKIA5AEsBZAwGUQ%2BDqXyrkIAIxlkAFgCslwpwcPXH1pwARgA2zLK4mpy62gCSFlYoFCB2jr7ungTeAMx%2BnmCc-BxykfbRcZ7WWbbeJLny2XXgBQLhJSBl8SDWJNX2DrXp9X05g032ha0gWvYAQjEzADIxAPIVib0gZNjIWWQZ3s6j%2BfYAngTBwRA0xVOcc4srazbJnFs7e0OOh-5jIGcXV0m0xAeiMpn0nWsSRSTkamT6aR%2BxxAITCN2B9yWqwSOw2b12%2Bz6AyRnH%2Bl2uEVu9gA4gAJ-S6ABKuieDg2DjcyDIHy8fQA7FyecihHAoABrIF3eZY1l47YEz6wo6k87kyX2UEmcyyl59b6E1KNZGozLoqUPbFdFBs3WG0bwxwjEmnVWAs32My6BbaAC0ZgAKgBVAAiAE0AAQAQXDAGFI2ZI08XHiAJyCg0ObbcvJBehXaTukCYx446HeABs6cV8qFKoBFLaxlp-uWwd0ZnDxkj-t0xgAA-6YjHIetbRyq7zHJXswF7EJGPQhMFTZTgU2W22O12e-3B8OnlUx5yZ5OHNPa3OF0uV21i5bKuzzxmazmXfX1UXpSWrc8YceeQ6mbvK%2BfyutcAC6MhAA)



### Llicència
#### Codi
MIT

##### Lucide Icons i Simple Icons
Els icones principals utilitzats en la web són de Lucide Icons, que estan sota la llicència ISC, excepte l'icona de GitHub que està sota la llicència Creative Commons CC0 1.0 Universal.
