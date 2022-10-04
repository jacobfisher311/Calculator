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
    var stack = [];
    var input = document.getElementById("result").value;
    document.getElementById("result").value = "";
    let tokens = input.split("");
    while (iterator < tokens.length)
    {
        var currToken = tokens[iterator];

        if (isNum(currToken))
        {
            stack.push(currToken);
        }
        else if (isOperator(currToken))
        {
            var op1 = stack.pop();
            var op2 = stack.pop();

            var result = performOperation(parseInt(op1), parseInt(op2), currToken);
            stack.push(result);
        }
        else if (isFunc(currToken))
        {

        }
        iterator++;
    }

    // perform mathematical functions on i to ensure valid result
    // do not just use eval
}

function isOperator(token)
{
    if(!token.match(/([*+-\/])/))
        return false;
    else 
        return true;
    
}

function isNum(token)
{
    if (!token.match(/-?[0-9]+(\.[0-9]+)?/))
        return false;
    else 
        return true;
}
    // Function to acquire the presidence of the operator
function getPres(token)
{
    switch(token)
    {
        case '^':
            return 4;
        case '*':
        case '/':
            return 3;
        case '-':
        case '+':
            return 2;
        default:
            return -1;
    }
}

function isFunc(token)
{
    switch(token)
    {
        case 's':
        case 'c':
        case 't':
        case 'l':
            return true;
        default:
            return false;

    }
}

function getAssoc(token)
{
    switch(token)
    {
        case '+':
        case '-':
        case '*':
        case '/':
            return 'left';
        case '^':
        case 'sin':
        case 'cos':
        case 'tan':
        case 'cot':
        case 'ln':
        case 'log':
            return 'right';
    }
}