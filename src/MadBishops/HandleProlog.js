class HandleProlog {
    constructor(game) {
        this.game = game;
    }

    getPrologRequest(requestString, onSuccess, onError, port) {  //2 

        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    initBoard() {
        var client = this;
        this.getPrologRequest('board', function (data) {
            var board = data.target.response;
            client.game.initPrologBoard(board);
        });
    }

    checkValidMoves(string) {
        //string = 'Board_PlayerChar_X_Y'
        let array = string.split('_');
        let board = array[0];
        let playerChar = array[1];
        let x = array[2];
        let y = array[3];

        board = replaceAll(board, 'W', "'W'");
        board = replaceAll(board, 'B', "'B'");
        board = replaceAll(board, 'x', "'x'");
        board = replaceAll(board, '-', "'-'");

        var client = this;

        this.getPrologRequest('valid-' + board + '-' + playerChar + '-' + x + '-' + y, function (data) {
            var response = data.target.response;
            client.game.parseValidMoves(response);
        });
    }

    checkMove(string) {
        //string = 'Board_PlayerChar_Xi_Yi_Xf_Yf_Type_Player'
        let array = string.split('_');
        let board = array[0];
        let playerChar = array[1];
        let xi = array[2];
        let yi = array[3];
        let xf = array[4];
        let yf = array[5];
        let type = array[6];
        let player = array[7];

        board = replaceAll(board, 'W', "'W'");
        board = replaceAll(board, 'B', "'B'");
        board = replaceAll(board, 'x', "'x'");
        board = replaceAll(board, '-', "'-'");

        let requestString = 'move-' + board + '-' + "'" + playerChar + "'" + '-' + xi + '-' + yi + '-' + xf + '-' + yf + '-' + type + '-' + player;

        var client = this;
        this.getPrologRequest(requestString, function (data) {
            var response = data.target.response;
            client.game.makePlay(response);
        });
    }
}