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
            //Cleaning up possible places to play
            this.clearMoveSlots();

            this.setPlayablePlace(slots.row, slots.leftCol);
            this.setPlayablePlace(slots.row, slots.rightCol);

            // console.log(slots);
            
            //Marking possible places to play
            // if (slots.leftCol < 0) {
            //     if (this.board[slots.row][slots.rightCol].player == null && this.board[slots.row][slots.leftCol].player != this.playerOfTime) {
            //         this.board[slots.row][slots.rightCol].player = 3;
            //     } else {
            //         console.log("caiu do right");
            //     }
            // } else if (slots.rightCol > 7) {
            //     if (this.board[slots.row][slots.leftCol].player == null && this.board[slots.row][slots.leftCol].player != this.playerOfTime) {
            //         this.board[slots.row][slots.leftCol].player = 3;
            //     } else {
                    
            //         console.log("caiu do left");
            //     }
            // } else {
            //     if (this.board[slots.row][slots.leftCol].player == null && this.board[slots.row][slots.leftCol].player != this.playerOfTime) {
            //         this.board[slots.row][slots.leftCol].player = 3;
            //     } else {
            //         console.log("caiu do left");
                  
            //     }
            //     if (this.board[slots.row][slots.rightCol].player == null && this.board[slots.row][slots.leftCol].player != this.playerOfTime) {
            //         this.board[slots.row][slots.rightCol].player = 3;
            //     } else {
            //         console.log("caiu do right");
                    
            //     }
            // }

        },
        movePiece (ri, pi) {   
            this.board[ri][pi].player = this.playerOfTime;
            this.board[this.pieceOfTime.ri][this.pieceOfTime.pi].player = null;
            this.clearMoveSlots();
            
            //Change de player of time
            this.playerOfTime = this.playerOfTime == 1 ? 2 : 1;
        },
        setPlayablePlace(row, col) {
            if (this.board[row][col] != null) {
                if (this.board[row][col].player != this.playerOfTime && this.board[row][col].player == null)  {
                    this.board[row][col].player = 3;
                } else {
                    // É uma peça do oponente
                    this.checkIfCanScore(row, col);
                  
                    // console.log("tem peça de adversário ai", row, col, this.pieceOfTime.pi);
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
        },
        checkFreePlace(ri, pi, side) {
            if (side == 'RIGHT') {
                let row = ri+1 == undefined ? ri : ri+1;
                let col = pi+1 == undefined ? pi : pi+1;
                if (this.board[row][col].player == null) {
                    console.log("pode pontuar", row, col);
                    this.setPlayablePlace(row, col);
                } else {
                    console.log("lugar ocupado", row, col);
                }
            } else if (side == 'LEFT') {
                let row = ri+1 == undefined ? ri : ri+1;
                let col = pi-1 == undefined ? pi : pi-1;
                if (this.board[row][col].player == null) {
                    console.log("pode pontuar", row, col);
                    this.setPlayablePlace(row, col);
                } else {
                    console.log("lugar ocupado", row, col);
                }
            } else {

            }
        },
        checkIfCanScore (row, col) {

            if (this.playerOfTime == 1) {
                let pointRow = row+1;
                if (pointRow < 8) {
                    console.log("[JOGADOR PRETO] Linha de campos possivels a potuar no oponente:", pointRow);
                    if (this.pieceOfTime.pi < col) {
                        if (pointRow < 8) {
                            console.log("[JOGADOR PRETO] Possívels colunas a pontuar no oponente: ", col+1);
                            this.setPlayablePlace(pointRow, col+1);
                        }
                    } else {
                        if (pointRow >= 0) {
                            console.log("[JOGADOR PRETO] Possívels colunas a pontuar no oponente: ", col-1);
                            this.setPlayablePlace(pointRow, col-1);
                        }
                    }
                }
            } else {
                let pointRow = row-1;
                if (pointRow >= 0) {
                    console.log("[JOGADOR BRANCO] Linha de campos possivels a potuar no oponente:", pointRow);
                    if (this.pieceOfTime.pi < col) {
                        if (pointRow < 8) {
                            console.log("[JOGADOR BRANCO] Possívels colunas a pontuar no oponente direita: ", col+1);
                            this.setPlayablePlace(pointRow, col+1);
                        }
                    } else {
                        if (pointRow >= 0) {
                            console.log("[JOGADOR BRANCO] Possívels colunas a pontuar no oponente esquerda: ", col-1);
                            this.setPlayablePlace(pointRow, col-1);
                        }
                    }
                }
            }          
        }
        
        
        
    }
});