
const { createApp } = Vue;

createApp({
  data() {
    return {
      tab: "teams",

      teams: JSON.parse(localStorage.getItem("liga_teams") || "[]"),
      players: JSON.parse(localStorage.getItem("liga_players") || "[]"),
      matches: JSON.parse(localStorage.getItem("liga_matches") || "[]"),

      teamName: "",
      teamCity: "",

      playerName: "",
      playerTeam: "",
      playerNumber: 0,

      homeTeam: "",
      awayTeam: "",
      matchDate: "",

      message: ""
    };
  },

  methods: {
    saveData() {
      localStorage.setItem("liga_teams", JSON.stringify(this.teams));
      localStorage.setItem("liga_players", JSON.stringify(this.players));
      localStorage.setItem("liga_matches", JSON.stringify(this.matches));
    },

    notify(text) {
      this.message = text;

      setTimeout(() => {
        this.message = "";
      }, 2500);
    },

    teamNameById(id) {
      const team = this.teams.find(item => item.id === id);
      return team ? team.name : "Equipo no disponible";
    },

    addTeam() {
      const name = this.teamName.trim();
      const city = this.teamCity.trim();

      if (!name || !city) {
        return this.notify("Completa todos los campos.");
      }

      const exists = this.teams.some(
        team => team.name.toLowerCase() === name.toLowerCase()
      );

      if (exists) {
        return this.notify("Ya existe un equipo con ese nombre.");
      }

      this.teams.push({
        id: crypto.randomUUID(),
        name: name,
        city: city
      });

      this.teamName = "";
      this.teamCity = "";

      this.saveData();
      this.notify("Equipo registrado correctamente.");
    },

    deleteTeam(id) {
      this.teams = this.teams.filter(team => team.id !== id);

      this.players = this.players.filter(
        player => player.teamId !== id
      );

      this.matches = this.matches.filter(
        match => match.home !== id && match.away !== id
      );

      this.saveData();
      this.notify("Equipo y registros relacionados eliminados.");
    },

    addPlayer() {
      const name = this.playerName.trim();
      const number = Number(this.playerNumber);

      if (!name || !this.playerTeam) {
        return this.notify("Completa los datos del jugador.");
      }

      if (!Number.isInteger(number) || number < 0 || number > 99) {
        return this.notify("El número debe estar entre 0 y 99.");
      }

      this.players.push({
        id: crypto.randomUUID(),
        name: name,
        teamId: this.playerTeam,
        number: number
      });

      this.playerName = "";
      this.playerTeam = "";
      this.playerNumber = 0;

      this.saveData();
      this.notify("Jugador registrado correctamente.");
    },

    deletePlayer(id) {
      this.players = this.players.filter(
        player => player.id !== id
      );

      this.saveData();
      this.notify("Jugador eliminado.");
    },

    addMatch() {
      if (!this.homeTeam || !this.awayTeam || !this.matchDate) {
        return this.notify("Completa todos los datos del partido.");
      }

      if (this.homeTeam === this.awayTeam) {
        return this.notify("Selecciona dos equipos diferentes.");
      }

      this.matches.push({
        id: crypto.randomUUID(),
        home: this.homeTeam,
        away: this.awayTeam,
        date: this.matchDate,
        status: "Programado"
      });

      this.homeTeam = "";
      this.awayTeam = "";
      this.matchDate = "";

      this.saveData();
      this.notify("Partido programado correctamente.");
    },

    deleteMatch(id) {
      this.matches = this.matches.filter(
        match => match.id !== id
      );

      this.saveData();
      this.notify("Partido eliminado.");
    }
  }
}).mount("#app");
