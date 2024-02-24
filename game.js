        // declaracao de constantes que serao utilizadas na configuracao do jogo
        const larguraJogo = 700; //muda a largura do jogo
        const alturaJogo = 850; //muda a altura do jogo

        // Configuracoes basicas do jogo
        const config = {
            type: Phaser.AUTO,
            width: larguraJogo,
            height: alturaJogo,

            physics:{ //ativando a fisica do jogo
                default: 'arcade', //fisicas tipo arcade
                arcade:{
                    gravity: {y: 300}, //adicionando a forca da gravidade
                    debug:false //ativa o modo de debug/depuracao
                }
            },

            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        //variaveis
        var alien; //variavel do player
        var teclado; //variavel do teclado
        var fogo; //variavel do efeito de fogo da nave
        var plataformas; //variavel da plataforma do jogo
        var moeda; //variavel das moedas
        var placar; //variavel para exibicao do placar
        var pontuacao = 0; //variavel que registra a pontuacao do jogo

        // Instanciando um novo jogo Phaser
        const game = new Phaser.Game(config);

        function preload() {
            //preload das imagens
            this.load.image('background', 'assets/bg.png'); //carrega background

            this.load.image('turbo','assets/turbo.png'); //carrega a imagem do turbo

            this.load.image('player','assets/alienigena.png'); //carrega a imagem do alien

            this.load.image('plataforma','assets/tijolos.png'); //carrega a imagem das plataformas

            this.load.image('moeda','assets/moeda.png'); //carrega a imagem da moeda
        }

        function create() {
            // Adiciona a imagem do background na tela, repare que ele usa as constantes para posicionar a imagem no centro da tela
            this.add.image(larguraJogo/2, alturaJogo/2, 'background');

            fogo = this.add.sprite(0,0,'turbo'); //cria o sprite do turbo
            fogo.setVisible(false); //deixa o efeito de turbo invisivel

            alien = this.physics.add.sprite(larguraJogo/2,0,'player'); //carregando o sprite do alien na tela, respeitando as fisicas declaradas na config
            alien.setCollideWorldBounds(true); //ativa os limites fisicos das bordas da tela do jogo

            plataformas = this.physics.add.staticGroup(); //cria um grupo de plataformas com fisicas estaticas
            plataformas.create(larguraJogo/4,alturaJogo/2,'plataforma'); //add plataforma no grupo de plataformas
            plataformas.create((larguraJogo*3)/4,alturaJogo/2,'plataforma'); //add plataforma no grupo de plataformas
            this.physics.add.collider(alien,plataformas); //adiciona a colisao entre o alien e as plataformas

            moeda = this.physics.add.sprite(larguraJogo/2,0,'moeda'); //adiciona a moeda no jogo, com influencia das fisicas do mundo
            moeda.setCollideWorldBounds(true); //ativa os limites fisicos das bordas da tela do jogo
            moeda.setBounce(0.7); //ativa o movimento de quicar quando encostar no chao
            this.physics.add.collider(plataformas,moeda); //adiciona a colisao entre a moeda e as plataformas

            teclado = this.input.keyboard.createCursorKeys(); //adicionando as funcoes de reconhecimento das setas do teclado

            // adicionando placar 
            placar = this.add.text(50, 50, 'Moedas:' + pontuacao, {fontSize:'45px', fill:'#495613'});

            this.physics.add.overlap(alien,moeda,() =>{ //quando o alien encostar na moeda
                moeda.setVisible(false); //moeda fica invisivel
                var posicaoMoeda_X = Phaser.Math.RND.between(50,650); //sorteio da nova posicao da moeda
                moeda.setPosition(posicaoMoeda_X,100); //selecionando a posicao da moeda de acordo com sorteio
                pontuacao += 1; //soma pontuacao
                placar.setText('Moedas: '+pontuacao); //atualiza texto do placar
                moeda.setVisible(true);
            })
        }

        function update() {
            //inputs de controle do personagem
            if(teclado.left.isDown){
                alien.setVelocityX(-150); //move o jogador para a esquerda
            }else if(teclado.right.isDown){
                alien.setVelocityX(150); //move o jogador para a direita
            }else{
                alien.setVelocityX(0); // caso nada seja pressionado, a velocidade em X e 0
            }
            if(teclado.up.isDown){
                alien.setVelocityY(-150); //move o jogador para cima
                ativarTurbo(); //utiliza a funcao que mostra o turbo
            }else{
                semTurbo(); //utiliza a funcao semTurbo
            }

            fogo.setPosition(alien.x,alien.y + alien.height/2); //atualiza a posicao do fogo em relacao ao alien


        }
        function ativarTurbo(){ //funcao que deixa o fogo visivel
            fogo.setVisible(true);
        }
        function semTurbo(){ //funcao que deixa o fogo invisivel
            fogo.setVisible(false);
        }