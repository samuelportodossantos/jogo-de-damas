let damas = new Vue({
    el: "#damas",
    data: {
        players: [
            {name: 'Samuel', team: 'black', junk: 0},
            {name: 'Lizangela', team: 'white', junk: 0},
        ],
        board: [
            [{player: null},null,{player: null},null,{player: 1},null,{player: null},null],
            [null,{player: null},null,{player: null},null,{player: null},null,{player: null}],
            [{player: null},null,{player: null},null,{player: null},null,{player: null},null],
            [null,{player: null},null,{player: null},null,{player: null},null,{player: null}],
            [{player: null},null,{player: null},null,{player: null},null,{player: null},null],
            [null,{player: null},null,{player: null},null,{player: null},null,{player: null}],
            [{player: null},null,{player: null},null,{player: 2},null,{player: null},null],
            [null,{player: null},null,{player: null},null,{player: null},null,{player: null}]
        ],
        pieceOfTime: {
            ri: null,
            pi: null
        },
        playerOfTime: null
    },
    mounted (){
       this.prepareBoard();
       this.startRandomPlayer();
    },
    methods: {
        prepareBoard () {
            console.log("Prepareing board!!");
            this.board.map((row, ri)=>{
                row.map((place, pi)=>{
                    if (place != null) {
                        if (ri < 3) {
                            place.player = 1;
                        }
                        if (ri > 4) {
                            place.player = 2;
                        }
                    }
                });
            });
        },
        startRandomPlayer () {
            console.log("Chosing a player to start randomly. not random at moment xD");
            this.playerOfTime = 1;
        },
        clickPiece (player, ri, pi) {
            if (this.playerOfTime != player) {
                swal('Eii!!', 'Você não pode mover as peças do seu oponente!', 'warning');
                return;
            }

            //Set the piece of time
            this.pieceOfTime.ri = ri;
            this.pieceOfTime.pi = pi;

            let slots = {
                rightCol : pi + 1,
                leftCol  : pi - 1
            }

            if (player == 1) {
                slots.row = ri + 1;
            }

            if (player == 2) {
                slots.row = ri - 1;
            }

            this.checkSlot(slots);
        },
        checkSlot (slots) {
            //Cleaning up possible places to play
            this.clearMoveSlots();
            
            //Marking possible places to play
            if (slots.leftCol < 0) {
                if (this.board[slots.row][slots.rightCol].player == null) {
                    this.board[slots.row][slots.rightCol].player = 3;
                }
            } else if (slots.rightCol > 7) {
                if (this.board[slots.row][slots.leftCol].player == null) {
                    this.board[slots.row][slots.leftCol].player = 3;
                }
            } else {
                if (this.board[slots.row][slots.leftCol].player == null) {
                    this.board[slots.row][slots.leftCol].player = 3;
                }
                if (this.board[slots.row][slots.rightCol].player == null) {
                    this.board[slots.row][slots.rightCol].player = 3;
                }
            }
        },
        movePiece (ri, pi) {   
            this.board[ri][pi].player = this.playerOfTime;
            this.board[this.pieceOfTime.ri][this.pieceOfTime.pi].player = null;
            this.clearMoveSlots();
            
            //Change de player of time
            this.playerOfTime = this.playerOfTime == 1 ? 2 : 1;
        },
        clearMoveSlots () {
            this.board.map((rows)=>{               
                rows.map((place)=>{
                    if (place != null && place.player == 3) {
                        place.player = null;
                    }
                });
            });
        }
        
        
    }
});