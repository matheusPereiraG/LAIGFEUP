function Board(scene) {
    this.scene = scene;
    this.board = new Array();
    this.createCells();
    this.cellSelection = false;
    this.cellSelected = new Array();
}

Board.prototype.constructor = Board;

Board.prototype.createCells = function () {

    for (let i = 0; i < 10; i++) {
        let line = new Array();
        for (let j = 0; j < 10; j++) {
            let plane = new Plane(this.scene, [20, 20]);
            line.push(plane);
        }
        this.board.push(line);
    }
}

Board.prototype.display = function () {

    let counter = 0;

    for (let i = 0; i < this.board.length; i++) {
        let incZ = (i * 2);

        for (let j = 0; j < this.board[i].length; j++) {
            this.scene.pushMatrix();
            counter++;
            if(this.cellSelection) this.scene.registerForPick(counter, this.board[i][j]);
            this.scene.translate(j * 2, 0, incZ);
            if(i % 2 == j % 2) this.scene.blackMaterial.apply();
            else this.scene.whiteMaterial.apply();
            this.board[i][j].display();
            this.scene.popMatrix();
        }

    }
}

Board.prototype.getBoardPosWithId = function(customId){
    let counter = 0;
    for(let row = 0; row < this.board.length; row++){
        for(let col = 0; col < this.board.length; col++){
           counter++;
           if(counter == customId) return [row,col];
        }
       
    }
    return null;

}

Board.prototype.setTargetCell = function(xf, yf){
    this.cellSelected = [xf,yf];
}
Board.prototype.getTargetCell = function(){
    return this.cellSelected;
}
