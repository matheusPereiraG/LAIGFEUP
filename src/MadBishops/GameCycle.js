function GameCycle(scene) {
    this.scene = scene;

    //creates client
    this.client = new HandleProlog(this);

    this.gamePieces = new Array();
    this.board = new Board(this.scene);
    this.prologBoard = null;

    //get initial prolog board 
    this.client.initBoard();

    this.pieceSelection = true; //it first requires a piece to be selected
    this.pieceSelected = null;

    this.turn = 1;
    this.player1Char = this.scene.player1Char;
    if (this.player1Char == 'W') this.player2Char = 'B'
    else this.player2Char = 'W';

    this.topView = new CGFcamera(0.5, 0.1, 500, vec3.fromValues(10, 35, 40), vec3.fromValues(10, 0, 10));
    this.scene.camera = this.topView;



    this.createPieces();
};

GameCycle.prototype.constructor = GameCycle;

GameCycle.prototype.parseBoard = function (boardString) {
    //first row
    let stringRow1 = boardString.substring(2, 21);
    let firstRow = stringRow1.split(',');
    row1 = [firstRow[0], firstRow[1], firstRow[2], firstRow[3], firstRow[4], firstRow[5], firstRow[6], firstRow[7], firstRow[8], firstRow[9]];
    //second row
    let stringRow2 = boardString.substring(24, 43);
    let secondRow = stringRow2.split(',');
    row2 = [secondRow[0], secondRow[1], secondRow[2], secondRow[3], secondRow[4], secondRow[5], secondRow[6], secondRow[7], secondRow[8], secondRow[9]];
    //third row
    let stringRow3 = boardString.substring(46, 65);
    let thirdRow = stringRow3.split(',');
    row3 = [thirdRow[0], thirdRow[1], thirdRow[2], thirdRow[3], thirdRow[4], thirdRow[5], thirdRow[6], thirdRow[7], thirdRow[8], thirdRow[9]];
    //fourth row
    let stringRow4 = boardString.substring(68, 87);
    let fourthRow = stringRow4.split(',');
    row4 = [fourthRow[0], fourthRow[1], fourthRow[2], fourthRow[3], fourthRow[4], fourthRow[5], fourthRow[6], fourthRow[7], fourthRow[8], fourthRow[9]];
    //fifth row
    let stringRow5 = boardString.substring(90, 109);
    let fifthRow = stringRow5.split(',');
    row5 = [fifthRow[0], fifthRow[1], fifthRow[2], fifthRow[3], fifthRow[4], fifthRow[5], fifthRow[6], fifthRow[7], fifthRow[8], fifthRow[9]];
    //sixth row 
    let stringRow6 = boardString.substring(112, 131);
    let sixthRow = stringRow6.split(',');
    row6 = [sixthRow[0], sixthRow[1], sixthRow[2], sixthRow[3], sixthRow[4], sixthRow[5], sixthRow[6], sixthRow[7], sixthRow[8], sixthRow[9]];
    //seventh row
    let stringRow7 = boardString.substring(134, 153);
    let seventhRow = stringRow7.split(',');
    row7 = [seventhRow[0], seventhRow[1], seventhRow[2], seventhRow[3], seventhRow[4], seventhRow[5], seventhRow[6], seventhRow[7], seventhRow[8], seventhRow[9]];
    //eighth row
    let stringRow8 = boardString.substring(156, 175);
    let eighthRow = stringRow8.split(',');
    row8 = [eighthRow[0], eighthRow[1], eighthRow[2], eighthRow[3], eighthRow[4], eighthRow[5], eighthRow[6], eighthRow[7], eighthRow[8], eighthRow[9]];
    //ninth row
    let stringRow9 = boardString.substring(178, 197);
    let ninthRow = stringRow9.split(',');
    row9 = [ninthRow[0], ninthRow[1], ninthRow[2], ninthRow[3], ninthRow[4], ninthRow[5], ninthRow[6], ninthRow[7], ninthRow[8], ninthRow[9]];
    //tenth
    let stringRow10 = boardString.substring(200, 219);
    let tenthRow = stringRow10.split(',');
    row10 = [tenthRow[0], tenthRow[1], tenthRow[2], tenthRow[3], tenthRow[4], tenthRow[5], tenthRow[6], tenthRow[7], tenthRow[8], tenthRow[9]];

    let board = [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10];
    this.gamePieces = board;
};

