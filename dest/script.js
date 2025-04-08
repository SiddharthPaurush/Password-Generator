const inputSlider=document.querySelector("[data-lengthSlider]")
const lengthDisplay=document.querySelector("[data-lengthNumber]")
const passwordDisplay=document.querySelector("[data-passwordDisplay]")
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copyMsg]")
const uppercaseCheck=document.querySelector("#uppercase")
const lowercaseCheck=document.querySelector("#lowercase")
const numbersCheck=document.querySelector("#numbers")
const symbolsCheck=document.querySelector("#symbols")
const indicator=document.querySelector("[data-indicator]")
const generateBtn=document.querySelector(".generate-btn")
const allCheckbox=document.querySelectorAll("input[type=checkbox]")

const symbols='`~!@#$%^&*()-_",<.>/?=+[{]}\'\|;:'


let password=""
let passwordLength=10
let checkCount=0
handleSlider()

// set strength circle color to grey
setIndicator("#ccc")

function handleSlider(){
    inputSlider.value=passwordLength
    lengthDisplay.innerText=passwordLength

   const min = inputSlider.min
   const max = inputSlider.max
   inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min))+ "% 100%"
}
// handleSlider()


function setIndicator(color){
    indicator.style.backgroundColor=color
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}

function getRndInt(min,max){
    return Math.floor(Math.random() * (max-min)) + min
}

function generateRandomNumber(){
   return getRndInt(0,9)
}

function generateUppercase(){
   return String.fromCharCode(getRndInt(65,91))
}

function generateLowercase(){
   return String.fromCharCode(getRndInt(97,123))
}

function generateSymbols(){
    let rndNum=getRndInt(0,symbols.length)
   return symbols.charAt(rndNum)
}

function calcStrength(){
    let hasUpper=false
    let hasLower=false
    let hasNum=false
    let hasSym=false

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(symbolsCheck.checked) hasNum=true;
    if(numbersCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
    
}

async function copyContent(){

try{
   await navigator.clipboard.writeText(passwordDisplay.value)
   copyMsg.innerText="copied"
}
catch(e){
    copyMsg.innerText="failed"
}

   copyMsg.classList.add("active")

   setTimeout(() => {
    copyMsg.classList.remove("active")
   },2000)

}

function handleCheckbox(){
    checkCount=0
    allCheckbox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    //special condition
    // if(passwordLength<checkCount){
    //     passwordLength=checkCount
    //     handleSlider()
    // }
}

allCheckbox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handleCheckbox);
})


inputSlider.addEventListener('input',(e) =>{
    passwordLength=e.target.value
    handleSlider()
})

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value){
        copyContent()
    }
})

generateBtn.addEventListener('click', () =>{
    if(checkCount<=0) return;

    if(passwordLength < checkCount){
        passwordLength=checkCount
        handleSlider()    
    }


    //password generation

    password=""

    //code
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase()
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase()
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber()
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbols()
    // }


let funArr=[]

if(uppercaseCheck.checked){
    funArr.push(generateUppercase)
}
if(lowercaseCheck.checked){
    funArr.push(generateLowercase)
}
if(numbersCheck.checked){
    funArr.push(generateRandomNumber)
}
if(symbolsCheck.checked){
    funArr.push(generateSymbols)
}

//compulsory addition

for(let i=0; i<funArr.length ;i++){
    password+=funArr[i]()
}

//Remaining addition

for(let i=0; i<passwordLength - funArr.length ; i++){
    let randIndex=getRndInt(0,funArr.length)
    password+=funArr[randIndex]()
}


//Shuffle Password

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        //finding random index j,using Math.random
        const j=Math.floor(Math.random()*(i+1))
        //swaping numbers at i index and j index
        const temp=array[i]
        array[i]=array[j]
        array[j]=temp
    }
    let str=""
    array.forEach((el) => (str+=el));
    return str;
}


password=shufflePassword(Array.from(password))

//show in UI
passwordDisplay.value=password


//calculate strength
calcStrength()
})