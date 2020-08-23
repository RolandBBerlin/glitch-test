
/* Klasse für x-y-Tupel */
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.length = Math.sqrt(x * x + y * y);
  }
}


/* Variablen für Programmausführung */
var hoehe = 300;
var grid = 20;
var xcheck = 0; // x-Wert für Checkpoint
var yziel = 0;  // y-Wert der Ziellinie
var gitterfarbe = "#aaaaaa";
var startfarbe = "#0000ff";


// Variablen für das Spiel
var schritte = 0;
var checkpunkt = false; //Checkpunkt erreicht
var position = null;
var letzterVektor = null;
var naechstePosition = null;
var laengsterVektor = null;


/* Referenzen zu Zeichenflächen speichern */
var layer0 = document.getElementById("layer0");
var ctx0 = layer0.getContext("2d");
var layer1 = document.getElementById("layer1");
var ctx1 = layer1.getContext("2d");
var layer2 = document.getElementById("layer2");
var ctx2 = layer2.getContext("2d");
var layer3 = document.getElementById("layer3");
var ctx3 = layer3.getContext("2d");

// Ellipsenstreifen berechnen
class Ellipseslice {
  constructor(xy, setxy) {
    this.slices = 1;
    if (setxy == "y") {
      // y-Werte aus gegebenem x berechnen
      this.a0 = hoehe/2 - 1/2 * Math.sqrt(hoehe*hoehe - (xy-hoehe)*(xy-hoehe));
      this.a1 = hoehe/2 + 1/2 * Math.sqrt(hoehe*hoehe - (xy-hoehe)*(xy-hoehe));
      
      if (Math.abs(xy - hoehe) < hoehe/2.4){
        // es gibt innere Linien
        this.slices = 2;
        this.i0 = hoehe/2 - 1/2 * Math.sqrt(hoehe*hoehe/ (2.4*2.4) - (xy-hoehe)*(xy-hoehe));
        this.i1 = hoehe/2 + 1/2 * Math.sqrt(hoehe*hoehe/ (2.4*2.4) - (xy-hoehe)*(xy-hoehe));
      }
    }
    else {
      //alert(xy);

      // x-Werte aus gegebenem y berechnen
      this.a0 = hoehe - 2 * Math.sqrt(hoehe*hoehe/4 - (xy-hoehe/2)*(xy-hoehe/2));
      this.a1 = hoehe + 2 * Math.sqrt(hoehe*hoehe/4 - (xy-hoehe/2)*(xy-hoehe/2));
      
      if (Math.abs(xy - hoehe/2) < hoehe/(2*2.4)){
        // es gibt innere Linien
        this.slices = 2;
        this.i0 = hoehe - 2 * Math.sqrt(hoehe*hoehe/ (4*2.4*2.4) - (xy-hoehe/2)*(xy-hoehe/2));
        this.i1 = hoehe + 2 * Math.sqrt(hoehe*hoehe/ (4*2.4*2.4) - (xy-hoehe/2)*(xy-hoehe/2));
      }
    }
  }
}




/* Spielfeld zeichnen */

// senkrechte Linien
{
  var x = 0;
  ctx0.strokeStyle = gitterfarbe;
  x = grid / 2;
  while (x <= hoehe * 2) {
    /*var ellipse = new Ellipseslice(x, "y")
    if (ellipse.slices == 2) {
     // 2 Linien zu zeichnen
     ctx0.beginPath();
      ctx0.moveTo(x,ellipse.a0);
      ctx0.lineTo(x,ellipse.i0);
      ctx0.stroke();
      ctx0.beginPath();
      ctx0.moveTo(x,ellipse.i1);
      ctx0.lineTo(x,ellipse.a1);
      ctx0.stroke();

    }
    else {
      // 1 Linie zu zeichnen
      ctx0.beginPath();
      ctx0.moveTo(x,ellipse.a0);
      ctx0.lineTo(x,ellipse.a1);
      ctx0.stroke();

    }*/
    
    // Eine Linie
    ctx0.beginPath();
    ctx0.moveTo(x,0);
    ctx0.lineTo(x,2*hoehe);
    ctx0.stroke();
    
    // Checkpoint ggf. festlegen
    if (xcheck == 0 && x >= 3.4*hoehe/2.4)
      xcheck = x;

    x = x + grid;
  }
}

