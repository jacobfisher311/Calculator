function clearScreen() 
{
    document.getElementById("result").value = "";
}
 
function display(value) 
{
    document.getElementById("result").value += value;
}

function calculate() 
{
    // following the pseudocode found on wikipedia.org/wiki/Shunting_yard_algorithm
    let iterator = 0; // used to iterate array
    var input = document.getElementById("result").value;
    document.getElementById("result").value = "";
    let tokens = input.split("");
    while (iterator < tokens.length)
    {
        
        iterator++;
    }

    // perform mathematical functions on i to ensure valid result
    // do not just use eval
}