let damas = new Vue({
    el: "#damas",
    data: {
        players: [
            {name: 'Black Pieces', team: 'black', junk: 0},
            {name: 'White Pieces', team: 'white', junk: 0},
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
            column: null
        },
        playerOfTime: null,
        enemyPiece: [],
        debug: false
    },
    mounted (){
        this.prepareBoard();
        this.startRandomPlayer();
        this.playBackgroundSong();
    },
    methods: {
        playBackgroundSong () {
            // let bgaudio = new Audio('assets/sounds/background.mp3');
            // bgaudio.loop = true;
            // document.body.addEventListener("mousemove", function () {
            //     bgaudio.play(); 
            // })
        },
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
            this.log('[SYSTEM] Escolhendo o jogador que vai iniciar a partida!');
            this.playerOfTime = 2;
            // this.playerOfTime = Math.floor(Math.random() * 2);
            this.playerOfTime = 2;
            setTimeout(()=>{
                this.log('[SYSTEM] O jogador '+this.playerOfTime+' vai iniciar a partida!');
            }, 1000);
        },
        clickPiece (player, row, column) {
            this.enemyPiece.row = null;
            this.enemyPiece.column = null;
            if (this.playerOfTime != player) {
                this.log("[SYSTEM] Você não pode mover as peças do seu oponente!");
                return;
            }
            //Set the piece of time
            this.pieceOfTime.row = row;
            this.pieceOfTime.column = column;
            let slots = {
                rightCol : column + 1,
                leftCol  : column - 1
            }
            if (player == 1) {
                slots.row = row + 1;
            }
            if (player == 2) {
                slots.row = row - 1;
            }
            this.checkSlot(slots);
        },
        checkSlot (slots) {
            this.clearMoveSlots();
            this.setPlayablePlace(slots.row, slots.leftCol);
            this.setPlayablePlace(slots.row, slots.rightCol);
        },
        movePiece (row, column) {

            this.board[row][column].player = this.playerOfTime;
            this.board[this.pieceOfTime.row][this.pieceOfTime.column].player = null;


            this.enemyPiece.map((enemy)=>{

                if (column < enemy.column && this.pieceOfTime.column > enemy.column) {
                    this.log("A peça esta a esquerda");
                    this.board[enemy.row][enemy.column].player = null;
                }

                if (column > enemy.column && this.pieceOfTime.column < enemy.column) {
                    this.log("A peça esta a direita");
                    this.board[enemy.row][enemy.column].player = null;
                }
                this.players[!this.playerOfTime+1].junk++;
            });
            
            
            //Troca jogador da vez
            this.playerOfTime = this.playerOfTime == 1 ? 2 : 1;
            this.clearMoveSlots();
        },
        setPlayablePlace(row, column) {
            
            if (this.board[row][column] != null) {
                if (this.board[row][column].player != this.playerOfTime && this.board[row][column].player == null)  {
                    if (column == this.pieceOfTime.column + 1 || column == this.pieceOfTime.column - 1) {
                        if (this.playerOfTime == 1) {
                            this.board[this.pieceOfTime.row + 1][column].player = 3;
                        } else {
                            this.board[this.pieceOfTime.row - 1][column].player = 3;
                        }
                    }
                } else {
                    
                    if (this.board[row][column].player != this.playerOfTime) {
                        this.enemyPiece.push({row: row, column: column});
                    }

                    this.enemyPiece.map((enemy) => {

                        let coluna_atual_jogador = this.pieceOfTime.column;
                        let coluna_atual_inimigo = enemy.column;

                        if (this.playerOfTime == 1) {
                            if (coluna_atual_inimigo < coluna_atual_jogador) {
                                this.log('[SYSTEM] Peça do inimigo está a esquerda', 'green');
                                this.enemyPlayablePlaces(enemy, 'left', 'topdown');
                            } else {
                                this.log('[SYSTEM] Peça do inimigo está a direita', 'green');
                                this.enemyPlayablePlaces(enemy, 'right', 'topdown');
                            }
                        } else {
                            if (coluna_atual_inimigo < coluna_atual_jogador) {
                                this.log('[SYSTEM] Peça do inimigo está a esquerda', 'purple');
                                this.enemyPlayablePlaces(enemy, 'left', 'downtop');
                            } else {
                                this.log('[SYSTEM] Peça do inimigo está a direita', 'purple');
                                this.enemyPlayablePlaces(enemy, 'right', 'downtop');
                            }
                        }

                    });

                   
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
        enemyPlayablePlaces (enemy, side, vertical_position ) {

            let casa_horizontal;
            let casa_vertical;

            if (side == 'left') {
                this.log('[LEFT SIDE]', 'orange');

                this.log(`enemy row ${enemy.row} | enemy column ${enemy.column}`);
                
                // posivel casa a esquerda do inimigo
                casa_horizontal = enemy.column - 1;
                
                if (vertical_position == 'downtop') {
                    casa_vertical = enemy.row - 1;
                } else if (vertical_position == 'topdown') {
                    casa_vertical = enemy.row + 1;
                }

                // Verifica se as posicoes são validas
                if (casa_vertical < 0 || casa_vertical > 7) {
                    this.log(`Posicao vertical ${casa_vertical} não é válida`, 'red');
                    return false;
                }
                if (casa_horizontal < 0 || casa_horizontal > 7) {
                    this.log(`Posicao horizontal ${casa_horizontal} não é válida`, 'lightcoral');
                    return false;
                }
                if (this.board[casa_vertical][casa_horizontal].player != null) {
                    this.log(`[SYSTEM] O inimimgo não pode ser abatido! v:${casa_vertical} h:${casa_horizontal}`, 'red');
                    return false;
                }
                this.board[casa_vertical][casa_horizontal].player = 3;
                
            } else if (side == 'right') {
                this.log('[RIGHT SIDE]', 'orange');
                
                this.log(`enemy row ${enemy.row} | enemy column ${enemy.column}`);
                
                // posivel casa a esquerda do inimigo
                casa_horizontal = enemy.column + 1;
                
                if (vertical_position == 'downtop') {
                    casa_vertical = enemy.row - 1;
                } else if (vertical_position == 'topdown') {
                    casa_vertical = enemy.row + 1;
                }

                // Verifica se as posicoes são validas
                if (casa_vertical < 0 || casa_vertical > 7) {
                    this.log(`Posicao vertical ${casa_vertical} não é válida`, 'red');
                    return false;
                }
                if (casa_horizontal < 0 || casa_horizontal > 7) {
                    this.log(`Posicao horizontal ${casa_horizontal} não é válida`, 'lightcoral');
                    return false;
                }
                if (this.board[casa_vertical][casa_horizontal].player != null) {
                    this.log(`[SYSTEM] O inimimgo não pode ser abatido! v:${casa_vertical} h:${casa_horizontal}`, 'red');
                    return false;
                }
                this.board[casa_vertical][casa_horizontal].player = 3;
            }
        },
        displayDebug () {
            this.debug = !this.debug;
        },
        log (string, color = null) {
            if (this.debug != true) {
                return false;
            }
            if (color == null) {
                color = "#09f"   
            }
            console.log(`%c ${string}`, `color: white; background-color: ${color};`);
        }
        
    }
});