GameCycle.prototype.initPrologBoard = function (prologData) {
    this.prologBoard = prologData;
};

GameCycle.prototype.createPieces = function () {
    //first line 
    this.gamePieces.push(new Bishop(this.scene, 2, 0, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 6, 0, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 10, 0, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 14, 0, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 18, 0, 'B'));
    //second line
    this.gamePieces.push(new Bishop(this.scene, 0, 2, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 4, 2, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 8, 2, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 12, 2, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 16, 2, 'B'));
    //third line
    this.gamePieces.push(new Bishop(this.scene, 2, 4, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 6, 4, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 10, 4, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 14, 4, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 18, 4, 'W'));
    //fourth line
    this.gamePieces.push(new Bishop(this.scene, 0, 6, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 4, 6, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 8, 6, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 12, 6, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 16, 6, 'W'));
    //fifth line
    this.gamePieces.push(new Bishop(this.scene, 2, 8, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 6, 8, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 10, 8, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 14, 8, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 18, 8, 'B'));
    //sixth line 
    this.gamePieces.push(new Bishop(this.scene, 0, 10, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 4, 10, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 8, 10, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 12, 10, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 16, 10, 'B'));
    //seventh line
    this.gamePieces.push(new Bishop(this.scene, 2, 12, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 6, 12, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 10, 12, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 14, 12, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 18, 12, 'W'));
    //eighth line 
    this.gamePieces.push(new Bishop(this.scene, 0, 14, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 4, 14, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 8, 14, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 12, 14, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 16, 14, 'W'));
    //ninth line 
    this.gamePieces.push(new Bishop(this.scene, 2, 16, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 6, 16, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 10, 16, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 14, 16, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 18, 16, 'B'));
    //tenth line 
    this.gamePieces.push(new Bishop(this.scene, 0, 18, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 4, 18, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 8, 18, 'W'));
    this.gamePieces.push(new Bishop(this.scene, 12, 18, 'B'));
    this.gamePieces.push(new Bishop(this.scene, 16, 18, 'W'));
};

GameCycle.prototype.display = function () {
    //display board
    this.board.display();

    //display pieces
    for (let i = 0; i < this.gamePieces.length; i++) {
        this.scene.pushMatrix();
        if (this.pieceSelection) this.scene.registerForPick(i + 1, this.gamePieces[i]);
        if (this.gamePieces[i].getPieceChar() == 'W') {
            this.scene.whiteMaterial.apply();
        }
        else this.scene.blackMaterial.apply();

        this.gamePieces[i].display();
        this.scene.popMatrix();

    }

    this.handlePicking();
};

GameCycle.prototype.getPiecePos = function (customId) {
    let counter = 0;
    for (let i = 0; i < this.gamePieces.length; i++) {
        counter++;
        if (counter == customId) {
            let x = this.gamePieces[i].getX();
            let z = this.gamePieces[i].getZ();
            return [x, z];
        }
    }
    return null;
};

