//author: Christoffer Norell

const convertButton = document.getElementById("convert");
const inputField = document.getElementById("input");
const outputField = document.getElementById("output");
const rbsFrom = document.querySelectorAll('input[name="choice-from"]');
const rbsTo = document.querySelectorAll('input[name="choice-to"]');

const numberMap = new Map();
numberMap.set('bin', 2);
numberMap.set('oct', 8);
numberMap.set('dec', 10);
numberMap.set('hex', 16);

convertButton.addEventListener("click",function(){
  var nr = inputField.value;
  var convertFrom = getNumberSystem(rbsFrom);
  var convertTo = getNumberSystem(rbsTo);
  if(correctInput(nr, convertFrom)){
    outputField.value = convertNumber(nr, convertFrom, convertTo).toString();
  }
  else{
    alert("Not a valid number. Please check your input");
  }
});

//Checks what number system the radio buttons are checked at
function getNumberSystem(rbs){
  for (const rb of rbs) {
    if (rb.checked) {
      return numberMap.get(rb.value);
    }
  }
}

//Returns the number converted from base "from" to base "to".
function convertNumber(n, from, to){
  let input = parseInt(n, from)
  return input.toString(to);
}

//Testing if the string can be interpreted as a number with base b.
function correctInput(n,b) {
  var test = parseInt(n,b);
  return (test.toString(b) === n.toLowerCase());
}
