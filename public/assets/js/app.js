const app = {

    body: document.querySelector('body'),

    // Bouton + Section +
    button: document.getElementById('expand'),
    refSectionDetails: document.getElementById('detail'),
    blnExpanded: false,
    // Jour
    intJourAnnee: 0,
    intJourSemaine: 0,
    intNumSemaine: 0,
    // Heure
    intHeureCourante: 0,
    intMinutesCourante: 0,
    intSecondesCourante: 0,

    strMessage: "",

    urlWorld: "http://worldtimeapi.org/api/timezone/America/Toronto",
    urlGeolocation: "",
    urlQuotes: "https://api.quotable.io",


    /* Chargement */
    strTexteAnimation: "",


    // Minuteurs
    minuteurCompteur: null,
    minuteurChargement: null,
    minuteurFinChargement: null,

    // Autres
    ip: null,

    init: function() {

        this.minuteurChargement = setInterval(this.animationChargement.bind(this), 400);

        // this.ipGeolocationAPI("http://api.ipbase.com/v2/info?apikey=ipb_live_Vc5YbqyRjGS8w2a6nkIcjmbMDPSnl8BqmVk8aR1Y");

        let strUrl = "http://worldtimeapi.org/api/timezone/America/Toronto";
        this.worldTimeAPI(strUrl);

        /**
         * CORS -> Cross Origin R S
         */
        this.randomQuote("https://programming-quotes-api.herokuapp.com/");

        this.button.addEventListener("click", () => {
            if(!this.blnExpanded) {
                this.refSectionDetails.classList.add("less");
                this.blnExpanded = true;
                document.getElementById("expand__text").innerText = "LESS";
            } else {
                this.refSectionDetails.classList.remove("less");
                this.blnExpanded = false;
                document.getElementById("expand__text").innerText = "MORE";
            }
        });


    },

    ipGeolocationAPI: async function(url) {
        
        try {

            // 1. Récupère les données
            const response = await fetch(url);

            // 2. Vérifie si les données ont bien été récupérées
            if(!response.ok) {
                throw new Error(`Erreur réseau : ${response.status}`);
            }

            // 3. Converse la réponse en JSON
            const fetchData = await response.json();

            // 4. Extrait les données
            console.log(fetchData);

        }
        catch(error) {
            
            // 1. Gestion des erreurs avec un bloc try/catch
            console.error('Erreur :', error.message);

        }
    },

    worldTimeAPI: async function(url) {
        
        try {

            console.log("En attente");
            // 1. Récupère les données
            const response = await fetch(url);
        
            console.log("Récupérer");

            // 2. Vérifie si les données ont bien été récupérées
            if(!response.ok) {
                throw new Error(`Erreur réseau : ${response.status}`);
            }

            // 3. Converse la réponse en JSON
            const data = await response.json();

            // 4. Extrait les données
            console.log(data);
            this.intNumSemaine = data.week_number;
            this.intJourSemaine = data.day_of_week;
            this.intJourAnnee = data.day_of_year;
            const currentTime = new Date(data.datetime);
            this.intHeureCourante = currentTime.getHours();
            this.intMinutesCourante = currentTime.getMinutes();
            this.intSecondesCourante = currentTime.getSeconds();

            // Affecte les valeurs statiques (qui ne changeront pas)
            document.getElementById("timezone").innerHTML = data.timezone;
            document.getElementById("day-of-week").innerText = this.intJourSemaine;
            document.getElementById("day-of-year").innerText = this.intJourAnnee;
            document.getElementById("week-number").innerText = this.intNumSemaine;

            // Minuteur
            this.compteur();
            this.compteur__lier = this.compteur.bind(this);
            this.minuteurCompteur = window.setInterval(this.compteur__lier, 1000);

            // Lancer l'affichage de la page
            this.minuteurFinChargement = setTimeout(this.debuterApp.bind(this), 2000);
        }
        catch(error) {
            
            // 1. Gestion des erreurs avec un bloc try/catch
            document.getElementById("erreur").innerText = "An error has occured while connecting to the Clock API. Try refreshing the page";

            console.error('Erreur :', error.message);


        }

    },

    // Chargement
    animationChargement: function() {
        let strLoadDepart = "Clock App";
        switch(this.strTexteAnimation) {
            case ".":
                this.strTexteAnimation = "..";
            break;
            case "..":
                this.strTexteAnimation = "...";
            break;
            case "...":
                this.strTexteAnimation = "";
            break;
            default:
                this.strTexteAnimation = ".";
            break;
        }
        document.getElementById("loading").innerHTML = strLoadDepart + this.strTexteAnimation;
    },

    debuterApp: function() {
        // Débute l'animation de disparition de l'écran de chargement
        document.querySelector(".ecran-chargement").classList.add("chargement-cacher");
        clearInterval(this.minuteurChargement);
        this.minuteurChargement = setTimeout(this.detruireChargement.bind(this), 1250);
    },

    detruireChargement: function() {
        document.querySelector(".ecran-chargement").remove();
    },

    randomQuote: async function(url) {

        try {

            // 1. Récupère les données
            const response = await fetch(url);

            // 2. Vérifie si les données ont bien été récupérées
            if(!response.ok) {
                throw new Error(`Erreur réseau : ${response.status}`);
            }

            // 3. Converse la réponse en JSON
            const data = await response.json();

            // 4. Extrait les données
            console.log(data);

        }
        catch(error) {
            
            // 1. Gestion des erreurs avec un bloc try/catch
            console.error('Erreur :', error.message);

        }

    },

    compteur: function() {

        console.log(this.intHeureCourante + " "  + this.intMinutesCourante + " " + this.intSecondesCourante);
        // Calcul du temps
        this.intSecondesCourante = this.intSecondesCourante + 1;
        // Si une minute est passée
        if(this.intSecondesCourante >= 60) {
            this.intSecondesCourante = 0;
            this.intMinutesCourante = this.intMinutesCourante + 1;
            // Si une heure est passée
            if(this.intMinutesCourante >= 60) {
                this.intMinutesCourante = 0;
                this.intHeureCourante = this.intHeureCourante + 1;
                // Si une journée passe
                if(this.intHeureCourante >= 24) {
                    this.intHeureCourante = 0;
                    // Met à jour les données Day of year et Day of week
                    this.intJourSemaine++;
                    document.getElementById("day-of-week").innerText = this.intJourSemaine;
                    this.intJourAnnee++;
                    document.getElementById("day-of-year").innerText = this.intJourAnnee;
                    this.intNumSemaine++;
                    if(this.intNumSemaine > 7) {
                        this.intNumSemaine = 1;
                        document.getElementById("week-number").innerText = this.intNumSemaine;

                    }
                }
            }
        }

        // Affichage des messages de bienvenue
        if(this.intHeureCourante <= 12) {
            this.strMessage = "GOOD MORNING";
            this.body.className = "day";
            if(document.querySelector(".details").classList.contains("night")) {
                document.querySelector(".details").classList.remove("night");
            }
        } else if(this.intHeureCourante <= 17) {
            this.strMessage = "GOOD AFTERNOON";
            this.body.className = "day";
        } else {
            this.strMessage = "GOOD EVENING";
            this.body.className = "night";
            if(!document.querySelector(".details").classList.contains("night")) {
                document.querySelector(".details").classList.add("night");
            }
        }
        if(document.getElementById('extension').innerText != this.strMessage) {
            document.getElementById('extension').innerText = this.strMessage;
        }


        // Affichage de l'heure
        let strMinutes = this.intMinutesCourante.toString()
        if(strMinutes.length == 1) {
            strMinutes = "0" + strMinutes;
        }
        let strHeures = this.intHeureCourante.toString()
        if(strHeures.length == 1) {
            strHeures = "0" + strHeures;
        }

        document.getElementById("heure").innerText = strHeures;
        document.getElementById("minute").innerText = strMinutes;


    },



}
window.addEventListener('load', () => app.init());