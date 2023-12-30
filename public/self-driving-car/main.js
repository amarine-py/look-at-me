const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=1;
const cars=generateCars(N);
let bestCar=cars[0];
// implanting an already traind neural network brain into local storage
const storedBrain = JSON.stringify({"levels":[{"inputs":[0,0,0,0.13612865220556436,0.5324761955456124],"outputs":[0,0,0,0,1,0],"biases":[0.07379032437112462,0.12158104947760204,0.2768164254470946,0.26932977952562487,-0.20294932878690788,0.1282483508576469],"weights":[[0.0516112956405001,0.12309695117651259,0.12733348247134374,0.07696318126295468,0.1353179109341961,0.5098763571587895],[-0.153576069528837,0.12134035970739109,-0.09643131778914268,-0.10416470783459819,0.07153358176382818,-0.032783824756676044],[0.23419811364806148,0.023125490111460686,-0.06504582272045528,0.3286482434049953,0.007674400133944409,-0.2423050311256452],[0.4184852222295713,-0.08195458935702132,-0.1839077320251565,0.37835530548786833,-0.32146022696844523,-0.4687282839013834],[0.007923223272469138,-0.082280594780115,-0.43446270223029365,0.10873649228823776,-0.0030612397016075432,-0.3117266027343809]]},{"inputs":[0,0,0,0,1,0],"outputs":[1,0,0,0],"biases":[-0.16704717527473067,0.4588456898591083,0.2218411136371801,0.3324038021753913],"weights":[[-0.01281360538646742,0.28413356974934284,0.14933487940671167,0.3162462652333535],[0.19380137694044774,0.16328111099992793,0.43340489894894435,-0.2094851905423361],[0.09526368522251417,-0.32105974955845,0.05321431363339718,0.15069411942459515],[-0.2105975354429228,0.18791069953431386,0.07758762262409456,-0.105906888441751],[0.671248519482833,0.2768122495079246,-0.015385519655037039,-0.2978990942908573],[0.11475980468877209,-0.19327924186545786,0.12388265998633163,-0.28497159289962104]]}]});
localStorage.setItem("bestBrain", storedBrain);
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.4);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2, getRandomColor()),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2, getRandomColor()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2, getRandomColor()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2, getRandomColor()),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2, getRandomColor()),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2, getRandomColor()),
];
new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}