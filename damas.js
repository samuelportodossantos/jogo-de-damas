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
        playerOfTime: null,
        enemyPiece: {
            ri: null,
            pi: null
        }
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
            this.playerOfTime = 2;
        },
        clickPiece (player, ri, pi) {
            if (this.playerOfTime != player) {
                // swal('Eii!!', 'Você não pode mover as peças do seu oponente!', 'warning');
                console.log('Você não pode mover as peças do seu oponente!');
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
            this.clearMoveSlots();
            this.setPlayablePlace(slots.row, slots.leftCol);
            this.setPlayablePlace(slots.row, slots.rightCol);
        },
        movePiece (ri, pi) {   
            this.board[ri][pi].player = this.playerOfTime;
            this.board[this.pieceOfTime.ri][this.pieceOfTime.pi].player = null;
            this.clearMoveSlots();
            this.playerOfTime = this.playerOfTime == 1 ? 2 : 1;
            // if (this.enemyPiece.ri != null) {
            //     this.board[this.enemyPiece.ri][this.enemyPiece.pi].player = null;
            //     this.enemyPiece.ri = null;
            //     this.enemyPiece.pi = null;
            // }
        },
        setPlayablePlace(row, col) {           
            if (this.board[row][col] != null) {
                if (this.board[row][col].player != this.playerOfTime && this.board[row][col].player == null)  {
                    if (this.playerOfTime == 1) {
                        if (col == this.pieceOfTime.pi + 1 || col == this.pieceOfTime.pi - 1) {
                            this.board[this.pieceOfTime.ri + 1][col].player = 3;
                        }
                    } else {
                        if (col == this.pieceOfTime.pi + 1 || col == this.pieceOfTime.pi - 1) {
                            this.board[this.pieceOfTime.ri - 1][col].player = 3;
                        }
                    }
                } else {
                    this.enemyPiece.pi = col;
                    this.enemyPiece.ri = row;
                    if (this.playerOfTime == 1) {
                        if (this.pieceOfTime.pi > col) {
                            if ( this.board[row+1][col-1].player == null ) {
                                this.board[row+1][col-1].player = 3;
                            }
                        } else {
                            if ( this.board[row+1][col+1].player == null ) {
                                this.board[row+1][col+1].player = 3;
                            }
                        }
                    } else {
                        if (this.pieceOfTime.pi > col) {
                            if ( this.board[row-1][col-1] != null && this.board[row-1][col-1].player == null ) {
                                this.board[row-1][col-1].player = 3;
                            }
                        } else {
                            if ( this.board[row-1][col+1] != null && this.board[row-1][col+1].player == null ) {
                                this.board[row-1][col+1].player = 3;
                            }
                        }
                    }
                }
            }
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