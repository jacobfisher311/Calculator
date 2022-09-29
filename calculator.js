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
    var i = document.getElementById("result").value;
    document.getElementById("result").value = "";
    // perform mathematical functions on i to ensure valid result
    // do not just use eval
}