//Variaveis de contadores da funcao.
var contpodaAlfaBeta;
var contverificaEstado;
var contverificaDistanciaMeta;
var contiaMovimento;
var contmaxState;
var contminState;
var contatualizaMatriz;
var contmensagemGanhador;
var contacao;
var continicializaJogo;
var contplayerTurn;
var contgameStatus;
var contlimpaBoard;
var contpintaBoard;
var contdisplayShape;
var contdrawCanvasShape;
var contefeitoJogo;
var contshapeInPos;
var contonclick;

function QuatroEmLinha() {
    //inicio da matriz e movimento inicial 0.
    this.matrizArr = [];
    this.movimento = 0;
    //Iniciacao de vars e relacao this = this para acessar dps
    this.jogoPause = false;
    this.fimTurno = false;
    this.movimentoInvalido = false;
    this.initialize = false;
    var thisObjeto = this;
    //Declaracao de cores e distancia do canvas
    var pcPecaCor = '#404040';
    var iaPecaCor = '#0000ff';
    var transparentCor = 'transparent';
    var shapeOutlineCol = '#000';
    var boardColor = '#ffff00';
    var minDist = -100000000007;
    var maxDist = 100000000007;
    var heuristicaPadrao = -1;



    //Funcao inicial do jogo inicio da matriz e variáveis.
    this.startgame = function () {
        contpodaAlfaBeta = 0;
        contverificaEstado = 0;
        contverificaDistanciaMeta = 0;
        contiaMovimento = 0;
        contmaxState = 0;
        contminState = 0;
        contatualizaMatriz = 0;
        contmensagemGanhador = 0;
        contacao = 0;
        continicializaJogo = 0;
        contplayerTurn = 0;
        contgameStatus = 0;
        contlimpaBoard = 0;
        contpintaBoard = 0;
        contdisplayShape = 0;
        contdrawCanvasShape = 0;
        contefeitoJogo = 0;
        contshapeInPos = 0;
        contonclick = 0;
        this.matrizArr = [];
        this.jogoPause = false;
        this.fimTurno = false;
        this.movimentoInvalido = false;
        this.movimento = 0;
        this.inicializaJogo();
        var x, y;
        for (x = 0; x <= 6; x++) {
            this.matrizArr[x] = [];
            for (y = 0; y <= 7; y++) {
                this.matrizArr[x][y] = 0;
            }
        }
        this.limpaBoard();
        this.pintaBoard();
    };


    //Algoritmo poda alfa beta
    this.podaAlfaBeta = function (valorHeuristica) {
        contpodaAlfaBeta++;
        var estadoJogo = this.matrizArr.clone();

        var moveValue = maxState(estadoJogo, 0, minDist, maxDist);
        proximoMovimento = moveValue[1];

        this.jogoPause = false;
        var complete = this.acao(proximoMovimento, function () {
            thisObjeto.movimentoInvalido = false;
        });

        while (complete < 0) {
            proximoMovimento = Math.floor(Math.random() * 7);
            complete = this.acao(proximoMovimento, function () {
                thisObjeto.movimentoInvalido = false;
            });
        }

        var proximoMovimento = null;
        function verificaEstado(estadoJogo) {
            contverificaEstado++;
            var fim = 0;
            var estimativaFim = 0;
            var rightAxis = 0;
            var bottomAxis = 0;
            var bottomRightAxis = 0;
            var topRightAxis = 0;
            var x;
            var y;
            var z;
            var estimativaEMeta = [fim, estimativaFim];

            for (x = 0; x < 6; x++) {
                for (y = 0; y < 7; y++) {
                    rightAxis = 0;
                    bottomAxis = 0;
                    bottomRightAxis = 0;
                    topRightAxis = 0;
                    for (z = 0; z <= 3; z++) {
                        if (y + z < 7)
                            rightAxis = rightAxis + estadoJogo[x][y + z];
                        if (x + z < 6 && y + z < 7)
                            bottomRightAxis = bottomRightAxis + estadoJogo[x + z][y + z];
                        if (x + z < 6)
                            bottomAxis = bottomAxis + estadoJogo[x + z][y];
                        if (x - z >= 0 && y + z < 7)
                            topRightAxis = topRightAxis + estadoJogo[x - z][y + z];
                    }
                    estimativaFim = estimativaFim + rightAxis * rightAxis * rightAxis;
                    estimativaFim = estimativaFim + bottomAxis * bottomAxis * bottomAxis;
                    estimativaFim = estimativaFim + bottomRightAxis * bottomRightAxis * bottomRightAxis;
                    estimativaFim = estimativaFim + topRightAxis * topRightAxis * topRightAxis;

                    if (Math.abs(rightAxis) === 4)
                        fim = rightAxis;
                    else if (Math.abs(bottomAxis) === 4)
                        fim = bottomAxis;
                    else if (Math.abs(bottomRightAxis) === 4)
                        fim = bottomRightAxis;
                    else if (Math.abs(topRightAxis) === 4)
                        fim = topRightAxis;
                }
            }
            estimativaEMeta[0] = fim;
            estimativaEMeta[1] = estimativaFim;

            return estimativaEMeta;
        }
        function verificaDistanciaMeta(estadoJogo, profundidadeArvore, podaAlfa, podaBeta) {
            contverificaDistanciaMeta++;
            var estimativaValor;
            var fim;
            var estimativaFim;
            var estadoMeta;
            var valueAtCurrState = verificaEstado(estadoJogo);
            if (profundidadeArvore >= 4) {
                estimativaValor = 0;
                fim = valueAtCurrState[0];
                estimativaFim = valueAtCurrState[1] * valorHeuristica;
                estimativaValor = estimativaFim;

                if (fim === 4 * valorHeuristica)
                    estimativaValor = 999999;
                else if (fim === 4 * valorHeuristica * -1)
                    estimativaValor = 999999 * -1;
                estimativaValor -= profundidadeArvore * profundidadeArvore;
                return [estimativaValor, -1];
            }

            estadoMeta = valueAtCurrState[0];
            if (estadoMeta === 4 * valorHeuristica)
                return [999999 - profundidadeArvore * profundidadeArvore, -1];
            if (estadoMeta === 4 * valorHeuristica * -1)
                return [999999 * -1 - profundidadeArvore * profundidadeArvore, -1];

            if (profundidadeArvore % 2 === 0)
                return minState(estadoJogo, profundidadeArvore + 1, podaAlfa, podaBeta);

            return maxState(estadoJogo, profundidadeArvore + 1, podaAlfa, podaBeta);

        }
        function iaMovimento(movimento) {
            contiaMovimento++;
            var randomMove = movimento[Math.floor(Math.random() * movimento.length)];
            return randomMove;
        }

        function maxState(estadoJogo, profundidadeArvore, podaAlfa, podaBeta) {
            contmaxState++;
            var maxStateArr = [0, 0];
            var filaAlfa = [];
            var movimento = -1;
            var distancia = null;
            var estadoAtual = null;
            var x;
            var y = minDist;

            for (x = 0; x < 7; x++) {
                estadoAtual = thisObjeto.atualizaMatriz(estadoJogo, x, valorHeuristica);
                if (estadoAtual !== -1) {
                    distancia = verificaDistanciaMeta(estadoAtual, profundidadeArvore, podaAlfa, podaBeta);
                    if (distancia[0] > y) {
                        y = distancia[0];
                        movimento = x;
                        filaAlfa = [];
                        filaAlfa.push(x);
                    } else if (distancia[0] === y) {
                        filaAlfa.push(x);
                    }

                    if (y > podaBeta) {
                        movimento = iaMovimento(filaAlfa);
                        return [y, movimento];
                    }
                    //retorna o maior entre os dois.
                    podaAlfa = Math.max(podaAlfa, y);
                }
            }
            movimento = iaMovimento(filaAlfa);
            maxStateArr[0] = y;
            maxStateArr[1] = movimento;
            return maxStateArr;
        }
        //Funcao Min      
        function minState(estadoJogo, profundidadeArvore, podaAlfa, podaBeta) {
            contminState++;
            var minStateArr = [0, 0];
            var filaBeta = [];
            var movimento = -1;
            var distancia = null;
            var estadoAtual = null;
            var x;
            var y = minDist;

            for (x = 0; x < 7; x++) {
                estadoAtual = thisObjeto.atualizaMatriz(estadoJogo, x, valorHeuristica * -1);
                if (estadoAtual !== -1) {

                    distancia = verificaDistanciaMeta(estadoAtual, profundidadeArvore, podaAlfa, podaBeta);
                    if (distancia[0] < y) {
                        y = distancia[0];
                        movimento = x;
                        filaBeta = [];
                        filaBeta.push(x);
                    } else if (distancia[0] === y) {
                        filaBeta.push(x);
                    }
                    if (y < podaAlfa) {
                        movimento = iaMovimento(filaBeta);
                        minStateArr[0] = y;
                        minStateArr[1] = movimento;
                        return minStateArr;
                    }
                    //Valor minimo entre poda e y.
                    podaBeta = Math.min(podaBeta, y);
                }
            }
            movimento = iaMovimento(filaBeta);
            minStateArr[0] = y;
            minStateArr[1] = movimento;
            return minStateArr;
        }
    };
    //Fim algoritmo Poda Alfa Beta

    //Funcoes acoes do jogador e controladora do jogo.
    this.atualizaMatriz = function (estadoJogo, matrixCol, value) {
        contatualizaMatriz++;
        var tempMatriz = estadoJogo.clone();
        if (tempMatriz[0][matrixCol] !== 0 || matrixCol < 0 || matrixCol > 6)
            return -1;

        var complete = false;
        var matrixRow = 0;
        var i;
        for (i = 0; i < 5; i++) {
            if (tempMatriz[i + 1][matrixCol] !== 0) {
                complete = true;
                matrixRow = i;
                break;
            }
        }
        if (!complete) {
            matrixRow = 5;
        }
        tempMatriz[matrixRow][matrixCol] = value;
        return tempMatriz;
    };
    this.mensagemGanhador = function (jogador) {
        contmensagemGanhador++;
        this.jogoPause = true;
        this.fimTurno = true;
        this.movimentoInvalido = false;
        var alerta = "";
        if (jogador < 0) {
            alerta = "Parece que o computador foi mais inteligente...";
        } else if (jogador > 0) {
            alerta = "Ora ora, temos um vencedor.";
        } else {
            alerta = "Ora ora, parece que empatamos...";
        }
        alert(alerta);
        console.log("Resutados finais da execucao");
        escreveValores();
        this.context.save();
        this.context.restore();
        $("#newGame").show();
    };
    this.acao = function (matrixCol, callbackFunction) {
        contacao++;
        if (this.jogoPause || this.fimTurno)
            return 0;
        if (this.matrizArr[0][matrixCol] !== 0 || matrixCol < 0 || matrixCol > 6)
            return -1;
        var complete = false;
        var row = 0;
        var i;
        for (i = 0; i < 5; i++) {
            if (this.matrizArr[i + 1][matrixCol] !== 0) {
                complete = true;
                row = i;
                break;
            }
        }
        if (!complete) {
            row = 5;
        }
        this.efeitoJogo(matrixCol, this.playerTurn(this.movimento), row, 0,
                function () {
                    thisObjeto.matrizArr[row][matrixCol] = thisObjeto.playerTurn(thisObjeto.movimento);
                    thisObjeto.movimento = thisObjeto.movimento + 1;
                    thisObjeto.displayShape();
                    thisObjeto.gameStatus();
                    callbackFunction();
                });
        this.jogoPause = true;
        return 1;
    };
    this.inicializaJogo = function () {
        continicializaJogo++;
        this.canvas = document.getElementsByTagName("canvas")[0];
        if (this.initialize) {
            return false;
        }
        this.canvas.addEventListener('click', function (e) {
            thisObjeto.onclick(thisObjeto.canvas, e);
        });
        this.context = this.canvas.getContext('2d');
        this.initialize = true;
        console.log("Inicio de jogo");

    };
    this.playerTurn = function () {
        contplayerTurn++;
        if (this.movimento % 2 === 0) {
            return 1;
        }
        return -1;
    };
    //Fim funcoes do jogador e controladora do jogo			


    //Funcoes responsaveis pela parte gráfica.
    this.gameStatus = function () {
        contgameStatus++;
        var rightAxis = 0;
        var bottomAxis = 0;
        var bottomRightAxis = 0;
        var topRightAxis = 0;
        var x;
        var y;
        var z;

        for (x = 0; x < 6; x++) {
            for (y = 0; y < 7; y++) {
                rightAxis = 0;
                bottomAxis = 0;
                bottomRightAxis = 0;
                topRightAxis = 0;
                for (z = 0; z <= 3; z++) {
                    if (x - z >= 0 && y + z < 7) {
                        topRightAxis += this.matrizArr[x - z][y + z];
                    }
                    if (y + z < 7) {
                        rightAxis += this.matrizArr[x][y + z];
                    }
                    if (x + z < 6) {
                        bottomAxis += this.matrizArr[x + z][y];
                    }
                    if (x + z < 6 && y + z < 7) {
                        bottomRightAxis += this.matrizArr[x + z][y + z];
                    }
                }
                if (Math.abs(rightAxis) === 4)
                    this.mensagemGanhador(rightAxis);
                else if (Math.abs(bottomAxis) === 4)
                    this.mensagemGanhador(bottomAxis);
                else if (Math.abs(bottomRightAxis) === 4)
                    this.mensagemGanhador(bottomRightAxis);
                else if (Math.abs(topRightAxis) === 4)
                    this.mensagemGanhador(topRightAxis);
            }
        }
        if ((!this.fimTurno) && (this.movimento === 42))
            this.mensagemGanhador(0);
    };
    this.limpaBoard = function () {
        contlimpaBoard++;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    this.pintaBoard = function () {
        contpintaBoard++;
        this.context.save();
        this.context.fillStyle = boardColor;
        this.context.beginPath();
        var x, y;
        for (y = 0; y < 6; y++) {
            for (x = 0; x < 7; x++) {
                this.context.arc(75 * x + 100, 75 * y + 50, 25, 0, 2 * Math.PI);
                this.context.rect(75 * x + 150, 75 * y, -100, 100);
            }
        }
        this.context.fill();
        this.context.restore();
    };
    this.displayShape = function () {
        contdisplayShape++;
        var x, y;
        var pecaCor;
        for (y = 0; y < 6; y++) {
            for (x = 0; x < 7; x++) {
                pecaCor = transparentCor;
                if (this.matrizArr[y][x] >= 1) {
                    pecaCor = pcPecaCor;
                } else if (this.matrizArr[y][x] <= -1) {
                    pecaCor = iaPecaCor;
                }
                this.drawCanvasShape(75 * x + 100, 75 * y + 50, 25, pecaCor, shapeOutlineCol);
            }
        }
    };
    this.drawCanvasShape = function (x, y, z, colorFill, colorStroke) {
        contdrawCanvasShape++;
        this.context.save();
        this.context.strokeStyle = colorStroke;
        this.context.fillStyle = colorFill;
        this.context.beginPath();
        this.context.arc(x, y, z, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.restore();
    };
    this.efeitoJogo = function (matrixCol, movimento, matrixRow, matrizPosicao, callbackFunction) {
        contefeitoJogo++;
        var pecaCor = transparentCor;
        if (movimento >= 1)
            pecaCor = pcPecaCor;
        else if (movimento <= -1)
            pecaCor = iaPecaCor;

        if (matrixRow * 75 >= matrizPosicao) {
            this.limpaBoard();
            this.displayShape();
            this.drawCanvasShape(75 * matrixCol + 100, matrizPosicao + 50, 25, pecaCor, shapeOutlineCol);
            this.pintaBoard();
            window.requestAnimationFrame(function () {
                thisObjeto.efeitoJogo(matrixCol, movimento, matrixRow, matrizPosicao + 25, callbackFunction);
            });
        } else
            callbackFunction();
    };
    this.shapeInPos = function (index, offset, radius) {
        contshapeInPos++;
        if ((index[0] - offset) * (index[0] - offset) <= radius * radius)
            return true;
        else
            return false;
    };

    this.onclick = function (canvas, elem) {
        contonclick++;
        if (this.movimentoInvalido) {
            return false;
        } else

        if (this.fimTurno) {
            this.startgame();
            return false;
        }
        var x;
        var y;
        var z;
        var validMove;

        var boundingBox = canvas.getBoundingClientRect(),
                x = elem.clientX - boundingBox.left,
                y = elem.clientY - boundingBox.top;


        for (z = 0; z < 7; z++) {
            if (this.shapeInPos([x, y], 75 * z + 100, 25)) {
                this.jogoPause = false;
                validMove = this.acao(z, function () {
                    thisObjeto.podaAlfaBeta(heuristicaPadrao);
                });
                if (validMove === 1) {
                    this.movimentoInvalido = true;
                }
                break;
            }
        }
        escreveValores();
    };
    //Fim funcoes gráficas	
}


function escreveValores() {
    console.log("Listagem execucaoo de chamadas de funcoes:");
    console.log("Funcao onclick = " + contonclick);
    console.log("Funcao podaAlfaBeta = " + contpodaAlfaBeta);
    console.log("Funcao verificaEstado = " + contverificaEstado);
    console.log("Funcao verificaDistanciaMeta = " + contverificaDistanciaMeta);
    console.log("Funcao iaMovimento = " + contiaMovimento);
    console.log("Funcao maxState = " + contmaxState);
    console.log("Funcao minState = " + contminState);
    console.log("Funcao atualizaMatriz = " + contatualizaMatriz);
    console.log("Funcao mensagemGanhador = " + contmensagemGanhador);
    console.log("Funcao acao = " + contacao);
    console.log("Funcao inicializaJogo = " + continicializaJogo);
    console.log("Funcao playerTurn = " + contplayerTurn);
    console.log("Funcao gameStatus = " + contgameStatus);
    console.log("Funcao limpaBoard = " + contlimpaBoard);
    console.log("Funcao pintaBoard = " + contpintaBoard);
    console.log("Funcao displayShape = " + contdisplayShape);
    console.log("Funcao contdrawCanvasShape = " + contdrawCanvasShape);
    console.log("Funcao efeitoJogo = " + contefeitoJogo);
    console.log("Funcao shapeInPos = " + contshapeInPos);
    console.log("\n");
}

//Criacao do clone da matriz, chamada na poda.
Array.prototype.clone = function () {
    var tempArray = [], i;
    for (i = 0; i < this.length; i++) {
        tempArray[i] = this[i].slice();
    }
    return tempArray;
};

function inicializaNovoJogo() {
    new QuatroEmLinha().startgame();
    $("#newGame").hide();
}
function reiniciaJogo() {
    location.reload();
}


$(document).ready(function () {
    inicializaNovoJogo();
});