GameCycle.prototype.handlePicking = function () {
    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj) {
                    var customId = this.scene.pickResults[i][1];
                    if (this.pieceSelection && !this.board.cellSelection) {
                        //check if piece is from current player
                        //for player 1 odd turns 
                        if (this.turn % 2 != 0) {
                            if (obj.getPieceChar() == this.player1Char) {
                                var pos = this.getPiecePos(customId);
                                console.log("Picked piece for player 1: " + obj + ", with pick id " + customId + ' and pos equal to x= ' + pos[0] + ' y= ' + pos[1]);

                                this.pieceSelection = false;
                                this.board.cellSelection = true;
                                this.pieceSelected = obj;

                                //check with prolog what are the valid moves for this piece, if not a valid move repeat process
                                this.client.checkValidMoves(this.prologBoard + '_' + this.player1Char + '_' + obj.getX() + '_' +
                                    obj.getZ());


                            }
                            else return;
                        }
                        else {
                            if (obj.getPieceChar() == this.player2Char) {
                                var pos = this.getPiecePos(customId);
                                console.log("Picked piece for player 2: " + obj + ", with pick id " + customId + ' and pos equal to x= ' + pos[0] + ' y= ' + pos[1]);

                                this.pieceSelection = false;
                                this.board.cellSelection = true;
                                this.pieceSelected = obj;

                                //check with prolog what are the valid moves for this piece, if not a valid move repeat process
                                this.client.checkValidMoves(this.prologBoard + '_' + this.player2Char + '_' + this.pieceSelected.getX() + '_' +
                                    this.pieceSelected.getZ());

                            }
                            else return;
                        }
                    }
                    else {

                        var pos = this.board.getBoardPosWithId(customId);
                        console.log('Selected target cell with pos: x= ' + pos[0] + ' and y= ' + pos[1]);

                        //get all ready for next turn, if bad request this go back to previous state in function makePlay()
                        this.pieceSelection = true;
                        this.board.cellSelection = false;

                        if (this.pieceSelected.getPieceChar() == this.player1Char) var player = 1;
                        else var player = 2;

                        let xf = pos[0] + 1;
                        let yf = pos[1] + 1;

                        this.board.setTargetCell(xf,yf);

                        //now we have a piece selected, and a board cell selected, all we need to do is ask prolog if the movement is valid
                        this.client.checkMove(this.prologBoard + '_' + this.pieceSelected.getPieceChar() + '_' + this.pieceSelected.getX() + '_' +
                            this.pieceSelected.getZ() + '_' + xf + '_' + yf + '_' + this.pieceSelected.getType() + '_' + player);

                    }
                }
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
        }
    }
};

GameCycle.prototype.makePlay = function (response) {
    //response is 'NewBoard-NewEnd' or bad request in case it fails to move

    if (response == 'Bad Request') { //in case it fails, choose another cell to move
        alert('Not a valid move, pick another cell');
        this.pieceSelection = false;
        this.board.cellSelection = true;
        return;
    }

    let newBoard = response.substring(0, response.length - 2);
    let end = response.substring(newBoard.length + 1, response.length);

    //the game ended, pick winner
    if (end == 1) {
        if (this.pieceSelected.getPieceChar() == this.player1Char) var player = 1;
        else var player = 2;
        alert('GAME OVER , THE WINNER IS PLAYER: ' + player);
    }
    else { //the game continues 
        //update prolog board
        this.prologBoard = newBoard;

        //if type equals to 1, it will eat an enemy piece, so first the piece selected makes a movement to the target cell, and then we add the eated piece to aux board
        if(this.pieceSelected.getType() == 1){

            let targetCell = this.board.getTargetCell();
            this.pieceSelected.createAnimation(targetCell);

            let yf = (targetCell[0] - 1) * 2;
            let xf = (targetCell[1] - 1) * 2;

            this.killPieceInTargetPos(xf,yf);

            
        }
        else{ //dont eat anyone, just move to target pos
            let targetCell = this.board.getTargetCell();
            this.pieceSelected.createAnimation(targetCell);
        }
    }
    this.turn++;
};

GameCycle.prototype.parseValidMoves = function (prologData) {
    if (prologData == 'Bad Request') { //it means it cant move this piece, pick another one
        alert('You cant move this piece, select another one');
        this.pieceSelection = true;
        this.board.cellSelection = false;
        this.pieceSelected = null;
        return;
    }
    else if (prologData == 1) { //if type equals 1 the piece selected can eat an enemy piece
        this.pieceSelected.setType(prologData);
        alert('This piece must eat another piece');
    }
    else { //if type equals 2, the piece can move to a position that can eat a piece
        this.pieceSelected.setType(prologData);
        alert('This piece must move to a cell that further can eat a enemy piece');
    }

};

GameCycle.prototype.killPieceInTargetPos = function (xf,yf){
    for(let i = 0; i < this.gamePieces.length ; i++){
        if(this.gamePieces[i].x == xf && this.gamePieces[i].z == yf){
            this.gamePieces.splice(i,1);
        }
    }
}