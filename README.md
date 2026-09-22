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
- Pots compartir la teva rutina/agenda setmanal via URL. Les dades es minifiquen, es comprimeixen amb `lz-string` i es passen codificades a la query string.

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

### JSON minificat

En generar un enllaç per compartir, primier es minifiquen els "keys" del json a 1-2 caràcters i després es comprimeixen amb lz-string. També s'elimina l'ID ja que no és necessari, quan s'obre una URL a cada esdeveniment simplement se l'hi assigna un nou ID.

### Llicència
MIT

#### Lucide Icons i SImple Icons
Els icones principals utilitzats en la web són de Lucide Icons, que estan sota la llicència ISC, excepte l'icona de GitHub que està sota la llicència Creative Commons CC0 1.0 Universal.
