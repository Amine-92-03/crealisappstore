import InsertRecordsAPI from './apiCRM.js'


const apiCrm = new InsertRecordsAPI()

apiCrm.insertRecords()

let submiBtn = document.getElementById('submiBtn')
submiBtn.onclick = async ()=>{
    const form = document.getElementById('formulaire')
    const val = document.querySelectorAll('input')
    op
    const data = await fetch('/api')
    const json = await data.json()
    console.log(json);
}

async function connectToCRM(){
    console.log('hello');
}

connectToCRM()