// horizontale Linien
{
  var y = 0;
  ctx0.strokeStyle = gitterfarbe;
  y = grid / 2;
  while (y <= hoehe) {
    var ellipse = new Ellipseslice(y, "x")
    /*if (ellipse.slices == 2) {
      // 2 Linien zu zeichnen
      ctx0.strokeStyle = gitterfarbe;
      ctx0.beginPath();
      ctx0.moveTo(ellipse.a0,y);
      ctx0.lineTo(ellipse.i0,y);
      ctx0.stroke();
      ctx0.beginPath();
      ctx0.moveTo(ellipse.i1,y);
      ctx0.lineTo(ellipse.a1,y);
      ctx0.stroke();

    }
    else {
      // 1 Linie zu zeichnen
      ctx0.strokeStyle = gitterfarbe;
      ctx0.beginPath();
      ctx0.moveTo(ellipse.a0,y);
      ctx0.lineTo(ellipse.a1,y);
      ctx0.stroke();

    }*/
    
    // 1 Linie zeichnen
    ctx0.strokeStyle = gitterfarbe;
    ctx0.beginPath();
    ctx0.moveTo(0,y);
    ctx0.lineTo(hoehe*2,y);
    ctx0.stroke();
    
    
    // Ziellinie finden
    if (ellipse.slices == 2 && yziel == 0 && y >= hoehe/2) {
      yziel = y;
      ctx0.strokeStyle = startfarbe;
      ctx0.beginPath();
      ctx0.moveTo(ellipse.a0,y);
      ctx0.lineTo(ellipse.i0,y);
      ctx0.stroke();
      ctx0.strokeStyle = gitterfarbe;

    }
    
    
    
    y = y + grid;
  }
}


// Äußere Ellipse
ctx0.strokeStyle = "black";
ctx0.beginPath();
ctx0.ellipse(hoehe, hoehe / 2, hoehe, hoehe / 2, 0, 0, 2 * Math.PI);
ctx0.stroke();
// Innere Ellipse
ctx0.beginPath();
ctx0.ellipse(
  hoehe,
  hoehe / 2,
  hoehe / 2.4,
  hoehe / 4.8,
  0,
  0,
  2 * Math.PI
);
ctx0.stroke();



