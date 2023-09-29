const {Web3} = require('web3');

const web3 = new Web3('https://rpc-mainnet.maticvigil.com');

/*
Description Esta Funcion busca transferencias de un determinado token dado por su dirección de contrato hacia una wallet en particular dado por su depositAddr desde un bloque determinado hasta un bloque determinado.
param contractAddress (string) El address del contrato de la moneda a la cual queremos saber si hubo alguna transferencia.
param depositAddr (string) El deposit address de la persona en la cual estaría recibiendo la moneda que estamos buscando si hubo transferencia.
param fromBlock (string) Bloque en donde empezamos a buscar una transferencia del token con address contractAddress hacia la direccion depositAddr.
param toBlock (string) Ultimo Bloque en donde terminamos de buscar una transferencia del token con address contractAddress hacia la direccion depositAddr. Nota => ( toBlock - fromBlock =< 1000 )
*/
async function getTransferLogs(contractAddress, depositAddr, fromBlock, toBlock) {
  try {
    const usdcContractAddress = contractAddress; //'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
    const usdcAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false}];

    const usdcContract = new web3.eth.Contract(usdcAbi, usdcContractAddress);

    log = await usdcContract.getPastEvents(
      'Transfer', 
      {
        filter: {to: depositAddr},
        fromBlock,
        toBlock
      });

    return(log);


  } catch (error) {
    return('Error al obtener los logs de transferencia:', error);
  }
}


/*
Description Esta Funcion me devuelve cual es el último bloque en la blockchain
*/
async function getLastBlockNumber() {
  lastBlock= await web3.eth.getBlockNumber();
  return(lastBlock);
}


/*
Description Esta Funcion solo está para crear los 1000 ultimos bloques y mandarlo a que busque una transacción determinada a modo de ejemplo
Retorna: (Podrás ver transactionHash para ver donde se realizó y en returnValue de a donde, hacía donde y cuanto). Los topics son 3, el evento, el from y el to. Acordarse que estos topics son los elementos de busqueda de los blooming filters.

48105994
48104994
[
  {
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000f7fa485959711e2f2a1a421e6244e8099d1cac9b',
      '0x000000000000000000000000f42824fc74901bae38b5969ed426c9fd279ff83b'
    ],
    data: '0x00000000000000000000000000000000000000000000000000000000436fbe8f',
    blockNumber: 48105965n,
    transactionHash: '0x686cee0e4cccf6c884e4f1e903fc8ba4f97c62b1d0a07fefeff3f813
da3d464c',
    transactionIndex: 71n,
    blockHash: '0x60ecc6ad19bc2ae5992b4eb26960bdce5af0daf5a7ed174b9e5c5a01cea5f2
ae',
    logIndex: 443n,
    removed: false,
    returnValues: {
      '0': '0xf7Fa485959711E2F2A1A421E6244e8099D1cAc9b',
      '1': '0xf42824fc74901baE38B5969ED426C9Fd279Ff83B',
      '2': 1131396751n,
      __length__: 3,
      from: '0xf7Fa485959711E2F2A1A421E6244e8099D1cAc9b',
      to: '0xf42824fc74901baE38B5969ED426C9Fd279Ff83B',
      value: 1131396751n
    },
    event: 'Transfer',
    signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3
ef',
    raw: {
      data: '0x00000000000000000000000000000000000000000000000000000000436fbe8f'
,
      topics: [Array]
    }
  }
]

*/
async function main() {
    lastBlock= await getLastBlockNumber();
    toBlock=lastBlock.toString();
    console.log(toBlock);
    fromBlock = toBlock - 1000;
    console.log(fromBlock);
    Result= await getTransferLogs('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', '0xf42824fc74901bae38b5969ed426c9fd279ff83b', fromBlock, toBlock);  
    console.log(Result);
}


// Para llamar a correr a la funciones
main();


