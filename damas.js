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
        enemyPiece: []
    },
    mounted (){
       this.prepareBoard();
       this.startRandomPlayer();
    },
    methods: {
        prepareBoard () {
            this.board.map((row, ri)=>{
                row.map((place, pi)=>{
                    // place.player = null;
                    if (place != null) {
                        if (ri < 3) {
                            place.player = 1;
                        }
                        if (ri >= 3 && ri <= 4) {
                            place.player = null;
                        }
                        if (ri > 4) {
                            place.player = 2;
                        }
                    }
                });
            });
        },
        startRandomPlayer () {
            console.log("%c [SYSTEM] Escolhendo o jogador que vai iniciar a partida!" ,"color: white; background-color: #09f;");
            this.playerOfTime = 2;
            // this.playerOfTime = Math.floor(Math.random() * 2);
            this.playerOfTime = 2;
            setTimeout(()=>{
                console.log("%c [SYSTEM] O jogador "+this.playerOfTime+" vai iniciar a partida!" ,"color: white; background-color: #09f;");
            }, 1000);
        },
        clickPiece (player, ri, pi) {
            this.enemyPiece.ri = null;
            this.enemyPiece.pi = null;
            if (this.playerOfTime != player) {
                console.log("%c [SYSTEM] Você não pode mover as peças do seu oponente!" ,"color: white; background-color: #09f;");
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
            
            
            
            if (this.playerOfTime == 1) {

            

                //cima p baixo
                console.log("%c [BLACK] Slot de destino: ri: "+ri+" pi: "+pi,"color: white; background-color: #555;");
                console.log("%c [BLACK] Slot de partida: ri: "+this.pieceOfTime.ri+" pi: "+this.pieceOfTime.pi,"color: white; background-color: #555;");

            } else {
                
                this.enemyPiece.map((enemy)=>{

                    if (pi < enemy.pi) {
                        console.log("A peça esta a esquerda");
                        this.pontuar(this.playerOfTime, enemy);
                    }
                    
                  
                });

                //baixo p cima
                console.log("%c [WHITE] Slot de destino: "+ri+" "+pi,"color: white; background-color: #83521F;");
                console.log("%c [WHITE] Slot de partida: "+this.pieceOfTime.ri+" "+this.pieceOfTime.pi,"color: white; background-color: #83521F;");
            }
            
            //Troca jogador da vez
            this.playerOfTime = this.playerOfTime == 1 ? 2 : 1;
            this.clearMoveSlots();
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
                    if (this.board[row][col].player != this.playerOfTime) {
                        this.enemyPiece.push({ri: row, pi: col});
                    }
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
            this.enemyPiece = [];
        },
        resetGame () {
            this.clearMoveSlots();
            this.prepareBoard();
        },
        pontuar (playerOfTime, enemyPiece) {
            this.board[enemyPiece.ri][enemyPiece.pi].player = null;
            console.log(enemyPiece);
        }
    }
});