// Punkt zeichnen
function punktZeichnen(ctx, x, y, color, klein){
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  var groesse = grid/4;
  if (klein == true)
      groesse = grid/8;
  ctx.ellipse(x, y, groesse, groesse, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

// Vektor zeichnen
function vektorZeichnen(ctx, fromx, fromy, tox, toy, color){
  ctx.strokeStyle = color;
  ctx.beginPath();
  var headlen = grid/2; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.stroke();

}


// Grid-Koordinate finden
function gridFinden(xy){

  return Math.round((xy-grid/2)/grid)*grid + grid/2;
}



// Mögliche Zielpunkte anzeigen
function moeglicheZuege() {
  // Zunächst löschen
  ctx2.clearRect(0,0,2*hoehe, hoehe);
  var ziele = 0;
  if (position == null){
    // Startpunkte auf Startlinie zeichnen
    x = grid/2;
    while(x <= hoehe - 2 * Math.sqrt(hoehe*hoehe/ (4*2.4*2.4) - (yziel-hoehe/2)*(yziel-hoehe/2))) {
      punktZeichnen(ctx2, x, yziel, "#00ff00");
      x = x + grid;
      ziele += 1;
    }

  }
  else {
    if (letzterVektor == null)
      // Startposition merken
      naechstePosition = new Vector(position.x,  position.y)

    else 
      // Vektor fortsetzen
      naechstePosition = new Vector(position.x + letzterVektor.x * grid, position.y + letzterVektor.y * grid);


    // Punkte rund um Punkt zeichnen, dabei Zielpunkte zählen
    for(var xi = -1; xi<= 1; xi++) {
      for (var yi = -1; yi <= 1; yi++) {
        var punktx = naechstePosition.x + xi * grid;
        var punkty = naechstePosition.y + yi * grid;
        // Checkpoint ggf. passieren
        if (punktx >= xcheck)
          checkpunkt = true;

        // Startlinie darf erst nach Checkpunkt wieder durchquert werden
        if (checkpunkt || punkty < yziel) {

          // Koordinaten prüfen, zunächst x:
          if ( x <= hoehe * 2 ) {
            // y-Außenbereich berechnen
            var ellipse = new Ellipseslice(punktx, "y");

            // Außenbereich y prüfen
            if (ellipse.a0 <= punkty && punkty <= ellipse.a1) {

              // Ggf. Innenbereich prüfen
              if (ellipse.slices == 1 || ( punkty <= ellipse.i0 ) || ( ellipse.i1 <= punkty) ) {
                punktZeichnen(ctx2, punktx, punkty, "#00ff00");

                ziele += 1;
              }



            }
            //ya0 = hoehe/2 - 1/2 * Math.sqrt(hoehe*hoehe - (x-hoehe)*(x-hoehe));
            //ya1 = hoehe/2 + 1/2 * Math.sqrt(hoehe*hoehe - (x-hoehe)*(x-hoehe));

/*              if (Math.abs(x - hoehe) < hoehe/2.4){
              // 2 Linien zu zeichnen
              yi0 = hoehe/2 - 1/2 * Math.sqrt(hoehe*hoehe/ (2.4*2.4) - (x-hoehe)*(x-hoehe));
              yi1 = hoehe/2 + 1/2 * Math.sqrt(hoehe*hoehe/ (2.4*2.4) - (x-hoehe)*(x-hoehe));

            }

          }

          // Zweite Prüfung, nur innerhalb der Ellipsen zeichnen
          var p = ctx0.getImageData(punktx, punkty, 1, 1).data; 
          var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
          if  (hex != "#000000") {  //(hex == gitterfarbe || hex == startfarbe || hex == "#a9a9a9" || hex == "#a8a8a8" || hex == "#ababab") {
            punktZeichnen(ctx2, punktx, punkty, "#00ff00");

            ziele += 1;
          }
          else {
            // alert(x+","+y+","+hex)
          }
          */
          }
        }

      }
    }
  }

  // Anzahl der Zielpunkte zurückgeben
  return ziele;
}



// Auf Mausklick im Canvas reagieren -> ggf. Zug machen
layer3.addEventListener('mousedown', function (e) {
  var pos = findPos(this);
  var x = e.pageX - pos.x;
  var y = e.pageY - pos.y;
  var p = ctx3.getImageData(x, y, 1, 1).data; 
  var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
  
  // Wenn etwas rotes unter der Maus ist, 
  if (hex == "#ff0000") {
    // Punkt markieren
    punktZeichnen(ctx1, gridFinden(x), gridFinden(y), "black", true);
    
    // Wenn nicht auf der Startlinie -> Vektor zeichnen
    if (position != null) {
      vektorZeichnen(ctx1, position.x, position.y, gridFinden(x), gridFinden(y), "black")
      letzterVektor = new Vector(Math.round((gridFinden(x)-position.x)/grid), Math.round((gridFinden(y)-position.y)/grid));
      schritte += 1;
      if (laengsterVektor == null)
        laengsterVektor = letzterVektor;
      else if (letzterVektor.length > laengsterVektor.length)
        laengsterVektor = letzterVektor;
      
      // Hinweis zeigen:
      document.getElementById("Hinweis")
			  .innerHTML = schritte + " Pfeile bis jetzt gemacht. Wähle Dein nächstes Ziel!"


    }
    else {
      document.getElementById("Hinweis")
        .innerHTML = "Wähle Deinen erster Zielpunkt!"
    }


    // aktuelle Position setzen
    position = new Vector(gridFinden(x), gridFinden(y));
    
    //Layer 2 und 3 löschen
    ctx2.clearRect(0,0,2*hoehe, hoehe);
    ctx3.clearRect(0,0,2*hoehe, hoehe);

    
    // Prüfen, ob gewonnen
    if (checkpunkt && position.x <= 1.4*hoehe/2.4 && position.y <= yziel) {
      alert("Ziellinie erreicht! Glückwunsch! Du hast " + schritte + " Pfeile benötigt.");
      document.getElementById("Hinweis")
			  .innerHTML = "Ziellinie erreicht! Glückwunsch! Du hast " + schritte + " Pfeile benötigt.";
    }
    
    // Neue Möglichkeiten zeichnen und zählen -> ggf. außerhalb der Bahn
    else if (moeglicheZuege() == 0) {
      alert ("Dein Auto ist zu schnell geworden und Du bist aus der Kurve gefahren.");
      document.getElementById("Hinweis")
			  .innerHTML = "Dein Auto ist zu schnell geworden und Du bist aus der Kurve gefahren.";
    }
  }
});



// Auf MouseOver reagieren (Zug zeigen oder löschen)
layer3.addEventListener('mousemove', function (e) {
  var pos = findPos(this);
  var x = e.pageX - pos.x;
  var y = e.pageY - pos.y;
  var p = ctx2.getImageData(x, y, 1, 1).data; 
  var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
  if (hex == "#00ff00") {
    // Punkt markieren
    punktZeichnen(ctx3, gridFinden(x), gridFinden(y), "#ff0000")

    // Wenn nicht auf der Startlinie -> Vektor zeichnen
    if (position != null)
      vektorZeichnen(ctx3, position.x, position.y, gridFinden(x), gridFinden(y), "#ff0000");
  }
  else if (hex != "#ff0000")
      ctx3.clearRect(0,0,2*hoehe, hoehe);
  
});

// Spiel neu starten
function neuStarten() {
  // Zunächst Spielebenen löschen
  ctx1.clearRect(0,0,2*hoehe, hoehe);
  ctx2.clearRect(0,0,2*hoehe, hoehe);
  ctx3.clearRect(0,0,2*hoehe, hoehe);
  
  // Spielervariablen zurücksetzen
  schritte = 0;
  checkpunkt = false; //Checkpunkt erreicht
  position = null;
  letzterVektor = null;
  naechstePosition = null;
  laengsterVektor = null;
  
  // Mögliche Züge zeigen
  moeglicheZuege();
  
  // Text wieder ersetzen:
  document.getElementById("Hinweis")
			.innerHTML = "Wähle Deinen Startpunkt";
}


// Aus Klick "Neues Spiel" reagieren
moeglicheZuege();


// Hilfsfunktionen
function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}



